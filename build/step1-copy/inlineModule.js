import subMod from "subModule/main";



export default function() {
  console.log("START inlineModule.js, calling Submod");
  let ret = subMod();
  console.log("END inlineModule.js, submod called", ret)
}