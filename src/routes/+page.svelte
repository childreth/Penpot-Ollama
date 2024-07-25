<script>
  import { onMount } from "svelte";
  import ollama from "ollama";

  export let data;
  //console.log('page:',data.modelNames)
  const modelList = data.modelNames;
  console.log(modelList);

  let selectedModel = "llama3.1:latest";
  let activeModel = "";
  let responseMarked = "No data";
  let languageSelected = "French";
  const languageList = [
    "French","German","Spanish","Russian","Japanese","English"
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
      //parent.sendMessage('test')
    }

    // window.addEventListener("message", (event) => {
    //   //const test = document.querySelector('#testText')
    //   //test.textContent = 'worked'
    //   console.log("worked", event.data);
    // });
    //getOllama();
  });

  function setText(translated){
       //const selectedIds = context.getSelected()
       console.log("clicked");
      //getClaude()

      const onmessage = {
        type: 'setting',
        content: translated
      };
      //penpot.ui.sendMessage("message");
      parent.postMessage(onmessage, "*");
      //parent.sendMessage('test')
    }

  function handleMessage(event) {
    console.log("worked", JSON.stringify(event.data));
    getOllama(JSON.stringify(event.data));
    //getClaude()
    //llamaFile();
  }
  function changeModel() {
    console.log("model reset");
    //countConvo = 0;
    //chatConvo = [];
    //theImage = [];
    //document.querySelector("#thumbnails").innerHTML = "";
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

  // let prompt = `You are an amazing language translator. Translate the provided english and translate it into ${languageSelected}. When returning translated text, do not add explaination, just send the translated text.`;

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

  async function getOllama(code) {
    const response = await ollama.chat({
      model: selectedModel,
      format: 'json',
      messages: [
        {
          role: "system",
          content: `You are an amazing language translator. You will be provided some content first determine the language and then translate it into ${languageSelected}. When returning translated text, do not add explaination, just send the translated text. When returning JSON each key as increment of the word 'text'. Example text1, text2`,
        },
        { role: "user", content: code },
      ],
    });
    console.log("response:", response.message.content);
   
    setText(response.message.content);
    //responseMarked = response.message.content;
  }
</script>

<div data-theme="dark" style="padding:16px 0;">
  <h2>Translator 1.Ollama 🦙</h2>
  <section>
    <div class="form-group">
      <label class="" for="models">Choose a model</label>
      <select
        bind:value={selectedModel}
        on:change={changeModel}
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
    <!-- <div class="form-group">
      <label class="input-label-hidden" for="input-3">This is the label</label>
      <input class="input error" type="text" placeholder="Input
   dark theme error" id="input-3">
    </div> -->
  </section>

  <button id="create" data-appearance="primary" class="--la-primary"
    >Translate to {languageSelected}</button
  >

  <!-- <section id="" class="response" aria-live="polite" role="log">
    {@html responseMarked} {languageSelected}
  </section> -->

  <!-- <footer>
    <strong>{selectedModel}</strong> may make mistakes, always check the information provided.
  </footer> -->
</div>

<svelte:window on:message={handleMessage} />

<style>
  @import "@penpot/plugin-styles/styles.css";

  h2 {
    margin:1rem 0;
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
    margin-block-start: 2rem;
    font-size:.75rem;
    line-height:1.25rem;
    font-weight: 400;
  }
  select {
    background-image: url('$lib/images/chevron-down.svg');
  }
</style>
