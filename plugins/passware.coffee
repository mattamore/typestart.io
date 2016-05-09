new Command
  name: "passware",

  init: ()-> 
    $.getScript "https://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/sha3.js", ()->
      console.info("sha3 loaded")
        
  f: (arg)->
    s = typestart.splitArg(arg)
    cryptophrase

    getPass = (service)->
      pass = btoa(CryptoJS.SHA3(cryptophrase+service).toString()).substring(0,32)
      typestart.echo pass
      # clip = new ClipboardEvent('copy')
      # clip.clipboardData.setData('text/plain', pass)
      # clip.preventDefault()

    switch s.length
        when 0
          "Usage: passware <your_service>"
        when 1
          cryptophrase = sessionStorage.getItem("passware_cryptophrase")

          if not cryptophrase
            typestart.terminal.set_mask(true)
            typestart.terminal.read "enter your passphrase > ", (result)->
              typestart.terminal.set_mask(false)
              cryptophrase = result;
              x = 0
              while x < 1000
                cryptophrase = CryptoJS.SHA3(cryptophrase).toString()
                x++

              sessionStorage.setItem("passware_cryptophrase", cryptophrase)
              getPass(s[0])
          else
            getPass(s[0])

          undefined

