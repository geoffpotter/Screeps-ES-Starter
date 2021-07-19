import { s as subSubMod } from './inlineFolder-bb41d525.js';

var inline2 = "inlineModule2.js";

function subMod() {
  console.log("subModule main.js from inline2->", inline2, subSubMod);

  return inline2;
}

export { subMod as s };
