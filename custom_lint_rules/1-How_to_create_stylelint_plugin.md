# How to create stylelint plugin?

# Prerequisites
node, npm

# Create your project folder
c:\projects\myproject

# Install dependencies
$ npm install stylelint --save-dev

# Add .stylelintrc file 


```javascript
.stylelintrc
{
    "plugins": [        
        "./custom_lint_rules/my-rule/index.js"
    ],
    "rules": {
        "custom_lint_rules/my-rule":true
    }
}
```

# Add folder
custom_lint_rules/my-rule

# Add index.js
custom_lint_rules/my-rule/index.js
```javascript

var stylelint = require("stylelint");
var report = stylelint.utils.report; //require("../../utils/report");
var ruleName = "custom_lint_rules/my-rule"; //"selector-no-unnecessary-nesting";
var ruleMessages = stylelint.utils.ruleMessages;//require("../../utils/ruleMessages") 
var messages = ruleMessages(ruleName, {
  rejected: function(a, b){
    return  `Expected "${a}" should be "${b}"`;
  }
})


module.exports = stylelint.createPlugin(ruleName, function(option1, option2) { 
    return function(root, result) {             
        
        root.walkRules(function (rule) {            
            someError = true;
            if(someError){                
                stylelint.utils.report({
                    message: messages.rejected('expect this result', 'actual'),
                    node: rule,
                    result: result,
                    ruleName: ruleName
                });
            }
        });
        return {};
    }
});// don't forget to remove this parenthesis for stylelint pull request 



module.exports.ruleName = ruleName;
//rule.ruleName = ruleName;
//rule.messages = messages;
//module.exports = rule;
```

# Add __tests__/index.js
custom_lint_rules/my-rule/__tests__/index.js
```javascript
index.js

"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],
  skipBasicChecks: true,

  accept: [{
    code: ".parent .child {} .grand .parent .child {}",
    description: "Whole selector"
  }],
  reject: [{
    code: ".grand .parent .child {}",
    message: messages.rejected(".parent .child", ".grand .parent .child"),
    line: 1,
    column: 1
  }]
})
```

# Add README.md
Explaining reason for new rule
follow ideas here - 
https://github.com/stylelint/stylelint/blob/master/docs/developer-guide/rules.md








