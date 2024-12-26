import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import pathAlias from "eslint-plugin-path-alias";
import header from "eslint-plugin-simple-header";

export default [
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: "module",
                project: "./tsconfig.json",
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            "simple-import-sort": simpleImportSort,
            "unused-imports": unusedImports,
            "path-alias": pathAlias,
            "simple-header": header,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            eqeqeq: ["error", "always", { null: "ignore" }],
            "prefer-const": "error",
            "no-duplicate-imports": "error",
            "no-unneeded-ternary": ["error", { defaultAssignment: false }],
            "no-constant-condition": ["error", { checkLoops: false }],
            "prefer-destructuring": [
                "error",
                {
                    VariableDeclarator: { array: false, object: true },
                    AssignmentExpression: { array: false, object: false },
                },
            ],
            "simple-header/header": [
                "error",
                {
                    files: ["scripts/header.txt"],
                    templates: {
                        author: [".*", "Prism"],
                    },
                },
            ],
            "unused-imports/no-unused-imports": "error",
            "path-alias/no-relative": "error",
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            yoda: "error",
            "operator-assignment": ["error", "always"],
            "no-useless-computed-key": "error",
            "no-invalid-regexp": "error",
            "dot-notation": "error",
            "no-fallthrough": "error",
            "for-direction": "error",
            "no-async-promise-executor": "error",
            "no-cond-assign": "error",
            "no-dupe-else-if": "error",
            "no-duplicate-case": "error",
            "no-irregular-whitespace": "error",
            "no-loss-of-precision": "error",
            "no-misleading-character-class": "error",
            "no-prototype-builtins": "error",
            "no-regex-spaces": "error",
            "no-shadow-restricted-names": "error",
            "no-unexpected-multiline": "error",
            "no-unsafe-optional-chaining": "error",
            "no-useless-backreference": "error",
            "use-isnan": "error",
            "prefer-spread": "error",
        },
    },
];
