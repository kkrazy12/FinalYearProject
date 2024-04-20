function applyBackgroundColour(backgroundColor) {
  const elements = document.querySelectorAll('body, header, nav, footer, main, div, aside');
  elements.forEach(element => {
    element.style.setProperty('background-color', backgroundColor, 'important');
    element.style.setProperty('background-image', 'none', 'important');
  });

  const defaultBgElements = document.querySelectorAll('aside.color-bg-default');
  defaultBgElements.forEach(element => {
    element.style.setProperty('background-color', backgroundColor, 'important');
  });
}


chrome.storage.sync.get('backgroundColor', ({ backgroundColor }) => {
  if (backgroundColor) {
      applyBackgroundColour(backgroundColor);
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.backgroundColor) {
      applyBackgroundColour(changes.backgroundColor.newValue);
  }
});

const colourPresets = [
    { name: "Default", value: "#ffffff" }, 
    { name: "Night Mode", value: "#000000" }, 
    { name: "Ocean Blue", value: "#0080ff" }, 
    { name: "Forest Green", value: "#228B22" }, 
];