import pptxgen from "pptxgenjs";

const pptx = new pptxgen();
pptx.defineLayout({ name: "CUSTOM_16_9", width: 13.333, height: 7.5 });
pptx.layout = "CUSTOM_16_9";

console.log("Layout set successfully. Dimensions: 13.333 x 7.5 inches");
