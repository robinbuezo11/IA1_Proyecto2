async function execNeuronalNetwork() {
    try {
        const data = await parseCSV();

        const coln1 = document.getElementById('neuronalColumn1').value;
        const coln2 = document.getElementById('neuronalColumn2').value;

        if (!data[0].hasOwnProperty(coln1) || !data[0].hasOwnProperty(coln2)) {
            throw 'Las columnas seleccionadas no existen en el archivo';
        }

        const n1Data = data.map(row => parseFloat(row[coln1]));
        const n2Data = data.map(row => parseFloat(row[coln2]));

        const design = [2, 4, 3, 2];
        const model = new NeuralNetwork(design);

        for (let i = 0; i < n1Data.length; i++) {
            model.Entrenar([n1Data[i], n2Data[i]], (n1Data[i] > n2Data[i]) ? [1, 0] : [0, 1]);
        }

        const largest = model.Predecir([10, 20]);

        const graphData = {
            model: 'neuronal',
            graphs: [],
            table: {
                'Largest': largest,
            }
        };

        localStorage.setItem('graphData', JSON.stringify(graphData));

        alert('Red Neuronal entrenada');
        return model;
    } catch (error) {
        alert(error);
    }
};

function predictNeuronalNetwork() {
    if (document.getElementById('neuronalPredictValue').value === '') {
        alert('Por favor, ingrese los valores a predecir');
    }

    const values = document.getElementById('neuronalPredictValue').value.split(',').map(val => parseInt(val));
    if (values.length !== 2) {
        alert('Por favor, ingrese dos valores');
        return;
    }

    const largest = currentModel.Predecir(values);

    const divResults = document.getElementById('results');
    divResults.innerHTML = '';
    divResults.innerHTML = `
        <h3>Resultados:</h3>
        <p>${values[0]} Mayor que ${values[1]}: ${largest}</p>
    `;
}