chrome.runtime.onMessage.addListener( (message, sender) => {

  if (message.from === "popup" && message.query === "eye_dropper_clicked") {

    setTimeout(() => {

      const eyeDropper = new EyeDropper();

      eyeDropper.open().then(result => {

        console.log(result);

        chrome.storage.local.get("color_hex_code", (resp) => {

          if (resp.color_hex_code && resp.color_hex_code.length > 0) {
            chrome.storage.local.set({ "color_hex_code": [...resp.color_hex_code, result.sRGBHex] })
          }
          else {
            chrome.storage.local.set({ "color_hex_code": [result.sRGBHex] });
          }
        })
      }).catch(e => {
        console.log(e)
      })

    }, 500);
  }
})
