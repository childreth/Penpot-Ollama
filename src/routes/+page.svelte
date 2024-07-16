<script>
  import { onMount } from "svelte";
  import ollama from "ollama";

  export let data;
  //console.log('page:',data.modelNames)
  const modelList = data.modelNames;
  console.log(modelList);

  let selectedModel = "llama3:latest";
  let activeModel = "";
  let responseMarked ='hello'

  onMount(async () => {
    console.log("mounted!");
    document.getElementById("create").onclick = () => {
      //const selectedIds = context.getSelected()
      console.log("clicked");

      //penpot.ui.sendMessage("message");
      parent.postMessage(onmessage, "*");
      //parent.sendMessage('test')
    };

    // window.addEventListener("message", (event) => {
    //   //const test = document.querySelector('#testText')
    //   //test.textContent = 'worked'
    //   console.log("worked", event.data);
    // });
    //getOllama();
  });

  function handleMessage(event) {
    console.log("worked", event.data);
    getOllama(event.data)

  }
  function changeModel() {
    console.log("model reset");
    //countConvo = 0;
    //chatConvo = [];
    //theImage = [];
    //document.querySelector("#thumbnails").innerHTML = "";
  }
  async function getOllama(code) {
    const response = await ollama.chat({
      model: "codellama:7b",
      messages: [
        { role: "system", content: `You are an elite coder who will receive code and need to translate it into working html. When you encounter the code use the comments contained within the provide code to update it to working interacble html form. Keep the css class name intact. Here are some comments and how to handle them: 
            * frame: input - Change this to a real input field
        Do not provide an explaination with the response.`},
        { role: "user", content: code }
    ],
    });
    console.log("response:", response.message.content);
    responseMarked = response.message.content;
  }
</script>

<p id="testText">testing</p>
<div>
  <p>Penpot plugin starter template</p>
  <select bind:value={selectedModel} on:change={changeModel} class='select'>
    {#each modelList as question}
      <option value={question}>
        {question}
      </option>
    {/each}
  </select>

  <p>Checkout the <a href="">documentation</a> to get started.</p>
  <button id="create" data-appearance="primary">Create</button>

  <section id="" class="response" aria-live="polite" role="log">
    {@html responseMarked}
  </section>
</div>

<svelte:window on:message={handleMessage} />

<style>
  @import "@penpot/plugin-styles/styles.css";
  
</style>
