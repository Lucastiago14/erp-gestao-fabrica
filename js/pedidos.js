const buscaPedido = $('searchOrder');
const listaPedidos = $('ordersList');
const btnNovoPedido = $('btnNewOrder');
const modalPedido = $('modalOrder');

const campoSeletorCliente = $('order_client');
const campoSeletorRef = $('order_ref');
const campoQtdPedido = $('order_qty');
const campoDataPedido = $('order_date');

const btnSalvarPedido = $('saveOrder');
const btnCancelarPedido = $('cancelOrder');
const filtroStatusPedidos = $('filterStatusOrders');

let idPedidoEmEdicao = null;

function popularSeletoresPedido() {
    campoSeletorCliente.innerHTML = '<option value="">Selecione um cliente...</option>';
    campoSeletorRef.innerHTML = '<option value="">Selecione uma referência...</option>';

    clientes.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        campoSeletorCliente.appendChild(opt);
    });

    referencias.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r.id;
        opt.textContent = r.codigo;
        campoSeletorRef.appendChild(opt);
    });
}

btnNovoPedido.onclick = () => {
    idPedidoEmEdicao = null;
    popularSeletoresPedido();
    campoQtdPedido.value = 1;
    campoDataPedido.value = '';
    $('modalOrderTitle').textContent = 'Novo Pedido';
    modalPedido.classList.remove('hidden');
};

btnCancelarPedido.onclick = () => modalPedido.classList.add('hidden');

btnSalvarPedido.onclick = () => {
    const idCli = campoSeletorCliente.value;
    const idRef = campoSeletorRef.value;
    const qtd = Number(campoQtdPedido.value) || 1;

    if (!idCli || !idRef) { 
        alert('Selecione um cliente e uma referência'); 
        return; 
    }

    const dataISO = campoDataPedido.value ? new Date(campoDataPedido.value).toISOString() : new Date().toISOString();

    if (idPedidoEmEdicao) {
        const p = pedidos.find(x => x.id === idPedidoEmEdicao);
        if (p) { 
            p.clientId = idCli; 
            p.idReferencia = idRef; 
            p.quantidade = qtd; 
            p.atualizado = dataISO; 
        }
    } else {
        pedidos.push({
            id: gerarId('ped'),
            clientId: idCli,
            idReferencia: idRef,
            quantidade: qtd,
            criado: dataISO,
            atualizado: null
        });
    }

    salvarDados('pedidos', pedidos);
    modalPedido.classList.add('hidden');
    renderizarTudo();
};

buscaPedido.oninput = renderizarPedidos;
filtroStatusPedidos.onchange = renderizarPedidos;

function renderizarPedidos() {
    const termoBusca = buscaPedido.value.trim().toLowerCase();
    const filtroAtivo = filtroStatusPedidos.value;
    listaPedidos.innerHTML = '';

    const filtrados = pedidos.filter(p => {
        const ref = referencias.find(r => r.id === p.idReferencia);
        if (!ref) return false;

        const matchesBusca = ref.codigo.toLowerCase().includes(termoBusca);
        const matchesStatus = filtroAtivo ? ref.status === filtroAtivo : true;
        return matchesBusca && matchesStatus;
    });

    if (filtrados.length === 0) {
        listaPedidos.innerHTML = '<div class="small">Nenhum pedido encontrado.</div>';
        return;
    }

    filtrados.forEach(p => {
        const li = document.createElement('li');
        const cliente = clientes.find(c => c.id === p.clientId);
        const ref = referencias.find(r => r.id === p.idReferencia);

        li.innerHTML = `
            <div>
                <strong>${cliente ? cliente.name : 'Cliente removido'}</strong> • 
                Ref: ${ref ? ref.codigo : 'Removida'} • 
                Qtd: ${p.quantidade} 
                <div class='small'>
                    Cadastrado: ${new Date(p.criado).toLocaleString()} 
                    ${p.atualizado ? ' • Atualizado: ' + new Date(p.atualizado).toLocaleString() : ''}
                </div>
            </div>
        `;

        const acoes = document.createElement('div');
        acoes.className = 'controls';

        const btnEditar = document.createElement('button');
        btnEditar.className = 'small-btn';
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => {
            idPedidoEmEdicao = p.id;
            popularSeletoresPedido();
            campoSeletorCliente.value = p.clientId;
            campoSeletorRef.value = p.idReferencia;
            campoQtdPedido.value = p.quantidade;
            campoDataPedido.value = p.criado ? new Date(p.criado).toISOString().slice(0, 16) : '';
            $('modalOrderTitle').textContent = 'Editar Pedido';
            modalPedido.classList.remove('hidden');
        };

        const btnExcluir = document.createElement('button');
        btnExcluir.className = 'small-btn';
        btnExcluir.textContent = 'Excluir';
        btnExcluir.onclick = () => {
            if (confirm('Excluir este pedido?')) {
                pedidos = pedidos.filter(x => x.id !== p.id);
                salvarDados('pedidos', pedidos);
                renderizarTudo();
            }
        };

        acoes.appendChild(btnEditar);
        acoes.appendChild(btnExcluir);
        li.appendChild(acoes);
        listaPedidos.appendChild(li);
    });
}