async function baixarPDF() {
    // Importando jsPDF e autoTable usando a função UMD para acessar o módulo
    const { jsPDF } = window.jspdf;

    // Cria um novo documento PDF
    const doc = new jsPDF();
    
    // Obtendo dados da tabela
    const tabela = document.getElementById("tabela");
    const linhas = tabela.querySelectorAll("tbody tr");
    const dados = [];

    linhas.forEach(linha => {
        const dia = linha.cells[0].innerText;
        const nome = linha.cells[1].querySelector("select").value || "Selecione um nome";
        dados.push([dia, nome]);
    });

    // Adicionando tabela ao PDF
    doc.autoTable({
        head: [['Dia', 'Nome']],
        body: dados,
    });

    // Salvando o PDF
    doc.save("tabela.pdf");
}
