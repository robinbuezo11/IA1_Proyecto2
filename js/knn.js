async function execKnn() {
    try {
        const data = await parseCSV();

        const headers = Object.keys(data[0]);
        const columns = {};
        headers.forEach(header => columns[header] = []);
        for (const row of data) {
            for (const header of headers) {
                columns[header].push(row[header]);
            }
        }

        const firstKey = Object.keys(data[0])[0];
        const trainData = data.map(obj => {
            return Object.keys(obj).filter(key => key !== firstKey).map(key => obj[key]);
        });

        const knn = new KNearestNeighbor(trainData);

        const graphData = {
            model: 'knn',
            graphs: [],
            table: columns
        };

        localStorage.setItem('graphData', JSON.stringify(graphData));

        alert('KNN entrenado');
        return knn;
    } catch (error) {
        alert(error);
    }
}

function predictKnn() {
    if (document.getElementById('knnPredictValue').value === '') {
        alert('Seleccione un valor a predecir');
        return;
    }

    const value = JSON.parse(document.getElementById('knnPredictValue').value);
    const euc = currentModel.euclidean(value);
    const man = currentModel.manhattan(value);

    const divResult = document.getElementById('results');
    divResult.innerHTML = '';
    divResult.innerHTML += '<h3>Resultados</h3>';
    divResult.innerHTML += `<p>Euclidean: ${euc}</p>`;
    divResult.innerHTML += `<p>Manhattan: ${man}</p>`;
}