import inline2 from "inlineModule2";
import inline3 from "inlineFolder/main"
export default function() {
  console.log("subModule main.js from inline2->", inline2, inline3);

  return inline2;
}