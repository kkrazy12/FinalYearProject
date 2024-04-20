document.addEventListener('DOMContentLoaded', () => {
  const colourInput = document.getElementById('colour');
  const textColourInput = document.getElementById('textColour');
  const buttonColourInput = document.getElementById('buttonColour');
  const saveButton = document.getElementById('save');

  saveButton.addEventListener('click', () => {
    const backgroundColour = colourInput.value;
    const textColour = textColourInput.value;
    const buttonColour = buttonColourInput.value;
    
    chrome.storage.sync.set({ backgroundColour, textColour, buttonColour });
    document.body.style.backgroundColor = backgroundColour;
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

