import pptxgen from "pptxgenjs";

const pptx = new pptxgen();
console.log("Shapes available:", Object.keys(pptx.shapes || {}));
console.log("ShapeType available:", Object.keys(pptx.ShapeType || {}));
