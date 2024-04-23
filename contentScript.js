function applyStyles(backgroundColour, textColour, buttonColour, linkColour) {
  const elements = document.querySelectorAll('body, header, nav, footer, main, div, aside, article, h1, h2, h3, h4, h5, h6');
  elements.forEach(element => {
    element.style.setProperty('background-color', backgroundColour, 'important');
    element.style.setProperty('color', textColour, 'important');
    element.style.setProperty('background-image', 'none', 'important');
  });

  const buttons = document.querySelectorAll('button, input');
  buttons.forEach(button => {
    button.style.setProperty('background-color', buttonColour, 'important');
  });

  const links = document.querySelectorAll('a');
  links.forEach(link => {
    link.style.setProperty('color', linkColour, 'important');
  });

  checkStyles(backgroundColour, textColour, buttonColour, linkColour);
}

function hexToRgb(hex) {
  if (!hex) return null;
  //remove the '#' from the hex value
  hex = hex.replace('#', '');
  //parse hex to RGB
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  //return as RGB string
  return `rgb(${r}, ${g}, ${b})`;
}


function checkStyles(backgroundColour, textColour, buttonColour, linkColour) {
  const elementsToCheck = document.querySelectorAll('body, header, nav, footer, main, div, aside, article, h1, h2, h3, h4, h5, h6, button, a');

  let incompatibilityDetected = false;
  let incompatibleElements = [];

  elementsToCheck.forEach(element => {
    const computedStyle = getComputedStyle(element);
    const _backgroundColor = computedStyle.backgroundColor;
    const color = computedStyle.color;

    const expectedBgColor = hexToRgb(backgroundColour);
    const expectedColor = hexToRgb(textColour);
    const expectedButtonColor = hexToRgb(buttonColour);
    const expectedLinkColor = hexToRgb(linkColour);

    if (_backgroundColor !== expectedBgColor || color !== expectedColor || (element.tagName === 'BUTTON' && computedStyle.backgroundColor !== expectedButtonColor) || (element.tagName === 'A' && computedStyle.color !== expectedLinkColor)) {
      console.log("textcolor: ",color, textColour,
      "background:", _backgroundColor, backgroundColour)
      incompatibilityDetected = true;
      incompatibleElements.push(element);
    }
  });

  if (incompatibilityDetected) {
    console.log("The extension's styles may not be fully compatible with this website. Incompatible elements:", incompatibleElements);
  }
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
