function applyStyles(backgroundColour, textColour, buttonColour) {
  const elements = document.querySelectorAll('body, header, nav, footer, main, div, aside');
  elements.forEach(element => {
    element.style.setProperty('background-color', backgroundColour, 'important');
    element.style.setProperty('color', textColour, 'important');
    element.style.setProperty('background-image', 'none', 'important');
  });

  // const defaultBgElements = document.querySelectorAll('aside.color-bg-default');
  // defaultBgElements.forEach(element => {
  //   element.style.setProperty('background-color', backgroundColour, 'important');
  //   element.style.setProperty('color', textColour, 'important');
  // });

  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.style.setProperty('background-color', buttonColour, 'important');
  });
}

chrome.storage.sync.get(['backgroundColour', 'textColour', 'buttonColour'], ({ backgroundColour, textColour, buttonColour }) => {
  if (backgroundColour && textColour && buttonColour) {
      applyStyles(backgroundColour, textColour, buttonColour);
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && (changes.backgroundColour || changes.textColour || changes.buttonColour)) {
      const { backgroundColour, textColour, buttonColour } = changes;
      applyStyles(backgroundColour?.newValue, textColour?.newValue, buttonColour?.newValue);
  }
});


const colourPresets = [
    { name: "Default", value: "#ffffff" }, 
    { name: "Night Mode", value: "#000000" }, 
    { name: "Ocean Blue", value: "#0080ff" }, 
    { name: "Forest Green", value: "#228B22" }, 
];