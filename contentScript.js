// function applyBackgroundColour(backgroundColor) {
//   document.body.style.backgroundColor = backgroundColor;

//   const commonElements = document.querySelectorAll('header, footer, main, div, aside');
//   commonElements.forEach(element => {
//       element.style.backgroundColor = backgroundColor;
//   });
// }

function applyBackgroundColour(backgroundColor) {
  const style = document.createElement('style');
  style.textContent = `
    body, header, nav, footer, main, div, aside {
      background-color: ${backgroundColor} !important;
    }
    div aside {
      background-color: ${backgroundColor} !important;
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
