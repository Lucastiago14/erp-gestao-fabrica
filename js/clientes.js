// js/clientes.js

const buscaCliente = $('searchClient');
const listaClientes = $('clientsList');
const btnNovoCliente = $('btnNewClient');
const modalCliente = $('modalClient');
const campoNomeCliente = $('client_name');
const tituloModalCliente = $('modalClientTitle');

const btnSalvarCliente = $('saveClient');
const btnCancelarCliente = $('cancelClient');

let idClienteEmEdicao = null;

// 1. Eventos de UI
btnNovoCliente.onclick = () => {
    idClienteEmEdicao = null;
    campoNomeCliente.value = '';
    tituloModalCliente.textContent = 'Novo Cliente';
    modalCliente.classList.remove('hidden');
};

btnCancelarCliente.onclick = () => modalCliente.classList.add('hidden');

btnSalvarCliente.onclick = () => {
    const nome = campoNomeCliente.value.trim();
    if (!nome) { alert('Nome obrigatório'); return; }

    if (idClienteEmEdicao) {
        const c = clientes.find(x => x.id === idClienteEmEdicao);
        if (c) c.name = nome; // Mantive .name para compatibilidade ou pode trocar para .nome
    } else {
        clientes.push({ id: gerarId('c'), name: nome });
    }

    salvarDados('clientes', clientes);
    modalCliente.classList.add('hidden');
    renderizarTudo();
};

buscaCliente.oninput = renderizarClientes;

// 2. Função de Renderização
function renderizarClientes() {
    const termoBusca = buscaCliente.value.trim().toLowerCase();
    listaClientes.innerHTML = '';

    const filtrados = clientes.filter(c => c.name.toLowerCase().includes(termoBusca));

    if (filtrados.length === 0) {
        listaClientes.innerHTML = '<div class="small">Nenhum cliente cadastrado.</div>';
        return;
    }

    filtrados.forEach(c => {
        const li = document.createElement('li');
        li.style.flexDirection = 'column';
        li.innerHTML = `<div><strong>${c.name}</strong></div>`;

        // Lógica Relacional: Quais pedidos este cliente tem?
        const pedidosRelacionados = pedidos.filter(p => p.clientId === c.id);

        if (pedidosRelacionados.length > 0) {
            const sub = document.createElement('div');
            sub.className = 'small';
            // Mapeia os pedidos para mostrar os códigos das referências
            sub.innerHTML = 'Referências: ' + pedidosRelacionados.map(p => {
                const ref = referencias.find(r => r.id === p.idReferencia);
                return `${ref ? ref.codigo : 'Removida'} (Qtd:${p.quantidade})`;
            }).join(', ');
            li.appendChild(sub);
        } else {
            const sub = document.createElement('div');
            sub.className = 'small';
            sub.textContent = 'Sem pedidos registrados.';
            li.appendChild(sub);
        }

        // Botões de Ação
        const acoes = document.createElement('div');
        acoes.style.marginTop = '8px';

        const btnEditar = document.createElement('button');
        btnEditar.className = 'small-btn';
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => {
            idClienteEmEdicao = c.id;
            campoNomeCliente.value = c.name;
            tituloModalCliente.textContent = 'Editar Cliente';
            modalCliente.classList.remove('hidden');
        };

        const btnExcluir = document.createElement('button');
        btnExcluir.className = 'small-btn';
        btnExcluir.textContent = 'Excluir';
        btnExcluir.onclick = () => {
            if (confirm('Excluir cliente? Isso removerá todos os pedidos vinculados a ele.')) {
                clientes = clientes.filter(x => x.id !== c.id);
                // Limpeza em cascata: remove pedidos do cliente excluído
                pedidos = pedidos.filter(p => p.clientId !== c.id);
                
                salvarDados('clientes', clientes);
                salvarDados('pedidos', pedidos);
                renderizarTudo();
            }
        };

        acoes.appendChild(btnEditar);
        acoes.appendChild(btnExcluir);
        li.appendChild(acoes);
        listaClientes.appendChild(li);
    });
}