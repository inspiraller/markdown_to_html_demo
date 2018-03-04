// Abbreviated example
var stylelint = require("stylelint");

/*var stringify = require("stringify-object");*/

var ruleName = "custom_lint_rules/two-underscores-only";


module.exports = stylelint.createPlugin(ruleName, function(option1, option2) {

	var getTwoUnderscores = function(rule){
		var strSelectors = rule.selector;
		var arrSelectors = strSelectors.split(/\s/);
		for(var i=0, intLen = arrSelectors.length; i < intLen; ++i){
			var strSelector = arrSelectors[i];
			var intUnderscores = strSelector.split('_').length - 1;	
			if(intUnderscores == 1 || intUnderscores > 2 ){
				return strSelector;
			}			
		}
	
		return null;		
	}

	return function(root, result) {				

		root.walkRules(function (rule) {

			var twoUnderscores = getTwoUnderscores(rule);

			if(twoUnderscores){
				
				stylelint.utils.report({
					message: 'Two underscores only = ' + twoUnderscores,
					node: rule,
					result: result,
					ruleName: ruleName
				});
			}

		});


		
	}
});

module.exports.ruleName = ruleName;


