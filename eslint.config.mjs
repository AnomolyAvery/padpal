import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import tseslint from "typescript-eslint";

// @ts-ignore
import drizzle from "eslint-plugin-drizzle";

export default defineConfig([
  // =========================
  // IGNORES (first!)
  // =========================
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "eslint.config.*",
    "next.config.*",
    "postcss.config.*", // ← add this too
    "drizzle.config.*", // ← and this if you have one
    "prettier.config.*",
  ]),

  // =========================
  // NEXT CONFIG
  // =========================
  ...nextVitals,

  // =========================
  // TS TYPE-AWARE LINTING — scoped to TS files only
  // =========================
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
  })),
  ...tseslint.configs.stylisticTypeChecked.map((config) => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
  })),

  // =========================
  // TS PROJECT CONFIG
  // =========================
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },

  // =========================
  // PROJECT RULES
  // =========================
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { drizzle },
    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "drizzle/enforce-delete-with-where": [
        "error",
        { drizzleObjectName: ["db", "ctx.db"] },
      ],
      "drizzle/enforce-update-with-where": [
        "error",
        { drizzleObjectName: ["db", "ctx.db"] },
      ],
    },
  },
]);
