document.addEventListener('DOMContentLoaded', () => {
    const colorInput = document.getElementById('colour');
    const saveButton = document.getElementById('save');
  
    saveButton.addEventListener('click', () => {
      const colour = colorInput.value;
      chrome.storage.sync.set({ backgroundColor: colour });
      document.body.style.backgroundColor = colour;
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

