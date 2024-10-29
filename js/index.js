document.onload = updateParams();

document.getElementById('objetivo').addEventListener('change', function () {
    updateParams();
});

function updateParams() {
    const objetivo = document.getElementById('objetivo').value;
    document.getElementById('paramClasificacion').style.display = objetivo === 'clasificacion' ? 'block' : 'none';
    document.getElementById('paramPrediccion').style.display = objetivo === 'prediccion' ? 'block' : 'none';
    document.getElementById('paramSupervisado').style.display = (objetivo === 'clasificacion' || objetivo === 'prediccion') ? 'block' : 'none';
}