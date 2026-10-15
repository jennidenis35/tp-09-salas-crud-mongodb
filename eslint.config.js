
const js = require("@eslint/js");

module.exports = [
    {
        files: ["src/**/*.js", "scripts/**/*.js"],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",

            globals: {
                process: "readonly",
                console: "readonly",
                __dirname: "readonly"
            }
        },

        rules: {
            ...js.configs.recommended.rules
        }
    }
];
