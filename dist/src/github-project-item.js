"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubProjectItem = void 0;
class GithubProjectItem {
    constructor(result) {
        this.result = result;
        this.result = result;
    }
    get id() {
        var _a;
        return (_a = this.result) === null || _a === void 0 ? void 0 : _a.id;
    }
    get number() {
        var _a, _b;
        const number = (_b = (_a = this.result) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.number;
        return number ? `#${number}` : undefined;
    }
    get url() {
        var _a, _b;
        return (_b = (_a = this.result) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.url;
    }
    get createdAt() {
        var _a, _b;
        return (_b = (_a = this.result) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.createdAt;
    }
    get updatedAt() {
        var _a, _b;
        return (_b = (_a = this.result) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.updatedAt;
    }
    get title() {
        const number = this.number;
        const title = this.fieldValueAttributes["Title"];
        return [number, title].filter(Boolean).join(" ");
    }
    get body() {
        var _a, _b;
        return (_b = (_a = this.result) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.body;
    }
    get labels() {
        var _a, _b, _c, _d;
        const labels = (_d = (_c = (_b = (_a = this.result) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.labels) === null || _c === void 0 ? void 0 : _c.nodes) === null || _d === void 0 ? void 0 : _d.map((label) => label.name);
        return labels === null || labels === void 0 ? void 0 : labels.join(", ");
    }
    get attributes() {
        return Object.assign(Object.assign({}, this.directAttributes), this.fieldValueAttributes);
    }
    get directAttributes() {
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
    get fieldValueAttributes() {
        var _a, _b;
        const fieldValues = ((_b = (_a = this.result) === null || _a === void 0 ? void 0 : _a.fieldValues) === null || _b === void 0 ? void 0 : _b.nodes) || [];
        return fieldValues.reduce((allAttributes, fv) => {
            var _a, _b, _c, _d, _e, _f;
            const key = (_a = fv.field) === null || _a === void 0 ? void 0 : _a.name;
            const value = fv.text ||
                fv.number ||
                fv.title ||
                fv.name ||
                fv.date ||
                ((_b = fv.milestone) === null || _b === void 0 ? void 0 : _b.title) ||
                ((_c = fv.repository) === null || _c === void 0 ? void 0 : _c.name) ||
                ((_f = (_e = (_d = fv.users) === null || _d === void 0 ? void 0 : _d.nodes) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.login);
            if (key) {
                allAttributes[key] = value;
            }
            return allAttributes;
        }, {});
    }
}
exports.GithubProjectItem = GithubProjectItem;
