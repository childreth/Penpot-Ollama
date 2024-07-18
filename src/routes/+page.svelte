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
      const onmessage = {
                type: 'greeting',
                text: 'Hello from the sender!',
                number: 42,
                isActive: true
            };
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
    //getClaude()

  }
  function changeModel() {
    console.log("model reset");
    //countConvo = 0;
    //chatConvo = [];
    //theImage = [];
    //document.querySelector("#thumbnails").innerHTML = "";
  }
  async function getClaude(){
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

  async function getOllama(code) {
    const response = await ollama.chat({
      model: "codellama:7b",
      messages: [
        { role: "system", content: `You are an elite coder who will receive html code and need to translate some of it into working html, specifically To translate the provided code into working interactive HTML form, you need to make some changes and follow these steps: 
        * When you encounter the code use the comments contained within the provide code to update it to working interacble html form. Keep the css class name intact. 
        * Take any inline styling and seperate it into a css class name
        * Here are some comments and how to handle them: 
            * frame: input - Change this to a real input field
        Do not provide an explaination of your thought process with the response.`},
        { role: "user", content: code }
    ],
    });
    console.log("response:", response.message.content);
    //window.open();
    responseMarked = response.message.content;
  }
</script>

<p id="testText">testing</p>
<div data-theme="dark">
  <h2>Ollamas 🦙</h2>
  <section>
    <div class="form-group">
    <label class="select-label-hidden" for="select-1">Which is your favorite animal?</label>
    <select bind:value={selectedModel} on:change={changeModel} class='select'>
        {#each modelList as question}
          <option value={question}>
            {question}
          </option>
        {/each}
      </select>
    </div>
   
  </section>
  

  <p>Checkout the <a href="">documentation</a> to get started.</p>
  <button id="create" data-appearance="primary" class='--la-primary'>Create</button>

  <section id="" class="response" aria-live="polite" role="log">
    {@html responseMarked}
  </section>
</div>

<svelte:window on:message={handleMessage} />

<style>
.controls {
    padding: var(--spacing-8)
}
  @import "@penpot/plugin-styles/styles.css";
  
</style>
