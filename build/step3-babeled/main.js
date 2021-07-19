"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loop = loop;

var _subModule9ee7cf = require("./subModule-9ee7cf19.js");

var _inlineFolderBb41d = require("./inlineFolder-bb41d525.js");

function inline() {
  console.log("START inlineModule.js, calling Submod");
  let ret = (0, _subModule9ee7cf.s)();
  console.log("END inlineModule.js, submod called", ret);
}

var subModInline = "inlineModule3.js";

function loop() {
  console.log('START Main Loop');
  inline();
  {
    console.log("debug if on");
  }
  (0, _subModule9ee7cf.s)();
  console.log('END Main Loop, submodule3 inline:', subModInline, _inlineFolderBb41d.s);
}