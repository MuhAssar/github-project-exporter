export type GithubProjectData = {
  data: {
    organization?: {
      projectV2: {
        id: string;
      };
    };
    user?: { projectV2: { id: string } };
  };
};

export type GithubProjectItemResult = {
  id?: string;
  content?: {
    title: string;
    number?: number;
    url?: string;
    body?: string;
    updatedAt?: string;
    createdAt?: string;
    labels?: {
      nodes?: { name: string }[];
    };
  };
  fieldValues?: {
    nodes?: {
      field?: { name: string };
      text?: string;
      number?: number;
      title?: string;
      name?: string;
      date?: string;
      milestone?: { title?: string };
      repository?: { name?: string };
      users?: { nodes?: { login?: string }[] };
    }[];
  };
};

export type GithubProjectItemResultCollection = {
  data?: {
    node?: {
      items?: {
        nodes?: GithubProjectItemResult[];
        pageInfo?: {
          hasNextPage: boolean;
          endCursor?: string;
        };
      };
    };
  };
};
