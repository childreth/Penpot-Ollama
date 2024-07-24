console.log("Hello from the plugin.js!");



penpot.ui.open("Translator 1.0", "", 
    {
      width: 390,
      height: 450,
    });    

penpot.ui.onMessage((message) => {
   // msgOllama();
    console.log('message received: ',message.type);
    // const selectedGroup = penpot.getSelectedShapes();
    // const cloneGroup = penpot.cloneGroup()
    //const selectItem = penpot.getSelected(); 
    if (message.type==='getting'){
      let theText = getText(penpot.selection[0]);
      console.log('func: ',theText);
      penpot.ui.sendMessage(theText);
    }else if(message.type==='setting'){
      console.log('setting')
      penpot.selection[0].characters = message.content
    }

   // let hteHTML = penpot.generateMarkup(selectItem)
  
  //penpot.closePlugin()
  });

//gets text from a single text block
  function getText(theSelected){
    if(theSelected.type==='text'){
      console.log(theSelected,'**istext**',penpot.selection[0].characters);
      return penpot.selection[0].characters

    }else {
      console.log("not text")
    }

  }

  function setText(translated) {

  }

 

