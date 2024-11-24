import yargs from "yargs";
import { GithubProject } from "./src/github-project";

// Argument Parsing
const argv = await yargs(process.argv.slice(2))
  .options({
    project: {
      type: "string",
      alias: "p",
      description: "GitHub Project URL",
      demandOption: true,
    },
    output: {
      type: "string",
      alias: "o",
      description: "Output CSV file name",
      default: "project.csv",
    },
    token: {
      type: "string",
      alias: "t",
      description: "GitHub Personal Access Token",
      demandOption: false,
    },
  })
  .help()
  .alias("help", "h")
  .parse();

async function main() {
  // Ensure Node.js version compatibility
  const NODE_VERSION = parseFloat(process.version.slice(1));
  if (NODE_VERSION < 18.0) {
    console.error("\nThis script requires Node.js version 18.0 or higher.\n");
    console.error("Please update Node.js or use a compatible version.");
    process.exit(1);
  }

  try {
    const { project, output, token } = argv;

    const projectDetails = project.match(
      /https:\/\/github\.com\/(orgs|users)\/([^\/]+)\/projects\/(\d+)/
    );

    if (!projectDetails) {
      throw new Error("Invalid project URL format.");
    }

    const [, type, owner, projectNumber] = projectDetails;
    const org = type === "orgs" ? owner : null;
    const user = type === "users" ? owner : null;

    if (!org && !user) {
      throw new Error("Could not extract org or user from project url");
    }

    if (+projectNumber <= 0) {
      throw new Error("Could not extract project number from project url");
    }

    const githubProject = new GithubProject();
    githubProject.personalAccessToken = token;
    const projectId = await githubProject.getProjectId(
      org,
      user,
      +projectNumber
    );
    if (!projectId) {
      throw new Error("Could not find project id");
    }
    const items = await githubProject.getItems(projectId);
    await githubProject.exportToCsv(items, output);

    console.log(`CSV exported successfully to ${output}`);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
