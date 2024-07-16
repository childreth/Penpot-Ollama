import ollama from 'ollama'


export async function POST({ request }) {
    console.log('post')

    const response = await ollama.chat({
        model: 'llama3:latest',
        messages: [{ role: 'user', content: 'tell me a joke' }],
      })
      console.log(response.message.content);

      response.headers.append('Access-Control-Allow-Origin', '*');

      return new Response(`returned`);
   
};