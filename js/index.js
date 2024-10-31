document.onload = updateParams();

document.getElementById('objetivo').addEventListener('change', function () {
    updateParams();
});

function updateParams() {
    const objetivo = document.getElementById('objetivo').value;
    document.getElementById('paramClasificacion').style.display = objetivo === 'clasificacion' ? 'block' : 'none';
    document.getElementById('paramPrediccion').style.display = objetivo === 'prediccion' ? 'block' : 'none';
    document.getElementById('paramSupervisado').style.display = (objetivo === 'clasificacion' || objetivo === 'prediccion') ? 'block' : 'none';
    document.getElementById('parametrosEspecificos').style.display = (objetivo === 'clasificacion' || objetivo === 'prediccion') ? 'block' : 'none';
};

document.getElementById('btnEntrenar').addEventListener('click', function () {
    const modelo = document.getElementById('modelo').value;
    if (modelo === 'linear') {
        execLinearRegression();
    }
});

document.getElementById('btnPredecir').addEventListener('click', function () {
    return false;
});

document.getElementById('btnGraficar').addEventListener('click', function () {
    if (!localStorage.getItem('graphData')) {
        alert('No hay datos para graficar');
        return;
    }
    window.open('html/graph.html', '_blank');
});

async function execLinearRegression() {
    try {
        const data = await parseCSV();

        const trainPercent = parseFloat(document.getElementById('trainPercent').value) / 100;
        const testPercent = parseFloat(document.getElementById('testPercent').value) / 100;

        if (trainPercent + testPercent !== 1) {
            throw 'La suma de los porcentajes de entrenamiento y prueba debe ser igual a 100';
        }

        const xData = data.map(d => parseFloat(d.x));
        const yData = data.map(d => parseFloat(d.y));

        const trainSize = Math.floor(xData.length * trainPercent);

        const xTrain = xData.slice(0, trainSize);
        const yTrain = yData.slice(0, trainSize);
        const xTest = xData.slice(trainSize);
        const yTest = yData.slice(trainSize);

        const linear = new LinearRegression();
        linear.fit(xTrain, yTrain);
        const yPred = linear.predict(xTest);

        const graphData = {
            model: 'linear',
            graphs: [
                {
                    title: 'Entrenamiento',
                    datasets: [
                        {
                            label: 'Datos Reales',
                            x: xTrain,
                            y: yTrain,
                            color: 'rgba(75, 192, 192, 1)',
                            type: 'scatter'
                        }
                    ]
                },
                {
                    title: 'Predicción vs Datos de Prueba',
                    datasets: [
                        {
                            label: 'Datos Reales',
                            x: xTest,
                            y: yTest,
                            color: 'rgba(75, 192, 192, 1)',
                            type: 'scatter'
                        },
                        {
                            label: 'Predicción',
                            x: xTest,
                            y: yPred,
                            color: 'rgba(255, 99, 132, 1)',
                            type: 'line'
                        }
                    ],
                    table: { x: xTest, y: yTest, yPred }
                }
            ]
        };

        localStorage.setItem('graphData', JSON.stringify(graphData));

        alert('Entrenamiento completado');
    } catch (error) {
        alert(error);
    }
}

function parseCSV() {
    return new Promise((resolve, reject) => {
        const file = document.getElementById('archivo').files[0];
        if (!file) {
            reject('No se ha seleccionado un archivo');
            return;
        }

        const reader = new FileReader();

        reader.onload = function (e) {
            const data = e.target.result;
            const parsedData = Papa.parse(data, { header: true });
            resolve(parsedData.data);
        };

        reader.onerror = function () {
            reject('Error al leer el archivo');
        };

        reader.readAsText(file);
    });
}