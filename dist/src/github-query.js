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
exports.GithubQuery = void 0;
const axios_1 = __importDefault(require("axios"));
const child_process_1 = require("child_process");
class GithubQuery {
    execute(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.personalAccessToken) {
                return yield this.executeWithHttps(query);
            }
            else {
                return yield this.executeWithGhClient(query);
            }
        });
    }
    executeWithHttps(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = "https://api.github.com/graphql";
            const headers = {
                Authorization: `Bearer ${this.personalAccessToken}`,
                "Content-Type": "application/json",
            };
            const response = yield axios_1.default.post(url, { query }, { headers });
            if (response.data.errors) {
                throw new Error(response.data.errors.map((e) => e.message).join(", "));
            }
            return response.data;
        });
    }
    executeWithGhClient(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Build the GitHub CLI command
                const command = `gh api graphql -f query='${query}' 2>&1`;
                // Execute the command
                let result = (0, child_process_1.execSync)(command, { encoding: "utf-8" });
                // Handle errors related to missing GitHub CLI
                if (result.includes("gh: command not found")) {
                    throw new Error("gh command line client not installed. https://cli.github.com/. Install with 'brew install gh'");
                }
                // Handle authentication prompt
                if (result.includes("gh auth login")) {
                    console.log("Authenticating with GitHub CLI...");
                    (0, child_process_1.execSync)(`gh auth login --scopes "project"`, { stdio: "inherit" });
                    // Retry the query after authentication
                    result = (0, child_process_1.execSync)(command, { encoding: "utf-8" });
                }
                // Parse the result as JSON
                return JSON.parse(result);
            }
            catch (error) {
                console.error("Error executing GitHub CLI command:", error.message);
                throw error;
            }
        });
    }
}
exports.GithubQuery = GithubQuery;
