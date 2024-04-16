function applyBackgroundColour(backgroundColor) {
  const style = document.createElement('style');
  style.textContent = `
    body, header, nav, footer, main, div, aside {
      background-color: ${backgroundColor} !important;
    }
    aside.color-bg-default {
      background-color: ${backgroundColor} !important;
    }
    .ssrcss-wcxvp8-StyledContainer.e1f9r9nm2{
      background-image: none !important;
    }
  `;
  document.head.appendChild(style);
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
