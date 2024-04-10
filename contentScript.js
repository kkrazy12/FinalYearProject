// chrome.storage.sync.get('backgroundColor', ({ backgroundColor }) => {
//     if (backgroundColor) {
//       document.body.style.backgroundColor = backgroundColor;
//     }
//   });

function applyBackgroundColour(backgroundColor) {
  document.body.style.backgroundColor = backgroundColor;

  const commonElements = document.querySelectorAll('header, footer, main, div, aside');
  commonElements.forEach(element => {
      element.style.backgroundColor = backgroundColor;
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
