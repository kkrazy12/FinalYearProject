function applyStyles(backgroundColour, textColour, buttonColour, linkColour) {
  const elements = document.querySelectorAll('body, header, nav, footer, main, div, aside');
  elements.forEach(element => {
    element.style.setProperty('background-color', backgroundColour, 'important');
    element.style.setProperty('color', textColour, 'important');
    element.style.setProperty('background-image', 'none', 'important');
  });

  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.style.setProperty('background-color', buttonColour, 'important');
  });

  const links = document.querySelectorAll('a');
  links.forEach(link => {
    link.style.setProperty('color', linkColour, 'important');
  });
}

chrome.storage.sync.get(['backgroundColour', 'textColour', 'buttonColour', 'linkColour'], ({ backgroundColour, textColour, buttonColour, linkColour }) => {
  if (backgroundColour && textColour && buttonColour && linkColour) {
    applyStyles(backgroundColour, textColour, buttonColour, linkColour);
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && (changes.backgroundColour || changes.textColour || changes.buttonColour || changes.linkColour)) {
    const { backgroundColour, textColour, buttonColour, linkColour } = changes;
    applyStyles(backgroundColour?.newValue, textColour?.newValue, buttonColour?.newValue, linkColour?.newValue);
  }
});

const colourPresets = [
    { name: "Default", value: "#ffffff" }, 
    { name: "Night Mode", value: "#000000" }, 
    { name: "Ocean Blue", value: "#0080ff" }, 
    { name: "Forest Green", value: "#228B22" }, 
];
