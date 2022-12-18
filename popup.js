document.addEventListener("DOMContentLoaded", () => {

  const main = document.getElementById("main");
  const buttonCont = document.getElementById("picker-btn-cont");
  const resultList = document.getElementById("result");


  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tab = tabs[0]

    if (tab.url === undefined || tab.url.indexOf('chrome') === 0) {
      buttonCont.innerHTML = '<span style="font-family: lobster, sans-serif">Eye Dropper</span> can\'t access <i>Chrome pages</i>'
    }
    else if (tab.url.indexOf('file') === 0) {
      buttonCont.innerHTML = '<span style="font-family: lobster, sans-serif">Eye Dropper</span> can\'t access <i>local pages</i>'

    } else {
      const button = document.createElement("button")
      button.setAttribute("id", "picker-btn")
      button.innerText = "Pick Color from webpage"

      button.addEventListener("click", () => {
        if ('EyeDropper' in window) {
          chrome.tabs.sendMessage(
              tabs[0].id,
              {from: "popup", query: "eye_dropper_clicked"}
          );
          window.close()
        } else {
          console.log('Your browser does not support the EyeDropper API');
          return;
        }
      })

      buttonCont.appendChild(button)
    }
  });

  chrome.storage.local.get("color_hex_code", (resp) => {

    if (resp.color_hex_code && resp.color_hex_code.length > 0) {

      resp.color_hex_code.forEach(hexCode => {

        const liElem = document.createElement("li")
        liElem.innerText = hexCode
        liElem.style.backgroundColor = hexCode

        liElem.addEventListener("click", () => {
          navigator.clipboard.writeText(hexCode);
          GiveMetheChild("#e19526", "Hex code is copied to clipboard!")
        })

        resultList.appendChild(liElem)

      })

      const ClearButton = document.createElement("button")
      ClearButton.innerText = "Clear Memory"
      ClearButton.setAttribute("id", "clearButton")

      ClearButton.addEventListener("click", () => {
        chrome.storage.local.remove("color_hex_code")
        window.close()
      })

      main.appendChild(ClearButton)
    }

  })

})