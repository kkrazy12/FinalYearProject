//apply styles to the webpage
function applyStyles(backgroundColour, textColour, buttonColour, linkColour) {
  //selecting the elements I want to apply styles to
  const elements = document.querySelectorAll('body, header, nav, footer, main, div, aside, article, h1, h2, h3, h4, h5, h6');
  //for each of my elements (above array) set styles 
  elements.forEach(element => {
    element.style.setProperty('background-color', backgroundColour, 'important');
    element.style.setProperty('color', textColour, 'important');
    element.style.setProperty('background-image', 'none', 'important');
  });
  //selecting buttons, inputs etc to apply styles to
  const buttons = document.querySelectorAll('button, input[type="submit"], input[type="reset"], .btn, .modal-trigger');
  //selecting buttons to apply styles to
  buttons.forEach(button => {
    button.style.setProperty('background-color', buttonColour, 'important');
    button.style.color = textColour;
  });

  //selecting links to apply styles
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    link.style.setProperty('color', linkColour, 'important');
  });
  
  //specifically applying styles to my announcement button
  const announcementButton = document.getElementById('announcement');
  if (announcementButton) {
    announcementButton.style.setProperty('color', textColour, 'important'); 
    announcementButton.style.setProperty('background-color', buttonColour, 'important');
  }
  
  //applying styles to labels
  const labels = document.querySelectorAll('label');
  labels.forEach(label => {
    label.style.setProperty('color', textColour, 'important');
  });
  
  //calling checkStyles function - checking the compatibility of the applied styles against the webpage
  checkStyles(backgroundColour, textColour, buttonColour, linkColour);
}

// Function to convert hex color codes to RGB
function hexToRgb(hex) {
  if (!hex) return null;
  // Remove the '#' from the hex value
  hex = hex.replace('#', '');
  // Parse hex to RGB
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  // Return as RGB string
  return `rgb(${r}, ${g}, ${b})`;
}

//checkStyles function checks the compatibility of the applied styles against the current URL
function checkStyles(backgroundColour, textColour, buttonColour, linkColour) {
  const elementsToCheck = document.querySelectorAll('body, header, nav, footer, main, div, aside, article, h1, h2, h3, h4, h5, h6, button, a');
  let totalElements = 0;
  let incompatibleElements = 0;
  elementsToCheck.forEach(element => {
    const computedStyle = getComputedStyle(element);
    const _backgroundColor = computedStyle.backgroundColor;
    const color = computedStyle.color;
    const expectedBgColor = hexToRgb(backgroundColour);
    const expectedColor = hexToRgb(textColour);
    if (_backgroundColor !== expectedBgColor || color !== expectedColor) {
      incompatibleElements++;
    } else if (element.tagName === 'BUTTON' && computedStyle.backgroundColor !== hexToRgb(buttonColour)) {
      incompatibleElements++;
    } else if (element.tagName === 'A' && computedStyle.color !== hexToRgb(linkColour)) {
      incompatibleElements++;
    }
    totalElements++;
  });
  let compatibilityPercentage = ((totalElements - incompatibleElements) / totalElements) * 100;
  let compatibilityText = "";
  if (compatibilityPercentage >= 70) {
    compatibilityText = "AG is likely to work well on this website.";
  } else if (compatibilityPercentage >= 50) {
    compatibilityText = "There are some elements on this page AG may not work with.";
  } else {
    compatibilityText = "AG will not work properly on this page.";
  }

  //send message to update compatibility text
  chrome.runtime.sendMessage({ action: 'updateCompatibilityText', compatibilityText: compatibilityText });
}

//remove styles 
function removeStyles() {
  const elements = document.querySelectorAll('body, header, nav, footer, main, div, aside, article, h1, h2, h3, h4, h5, h6, button, input, a');
  elements.forEach(element => {
    element.removeAttribute('style');
  });
}

//listen for if a custom theme is chosen and apply styles
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'applyCustomTheme') {
    applyStyles(request.backgroundColour, request.textColour, request.buttonColour, request.linkColour);
  }
});

//applying stored theme colours
chrome.storage.sync.get(['backgroundColour', 'textColour', 'buttonColour', 'linkColour'], ({ backgroundColour, textColour, buttonColour, linkColour }) => {
  if (backgroundColour && textColour && buttonColour && linkColour) {
    applyStyles(backgroundColour, textColour, buttonColour, linkColour);
  }
});
//listen for any changes to colours and apply
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && (changes.backgroundColour || changes.textColour || changes.buttonColour || changes.linkColour)) {
    const { backgroundColour, textColour, buttonColour, linkColour } = changes;
    applyStyles(backgroundColour?.newValue, textColour?.newValue, buttonColour?.newValue, linkColour?.newValue);
  }
});


