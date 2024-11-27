import * as vscode from "vscode";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicialização do modelo generativo
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDColT7u15xZU2Az-OZIdMBRqWpuu0e2rA";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function fetchAIResponse(input: string): Promise<string> {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(input);

    return result.response?.text || "Nenhuma resposta foi gerada.";
  } catch (error) {
    console.error("Erro na API Gemini:", error.message);
    return `Erro ao processar sua solicitação: ${error.message}`;
  }
}

export async function activate(context: vscode.ExtensionContext) {
  console.log('Parabéns, sua extensão "orbitia" está ativa!');

  const chatDisposable = vscode.commands.registerCommand(
    "orbitia.openChat",
    async () => {
      const panel = vscode.window.createWebviewPanel(
        "orbitiaChat",
        "OrbitIA Chatbot",
        vscode.ViewColumn.One,
        {}
      );

      panel.webview.html = getWebviewContent();

      panel.webview.onDidReceiveMessage(
        async (message) => {
          if (message.command === "askAI") {
            const aiResponse = await fetchAIResponse(message.text);
            panel.webview.postMessage({
              command: "aiResponse",
              text: aiResponse,
            });
          }
        },
        undefined,
        context.subscriptions
      );
    }
  );

  context.subscriptions.push(chatDisposable);
}

<<<<<<< HEAD
// Função de requisição à API
export async function fetchAIResponse(input: string): Promise<string> {
  if (!nodeFetch) {
    return 'Erro: node-fetch não foi carregado.';
  }

  try {
    const response = await nodeFetch('https://api.gemini.com/ai-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer `
      },
      body: JSON.stringify({ prompt: input })
    });

    const data = await response.json();

    if (data && typeof data.generatedText === 'string') {
      return data.generatedText;
    } else {
      return 'Erro ao obter resposta da AI';
    }
  } catch (error) {
    console.error('Erro na requisição da API:', error);
    return 'Erro ao fazer requisição à API';
  }
}

// Função para fornecer o HTML do chatbot
=======
>>>>>>> 4133c8d (fazendo a importação do gemini no codigo(teste))
function getWebviewContent(): string {
  return `
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chatbot OrbitIA</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      height: 100%;
      margin: 0;
      padding: 0;
      background-color: #f7f7f7;
    }
    #chatContainer {
      flex-grow: 1;
      overflow-y: auto;
      padding: 10px;
      background-color: white;
      border-bottom: 1px solid #ddd;
    }
    #inputContainer {
      display: flex;
      padding: 10px;
      background-color: #fff;
      border-top: 1px solid #ddd;
    }
    #input {
      width: 80%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
    }
    #send {
      margin-left: 10px;
      padding: 10px 15px;
      background-color: #0078d4;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    #send:hover {
      background-color: #005fa3;
    }
    .userMessage {
      padding: 10px;
      background-color: #e0f7fa;
      border-radius: 10px;
      margin: 5px 0;
      max-width: 70%;
      align-self: flex-end;
    }
    .aiMessage {
      padding: 10px;
      background-color: #e8e8e8;
      border-radius: 10px;
      margin: 5px 0;
      max-width: 70%;
      align-self: flex-start;
    }
    #loading {
      font-style: italic;
      color: #0078d4;
    }
  </style>
</head>
<body>
  <div id="chatContainer"></div>
  <div id="inputContainer">
    <input id="input" type="text" placeholder="Digite sua pergunta..." />
    <button id="send">Enviar</button>
  </div>
  <div id="loading" style="display: none;">Pensando...</div>

  <script>
    const vscode = acquireVsCodeApi();
    const chatContainer = document.getElementById('chatContainer');
    const input = document.getElementById('input');
    const sendButton = document.getElementById('send');
    const loadingElement = document.getElementById('loading');

    sendButton.addEventListener('click', () => {
      const userText = input.value.trim();
      if (userText) {
        addMessageToChat(userText, 'user');
        input.value = '';
        showLoading(true);
        vscode.postMessage({ command: 'askAI', text: userText });
      }
    });

    window.addEventListener('message', event => {
      const message = event.data;
      if (message.command === 'aiResponse') {
        showLoading(false);
        addMessageToChat(message.text, 'ai');
      }
    });

    function addMessageToChat(text, sender) {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add(sender === 'user' ? 'userMessage' : 'aiMessage');
      messageDiv.innerText = text;
      chatContainer.appendChild(messageDiv);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function showLoading(show) {
      loadingElement.style.display = show ? 'block' : 'none';
    }
  </script>
</body>
</html>
  `;
}

// Função de desativação
export function deactivate() {}


//o erro estava numa declaração global no fecht
