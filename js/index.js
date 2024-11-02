let currentModel;
let currentRoot;

document.onload = updateParams();

document.getElementById('model').addEventListener('change', function () {
    updateParams();
});

function updateParams() {
    currentModel = null;
    currentRoot = null;
    document.getElementById('results').innerHTML = '';
    localStorage.removeItem('graphData');

    const model = document.getElementById('model').value;
    document.getElementById('linearParams').style.display = model === 'linear' ? 'flex' : 'none';
    document.getElementById('polynomialParams').style.display = model === 'polynomial' ? 'flex' : 'none';
    document.getElementById('treeParams').style.display = model === 'tree' ? 'flex' : 'none';
    
    document.getElementById('bayesParams').style.display = 'none';
    document.getElementById('trainPercent').disabled = false;
    document.getElementById('testPercent').disabled = false;
    if (model === 'bayes' || model === 'neuronal' || model === 'kmeans' || model === 'knn') {
        document.getElementById('trainPercent').disabled = true;
        document.getElementById('testPercent').disabled = true;
    }
    document.getElementById('neuronalParams').style.display = model === 'neuronal' ? 'flex' : 'none';

    document.getElementById('btnPredict').disabled = false;
    document.getElementById('btnGraph').disabled = false;
    if (model === 'kmeans') {
        document.getElementById('btnPredict').disabled = true;
        document.getElementById('btnGraph').disabled = true;
    }
    document.getElementById('kmeansParams').style.display = model === 'kmeans' ? 'flex' : 'none';
    document.getElementById('knnParams').style.display = model === 'knn' ? 'flex' : 'none';
};

document.getElementById('btnTrain').addEventListener('click', async function () {
    const model = document.getElementById('model').value;
    if (model === 'linear') {
        currentModel = await execLinearRegression();
    } else if (model === 'polynomial') {
        currentModel = await execPolynomialRegression();
    } else if (model === 'tree') {
        ({ root: currentRoot, tree: currentModel } = await execDecisionTree());
    } else if (model === 'bayes') {
        currentModel = await execBayes();
        if (currentModel) {
            document.getElementById('bayesParams').style.display = 'flex';
        }
    } else if (model === 'neuronal') {
        currentModel = await execNeuronalNetwork();
    } else if (model === 'kmeans') {
        execKMeans();
    } else if (model === 'knn') {
        currentModel = await execKnn();
    }
});

document.getElementById('btnPredict').addEventListener('click', function () {
    if (!currentModel) {
        alert('No se ha entrenado un modelo');
        return;
    }
    // } else if (!currentRoot || !currentModel.isFit) {
    //     alert('El modelo no ha sido entrenado');
    //     return;
    // }

    switch (document.getElementById('model').value) {
        case 'linear':
            predictLinearRegression();
            break;
        case 'polynomial':
            predictPolynomialRegression();
            break;
        case 'tree':
            predictDecisionTree();
            break;
        case 'bayes':
            predictBayes();
            break;
        case 'neuronal':
            predictNeuronalNetwork();
            break;
        case 'knn':
            predictKnn();
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