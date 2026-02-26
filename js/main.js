const botoesAbas = document.querySelectorAll('.btn-aba');
const conteudosAbas = document.querySelectorAll('.conteudo-aba');

botoesAbas.forEach(botao => {
    botao.addEventListener('click', () => {
        botoesAbas.forEach(b => b.classList.remove('active'));
        
        botao.classList.add('active');

        const alvoId = botao.getAttribute('data-target');

        conteudosAbas.forEach(conteudo => {
            if (conteudo.id === alvoId) {
                conteudo.style.display = 'block';
            } else {
                conteudo.style.display = 'none';
            }
        });

        renderizarTudo();
    });
});

function renderizarTudo() {
    if (typeof renderizarSistema === 'function') renderizarSistema();
    if (typeof renderizarClientes === 'function') renderizarClientes();
    if (typeof renderizarPedidos === 'function') renderizarPedidos();
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarTudo();
    console.log("🚀 Navegação e renderização inicializadas!");
});