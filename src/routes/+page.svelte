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
  let translateTime = 0.0;
  let blockCount=0;
  let tokenCount=0
  let tokenDuration=0;
  let totalDuration=0;
  $: translateTime = Number(translateTime.toFixed(2));
  let translateTimer;
  $: tokenSpeed = Number(tokenCount / tokenDuration * Math.pow(10,9)).toFixed(2);

  


  const languageList = [
    "French","German","Spanish","Russian","Thai","English","Italian","Portuguese"
  ]

  onMount(async () => {

    console.log("mounted!");
    document.getElementById("create").onclick = () => {
      getText();
      disablePrimary(true)
      translateTime=0.0
    };
    document.getElementById("reset").onclick = () => {
      resetText()
    }
    //disabled on translating 

    

    function getText() {
      //const selectedIds = context.getSelected()
      incrementTimeout()
      const onmessage = {
        type: "getting",
        done: false,
      };
      //penpot.ui.sendMessage("message");
      parent.postMessage(onmessage, "*");
    }
    // keep for reference

    // window.addEventListener("message", (event) => {
    //   //const test = document.querySelector('#testText')
    //   //test.textContent = 'worked'
    //   console.log("worked", event.data);
    // });
    //getOllama();
  });
  function incrementTimeout(stop) {
    if(!stop){
      tokenCount=0;
      tokenDuration=0;
      translateTimer = setInterval(() => {
      translateTime += .10
    }, 100);
    }else if(stop){
      console.log('clear time')
      clearInterval(translateTimer);
      disablePrimary(false)
      blockCount=0
    } else {
    }
  }

  function disablePrimary(state){
      const primaryAction =  document.getElementById("create");
      state ? primaryAction.setAttribute('disabled',true): primaryAction.removeAttribute('disabled');
      //state ? primaryAction.innerText='Translating...' : primaryAction.innerText=`Translate to ${languageSelected}`;

    }

  function setText(key,translated){
      //const selectedIds = context.getSelected()

      const onmessage = {
        type: 'setting',
        blockid: key,
        content: translated
      };
      //console.log('setText onmessage: ',onmessage)
      parent.postMessage(onmessage, "*");
      //penpot.ui.sendMessage("message");
      //parent.sendMessage('test')
    }
    function resetText(){
      //const selectedIds = context.getSelected()

      const onmessage = {
        type: 'reset',
        blockid: 'key',
        content: 'translated'
      };
      //console.log('setText onmessage: ',onmessage)
      parent.postMessage(onmessage, "*");
      //penpot.ui.sendMessage("message");
      //parent.sendMessage('test')
    }

//handles the return message

  function handleMessage(event) {
    //getOllama(JSON.stringify(event.data));
    let blocks = event.data
    let blockTotal = Object.values(blocks).length
    
    Object.entries(blocks).forEach(async ([key, value]) => {
      //console.log(`${key}: ${value}`);
      getOllama(key,value,blockTotal)
    });
    //llamaFile();
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

  

  async function getOllama(key,value,blockTotal) {

   

    const response = await ollama.chat({
      model: selectedModel,
      // format: 'json',
      messages: [
        {
          role: "system",
          content: `You are a language translator that will be provided content. First determine the language and then translate it into ${languageSelected}. When returning translated text follow these instructions:
           * Do not add explainations for the text, extra context or any reasoningfor translating
           * ONLY send the translated text.
          `
          
        },
        { role: "user", content: value },
      ],
    });
    blockCount++
    console.log(`blocks: ${blockTotal}, ${blockCount}`)
    
    //get tokens per sec (eval_count)
    console.log('tokens-',response.eval_count);
    tokenCount += response.eval_count;
    tokenDuration += response.eval_duration;
    totalDuration += response.total_duration;
    setText(key,response.message.content);
    blockCount == blockTotal ? incrementTimeout(true) : null;
    
  }

</script>

<div data-theme="dark" style="padding:16px 0;">
  <h2>Translate <span class='badge caption'>Beta</span></h2>
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

  <button id="create" data-appearance="primary"
    >Translate to {languageSelected}</button
  >
  <button id="reset" data-appearance="secondary"
    >Reset</button
  >

  <!-- <section id="" class="response" aria-live="polite" role="log">
    {@html responseMarked} {languageSelected}
  </section> -->
<section id='timeblock'><p>Translation time: <span id='time' class='highlightText'>{translateTime}</span> secs</p><p>Tokens/sec: <span class='highlightText'>{tokenSpeed}</span></p><p>Total tokens: <span class='highlightText'>{tokenCount}</span></p></section>

</div>

<svelte:window on:message={handleMessage} />

<style>
  @import "@penpot/plugin-styles/styles.css";

  h2 {
    margin:.5rem 0 .75rem 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap:.5rem;
  }
  .badge {
    background-color: var(--app-lemon);
    border-radius: 1rem;
    color: var(--lf-primary);
    padding: .1rem .5rem;
    margin-top:.1rem;
 
  }
  p {
    margin-block-end: .75rem;
  }
  #timeblock {
    padding-top:1rem;
    font-size: .75rem;
    
  }
.highlightText {
      color: var(--app-lemon)
    }
  #create {
    margin-top:1rem;
  }
  .form-group {
    margin-block-end: 1rem;
  }
  label {
    font-size:.75rem;
    line-height:1.75rem;
  }
  select {
    background-image: url('$lib/images/chevron-down.svg');
  }
</style>
