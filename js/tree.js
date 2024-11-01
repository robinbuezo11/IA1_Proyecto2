async function execDecisionTree() {
    try {
        const data = await parseCSV();

        const trainPercent = parseFloat(document.getElementById('trainPercent').value) / 100;
        const testPercent = parseFloat(document.getElementById('testPercent').value) / 100;

        if (trainPercent + testPercent !== 1) {
            throw 'La suma de los porcentajes de entrenamiento y prueba debe ser igual a 100';
        }

        const arrayData = [];
        const headers = Object.keys(data[0]);
        data.forEach(row => {
            const values = headers.map(header => row[header]);
            arrayData.push(values);
        });

        const trainSize = Math.floor(arrayData.length * trainPercent);

        const trainData = arrayData.slice(0, trainSize);
        const testData = arrayData.slice(trainSize);
        // Colocar los headers al principio
        trainData.unshift(headers);
        testData.unshift(headers);

        const test = testData.map(row => row.slice(0, -1));

        const tree = new DecisionTreeID3(trainData);
        const root = tree.train(tree.dataset);
        const pred = tree.predict(test, root);

        const dot = tree.generateDotString(root);

        const graphData = {
            model: 'tree',
            graphs: [
                {
                    title: 'Árbol de Decisión',
                    type: 'tree',
                    datasets: [],
                    dot
                }
            ],
        };

        localStorage.setItem('graphData', JSON.stringify(graphData));

        alert('Árbol de decisión entrenado');
        return { root, tree };
    } catch (error) {
        alert(error);
    }
};

function predictDecisionTree() {
    if(document.getElementById('treePredictValue').value === '') {
        alert('No se ha ingresado un valor para predecir');
        return;
    }

    const values = JSON.parse(document.getElementById('treePredictValue').value);
    const pred = currentModel.predict(values, currentRoot);

    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-responsive mt-5';
    tableContainer.innerHTML = `<h3 class="text-center">Predicción</h3>`;
    const table = document.createElement('table');
    table.className = 'table table-striped table-bordered';
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = Object.keys(pred);
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header.toUpperCase();
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    const row = document.createElement('tr');
    headers.forEach(header => {
        const cell = document.createElement('td');
        cell.textContent = pred[header];
        row.appendChild(cell);
    });
    tbody.appendChild(row);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    
    const divResults = document.getElementById('results');
    divResults.innerHTML = '';
    divResults.appendChild(tableContainer);
}