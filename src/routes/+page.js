
import ollama from 'ollama'

//pulls current models available in Ollama

export async function load() {
    let models = await ollama.list();
    //let what = await  ollama.ps();
    let theModels = models.models;

    //console.log('whats:', what);
    
    const modelNames = theModels.map(modelName => {
        return modelName.name;
    })
    //manually add names here

    //modelNames.push("Stable Diffusion","Canary Chrome");
   

   return {modelNames};
};