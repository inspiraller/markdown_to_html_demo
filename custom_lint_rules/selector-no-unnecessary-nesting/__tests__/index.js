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
  }, 
  {
    code: ".parent .child {} .grand .parent .child {} .ancestor .grand .parent .child {}",
    description: "Whole selector"
  },
  {
    code: ".parent{.child{}} .grand{ .parent{ .child{}}}",
    description: "Nested selector"
  }],

  reject: [{
    code: ".grand .parent .child {}",
    message: messages.rejected(".parent .child", ".grand .parent .child"),
    line: 1,
    column: 1
  },{
    code: ".ancestor .grand .parent .child {}",
    message: messages.rejected(".parent .child", ".ancestor .grand .parent .child"),
    line: 1,
    column: 1
  },
  {
    code: ".grand{.parent{.child{}}}",
    message: messages.rejected(".parent .child", ".grand .parent .child"),
    line: 1,
    column: 16
  }]
})
