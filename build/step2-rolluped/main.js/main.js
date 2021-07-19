import { s as subMod } from './subModule-9ee7cf19.js';
import { s as subSubMod } from './inlineFolder-bb41d525.js';

function inline() {
  console.log("START inlineModule.js, calling Submod");
  let ret = subMod();
  console.log("END inlineModule.js, submod called", ret);
}

var subModInline = "inlineModule3.js";

function loop() {
  console.log('START Main Loop');
  inline();
  {
    console.log("debug if on");
  }
  subMod();
  console.log('END Main Loop, submodule3 inline:', subModInline, subSubMod);
}

export { loop };
