# READ ME - How to convert test your stylelint plugin in stylelint repo#

# Prerequisites:
node, npm, github account

# Clone style lint
$ git clone https://github.com/stylelint/stylelint.git

# install dependencies
$ npm install

# copy custom rule into stylelint/lib/rules/
Replace the plugin type lines with the comments.
example:


1.
***find:***
var report = stylelint.utils.report; 

***replace with:***
var report = require("../../utils/report");

2.
***find:***
var ruleName = "custom_lint_rules/selector-no-unnecessary-nesting"; 

***replace with:***
var ruleName = "selector-no-unnecessary-nesting";

3.
***find:***
var ruleMessages = stylelint.utils.ruleMessages;

***replace with:***
var ruleMessages = require("../../utils/ruleMessages") 

4.
***find:***
module.exports = stylelint.createPlugin(ruleName, function(option1, option2) { 

});

***replace with:***
var rule = function (actual) {

}

5.
***find:***
module.exports.ruleName = ruleName;

***replace with:***
rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;

# update stylelint/rules/index.js to include this plugin
const selectorNoUnnecessaryNesting = require('./selector-no-unnecessary-nesting');

# run test on my rule
$ npm run watch 
p
type: selector-no-unnecessary-nesting

Ensure the tests past. If not, write more.
