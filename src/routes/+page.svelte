<script>
  import { onMount } from "svelte";
  import ollama from "ollama";

  export let data;
  
  const modelList = data.modelNames;
  console.log(modelList);

  let selectedModel = "llama3.1:latest";
  let activeModel = "";
  let responseMarked = "No data";
  let languageSelected = "French";
  const languageList = [
    "French","German","Spanish","Russian","Thai","English","Italian","Portuguese"
  ]

  onMount(async () => {
    console.log("mounted!");
    document.getElementById("create").onclick = () => {
      getText();
    };
    function getText() {
      //const selectedIds = context.getSelected()
      console.log("clicked");
      //getClaude()

      const onmessage = {
        type: "getting",
        done: false,
      };
      //penpot.ui.sendMessage("message");
      parent.postMessage(onmessage, "*");
    }

    // window.addEventListener("message", (event) => {
    //   //const test = document.querySelector('#testText')
    //   //test.textContent = 'worked'
    //   console.log("worked", event.data);
    // });
    //getOllama();
  });

  function setText(key,translated){
       //const selectedIds = context.getSelected()
       //console.log("setText before: ",key,'--',translated);
      //getClaude()

      const onmessage = {
        type: 'setting',
        blockid: key,
        content: translated
      };
      console.log('setText onmessage: ',onmessage)
      parent.postMessage(onmessage, "*");
      //penpot.ui.sendMessage("message");
      //parent.sendMessage('test')
    }
//handles the return message
  function handleMessage(event) {
    //getOllama(JSON.stringify(event.data));
    let blocks = event.data
    console.log('event.data',Object.values(blocks).length)
    Object.entries(blocks).forEach(async ([key, value]) => {
      console.log(`${key}: ${value}`);
      getOllama(key,value)
    });
    //getClaude()
    //llamaFile();
  }

  async function getClaude() {
    try {
      //guessing = true;
      const response = await fetch("/api/claude/", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          message: "userMsg34",
          // userImage: base64,
        }),
      });
      const returned = await response.json();
      //responseEl.innerHTML = returned.message;
      //guessing = false;
      console.log("returned:", returned);
    } catch (error) {
      console.log("error: ", error);
    }
  }


  async function llamaFile() {
    let response = await fetch("http://127.0.0.1:8080/completion", {
      method: "POST",
      body: JSON.stringify({
        prompt,
        n_predict: 512,
      }),
    });
    console.log((await response.json()).content);
  }

  async function getOllama(key,value) {
    const response = await ollama.chat({
      model: selectedModel,
      // format: 'json',
      messages: [
        {
          role: "system",
          content: `You are a language translator that will be provided content. First determine the language and then translate it into ${languageSelected}. When returning translated text follow these instructions:
           * Do not add an explaination, just send the translated text. 
          `
          
        },
        { role: "user", content: value },
      ],
    });
    console.log("response getOllama:",key,'----', response.message.content);
    
    setText(key,response.message.content);
    //responseMarked = response.message.content;
  }
</script>

<div data-theme="dark" style="padding:16px 0;">
  <h2>Translate with 🦙</h2>
  <section>
    <div class="form-group">
      <label class="" for="models">Choose a model</label>
      <select
        bind:value={selectedModel}
        class="select"
        id="models"
      >
        {#each modelList as question}
          <option value={question}>
            {question}
          </option>
        {/each}
      </select>
    </div>
    <div class="form-group">
      <label class=""
      for="languages" >Choose a language</label>
      <select bind:value={languageSelected} class="select" id="languages">
        {#each languageList as language}
          <option value={language}>
            {language}
          </option>
        {/each}
      </select>
    </div>

  </section>

  <button id="create" data-appearance="primary" class="--la-primary"
    >Translate to {languageSelected}</button
  >

  <!-- <section id="" class="response" aria-live="polite" role="log">
    {@html responseMarked} {languageSelected}
  </section> -->

  <footer>
    <strong>{selectedModel}</strong> may make mistakes, always check the information provided.
  </footer>
</div>

<svelte:window on:message={handleMessage} />

<style>
  @import "@penpot/plugin-styles/styles.css";

  h2 {
    margin:.5rem 0 .75rem 0;
  }
  p {
    margin-block-end: .75rem;
  }
  #create {
    margin-top:1rem;
  }
  .response {
    padding: 24px 0;
  }
  .form-group {
    margin-block-end: 1rem;
  }
  label {
    font-size:.75rem;
    line-height:1.75rem;
  }
  footer {
    margin-block-start: 1rem;
    font-size:.75rem;
    line-height:1.25rem;
    font-weight: 400;
  }
  select {
    background-image: url('$lib/images/chevron-down.svg');
  }
</style>
