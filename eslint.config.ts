import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import json from "@eslint/json"
import markdown from "@eslint/markdown"
import { defineConfig } from "eslint/config"

/**
 * @summary Linter's configuration.
 * @description A configuration for the ESLint linter.
 * @see {@link https://eslint.org/docs/latest/user-guide/configuring/configuration-files}
 */
export default defineConfig([
    tseslint.configs.recommended,
    {
        ignores: [
            "dist/**",
            "build/**",
            "out/**",
            "node_modules/**",
            "**/*.{js,mjs,cjs}",
        ]
    },
    {
        files: ["**/*.ts"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: { 
            globals: globals.node 
        },
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["error", {
                argsIgnorePattern: "^_{1,2}",
            }],
        }
    },
    {
        files: ["**/*.json"],
        plugins: { json },
        language: "json/json",
        extends: ["json/recommended"],
    },
    {
        files: ["**/*.jsonc"],
        plugins: { json },
        language: "json/jsonc",
        extends: ["json/recommended"],
    },
    {
        files: ["**/*.json5"],
        plugins: { json },
        language: "json/json5",
        extends: ["json/recommended"],
    },
    {
        files: ["**/*.md"],
        plugins: { markdown },
        language: "markdown/gfm",
        extends: ["markdown/recommended"],
        rules: {
            "markdown/no-missing-label-refs": "error"
        }
    },
])
