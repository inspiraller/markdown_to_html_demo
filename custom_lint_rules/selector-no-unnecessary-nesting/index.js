//var stylelint = require("stylelint");
//var stringify = require("stringify-object");

// note: comments below are to indicate how to convert this plugin to send pull request to stylelint
// replace the javascript line with the one in the comment.

var util = require('util');
var stylelint = require("stylelint");
var report = stylelint.utils.report; //require("../../utils/report");
var ruleName = "custom_lint_rules/selector-no-unnecessary-nesting"; //"selector-no-unnecessary-nesting";
var ruleMessages = stylelint.utils.ruleMessages;//require("../../utils/ruleMessages") 
var messages = ruleMessages(ruleName, {
  rejected: function(a, b){
  	return  `Expected selector "${a}" with declarations to exist for selector "${b}"`;
  }
})

module.exports = stylelint.createPlugin(ruleName, function(option1, option2) { //var rule = function (actual) {

	var trim = function(str){
		return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	}

	var getWholeSelector = function(node, strSelector){

//                                                  if not @media
//                                                        \/
		if(node.parent && node.parent.type!=='root' && node.parent.selector){
			var regAmpersand = /^\s*\&\s*([\#\.])/;
			var isAmpersand = (strSelector.search(regAmpersand)===-1)?false:true;


			var strSelectorWithoutAmpersand = (isAmpersand)?strSelector.replace(regAmpersand,'$1'):' '  + strSelector;

			return getWholeSelector(node.parent, node.parent.selector + strSelectorWithoutAmpersand);
			
		}else{
			return strSelector;
		}
	}

	var excludeSelectors = function(strCommaSelectors){
			// remove pseudo code.
			// We will allow pseudo overrides and adjacent siblings as this plugin is mainly focused on reducing nesting on elements.
			return strCommaSelectors.replace(/\&?\s*[\:\~\+][^\,]+(\,|$)/g,'$1');
	}
	var hasDeclarations = function(root, rule){
		// note: If a selector has an @include. We are not testing to see if that @include has declarations.
		// It is expensive checking and unnecessarily complicated. 
		// It is enough to know that this selector intended to have includes.
		return (rule.nodes.length > 0)?true:false;
	}


	var collectAllSelectors = function(root){

		var objSelectors = {};
		var arrNestItems = [];

		root.walkRules(function(rule){


			// iterate all selectors in commas 
			var strCommaSelectors = rule.selector;

//console.log('#############################################');
//console.log('strCommaSelectors = ' + strCommaSelectors);

			strCommaSelectors = excludeSelectors(strCommaSelectors);

			if(!hasDeclarations(root, rule)){
				return;
			}

			var arrCommaSelectors = strCommaSelectors.split(',');

			for(var i=0, intLen = arrCommaSelectors.length; i < intLen; ++i){
				var strSelector = arrCommaSelectors[i];

				var strWholeSelector = getWholeSelector(rule, strSelector);

				// replace line breaks with single space
				strWholeSelector = strWholeSelector.replace(/\s/g,' ');

				// trim
				strWholeSelector = strWholeSelector.replace(/^\s+/,'');
//console.log('strWholeSelector = "' + strWholeSelector + '"');

				var strSelectorTrimmed = trim(strWholeSelector);
				objSelectors[strSelectorTrimmed] = true;
				var arrSpacedSelectors = strSelectorTrimmed.split(/\s+/).reverse();
				var intNestCount = arrSpacedSelectors.length;
				if(intNestCount > 1){
					arrNestItems.push({
						strWholeSelector:strWholeSelector,
						intNestCount:intNestCount,
						arrSpacedSelectors:arrSpacedSelectors,
						rule:rule
					});
				}
			}
			// file = rule.source.input.file
		});
		return {
			arrNestItems:arrNestItems,
			objSelectors:objSelectors
		};
	}

	var iterateNestItemsToTestChildRuleExist = function(result, objAllFiles){
		var arrNestItems = objAllFiles.arrNestItems;
		var objSelectors = objAllFiles.objSelectors;

		arrNestItems = arrNestItems.sort(function(a,b){
			return (a.intNestCount > b.intNestCount);
		});

		outerLoop:
		for(var i=0, intLen = arrNestItems.length; i < intLen; ++i){
			var objNestItems = arrNestItems[i];
			var strWholeSelector = objNestItems.strWholeSelector;
			var arrSpacedSelectors = objNestItems.arrSpacedSelectors;
			var strConcatSpaced = '';

			innerLoop:
			for(var s = 0, intLenS = arrSpacedSelectors.length; s < intLenS; ++s){
				var strSpacedSelector = arrSpacedSelectors[s];


				/*if(s > 0){ don't allow any nest levels if a child doesnt exist */

				if(s > 1){/* allow atleast 1 nest level even if .child doesnt exist */

					//console.log('strConcatSpaced = ' + strConcatSpaced);

					if(!objSelectors[strConcatSpaced]){


						//console.log('###########################################################');
						//console.log('testing each nested selector = ' + objNestItems.strSelector);
						//console.log('This item does not exist: strConcatSpaced = "' + strConcatSpaced + '"');
						

						report({
							message: 'Unnecessary nesting. Create this first:' + strConcatSpaced,
							message: messages.rejected(strConcatSpaced, strWholeSelector),
							node: objNestItems.rule,
							result: result,
							ruleName: ruleName
						});

						break innerLoop;
							// report this item
						
					}					
					
				}		
				if(s > 0){
					strConcatSpaced = ' ' + strConcatSpaced;
				}

				strConcatSpaced = strSpacedSelector + strConcatSpaced;
				
			}
		}
	}

	return function(root, result) {				
		var objAllFiles = collectAllSelectors(root);
		iterateNestItemsToTestChildRuleExist(result, objAllFiles);
		return {};
	}

});// don't forget to remove this parenthesis for stylelint pull request 



module.exports.ruleName = ruleName;
//rule.ruleName = ruleName;
//rule.messages = messages;
//module.exports = rule;