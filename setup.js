function applyStyles(backgroundColour, textColour, buttonColour, linkColour) {
  const elements = document.querySelectorAll('body, header, nav, footer, main, div, aside, textarea');
  elements.forEach(element => {
    element.style.setProperty('background-color', backgroundColour, 'important');
    element.style.setProperty('background-image', 'none', 'important');
    element.style.setProperty('color', textColour, 'important');
  });
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    link.style.setProperty('color', textColour, 'important');
  });
  const buttons = document.querySelectorAll('button, input[type="submit"], input[type="reset"]');
  buttons.forEach(button => {
    button.style.setProperty('background-color', buttonColour, 'important');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const colourInput = document.getElementById('colour');
  const textColourInput = document.getElementById('textColour');
  const buttonColourInput = document.getElementById('buttonColour');
  const linkColourInput = document.getElementById('linkColour');
  const saveButton = document.getElementById('save');
  
  chrome.storage.sync.get(['backgroundColour', 'textColour', 'buttonColour', 'linkColour'], ({ backgroundColour, textColour, buttonColour, linkColour }) => {
    if (backgroundColour) {
      colourInput.value = backgroundColour;
    }
    if (textColour) {
      textColourInput.value = textColour;
    }
    if (buttonColour) {
      buttonColourInput.value = buttonColour;
    }
    if (linkColour) {
      linkColourInput.value = linkColour;
    }
    applyStyles(backgroundColour, textColour, buttonColour, linkColour); 
  });
  
  saveButton.addEventListener('click', () => {
    const backgroundColour = colourInput.value;
    const textColour = textColourInput.value;
    const buttonColour = buttonColourInput.value;
    const linkColour = linkColourInput.value;

    chrome.storage.sync.set({ backgroundColour, textColour, buttonColour, linkColour });
    chrome.storage.sync.remove('selectedPreset');
    applyStyles(backgroundColour, textColour, buttonColour, linkColour); 
  });
});

function selectPreset(presetColour, textColour, buttonColour) {
  chrome.storage.sync.set({ selectedPreset: presetColour, selectedTextColour: textColour, selectedButtonColour: buttonColour });
  chrome.storage.sync.remove(['backgroundColour', 'textColour', 'buttonColour', 'linkColour']);
}

document.querySelectorAll('.preset-btn').forEach(button => {
  button.addEventListener('click', () => {
    const presetColour = button.dataset.color;
    const textColour = button.dataset.textcolor || '#000000';
    const buttonColour = button.dataset.buttoncolor || '#ffffff'; 
    selectPreset(presetColour, textColour, buttonColour); 
  });
});

chrome.storage.sync.get(['selectedPreset', 'selectedTextColour', 'selectedButtonColour'], ({ selectedPreset, selectedTextColour, selectedButtonColour }) => {
  if (selectedPreset) {
    applyStyles(selectedPreset, selectedTextColour, selectedButtonColour);
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && (changes.selectedPreset || changes.selectedTextColour || changes.selectedButtonColour)) {
    applyStyles(changes.selectedPreset?.newValue, changes.selectedTextColour?.newValue, changes.selectedButtonColour?.newValue);
  }
});

//on off toggle
document.addEventListener('DOMContentLoaded', () => {
  const onOffToggle = document.getElementById('on-off-toggle');

  chrome.storage.sync.get('extensionEnabled', ({ extensionEnabled }) => {
    if (extensionEnabled) {
      applyStoredColorsOrTheme();
    }
    onOffToggle.checked = extensionEnabled; //toggle state
  });

  onOffToggle.addEventListener('change', () => {
    const extensionEnabled = onOffToggle.checked;
    chrome.storage.sync.set({ extensionEnabled });

    if (extensionEnabled) {
      applyStoredColorsOrTheme();
    } else {
      resetToDefaultColors();
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'removeStyles' });
      });
    }
  });

  function applyStoredColorsOrTheme() {
    chrome.storage.sync.get(['backgroundColour', 'textColour', 'buttonColour', 'linkColour', 'selectedPreset'], ({ backgroundColour, textColour, buttonColour, linkColour, selectedPreset }) => {
      if (selectedPreset) {
        applyStyles(backgroundColour, textColour, buttonColour, linkColour);
      } else if (backgroundColour && textColour && buttonColour && linkColour) {
        applyStyles(backgroundColour, textColour, buttonColour, linkColour);
      }
    });
  }

  function resetToDefaultColors() {
    const defaultBackground = '#ffffff';
    const defaultText = '#000000';
    const defaultButton = '#ffffff';
    const defaultLink = '#0000ff';
  
    chrome.storage.sync.remove(['backgroundColour', 'textColour', 'buttonColour', 'linkColour', 'selectedPreset']);
    applyStyles(defaultBackground, defaultText, defaultButton, defaultLink);
  
    document.querySelectorAll('.btn').forEach(button => {
      button.style.removeProperty('background-color');
    });
  }
});

document.addEventListener('DOMContentLoaded', applyStoredColorsOrTheme);

function applyStoredColorsOrTheme() {
  const onOffToggle = document.getElementById('on-off-toggle');
  chrome.storage.sync.get(['backgroundColour', 'textColour', 'buttonColour', 'linkColour', 'selectedPreset'], ({ backgroundColour, textColour, buttonColour, linkColour, selectedPreset }) => {
    if (selectedPreset) {
      applyStyles(backgroundColour, textColour, buttonColour, linkColour);
    } else if (backgroundColour && textColour && buttonColour && linkColour) {
      applyStyles(backgroundColour, textColour, buttonColour, linkColour);
    }
    if (!onOffToggle.checked && (backgroundColour || textColour || buttonColour || linkColour)) {
      onOffToggle.checked = true; //be true when colours are applied
      chrome.storage.sync.set({ extensionEnabled: true });
    }
  });
}

document.querySelectorAll('input[type="color"]').forEach(input => {
  input.addEventListener('input', () => {
    const onOffToggle = document.getElementById('on-off-toggle');
    if (!onOffToggle.checked) {
      onOffToggle.checked = true; //toggle on when styles applied
      chrome.storage.sync.set({ extensionEnabled: true });
    }
  });
});

document.querySelectorAll('.preset-btn').forEach(button => {
  button.addEventListener('click', () => {
    const onOffToggle = document.getElementById('on-off-toggle');
    if (!onOffToggle.checked) {
      onOffToggle.checked = true; //on for when a preset is applied
      chrome.storage.sync.set({ extensionEnabled: true });
    }
  });
});

