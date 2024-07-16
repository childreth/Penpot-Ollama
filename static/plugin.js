  
console.log("Hello from the plugin.js!");

penpot.ui.open("Penpot plugin starter template", "", 
    {
      width: 390,
      height: 450,
    });    

penpot.ui.onMessage((message) => {
   // msgOllama();
    console.log('message received');
    const selectItem = penpot.getSelectedShapes();
    let hteHTML = penpot.generateMarkup(selectItem)
  console.log('clicked',selectItem,hteHTML);
  penpot.ui.sendMessage(hteHTML);
 // penpot.closePlugin()
  });



