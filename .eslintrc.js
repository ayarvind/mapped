module.exports = {
    env: {
        browser: true,
        node: true,
        es2021: true
    },
    extends: ["eslint:recommended", "plugin:react/recommended"], 
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module"
    },
    rules: {
        "indent": ["error", 2] 
    }
};
