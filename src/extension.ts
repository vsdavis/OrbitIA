import * as vscode from 'vscode';
import fetch from 'node-fetch'; // Certifique-se de que está instalado corretamente

// Método chamado quando a extensão é ativada
export function activate(context: vscode.ExtensionContext) {
	console.log('Parabéns, sua extensão "orbitia" está ativa!');

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
	const response = await fetch('https://api.gemini.com/ai-endpoint', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer SUA_API_KEY` // Substitua pela sua chave
		},
		body: JSON.stringify({ prompt: input })
	});

	const data = await response.json();
	console.log(data); // Inspecione a resposta da API
	return data.generatedText || 'Erro ao obter resposta';
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
