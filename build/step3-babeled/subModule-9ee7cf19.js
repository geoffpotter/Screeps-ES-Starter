"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.s = subMod;

var _inlineFolderBb41d = require("./inlineFolder-bb41d525.js");

var inline2 = "inlineModule2.js";

function subMod() {
  console.log("subModule main.js from inline2->", inline2, _inlineFolderBb41d.s);
  return inline2;
}