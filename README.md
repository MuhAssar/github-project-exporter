# github-project-exporter

[![npm](https://img.shields.io/badge/NPM-package-red?style=flat&logo=npm)](https://www.npmjs.com/package/github-project-exporter)
[![github](https://img.shields.io/badge/hosted-github-red?style=flat&logo=github)](https://github.com/MuhAssar/github-project-exporter)
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](https://github.com/MuhAssar/github-project-exporter/pulls)
[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat)]()

> A tool to export [GitHub Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects) to JSON or CSV file format, based on [github-project-to-csv by fiedl](https://github.com/fiedl/github-project-to-csv)

## Requirements

1. Install [GitHub CLI](https://cli.github.com): `brew install gh`
2. Login with gh: `gh auth login --scopes "project"`

## Usage

### Without Install

#### NPM

```shell
npx gpe --project https://github.com/users/MuhAssar/projects/2 --output project.json
# or
npx gpe --project https://github.com/users/MuhAssar/projects/2 --output project.csv
```

#### Yarn

```shell
yarn gpe --project https://github.com/users/MuhAssar/projects/2 --output project.json
# or
yarn gpe --project https://github.com/users/MuhAssar/projects/2 --output project.csv
```

#### PNPM

```shell
pnpm gpe --project https://github.com/users/MuhAssar/projects/2 --output project.json
# or
pnpm gpe --project https://github.com/users/MuhAssar/projects/2 --output project.csv
```

#### Bun

```shell
bunx gpe --project https://github.com/users/MuhAssar/projects/2 --output project.json
# or
bunx gpe --project https://github.com/users/MuhAssar/projects/2 --output project.csv
```

### With Install

```shell
npm i -g github-project-exporter
gpe --project https://github.com/users/MuhAssar/projects/2 --output project.json
# or
gpe --project https://github.com/users/MuhAssar/projects/2 --output project.csv
```

## Further Resources

- [Github documentation on the projects api](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-api-to-manage-projects)
- [Introduction to GraphQL](https://docs.github.com/en/graphql/guides/introduction-to-graphql)
- [Understanding GraphQL Queries](https://graphql.org/learn/queries/)
- [Github GraphQL Object Reference](https://docs.github.com/en/graphql/reference/objects)
- [Github GraphQL API Explorer](https://docs.github.com/en/graphql/overview/explorer)

## Contributing

Feel free to submit a pull request for bugs or additions, and make sure to update tests as appropriate. If you find a mistake in the docs, send a PR! Even the smallest changes help.

For major changes, open an issue first to discuss what you'd like to change.

## ⭐ Found It Helpful? [Star It!](https://github.com/MuhAssar/github-project-exporter/stargazers)

If you found this project helpful, let the community know by giving it a [star](https://github.com/MuhAssar/github-project-exporter/stargazers): [👉⭐](https://github.com/MuhAssar/github-project-exporter/stargazers)

## Core Team

<table>
  <tr>
    <td align="center"><a href="https://github.com/MuhAssar"><img src="https://avatars.githubusercontent.com/u/2022065?v=4" width="100px;" alt="Muhammad Assar"/><br /><sub><b>Muhammad Assar</b></sub></a></td>
    </tr>
</table>
