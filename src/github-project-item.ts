import type { GithubProjectItemResult } from "./models.js";

export class GithubProjectItem {
  constructor(private result?: GithubProjectItemResult) {
    this.result = result;
  }

  get id(): string | undefined {
    return this.result?.id;
  }

  get number(): string | undefined {
    const number = this.result?.content?.number;
    return number ? `#${number}` : undefined;
  }

  get url(): string | undefined {
    return this.result?.content?.url;
  }

  get createdAt(): string | undefined {
    return this.result?.content?.createdAt;
  }

  get updatedAt(): string | undefined {
    return this.result?.content?.updatedAt;
  }

  get title(): string | undefined {
    const number = this.number;
    const title = this.fieldValueAttributes["Title"];
    return [number, title].filter(Boolean).join(" ");
  }

  get body(): string | undefined {
    return this.result?.content?.body;
  }

  get labels(): string | undefined {
    const labels = this.result?.content?.labels?.nodes?.map(
      (label) => label.name
    );
    return labels?.join(", ");
  }

  get attributes(): Record<string, any> {
    return { ...this.directAttributes, ...this.fieldValueAttributes };
  }

  private get directAttributes(): Record<string, any> {
    return {
      id: this.id,
      number: this.number,
      title: this.title,
      body: this.body,
      url: this.url,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      labels: this.labels,
    };
  }

  private get fieldValueAttributes(): Record<string, any> {
    const fieldValues = this.result?.fieldValues?.nodes || [];
    return fieldValues.reduce((allAttributes: Record<string, any>, fv) => {
      const key = fv.field?.name;
      const value =
        fv.text ||
        fv.number ||
        fv.title ||
        fv.name ||
        fv.date ||
        fv.milestone?.title ||
        fv.repository?.name ||
        fv.users?.nodes?.[0]?.login;

      if (key) {
        allAttributes[key] = value;
      }
      return allAttributes;
    }, {});
  }
}
