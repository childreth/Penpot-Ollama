
penpot.ui.open("Translate - Plugin Beta", "", 
    {
      width: 384,
      height: 460,
    });    

penpot.ui.onMessage((message) => {
    //console.log('message received: ',message, message.type,'--',message.blockid,'--',message.content);


    let theGroup = penpot.selection[0].children
    //console.log('theGroup: ',penpot.selection)
    let textJson={}
    let originalText={}
    


    //find text types
    if (message.type==='getting'){
      //let theText = getText(penpot.selection[0]);
      
      theGroup.forEach((item,index) => {
        if(item.type==='text'){
          //console.log('itemid-',item.id)
          //textBlocks.push(item.characters)
          textJson[item.id] = item.characters
          originalText[item.id] = item.characters
        }
      });
      //console.log('textBlocks get: ',textJson)
      penpot.ui.sendMessage(textJson);

    }
    else if(message.type==='setting'){
      
      //let translated = JSON.parse(message.content)
      //console.log('set: ',message.key,'--',message.translated)
      theGroup.forEach((item,index) => {
        if(item.type==='text' && item.id === message.blockid){
          //item.characters = translated['text'+index]
          item.characters = message.content
        }
      });
    } else if(message.type==='reset'){
      theGroup.forEach((item,index) => {
        if(item.type==='text'){
          //item.characters = translated['text'+index]
          console.log('originalText: ',originalText)
          //item.characters = message.content
        }
      });
    }
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

  function getHTML(){
    // let theHTML = penpot.generateMarkup(selectItem)

  }

 

