document.addEventListener('DOMContentLoaded', () => {
  const colourInput = document.getElementById('colour');
  const textColourInput = document.getElementById('textColour');
  const buttonColourInput = document.getElementById('buttonColour');
  const linkColourInput = document.getElementById('linkColour');
  const saveButton = document.getElementById('save');
  const saveNamedCustomButton = document.getElementById('saveNamedCustom');
  const customThemeBtn = document.querySelector('.custom-theme-btn');
  const savedThemes = document.getElementById('savedThemes');
  const compatibilityText = document.getElementById('compatibilityPercentage');

  //colour inputs here
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
    //apply the colours the user has selected from colour inputs
    applyStyles(backgroundColour, textColour, buttonColour, linkColour);
  });

  //save button for applying the selected styles
  saveButton.addEventListener('click', () => {
    const backgroundColour = colourInput.value;
    const textColour = textColourInput.value;
    const buttonColour = buttonColourInput.value;
    const linkColour = linkColourInput.value;
//set the colours 
    chrome.storage.sync.set({ backgroundColour, textColour, buttonColour, linkColour });
    //remove any presets and over-ride with my colour inputs
    chrome.storage.sync.remove('selectedPreset');
    applyStyles(backgroundColour, textColour, buttonColour, linkColour); 
   
  });

  //save a custom theme here button
  saveNamedCustomButton.addEventListener('click', () => {
    //get the user's custom theme name from the input
    const themeName = document.getElementById('themeName').value;
    //get the colours from the colour pickers
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

//make sure my user has added a name to the button or else give alert
    if (themeName.trim() === '') {
      alert('Please enter a theme name!');
      return;
    }
//save the user's custom theme
    const customTheme = { backgroundColour, textColour, buttonColour, linkColour };
    saveCustomTheme(themeName, customTheme);
  });


  //the button that is generated when the user saves a custom theme
  document.querySelectorAll('.custom-theme-btn').forEach(customThemeBtn => {
    customThemeBtn.addEventListener('click', () => {
      const themeName = customThemeBtn.dataset.themeName;
      chrome.storage.sync.get(`customTheme_${themeName}`, ({ [`customTheme_${themeName}`]: customTheme }) => {
        if (customTheme) {
          const { backgroundColour, textColour, buttonColour, linkColour } = customTheme;
          applyStyles(backgroundColour, textColour, buttonColour, linkColour);
          //save the custom theme the user has chosen and apply
          chrome.storage.sync.set({ backgroundColour, textColour, buttonColour, linkColour });
          //apply theme to current url
          applyCustomThemeToCurrentTab(backgroundColour, textColour, buttonColour, linkColour);
        }
      });
    });
  });

  function saveCustomTheme(themeName, customTheme) {
    //save theme and users chosen name fr it to the storage
    chrome.storage.sync.set({ [`customTheme_${themeName}`]: customTheme }, () => {
      //create a btn for this new custom theme
      const savedThemeButton = document.createElement('button');
      //add the following classes to the generated btn
      savedThemeButton.classList.add('btn', 'custom-theme-btn','waves-effect', 'waves-light', 'mt-2', 'cyan', 'darken-3');
      //btn name is what the user input
      savedThemeButton.dataset.themeName = themeName;
      savedThemeButton.textContent = themeName;
      //applyCustomTheme is applied upon btn click
      savedThemeButton.addEventListener('click', () => {
        applyCustomTheme(customTheme);
        //set each property of the user's theme to the storage
        chrome.storage.sync.set({
          backgroundColour: customTheme.backgroundColour,
          textColour: customTheme.textColour,
          buttonColour: customTheme.buttonColour,
          linkColour: customTheme.linkColour
        });
        //tell content script to apply custom theme to the current tab
        applyCustomThemeToCurrentTab(customTheme.backgroundColour, customTheme.textColour, customTheme.buttonColour, customTheme.linkColour);
      });
      //move the new generated btn to the 'My custom themes' collapsible menu
      savedThemes.appendChild(savedThemeButton);
    });
  }
//now that a theme has been saved, upon click of the new theme button, apply the styles to the webpage
  function applyCustomTheme(customTheme) {
    const { backgroundColour, textColour, buttonColour, linkColour } = customTheme;
    applyStyles(backgroundColour, textColour, buttonColour, linkColour);
  }
});

function selectPreset(presetColour, textColour, buttonColour, linkColour) {
  linkColour = linkColour || '#0000ff'; 
  //save the selected theme's colours to storage
  chrome.storage.sync.set({ 
    selectedPreset: presetColour, 
    selectedTextColour: textColour, 
    selectedButtonColour: buttonColour, 
    selectedLinkColour: linkColour 
  });
  //remove any of the colour picker colours and then apply the preset
  chrome.storage.sync.remove(['backgroundColour', 'textColour', 'buttonColour', 'linkColour']);
  applyStyles(presetColour, textColour, buttonColour, linkColour); 
}
//event listener for my preset buttons in the html
document.querySelectorAll('.preset-btn').forEach(button => {
  button.addEventListener('click', () => {
    //get html button attribute colours
    const presetColour = button.dataset.color;
    const textColour = button.dataset.textcolor || '#000000';
    const buttonColour = button.dataset.buttoncolor || '#ffffff';
    const linkColour = button.dataset.linkcolor || '#0000ff';
//apply the preset
    selectPreset(presetColour, textColour, buttonColour, linkColour); 
  });
});

//if a preset has been selected then make sure the colours are still applied upon refresh
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
const onOffToggle = document.getElementById('on-off-toggle');

//so I can add a class for my focus state
onOffToggle.addEventListener('focus', () => {
  onOffToggle.parentElement.classList.add('toggle-focus');
});
//remove focus state when the toggle is no longer focused
onOffToggle.addEventListener('blur', () => {
  onOffToggle.parentElement.classList.remove('toggle-focus');
});

//get extensionEnabled value from storage
chrome.storage.sync.get('extensionEnabled', ({ extensionEnabled }) => {
  //if enabled then apply colours of theme
  if (extensionEnabled) {
    applyStoredColoursOrTheme();
  }
  onOffToggle.checked = extensionEnabled; //update toggle state
});

//event listener for my toggle
onOffToggle.addEventListener('change', () => {
  //get the current toggle state
  const extensionEnabled = onOffToggle.checked;
  //update the state in the storage
  chrome.storage.sync.set({ extensionEnabled });

  //if the extension is on then apply stored colours or theme
  if (extensionEnabled) {
    applyStoredColoursOrTheme();
  } else {
    //else reset to default colours when its turned off and remove styles
    resetToDefaultColors();
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'removeStyles' });
    });
  }
});

function applyStoredColoursOrTheme() {
  //get my on/off toggle
  const onOffToggle = document.getElementById('on-off-toggle');
  //get the user's stored colours or theme from the stoage
  chrome.storage.sync.get(['backgroundColour', 'textColour', 'buttonColour', 'linkColour', 'selectedPreset'], ({ backgroundColour, textColour, buttonColour, linkColour, selectedPreset }) => {
    if (selectedPreset) { //if preset is selected then apply its styles
      applyStyles(backgroundColour, textColour, buttonColour, linkColour);
    } else if (backgroundColour && textColour && buttonColour && linkColour) { //else if its colours from the input pickers then apply those styles
      applyStyles(backgroundColour, textColour, buttonColour, linkColour);
    }
    //update the toggle state if the user applies a colour but the toggle is currently off
    if (!onOffToggle.checked && (backgroundColour || textColour || buttonColour || linkColour)) {
      onOffToggle.checked = true; //be true when colours are applied
      chrome.storage.sync.set({ extensionEnabled: true });//update the value in the storage
    }
  });
}

//reset colours to default function
function resetToDefaultColors() {
  const defaultBackground = '#ffffff';
  const defaultText = '#000000';
  const defaultButton = '#ffffff';
  const defaultLink = '#0000ff';

  //remove any styles that are in the storage and apply default instead
  chrome.storage.sync.remove(['backgroundColour', 'textColour', 'buttonColour', 'linkColour', 'selectedPreset', 'selectedTheme']);
  applyStyles(defaultBackground, defaultText, defaultButton, defaultLink);

  //remove custom bg colour from all btns
  document.querySelectorAll('.btn').forEach(button => {
    button.style.removeProperty('background-color');
  });
}
//listen for when a user interacts with a colour picker input
document.querySelectorAll('input[type="color"]').forEach(input => {
  input.addEventListener('input', () => {
    const onOffToggle = document.getElementById('on-off-toggle');
    if (!onOffToggle.checked) {
      onOffToggle.checked = true; //toggle the button on when styles applied
      chrome.storage.sync.set({ extensionEnabled: true });
    }
  });
});

//listen for when a user interacts with a preset/theme
document.querySelectorAll('.preset-btn').forEach(button => {
  button.addEventListener('click', () => {
    const onOffToggle = document.getElementById('on-off-toggle');
    if (!onOffToggle.checked) {
      onOffToggle.checked = true; //on for when a preset is applied
      chrome.storage.sync.set({ extensionEnabled: true });
    }
  });
});

//listen for compatibilityText changes from background script 
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateCompatibilityText') {
    //update message
    const compatibilityText = document.getElementById('compatibilityPercentage');
    compatibilityText.innerText = request.compatibilityText;
  }
});

//modal trigger function
var modals = document.querySelectorAll('.modal');
M.Modal.init(modals);

//collapsible dropdown content
var elems = document.querySelectorAll('.collapsible');
var instances = M.Collapsible.init(elems);

//for carets on collapsibles
$('.collapsible').collapsible({
  onOpenEnd: function(el) {
    $(el).find('.material-icons.right.caret').text('keyboard_arrow_up');
  },
  onCloseEnd: function(el) {
    $(el).find('.material-icons.right.caret').text('keyboard_arrow_down');
  }
});

//get my announcement button
document.addEventListener("DOMContentLoaded", function () {
  var announcementButton = document.getElementById("announcement");
//listen for a click and once its clicked, add the class of 'clicked'
  announcementButton.addEventListener("click", function () {
    this.classList.add("clicked");
  });
});


const collapsibleItems = document.querySelectorAll('.collapsible');
//when the item is being focused, add class
collapsibleItems.forEach(item => {
  item.addEventListener('focusin', () => {
    item.classList.add('collapsible-focus');
  });

  //when element is no longer being focused, remove class
  item.addEventListener('focusout', () => {
    item.classList.remove('collapsible-focus');
  });
});