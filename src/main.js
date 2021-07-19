
let inline = require("inlineModule");
import subModInline from "subModule/inlineFolder/inlineModule3";
import subMod from "subModule/main";
import subSubMod from "subModule/inlineFolder/main"
export function loop() {
  console.log('START Main Loop');
  inline();
  if (_DEBUG_) {
    console.log("debug if on");
  } else {
    console.log("debug if off")
  }
  subMod();
  console.log('END Main Loop, submodule3 inline:', subModInline, subSubMod);
}