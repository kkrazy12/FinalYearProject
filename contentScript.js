function applyStyles(backgroundColour, textColour, buttonColour, linkColour) {
  const elements = document.querySelectorAll('body, header, nav, footer, main, div, aside, article, h1, h2, h3, h4, h5, h6');
  elements.forEach(element => {
    element.style.setProperty('background-color', backgroundColour, 'important');
    element.style.setProperty('color', textColour, 'important');
    element.style.setProperty('background-image', 'none', 'important');
  });
  const buttons = document.querySelectorAll('button, input[type="submit"], input[type="reset"], .btn, .modal-trigger');
  buttons.forEach(button => {
    button.style.setProperty('background-color', buttonColour, 'important');
  });
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    link.style.setProperty('color', linkColour, 'important');
  });
  
  //targeting my annoucement button
  const announcementButton = document.getElementById('announcement');
  if (announcementButton) {
    announcementButton.style.setProperty('color', textColour, 'important');
  }
  
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

  chrome.runtime.sendMessage({ action: 'updateCompatibilityText', compatibilityText: compatibilityText });
}

function removeStyles() {
  const elements = document.querySelectorAll('body, header, nav, footer, main, div, aside, article, h1, h2, h3, h4, h5, h6, button, input, a');
  elements.forEach(element => {
    element.removeAttribute('style');
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'removeStyles') {
    removeStyles();
  }
});

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
