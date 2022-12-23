document.addEventListener("DOMContentLoaded", () => {

  const main = document.getElementById("main");
  const buttonCont = document.getElementById("picker-btn-cont");
  const resultList = document.getElementById("result");


  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tab = tabs[0]

    if (tab.url === undefined || tab.url.indexOf('chrome') === 0) {
      buttonCont.innerHTML = '<span class="highlight">Lean Color Picker</span> can\'t access this <i>special Chrome page</i>. Please try a different web page.';
    }
    else if (tab.url.indexOf('file') === 0) {
      buttonCont.innerHTML = '<span class="highlight">Lean Color Picker</span> can\'t access <i>local pages</i>. Please try a different web page.';

    } else {
      const button = document.createElement("button")
      button.setAttribute("id", "picker-btn")
      button.innerText = "Pick Color from Web Page"

      button.addEventListener("click", () => {
        if ('EyeDropper' in window) {
          chrome.tabs.sendMessage(
              tabs[0].id,
              {from: "popup", query: "eye_dropper_clicked"}
          );
          window.close()
        } else {
          // notification?
          console.log('Your browser does not support the EyeDropper API');
        }
      })

      buttonCont.appendChild(button)
    }
  });

  chrome.storage.local.get("color_hex_code", (resp) => {

    if (resp.color_hex_code && resp.color_hex_code.length > 0) {

      resp.color_hex_code.forEach(hexCode => {
        const liElem = document.createElement("li")
        liElem.innerText = hexCode;
        liElem.style.border = "solid 5px " + hexCode;

        liElem.addEventListener("click", () => {
          navigator.clipboard.writeText(hexCode);
          chrome.action.setBadgeText({text: '\u2713'});
          setTimeout(function(){
            chrome.action.setBadgeText({text: " "});
          }, 1500);

          chrome.action.setBadgeBackgroundColor({color: hexCode});
          /*chrome.notifications.create({
            type: "basic",
            title: "Hex code copied",
            message: "Hex code is copied to clipboard!",
            iconUrl: "assets/icon128.png"
          });*/
        })

        resultList.appendChild(liElem)
      })

      const ClearButton = document.createElement("button")
      ClearButton.innerText = "Delete Color History"
      ClearButton.setAttribute("id", "clearButton")

      ClearButton.addEventListener("click", () => {
        chrome.storage.local.remove("color_hex_code")
        window.close()
        chrome.action.setBadgeText({text: ""});
      })

      main.appendChild(ClearButton)
    }

  })

})

