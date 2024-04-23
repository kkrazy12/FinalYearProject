function applyBackgroundColour(backgroundColor, linkColour) {
  const elements = document.querySelectorAll('body, header, nav, footer, main, div, aside');
  elements.forEach(element => {
    element.style.setProperty('background-color', backgroundColor, 'important');
    element.style.setProperty('background-image', 'none', 'important');
  });

  const defaultBgElements = document.querySelectorAll('aside.color-bg-default');
  defaultBgElements.forEach(element => {
    element.style.setProperty('background-color', backgroundColor, 'important');
  });

  const links = document.querySelectorAll('a');
  links.forEach(link => {
    link.style.setProperty('color', linkColour, 'important');
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
  });

  saveButton.addEventListener('click', () => {
    const backgroundColour = colourInput.value;
    const textColour = textColourInput.value;
    const buttonColour = buttonColourInput.value;
    const linkColour = linkColourInput.value;

    chrome.storage.sync.set({ backgroundColour, textColour, buttonColour, linkColour });
    document.body.style.backgroundColor = backgroundColour;
    applyBackgroundColour(backgroundColour, linkColour);
  });
});

function selectPreset(presetColour) {
  chrome.storage.sync.set({ selectedPreset: presetColour, backgroundColor: null });
}

chrome.storage.sync.get('selectedPreset', ({ selectedPreset }) => {
  if (selectedPreset) {
      applyBackgroundColour(selectedPreset);
  }
});


chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.selectedPreset) {
      applyBackgroundColour(changes.selectedPreset.newValue);
  }
});

document.querySelectorAll('.preset-btn').forEach(button => {
  button.addEventListener('click', () => {
      const presetColour = button.dataset.color;
      selectPreset(presetColour);
  });
});
