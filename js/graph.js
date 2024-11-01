const graphData = JSON.parse(localStorage.getItem('graphData'));

if (graphData && graphData.graphs) {
    const chartsContainer = document.getElementById('chartsContainer');

    graphData.graphs.forEach((graph, index) => {
        // Create chart container
        const model = graphData.model

        switch (model) {
            case 'linear':
                document.getElementById('titleText').innerHTML = 'Gráficas de Regresión Lineal';
                break;
            case 'polynomial':
                document.getElementById('titleText').innerHTML = 'Gráficas de Regresión Polinomial';
                break;
            default:
                document.getElementById('titleText').innerHTML = 'Gráficas del Modelo';
        }

        if (graph.datasets.length > 0 ) {
            const chartContainer = document.createElement('div');
            chartContainer.className = 'mt-5';
            chartContainer.innerHTML = `<h3 class="text-center">${graph.title}</h3><canvas id="chart${index}"></canvas>`;
            chartsContainer.appendChild(chartContainer);

            // Create chart
            const ctx = document.getElementById(`chart${index}`).getContext('2d');

            const datasets = graph.datasets.map(dataset => ({
                label: dataset.label,
                data: dataset.x.map((x, i) => ({ x: x, y: dataset.y[i] })),
                borderColor: dataset.color,
                backgroundColor: dataset.color,
                borderWidth: 2,
                fill: dataset.type === 'line' ? false : true,
                type: dataset.type || 'line'
            }));

            const chartType = graph.type || 'scatter';

            new Chart(ctx, {
                type: chartType,
                data: { datasets },
                options: {
                    responsive: true,
                    scales: {
                        x: { title: { display: true, text: 'X' } },
                        y: { title: { display: true, text: 'Y' } }
                    }
                }
            });
        };

        if (graph.table) {
            const tableContainer = document.createElement('div');
            tableContainer.className = 'table-responsive mt-5';
            tableContainer.innerHTML = `<h3 class="text-center">${graph.title} - Tabla de Datos</h3>`;

            const table = document.createElement('table');
            table.className = 'table table-striped table-bordered';

            const headers = Object.keys(graph.table);
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header.toUpperCase();
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            const rowCount = graph.table[headers[0]].length;
            for (let i = 0; i < rowCount; i++) {
                const row = document.createElement('tr');
                headers.forEach(header => {
                    const cell = document.createElement('td');
                    cell.textContent = graph.table[header][i].toFixed(2);
                    row.appendChild(cell);
                });
                tbody.appendChild(row);
            }
            table.appendChild(tbody);

            tableContainer.appendChild(table);
            chartsContainer.appendChild(tableContainer);
        };

        if(graph.type === 'tree') {
            const treeContainer = document.createElement('div');
            treeContainer.className = 'mt-5';
            treeContainer.style = 'height: 350px;';
            treeContainer.innerHTML = `<h3 class="text-center">${graph.title}</h3><div id="tree${index}" style="height: 100%;"></div>`;
            chartsContainer.appendChild(treeContainer);

            const parseDot = vis.parseDOTNetwork(graph.dot);
            const data = {
                nodes: parseDot.nodes,
                edges: parseDot.edges
            };
            const options = {
                layout: {
                    hierarchical: {
                        levelSeparation: 100,
                        nodeSpacing: 100,
                        parentCentralization: true,
                        direction: 'UD',
                        sortMethod: 'directed'
                    }
                }
            };
            const network = new vis.Network(document.getElementById(`tree${index}`), data, options);
        }
    });

    if (graphData.table) {
        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-responsive mt-5';

        const table = document.createElement('table');
        table.className = 'table table-striped table-bordered';

        const headers = Object.keys(graphData.table);
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header.toUpperCase();
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        const rowCount = graphData.table[headers[0]].length;
        for (let i = 0; i < rowCount; i++) {
            const row = document.createElement('tr');
            headers.forEach(header => {
                const cell = document.createElement('td');
                cell.textContent = JSON.stringify(graphData.table[header][i]);
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        }
        table.appendChild(tbody);

        tableContainer.appendChild(table);
        
        chartsContainer.appendChild(tableContainer);
    }
} else {
    alert("No hay datos para graficar");
}