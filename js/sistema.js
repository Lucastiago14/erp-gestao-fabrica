const buscaRef = $('searchRef');
const resultadosBusca = $('searchResults');
const btnNovaRef = $('btnNewRef');
const modalReferencia = $('modalRef');
const tituloModalRef = $('modalRefTitle');

const campoCodRef = $('ref_code');
const campoOrdemRef = $('ref_order');
const campoQtdRef = $('ref_qty');
const campoStatusRef = $('ref_status');
const campoDataRef = $('ref_date');

const btnSalvarRef = $('saveRef');
const btnCancelarRef = $('cancelRef');
const filtroStatus = $('filterStatus');

let idReferenciaEmEdicao = null;

btnNovaRef.onclick = () => {
    idReferenciaEmEdicao = null;
    tituloModalRef.textContent = 'Cadastrar Referência';
    campoCodRef.value = '';
    campoOrdemRef.value = '';
    campoQtdRef.value = '1';
    campoStatusRef.value = 'Sem corte';
    campoDataRef.value = '';
    modalReferencia.classList.remove('hidden');
};

btnCancelarRef.onclick = () => modalReferencia.classList.add('hidden');

btnSalvarRef.onclick = () => {
    const codigo = campoCodRef.value.trim();
    if (!codigo) { alert('Preencha a referência'); return; }

    const ordem = campoOrdemRef.value.trim();
    const quantidade = Number(campoQtdRef.value);
    const status = campoStatusRef.value;
    const dataISO = campoDataRef.value ? new Date(campoDataRef.value).toISOString() : new Date().toISOString();

    if (idReferenciaEmEdicao) {
        const ref = referencias.find(r => r.id === idReferenciaEmEdicao);
        if (ref) { 
            ref.codigo = codigo; ref.ordem = ordem; ref.quantidade = quantidade; 
            ref.status = status; ref.atualizado = dataISO; 
        }
    } else {
        referencias.push({ 
            id: gerarId('ref'), 
            codigo, 
            ordem, 
            quantidade, 
            status, 
            criado: dataISO, 
            atualizado: null 
        });
    }

    salvarDados('referencias', referencias);
    modalReferencia.classList.add('hidden');
    renderizarTudo(); 
};

buscaRef.oninput = renderizarSistema;
filtroStatus.onchange = renderizarSistema;

function renderizarSistema() {
    const termoBusca = buscaRef.value.trim().toLowerCase();
    const filtroAtivo = filtroStatus.value;
    resultadosBusca.innerHTML = '';

    const filtrados = referencias.filter(r => 
        (r.codigo.toLowerCase().includes(termoBusca) || (r.ordem || '').toLowerCase().includes(termoBusca)) && 
        (filtroAtivo ? r.status === filtroAtivo : true)
    );

    if (filtrados.length === 0) {
        resultadosBusca.innerHTML = '<div class="small">Nenhuma referência encontrada.</div>';
        return;
    }

    filtrados.forEach(r => {
        const card = document.createElement('div');
        card.className = 'ref-card';

        const totalReservado = pedidos.filter(p => p.idReferencia === r.id).reduce((soma, p) => soma + Number(p.quantidade || 0), 0);
        const saldoDisponivel = r.quantidade - totalReservado;

        card.innerHTML = `
            <div class="ref-top">
                <div>
                    <strong>${r.codigo}</strong>
                    <div class='small'>Ordem: ${r.ordem || '-'} • Criada: ${new Date(r.criado).toLocaleString()}</div>
                </div>
                <div class='badge'>Disponível: ${saldoDisponivel} • Reservada: ${totalReservado}</div>
            </div>
            <div class="small">Status: <strong>${r.status}</strong> • Total em Produção: ${r.quantidade}</div>
        `;

        const acoes = document.createElement('div');
        acoes.className = 'controls';

        const btnEditar = document.createElement('button');
        btnEditar.className = 'small-btn';
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => {
            idReferenciaEmEdicao = r.id;
            tituloModalRef.textContent = 'Editar Referência';
            campoCodRef.value = r.codigo;
            campoOrdemRef.value = r.ordem || '';
            campoQtdRef.value = r.quantidade || 1;
            campoStatusRef.value = r.status || 'Sem corte';
            campoDataRef.value = r.criado ? new Date(r.criado).toISOString().slice(0, 16) : '';
            modalReferencia.classList.remove('hidden');
        };

        const btnExcluir = document.createElement('button');
        btnExcluir.className = 'small-btn';
        btnExcluir.textContent = 'Excluir';
        btnExcluir.onclick = () => {
            if (confirm('Excluir referência e pedidos relacionados?')) {
                referencias = referencias.filter(ref => ref.id !== r.id);
                pedidos = pedidos.filter(p => p.idReferencia !== r.id);
                salvarDados('referencias', referencias);
                salvarDados('pedidos', pedidos);
                renderizarTudo();
            }
        };

        acoes.appendChild(btnEditar);
        acoes.appendChild(btnExcluir);
        card.appendChild(acoes);
        resultadosBusca.appendChild(card);
    });
}