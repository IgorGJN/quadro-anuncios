// Função para gerar datas de quintas e domingos em pares
function gerarDatas(ano, mes) {
    const datas = [];
    const diasNoMes = new Date(ano, mes + 1, 0).getDate(); // Número de dias no mês
    let quinta = null;

    for (let dia = 1; dia <= diasNoMes; dia++) {
        const data = new Date(ano, mes, dia);
        const diaSemana = data.getDay(); // 0 = Domingo, 4 = Quinta-feira

        if (diaSemana === 4) {
            // Armazena a quinta-feira para adicionar na linha
            if (quinta !== null) {
                // Adiciona quinta isolada se não tiver par
                datas.push(quinta);
            }
            quinta = String(dia).padStart(2, '0'); // Formata o dia
        } else if (diaSemana === 0) {
            const domingo = String(dia).padStart(2, '0');
            if (quinta) {
                // Se temos uma quinta-feira armazenada, cria um par com o domingo
                datas.push(`${quinta}, ${domingo}`);
                quinta = null; // Reseta a quinta-feira armazenada
            } else {
                // Se não há quinta armazenada, adiciona o domingo isolado
                datas.push(domingo);
            }
        }
    }

    // Se ainda houver uma quinta-feira sem par, adiciona ela sozinha
    if (quinta) {
        datas.push(quinta);
    }

    return datas;
}

// Função para atualizar a tabela com as datas geradas
function atualizarTabela() {
    const ano = document.getElementById("ano").value;
    const mes = document.getElementById("mes").value;
    const tbody = document.querySelector("#tabela tbody");
    tbody.innerHTML = ""; // Limpa o conteúdo anterior

    const datas = gerarDatas(ano, parseInt(mes));

    datas.forEach(data => {
        const tr = document.createElement("tr");

        const tdData = document.createElement("td");
        tdData.textContent = data;
        tr.appendChild(tdData);

        // Criar colunas com selects para nomes
        const colunas = ["Indicador", "Indicador", "Microfone", "Microfone", "Palco", "Áudio"];
        colunas.forEach(coluna => {
            const td = document.createElement("td");
            const select = document.createElement("select");
            select.classList.add("nome-select");
            select.innerHTML = '<option value="">Selecione um nome</option>'; // Adiciona uma opção padrão
            td.appendChild(select);
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    // Recarrega nomes no select
    carregarNomes();
}

// Evento para gerar datas ao enviar o formulário
document.getElementById("selecionar-periodo-form").addEventListener("submit", (e) => {
    e.preventDefault();
    atualizarTabela();
});

// Função para carregar nomes do local storage nos selects
function carregarNomes() {
    const nomes = JSON.parse(localStorage.getItem("nomes")) || [];
    const selects = document.querySelectorAll(".nome-select"); // Seleciona todos os selects

    selects.forEach(select => {
        // Limpa as opções anteriores
        select.innerHTML = '<option value="">Selecione um nome</option>'; // Adiciona a opção padrão

        // Adiciona cada nome como uma opção
        nomes.forEach(nome => {
            const option = document.createElement("option");
            option.value = nome;
            option.textContent = nome;
            select.appendChild(option);
        });
    });
}

// Função para baixar o PDF
async function baixarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const tabela = document.getElementById("tabela");
    const linhas = tabela.querySelectorAll("tbody tr");
    const dados = [];

    linhas.forEach(linha => {
        const dia = linha.cells[0].innerText; // Dia da coluna 1
        const nomes = [];
        // Para cada coluna, coleta o nome selecionado
        for (let i = 1; i < linha.cells.length; i++) {
            const select = linha.cells[i].querySelector("select");
            nomes.push(select.value || "Selecione um nome"); // Coleta o valor ou a opção padrão
        }
        dados.push([dia, ...nomes]); // Adiciona o dia e os nomes como uma linha no PDF
    });

    doc.autoTable({
        head: [['Dia', 'Indicador 1', 'Indicador 2', 'Microfone 1', 'Microfone 2', 'Palco', 'Áudio']],
        body: dados,
    });

    doc.save("tabela.pdf");
}

// Carregar nomes ao abrir a página
document.addEventListener("DOMContentLoaded", carregarNomes);
