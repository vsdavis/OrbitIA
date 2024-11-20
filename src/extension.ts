import * as vscode from 'vscode';

// Use o import dinâmico dentro de uma função assíncrona
let fetch: any;

async function loadFetch() {
  fetch = (await import('node-fetch')).default;
}

// Método chamado quando a extensão é ativada
export function activate(context: vscode.ExtensionContext) {
  console.log('Parabéns, sua extensão "orbitia" está ativa!');

  // Chama a função para carregar o fetch
  loadFetch();

  // Comando Hello World
  const disposable = vscode.commands.registerCommand('orbitia.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from orbitIA!');
  });
  context.subscriptions.push(disposable);

  // Comando para abrir o chatbot
  const chatDisposable = vscode.commands.registerCommand('orbitia.openChat', async () => {
    const panel = vscode.window.createWebviewPanel(
      'orbitiaChat',
      'OrbitIA Chatbot',
      vscode.ViewColumn.One,
      {}
    );

    panel.webview.html = getWebviewContent();

    panel.webview.onDidReceiveMessage(
      async (message) => {
        if (message.command === 'askAI') {
          const aiResponse = await fetchAIResponse(message.text);
          panel.webview.postMessage({ command: 'aiResponse', text: aiResponse });
        }
      },
      undefined,
      context.subscriptions
    );
  });
  context.subscriptions.push(chatDisposable);
}

// Função de requisição à API
export async function fetchAIResponse(input: string): Promise<string> {
  // Espera o fetch ser carregado antes de fazer a requisição
  if (!fetch) {
    return 'Erro: fetch não foi carregado.';
  }

  const response = await fetch('https://api.gemini.com/ai-endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer AIzaSyCwHKFDxBIwJtyc9UQpQ1KIRUcxmLS7cS0` // Substitua pela sua chave
    },
    body: JSON.stringify({ prompt: input })
  });

  const data = await response.json();

  // Tipar a resposta de maneira adequada
  if (data && typeof data.generatedText === 'string') {
    return data.generatedText;
  } else {
    return 'Erro ao obter resposta';
  }
}

// Função para fornecer o HTML do chatbot
function getWebviewContent(): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Chatbot OrbitIA</title>
    </head>
    <body>
      <h1>OrbitIA Chatbot</h1>
      <input id="input" type="text" placeholder="Digite sua pergunta" />
      <button id="send">Enviar</button>
      <div id="output"></div>
      <script>
        const vscode = acquireVsCodeApi();
        document.getElementById('send').addEventListener('click', () => {
          const text = document.getElementById('input').value;
          vscode.postMessage({ command: 'askAI', text });
        });
        window.addEventListener('message', event => {
          const message = event.data;
          if (message.command === 'aiResponse') {
            document.getElementById('output').innerText = message.text;
          }
        });
      </script>
    </body>
    </html>
  `;
}

// Função de desativação
export function deactivate() {}
