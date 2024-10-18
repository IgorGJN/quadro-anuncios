// Função para carregar nomes do local storage
function carregarNomes() {
    const nomes = JSON.parse(localStorage.getItem("nomes")) || [];
    const selects = document.querySelectorAll(".nome-select");

    // Limpa as opções atuais e adiciona as novas do local storage
    selects.forEach(select => {
        select.innerHTML = '<option value="">Selecione um nome</option>';
        nomes.forEach(nome => {
            const option = document.createElement("option");
            option.value = nome;
            option.textContent = nome;
            select.appendChild(option);
        });
    });
}

// Função para adicionar novo nome ao local storage
function adicionarNome(event) {
    event.preventDefault();
    const novoNomeInput = document.getElementById("novo-nome");
    const novoNome = novoNomeInput.value.trim();

    if (novoNome) {
        let nomes = JSON.parse(localStorage.getItem("nomes")) || [];
        // Evitar adicionar nomes duplicados
        if (!nomes.includes(novoNome)) {
            nomes.push(novoNome);
            localStorage.setItem("nomes", JSON.stringify(nomes));
            carregarNomes(); // Atualiza os selects com o novo nome
        }
        novoNomeInput.value = ""; // Limpa o campo de entrada
    }
}

// Evento para adicionar novo nome
document.getElementById("adicionar-nome-form").addEventListener("submit", adicionarNome);

// Função para baixar o PDF (mesma de antes)
async function baixarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const tabela = document.getElementById("tabela");
    const linhas = tabela.querySelectorAll("tbody tr");
    const dados = [];

    linhas.forEach(linha => {
        const dia = linha.cells[0].innerText;
        const nome = linha.cells[1].querySelector("select").value || "Selecione um nome";
        dados.push([dia, nome]);
    });

    doc.autoTable({
        head: [['Dia', 'Nome']],
        body: dados,
    });

    doc.save("tabela.pdf");
}

// Carregar nomes ao abrir a página
document.addEventListener("DOMContentLoaded", carregarNomes);
