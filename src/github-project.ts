import { GithubQuery } from "./github-query";
import type {
  GithubProjectData,
  GithubProjectItemResult,
  GithubProjectItemResultCollection,
} from "./models";
import { GithubProjectItem } from "./github-project-item";
import { createObjectCsvWriter } from "csv-writer";

export class GithubProject extends GithubQuery {
  private async executePaginated(
    query: string
  ): Promise<GithubProjectItemResultCollection> {
    const PAGINATION_BATCH_SIZE = 100;

    let queryResult: GithubProjectItemResultCollection | null = null;
    let allNodes: GithubProjectItemResult[] = [];
    let paginationString = `first: ${PAGINATION_BATCH_SIZE}`;

    while (true) {
      const paginatedQuery = query.replace("first: ALL", paginationString);
      queryResult = await this.execute<GithubProjectItemResultCollection>(
        paginatedQuery
      );
      const pageNodes = queryResult.data?.node?.items?.nodes || [];
      allNodes.push(...pageNodes);

      const pageInfo = queryResult.data?.node?.items?.pageInfo;
      if (pageInfo?.hasNextPage) {
        const lastCursorId = pageInfo.endCursor;
        paginationString = `first: ${PAGINATION_BATCH_SIZE}, after: "${lastCursorId}"`;
      } else {
        break;
      }
    }

    if (queryResult.data?.node?.items?.nodes) {
      queryResult.data!.node!.items!.nodes = allNodes;
    }

    return queryResult!;
  }

  public async getItems(projectId: string): Promise<GithubProjectItem[]> {
    const result = await this.executePaginated(`
      query{
        node(id: "${projectId}") {
          ... on ProjectV2 {
            items(first: ALL) {
              pageInfo {
                endCursor
                hasNextPage
              }
              nodes {
                id
                content{
                  ... on DraftIssue {
                    title
                    body
                  }
                  ...on Issue {
                    title
                    body
                    number
                    url
                    labels(first: 20) {
                      nodes {
                        name
                      }
                    }
                  }
                  ...on PullRequest {
                    title
                    body
                    number
                    url
                    labels(first: 20) {
                      nodes {
                        name
                      }
                    }
                  }
                }
                fieldValues(first: 50) {
                  nodes {
                    ... on ProjectV2ItemFieldTextValue {
                      text
                      field {
                        ... on ProjectV2FieldCommon {
                          name
                        }
                      }
                    }
                    ... on ProjectV2ItemFieldNumberValue {
                      number
                      field {
                        ... on ProjectV2FieldCommon {
                          name
                        }
                      }
                    }
                    ... on ProjectV2ItemFieldDateValue {
                      date
                      field {
                        ... on ProjectV2FieldCommon {
                          name
                        }
                      }
                    }
                    ... on ProjectV2ItemFieldIterationValue {
                      title
                      field {
                        ... on ProjectV2FieldCommon {
                          name
                        }
                      }
                    }
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      name
                      field {
                        ... on ProjectV2FieldCommon {
                          name
                        }
                      }
                    }
                    ... on ProjectV2ItemFieldMilestoneValue {
                      milestone {
                        title
                      }
                      field {
                        ... on ProjectV2FieldCommon {
                          name
                        }
                      }
                    }
                    ... on ProjectV2ItemFieldRepositoryValue {
                      repository {
                        name
                      }
                      field {
                        ... on ProjectV2FieldCommon {
                          name
                        }
                      }
                    }
                    ... on ProjectV2ItemFieldUserValue {
                      users(first: 10) {
                        nodes {
                          login
                        }
                      }
                      field {
                        ... on ProjectV2FieldCommon {
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `);

    const items = result.data?.node?.items?.nodes?.map(
      (itemResult) => new GithubProjectItem(itemResult)
    );
    return items || [];
  }

  public async getProjectId(
    org: string | null,
    user: string | null,
    number: number
  ): Promise<string | undefined> {
    if (!org && !user) {
      throw new Error("Neither user nor org given");
    }

    const query = `
    query {
      ${org ? `organization(login: "${org}")` : `user(login: "${user}")`} {
          projectV2(number: ${number}) {
            id
            }
            }
            }
            `;
    const result = await this.execute<GithubProjectData>(query);

    return (
      result?.data?.organization?.projectV2?.id ||
      result?.data?.user?.projectV2?.id
    );
  }

  public async exportToCsv(
    items: GithubProjectItem[],
    filename: string
  ): Promise<void> {
    // Collect unique headers
    const headers = Array.from(
      new Set(items.flatMap((item) => Object.keys(item.attributes)))
    );

    // Collect rows of attribute values corresponding to the headers
    const rows = items.map((item) =>
      headers.reduce((acc: Record<string, any>, header) => {
        acc[header] = item.attributes[header];
        return acc;
      }, {})
    );

    const csvWriter = createObjectCsvWriter({
      path: filename,
      header: headers.map((h) => ({ id: h, title: h })),
    });

    await csvWriter.writeRecords(rows);
  }
}
