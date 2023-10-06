import { Database } from "./database.js";

document.addEventListener("DOMContentLoaded", function () {
    const cadastro = document.getElementById("cadastro");
    const participantes = document.getElementById("participantes");
    const resultado = document.getElementById("resultado");
    const resultTable = document.getElementById("resultTable");
    const resultadosAnteriores = document.getElementById("resultados-anteriores");
    const continueButton = document.getElementById("continue");
    const calculateButton = document.getElementById("calculate");

    cadastro.classList.add("stepshow")

    continueButton.addEventListener("click", function (e) {
        e.preventDefault();
        if (validarCadastro()) {
            cadastro.classList.remove("stepshow")
            participantes.classList.add("stepshow")
        }
    });

    calculateButton.addEventListener("click", function (e) {
        e.preventDefault();
        if (validarParticipantes()) {
            calculateResultsAndSave();
            participantes.classList.remove("stepshow")
            resultado.classList.add("stepshow")
            resultadosAnteriores.classList.add("stepshow")
            listPreviousResults()
        }
    });

    function validarCadastro() {
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const cep = document.getElementById("cep").value.trim();
        const checkbox = document.getElementById("consent").checked;

        if (name === "" || email === "" || cep === "") {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return false;
        }

        if (!Database.isInDatabase()) {
            Database.registerUser(email,name,cep,checkbox)
        }
    
        return true;
    }

    function validarParticipantes() {
        const men = returnNum(parseInt(document.getElementById("men").value));
        const women = returnNum(parseInt(document.getElementById("women").value));
        const children = returnNum(parseInt(document.getElementById("children").value));
        
        if (!men && !women && !children) {
            alert("Por favor, insira valores válidos para a quantidade de pessoas.");
            return false;
        }

        return true;
    }

    function returnNum(numero) {
        if (isNaN(numero)) { return 0 }
        return numero
    }

    function calculateResultsAndSave() {
        const men = returnNum(parseInt(document.getElementById("men").value));
        const women = returnNum(parseInt(document.getElementById("women").value));
        const children = returnNum(parseInt(document.getElementById("children").value));
        const drinkers = returnNum(parseInt(document.getElementById("drinkers").value));

        const carne = (0.4 * men) + (0.32 * women) + (0.2 * children);
        const paoDeAlho = (2 * (men + women)) + children;
        const carvao = men + women + children;
        const salGrosso = 0.04 * (men + women + children);
        const gelo = Math.ceil((men + women + children) / 10) * 5;
        const refrigerante = Math.ceil((men + women + children) / 5);
        const agua = Math.ceil((men + women + children) / 5);
        const cerveja = 3 * drinkers;

        const items = [
            { item: "Homens", quantidade: men },
            { item: "Mulheres", quantidade: women },
            { item: "Crianças", quantidade: children },
            { item: "Bebem álcool", quantidade: drinkers },
            { item: "Carne", quantidade: carne.toFixed(2) + " KG" },
            { item: "Pão de Alho", quantidade: paoDeAlho },
            { item: "Carvão", quantidade: carvao + " KG" },
            { item: "Sal Grosso", quantidade: salGrosso + " KG" },
            { item: "Gelo", quantidade: gelo + " KG" },
            { item: "Refrigerante", quantidade: refrigerante + " garrafa(s) de 2L" },
            { item: "Água", quantidade: agua + " garrafa(s) de 1L" },
            { item: "Cerveja", quantidade: cerveja + " garrafa(s) de 600ml" },
        ];

        Database.addRecipe(items)

        const tbody = resultTable.getElementsByTagName("tbody")[0];
        tbody.innerHTML = "";

        items.forEach((item) => {
            const row = tbody.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            cell1.textContent = item.item;
            cell2.textContent = item.quantidade;
        });
    }

    function listPreviousResults() {
        const recipies = Database.getSavedRecipiesFromUser()

        for (const recipe in recipies) {
            const items = recipies[recipe];
            const tabela = document.createElement("table");
            const tabelaHead = document.createElement("thead");
            const tabelaBody = document.createElement("tbody");
            tabelaHead.innerHTML = "<tr><th>Ingredientes</th><th>Quantidade</th></tr>";
            
            tabelaBody.innerHTML = "";

            items.forEach((item) => {
                const row = tabelaBody.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                cell1.textContent = item.item;
                cell2.textContent = item.quantidade;
            });

            tabela.appendChild(tabelaHead)
            tabela.appendChild(tabelaBody)

            resultadosAnteriores.appendChild(tabela)
        }
    }
});
