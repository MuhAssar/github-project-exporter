#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const github_project_js_1 = require("./src/github-project.js");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure Node.js version compatibility
        const NODE_VERSION = parseFloat(process.version.slice(1));
        if (NODE_VERSION < 16.0) {
            console.error("\nThis script requires Node.js version 16.0 or higher.\n");
            console.error("Please update Node.js or use a compatible version.");
            process.exit(1);
        }
        try {
            const argv = yield (0, yargs_1.default)(process.argv.slice(2))
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
                    description: "Output file name, either .csv or .json",
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
            const { project, output, token } = argv;
            if (!output.endsWith(".csv") && !output.endsWith(".json")) {
                throw new Error("Invalid output file extension, use either .csv or .json");
            }
            const projectDetails = project.match(/https:\/\/github\.com\/(orgs|users)\/([^\/]+)\/projects\/(\d+)/);
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
            const githubProject = new github_project_js_1.GithubProject();
            githubProject.personalAccessToken = token;
            const projectId = yield githubProject.getProjectId(org, user, +projectNumber);
            if (!projectId) {
                throw new Error("Could not find project id");
            }
            const items = yield githubProject.getItems(projectId);
            if (output.endsWith(".csv")) {
                yield githubProject.exportToCsv(items, output);
            }
            else if (output.endsWith(".json")) {
                yield githubProject.exportToJson(items, output);
            }
            console.log(`Project exported successfully to ${output}`);
        }
        catch (error) {
            console.error("Error:", error);
            process.exit(1);
        }
    });
}
main();
