
chrome.runtime.onMessage.addListener( (message, sender) => {

  if (message.from === "popup" && message.query === "eye_dropper_clicked") {

    setTimeout(() => {

      const eyeDropper = new EyeDropper();

      eyeDropper.open().then(result => {

        console.log(result);

        // this doesn't work:
        chrome.action.setBadgeBackgroundColor({color: result.sRGBA});

        chrome.storage.local.get("color_hex_code", (resp) => {

          if (resp.color_hex_code && resp.color_hex_code.length > 0) {
            chrome.storage.local.set({ "color_hex_code": [...resp.color_hex_code, result.sRGBHex] })
          }
          else {
            chrome.storage.local.set({ "color_hex_code": [result.sRGBHex] });
          }
        })
        // this works, picks the color immediately:
        navigator.clipboard.writeText(result.sRGBHex);
        // this doesn't work:
        chrome.action.setBadgeText({text: '\u2713'});
      }).catch(e => {
        console.log(e)
      })
    }, 500);
  }

})


/*
*  async function sendToClipboard(result.sRGBHex) {
    const newPick = await navigator.permissions.query({ name: "clipboard-write" });
    if (newPick.state == "granted" || newPick.state == "prompt") {
      try {
        await navigator.clipboard.writeText(result.sRGBHex);
      } catch (e) {
        // Failed to write to the clipboard.
        document.body.innerHTML = e;
      }
    }
  }
  sendToClipboard(result.sRGBHex);

* */