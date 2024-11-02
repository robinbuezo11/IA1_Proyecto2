async function execKMeans() {
    try {
        const data = await parseCSV();

        const col1 = document.getElementById('kmeansCol').value;

        if (!data[0].hasOwnProperty(col1)) {
            throw 'La columna seleccionada no existe en el archivo';
        }

        const col1Data = data.map(row => parseInt(row[col1], 10));

        const k = parseInt(document.getElementById('kmeansK').value, 10);
        const iterations = parseInt(document.getElementById('kmeansIter').value, 10);

        if (col1Data.length < k) {
            throw 'El número de clusters debe ser menor al número de datos';
        }

        const kmeans = new LinearKMeans(k, col1Data);
        const clusterized = kmeans.clusterize(k, col1Data, iterations);

        let clusters = new Set([...clusterized.map(c => c[1])]);

        clusters = Array.from(clusters);

        clusters.forEach((cluster, i) => {
            clusters[i] = [cluster, "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })];
        });

        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(function () { drawChart(clusters) });

        function drawChart(clusters) {
            var graph_data = new google.visualization.DataTable();
            graph_data.addColumn('number', 'X')
            graph_data.addColumn('number', 'Y')
            graph_data.addColumn({ type: 'string', role: 'style' });
            let a = clusterized.map(e => [e[0], 0, `point { size: 7; shape-type: diamond; fill-color: ${clusters[clusters.findIndex(a => a[0] == e[1])][1]}}`])

            graph_data.addRows(a)

            clusters.forEach(c => {
                graph_data.addRow([c[0], 0, `point { size: 3; shape-type: square; fill-color: #ff0000`])
            });



            var options = {
                title: 'Puntos',
                seriesType: 'scatter',
                series: { 1: { type: 'line' } },
                hAxis: { title: 'X', minValue: 0, maxValue: Math.max(this.data) + 10 },
                yAxis: { title: 'Y', minValue: 0, maxValue: 5 },
                legend: 'none'
            };

            const chartDiv = document.createElement('div');
            chartDiv.id = 'chart_div';
            chartDiv.style.width = '900px';
            chartDiv.style.height = '500px';
            document.getElementById('results').innerHTML = '';
            document.getElementById('results').appendChild(chartDiv);
            var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

            chart.draw(graph_data, options);
        }
    } catch (error) {
        alert(error);
    }
}