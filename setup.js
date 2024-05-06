document.addEventListener('DOMContentLoaded', () => {
  const colourInput = document.getElementById('colour');
  const textColourInput = document.getElementById('textColour');
  const buttonColourInput = document.getElementById('buttonColour');
  const linkColourInput = document.getElementById('linkColour');
  const saveButton = document.getElementById('save');
  const saveCustomButton = document.getElementById('saveCustom');
  const compatibilityText = document.getElementById('compatibilityPercentage');
  const customThemeBtn = document.querySelector('.custom-theme-btn'); 

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
    // applyStyles(backgroundColour, textColour, buttonColour, linkColour); 
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

  saveCustomButton.addEventListener('click', () => {
    const backgroundColour = colourInput.value;
    const textColour = textColourInput.value;
    const buttonColour = buttonColourInput.value;
    const linkColour = linkColourInput.value;
  
    chrome.storage.sync.set({ customTheme: { backgroundColour, textColour, buttonColour, linkColour } }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'applyCustomTheme',
          backgroundColour,
          textColour,
          buttonColour,
          linkColour
        });
      });
    });
  });
  

  customThemeBtn.addEventListener('click', () => {
    chrome.storage.sync.get('customTheme', ({ customTheme }) => {
      if (customTheme) {
        const { backgroundColour, textColour, buttonColour, linkColour } = customTheme;
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'applyCustomTheme',
            backgroundColour,
            textColour,
            buttonColour,
            linkColour
          });
        });
      }
    });
  });
  
});


function selectPreset(presetColour, textColour, buttonColour, linkColour) {
  linkColour = linkColour || '#0000ff'; 
  chrome.storage.sync.set({ 
    selectedPreset: presetColour, 
    selectedTextColour: textColour, 
    selectedButtonColour: buttonColour, 
    selectedLinkColour: linkColour 
  });
  chrome.storage.sync.remove(['backgroundColour', 'textColour', 'buttonColour', 'linkColour']);
  applyStyles(presetColour, textColour, buttonColour, linkColour); 
}

document.querySelectorAll('.preset-btn').forEach(button => {
  button.addEventListener('click', () => {
    const presetColour = button.dataset.color;
    const textColour = button.dataset.textcolor || '#000000';
    const buttonColour = button.dataset.buttoncolor || '#ffffff';
    const linkColour = button.dataset.linkcolor || '#0000ff';

    selectPreset(presetColour, textColour, buttonColour, linkColour); 
  });
});

chrome.storage.sync.get(['selectedPreset', 'selectedTextColour', 'selectedButtonColour', 'selectedLinkColour'], ({ selectedPreset, selectedTextColour, selectedButtonColour, selectedLinkColour }) => {
  if (selectedPreset) {
    applyStyles(selectedPreset, selectedTextColour, selectedButtonColour, selectedLinkColour);
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && (changes.selectedPreset || changes.selectedTextColour || changes.selectedButtonColour || changes.selectedLinkColour)) {
    applyStyles(changes.selectedPreset?.newValue, changes.selectedTextColour?.newValue, changes.selectedButtonColour?.newValue, changes.selectedLinkColour?.newValue);
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateCompatibilityText') {
    const compatibilityText = document.getElementById('compatibilityPercentage');
    compatibilityText.innerText = request.compatibilityText;
  }
});

//modal trigger function
document.addEventListener('DOMContentLoaded', function () {
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
});

//collapsible dropdown content
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.collapsible');
  var instances = M.Collapsible.init(elems);
});

//for carets on collapsibles
$(function() {
  $('.collapsible').collapsible({
    onOpenEnd: function(el) {
      $(el).find('.material-icons.right.caret').text('keyboard_arrow_up');
    },
    onCloseEnd: function(el) {
      $(el).find('.material-icons.right.caret').text('keyboard_arrow_down');
    }
  });
});
