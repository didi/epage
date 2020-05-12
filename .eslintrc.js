module.exports = {
  extends: ["standard", "plugin:vue/recommended"],
  // add your custom rules here
  'rules': {
    "vue/no-parsing-error": [0, {
      "x-invalid-end-tag": false
    }]
  }
}