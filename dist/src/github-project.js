"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubProject = void 0;
const fs = __importStar(require("fs/promises"));
const github_query_js_1 = require("./github-query.js");
const github_project_item_js_1 = require("./github-project-item.js");
const csv_writer_1 = require("csv-writer");
class GithubProject extends github_query_js_1.GithubQuery {
    executePaginated(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            const PAGINATION_BATCH_SIZE = 100;
            let queryResult = null;
            let allNodes = [];
            let paginationString = `first: ${PAGINATION_BATCH_SIZE}`;
            while (true) {
                const paginatedQuery = query.replace("first: ALL", paginationString);
                queryResult = yield this.execute(paginatedQuery);
                const pageNodes = ((_c = (_b = (_a = queryResult.data) === null || _a === void 0 ? void 0 : _a.node) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 : _c.nodes) || [];
                allNodes.push(...pageNodes);
                const pageInfo = (_f = (_e = (_d = queryResult.data) === null || _d === void 0 ? void 0 : _d.node) === null || _e === void 0 ? void 0 : _e.items) === null || _f === void 0 ? void 0 : _f.pageInfo;
                if (pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.hasNextPage) {
                    const lastCursorId = pageInfo.endCursor;
                    paginationString = `first: ${PAGINATION_BATCH_SIZE}, after: "${lastCursorId}"`;
                }
                else {
                    break;
                }
            }
            if ((_j = (_h = (_g = queryResult.data) === null || _g === void 0 ? void 0 : _g.node) === null || _h === void 0 ? void 0 : _h.items) === null || _j === void 0 ? void 0 : _j.nodes) {
                queryResult.data.node.items.nodes = allNodes;
            }
            return queryResult;
        });
    }
    getItems(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const result = yield this.executePaginated(`
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
                    createdAt
                    updatedAt
                  }
                  ...on Issue {
                    title
                    body
                    number
                    url
                    createdAt
                    updatedAt
                    closed
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
            const items = (_d = (_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.node) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 : _c.nodes) === null || _d === void 0 ? void 0 : _d.map((itemResult) => new github_project_item_js_1.GithubProjectItem(itemResult));
            return items || [];
        });
    }
    getProjectId(org, user, number) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
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
            const result = yield this.execute(query);
            return (((_c = (_b = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.organization) === null || _b === void 0 ? void 0 : _b.projectV2) === null || _c === void 0 ? void 0 : _c.id) ||
                ((_f = (_e = (_d = result === null || result === void 0 ? void 0 : result.data) === null || _d === void 0 ? void 0 : _d.user) === null || _e === void 0 ? void 0 : _e.projectV2) === null || _f === void 0 ? void 0 : _f.id));
        });
    }
    exportToJson(items, output) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs.writeFile(output, JSON.stringify(items, null, 2), "utf8");
            }
            catch (error) {
                console.error("Error writing to file:", error);
            }
        });
    }
    exportToCsv(items, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            // Collect unique headers
            const headers = Array.from(new Set(items.flatMap((item) => Object.keys(item.attributes))));
            // Collect rows of attribute values corresponding to the headers
            const rows = items.map((item) => headers.reduce((acc, header) => {
                acc[header] = item.attributes[header];
                return acc;
            }, {}));
            const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
                path: filename,
                header: headers.map((h) => ({ id: h, title: h })),
            });
            yield csvWriter.writeRecords(rows);
        });
    }
}
exports.GithubProject = GithubProject;
