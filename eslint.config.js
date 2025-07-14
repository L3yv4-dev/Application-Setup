const {
    defineConfig,
} = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const globals = require("globals");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([
  {
    languageOptions: {
      parser: tsParser,
      sourceType: "module",

      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: __dirname,
      },

      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },

    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    extends: compat.extends("plugin:@typescript-eslint/recommended", "prettier"),

    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Override para eslint.config.js: deshabilitar chequeo de tipos (sin project)
  {
    files: ["eslint.config.js"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: null,  // Desactiva el uso de tsconfig para este archivo
      },
    },
  },
]);
