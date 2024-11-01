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

        if (!data[0].hasOwnProperty(xCol) || !data[0].hasOwnProperty(yCol)) {
            throw 'Las columnas seleccionadas no existen en el archivo';
        }

        if (isNaN(degree) || degree < 1) {
            throw 'El grado del polinomio debe ser un número entero positivo';
        }

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