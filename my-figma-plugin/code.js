figma.ui.onmessage = async (msg) => {
  if (msg.type === "apply-typography") {
      const { fontFamily, fontSize, fontWeight, lineHeight } = msg;

      const selection = figma.currentPage.selection;

      if (selection.length === 0) {
          figma.notify("Please select at least one text layer.");
          return;
      }

      let successCount = 0;
      let errorCount = 0;

      for (const node of selection) {
          if (node.type === "TEXT") {
              try {
                  
                  const fontStyle = fontWeight || "Regular";
                  try {
                      await figma.loadFontAsync({ family: fontFamily, style: fontStyle });
                  } catch (error) {
                      
                      console.warn(`Failed to load ${fontFamily} with style ${fontStyle}, falling back to Regular`);
                      await figma.loadFontAsync({ family: fontFamily, style: "Regular" });
                  }

                  
                  node.fontName = { family: fontFamily, style: fontStyle };
                  node.fontSize = fontSize;

                  if (lineHeight) {
                      node.lineHeight = { value: lineHeight, unit: "PIXELS" };
                  }

                  successCount++;
              } catch (error) {
                  console.error(`Error applying typography to ${node.name}:`, error);
                  errorCount++;
              }
          }
      }

     
      if (successCount > 0) {
          figma.notify(`Updated ${successCount} text layer${successCount !== 1 ? 's' : ''}`);
      }
      if (errorCount > 0) {
          figma.notify(`Failed to update ${errorCount} layer${errorCount !== 1 ? 's' : ''}`, { error: true });
      }
  }
};

figma.showUI(__html__, { width: 300, height: 400 });