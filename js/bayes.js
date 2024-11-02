async function execBayes() {
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

        const naive = new NaiveBayes();
        headers.forEach(header => {
            naive.insertCause(header, columns[header]);
        });

        const graphData = {
            model: 'bayes',
            graphs: [],
            table: columns
        };

        const select = document.getElementById('bayesPredictValue');
        select.innerHTML = '';
        for (const header of headers) {
            const option = document.createElement('option');
            option.value = header;
            option.textContent = header;
            select.appendChild(option);
        }

        const causes = document.getElementById('bayesWhen');
        causes.innerHTML = '';
        for (const key of Object.keys(columns)) {
            const label = document.createElement('label');
            label.textContent = key.toUpperCase();
            label.htmlFor = 'bayes' + key;
            label.className = 'form-label';
            const select = document.createElement('select');
            select.id = 'bayes' + key;
            select.className = 'form-select mb-3';
            select.name = 'bayes' + key;
            select.required = true;
            // Agregar columans sin repetir
            const unique = [...new Set(columns[key])];
            unique.forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
            causes.appendChild(label);
            causes.appendChild(select);
        }

        localStorage.setItem('graphData', JSON.stringify(graphData));

        alert('Naive Bayes entrenado');
        return naive;
    } catch (error) {
        alert(error);
    }
};

function predictBayes() {
    if(document.getElementById('bayesPredictValue').value === '') {
        alert('No se ha ingresado un valor para predecir');
        return;
    }

    const value = document.getElementById('bayesPredictValue').value;
    const causes = [];
    const inputs = document.getElementById('bayesWhen').querySelectorAll('select');
    inputs.forEach(input => causes.push([input.name.replace('bayes', ''), input.value]));

    const prediction = currentModel.predict(value, causes);
    document.getElementById('results').innerHTML = `Predicción: ${prediction}`;
}