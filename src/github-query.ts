import axios from "axios";
import { execSync } from "child_process";

export class GithubQuery {
  personalAccessToken?: string;

  protected async execute<T>(query: string): Promise<T> {
    if (this.personalAccessToken) {
      return await this.executeWithHttps(query);
    } else {
      return await this.executeWithGhClient(query);
    }
  }

  private async executeWithHttps<T>(query: string): Promise<T> {
    const url = "https://api.github.com/graphql";
    const headers = {
      Authorization: `Bearer ${this.personalAccessToken}`,
      "Content-Type": "application/json",
    };
    const response = await axios.post(url, { query }, { headers });
    if (response.data.errors) {
      throw new Error(
        response.data.errors.map((e: any) => e.message).join(", ")
      );
    }
    return response.data;
  }

  private async executeWithGhClient<T>(query: string): Promise<T> {
    try {
      // Build the GitHub CLI command
      const command = `gh api graphql -f query='${query}' 2>&1`;

      // Execute the command
      let result = execSync(command, { encoding: "utf-8" });

      // Handle errors related to missing GitHub CLI
      if (result.includes("gh: command not found")) {
        throw new Error(
          "gh command line client not installed. https://cli.github.com/. Install with 'brew install gh'"
        );
      }

      // Handle authentication prompt
      if (result.includes("gh auth login")) {
        console.log("Authenticating with GitHub CLI...");
        execSync(`gh auth login --scopes "project"`, { stdio: "inherit" });

        // Retry the query after authentication
        result = execSync(command, { encoding: "utf-8" });
      }

      // Parse the result as JSON
      return JSON.parse(result);
    } catch (error: any) {
      console.error("Error executing GitHub CLI command:", error.message);
      throw error;
    }
  }
}
