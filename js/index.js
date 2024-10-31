let currentModel;

document.onload = updateParams();

document.getElementById('model').addEventListener('change', function () {
    updateParams();
});

function updateParams() {
    currentModel = null;
    localStorage.removeItem('graphData');

    const model = document.getElementById('model').value;
    document.getElementById('linearParams').style.display = model === 'linear' ? 'flex' : 'none';
    document.getElementById('polynomialParams').style.display = model === 'polynomial' ? 'flex' : 'none';
};

document.getElementById('btnTrain').addEventListener('click', async function () {
    const mlForm = document.getElementById('mlForm');

    if (!mlForm.checkValidity()) {
        alert('Por favor, complete todos los campos');
        return;
    }

    const model = document.getElementById('model').value;
    if (model === 'linear') {
        currentModel = await execLinearRegression();
    } else if (model === 'polynomial') {
        currentModel = await execPolynomialRegression();
    }
});

document.getElementById('btnPredict').addEventListener('click', function () {
    if (!currentModel) {
        alert('No se ha entrenado un modelo');
        return;
    } else if (!currentModel.isFit) {
        alert('El modelo no ha sido entrenado');
        return;
    }

    switch (document.getElementById('model').value) {
        case 'linear':
            predictLinearRegression();
            break;
        case 'polynomial':
            predictPolynomialRegression();
            break;
    }
});

document.getElementById('btnGraph').addEventListener('click', function () {
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

        const xCol = document.getElementById('linearXColumn').value;
        const yCol = document.getElementById('linearYColumn').value;

        const xData = data.map(row => parseFloat(row[xCol]));
        const yData = data.map(row => parseFloat(row[yCol]));

        const trainSize = Math.floor(xData.length * trainPercent);

        const xTrain = xData.slice(0, trainSize);
        const yTrain = yData.slice(0, trainSize);
        const xTest = xData.slice(trainSize);
        const yTest = yData.slice(trainSize);

        const linear = new LinearRegression();
        linear.fit(xTrain, yTrain);
        const yPred = linear.predict(xTest);
        const mse = linear.mserror(yTest, yPred);

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
                },
                {
                    title: 'Error Cuadrático Medio',
                    datasets: [
                        {
                            label: 'Error Cuadrático Medio',
                            x: [1],
                            y: [mse],
                            color: 'rgba(75, 192, 192, 1)',
                            type: 'bar'
                        }
                    ]
                }
            ]
        };

        localStorage.setItem('graphData', JSON.stringify(graphData));

        alert('Entrenamiento completado');
        return linear;
    } catch (error) {
        alert(error);
    }
};

function predictLinearRegression() {
    if (document.getElementById('linearPredictValue').value === '') {
        alert('Por favor, ingrese los valores a predecir');
        return;
    }

    const values = document.getElementById('linearPredictValue').value.split(',').map(value => parseFloat(value));
    if(values.map(value => isNaN(value)).includes(true)) {
        alert('Por favor, ingrese valores numéricos');
        return;
    }

    const yPred = currentModel.predict(values);
    yPred.forEach((value, index) => {
        yPred[index] = value.toFixed(2);
    });

    const divResults = document.getElementById('results');
    divResults.innerHTML = '';
    const h3 = document.createElement('h3');
    h3.innerText = 'Predicción';
    divResults.appendChild(h3);
    const p = document.createElement('p');
    p.innerText = `Valores: ${values.join(', ')}`;
    divResults.appendChild(p);
    const p2 = document.createElement('p');
    p2.innerText = `Predicción: ${yPred.join(', ')}`;
    divResults.appendChild(p2);
};

async function execPolynomialRegression() {
    try {
        const data = await parseCSV();

        const trainPercent = parseFloat(document.getElementById('trainPercent').value) / 100;
        const testPercent = parseFloat(document.getElementById('testPercent').value) / 100;

        if (trainPercent + testPercent !== 1) {
            throw 'La suma de los porcentajes de entrenamiento y prueba debe ser igual a 100';
        }

        const xCol = document.getElementById('polynomialXColumn').value;
        const yCol = document.getElementById('polynomialYColumn').value;
        const degree = parseInt(document.getElementById('polynomialDegree').value);

        const xData = data.map(row => parseFloat(row[xCol]));
        const yData = data.map(row => parseFloat(row[yCol]));

        const trainSize = Math.floor(xData.length * trainPercent);

        const xTrain = xData.slice(0, trainSize);
        const yTrain = yData.slice(0, trainSize);
        const xTest = xData.slice(trainSize);
        const yTest = yData.slice(trainSize);

        const polynomial = new PolynomialRegression();
        polynomial.fit(xTrain, yTrain, degree);
        const yPred = polynomial.predict(xTest);
        const r2 = polynomial.getError();

        const graphData = {
            model: 'polynomial',
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
                },
                {
                    title: 'R2',
                    datasets: [
                        {
                            label: 'R2',
                            x: [1],
                            y: [r2],
                            color: 'rgba(75, 192, 192, 1)',
                            type: 'bar'
                        }
                    ]
                }
            ]
        };

        localStorage.setItem('graphData', JSON.stringify(graphData));

        alert('Entrenamiento completado');
        return polynomial;
    } catch (error) {
        alert(error);
    }
};

function predictPolynomialRegression() {
    if (document.getElementById('polynomialPredictValue').value === '') {
        alert('Por favor, ingrese los valores a predecir');
        return;
    }

    const values = document.getElementById('polynomialPredictValue').value.split(',').map(value => parseFloat(value));
    if(values.map(value => isNaN(value)).includes(true)) {
        alert('Por favor, ingrese valores numéricos');
        return;
    }

    const yPred = currentModel.predict(values);
    yPred.forEach((value, index) => {
        yPred[index] = value.toFixed(2);
    });

    const divResults = document.getElementById('results');
    divResults.innerHTML = '';
    const h3 = document.createElement('h3');
    h3.innerText = 'Predicción';
    divResults.appendChild(h3);
    const p = document.createElement('p');
    p.innerText = `Valores: ${values.join(', ')}`;
    divResults.appendChild(p);
    const p2 = document.createElement('p');
    p2.innerText = `Predicción: ${yPred.join(', ')}`;
    divResults.appendChild(p2);
};

function parseCSV() {
    return new Promise((resolve, reject) => {
        const file = document.getElementById('dataFile').files[0];
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