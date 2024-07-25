console.log("Hello from the plugin.js!");



penpot.ui.open("Translator 1.0", "", 
    {
      width: 360,
      height: 400,
    });    

penpot.ui.onMessage((message) => {
   // msgOllama();
    console.log('message received: ',message.type);
    // const selectedGroup = penpot.getSelectedShapes();
    // const cloneGroup = penpot.cloneGroup()
    //const selectItem = penpot.getSelected(); 

    let theGroup = penpot.selection[0].children
    let textBlocks=[]

    //find text types

    
    
    if (message.type==='getting'){
      //let theText = getText(penpot.selection[0]);
      theGroup.map((item) => {
        console.log('theGroup: ',item.id,'-',item.type)
        if(item.type==='text'){
          textBlocks.push(item.characters)
        }
      });

      //console.log('func: ',theText);
      penpot.ui.sendMessage(textBlocks);
    }else if(message.type==='setting'){
      //console.log('setting',JSON.parse(message.content))
      let translated = JSON.parse(message.content)
      let key = 0
      theGroup.forEach((item) => {
        
        if(item.type==='text'){
          key++
          item.characters = translated[`text`+key]
        }
      });
      // theGroup.map((item) => {
        
      //   if(item.type==='text'){
      //     item.characters = translated.text[index]
      //   }
      // });
      //penpot.selection[0].characters = message.content
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

 

