import * as vscode from 'vscode';
import fetch from 'node-fetch';  // Importação do fetch
import { fetchAIResponse } from  './aiService';

// Este método é chamado quando sua extensão é ativada
export function activate(context: vscode.ExtensionContext) {
	console.log('Parabéns, sua extensão "orbitia" está agora ativa!');
	
	const disposable = vscode.commands.registerCommand('orbitia.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from orbitIA!');
	});

	context.subscriptions.push(disposable);
}

// Função para fazer a chamada à IA
export async function fetchAIResponse(input: string): Promise<string> {
	const response = await fetch('aqui vou colocar a IA', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ prompt: input }) // Corrigido
	});
	const data = await response.json();
	return data.generatedText;
} 

// Função de desativação da extensão
export function deactivate() {}
