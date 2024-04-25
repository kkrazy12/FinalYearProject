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
  });

  saveButton.addEventListener('click', () => {
    const backgroundColour = colourInput.value;
    const textColour = textColourInput.value;
    const buttonColour = buttonColourInput.value;
    const linkColour = linkColourInput.value;

    chrome.storage.sync.set({ backgroundColour, textColour, buttonColour, linkColour });
    document.body.style.backgroundColor = backgroundColour;
    applyStyles(backgroundColour, textColour, buttonColour, linkColour);
  });
});

function selectPreset(presetColour, textColour, buttonColour) {
  chrome.storage.sync.set({ selectedPreset: presetColour, selectedTextColour: textColour, selectedButtonColour: buttonColour });
  chrome.storage.sync.remove(['backgroundColour', 'textColour', 'buttonColour', 'linkColour']);
  //linkColourInput.value = '';
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
