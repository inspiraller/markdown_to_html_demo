// Abbreviated example
var stylelint = require("stylelint");
var ruleName = "custom_lint_rules/no-extending-classes";

module.exports = stylelint.createPlugin(ruleName, function(option1, option2) {
	return function(root, result) {				
		root.walkAtRules(function (atRule) {
      var name = atRule.name;
      var val = atRule.params;
      if(val.search(/\s*\./)!==-1){
      	stylelint.utils.report({
					message: 'Do not extend classes: ' + name + ' ' + val + '. (Use placeholders instead)',
					node: atRule,
					result: result,
					ruleName: ruleName
				});
      }
    });
	}

});
module.exports.ruleName = ruleName;


