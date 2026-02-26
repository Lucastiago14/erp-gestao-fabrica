
const STATUS_PRODUCAO = [
    'Sem corte', 
    'Corte', 
    'Costura', 
    'Conferencia', 
    'Acabamento', 
    'Embalagem', 
    'Estoque'
];

const $ = id => document.getElementById(id);

function gerarId(prefixo = 'id') { 
    return prefixo + '_' + Date.now() + '_' + Math.floor(Math.random() * 9999); 
}

function carregarDados(chave) { 
    try { 
        return JSON.parse(localStorage.getItem(chave) || '[]'); 
    } catch (erro) { 
        console.error("Erro ao carregar dados:", erro);
        return []; 
    } 
}

function salvarDados(chave, valor) { 
    localStorage.setItem(chave, JSON.stringify(valor)); 
}

let referencias = carregarDados('referencias');
let clientes = carregarDados('clientes');
let pedidos = carregarDados('pedidos');