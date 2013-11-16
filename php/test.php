<?php

require_once 'Conexion.php';
$conexion = new Conexion();

$inicio = $_POST['pagInicio'];
$limite = $_POST['numRegistros'];
$campoOrdenar = $_POST['campoOrden'];
$tipoOrden = $_POST['tipoOrden'];

if (isset($campoOrdenar) && isset($tipoOrden)) {
    $order = "order by $campoOrdenar $tipoOrden";
} else {
    $order = "";
}

$TABLABD="ofertas";
$result = $conexion->ejecutarSentencia("SELECT *  FROM $TABLABD $order LIMIT $limite OFFSET $inicio ");
$resultTotal = $conexion->ejecutarSentencia("SELECT *  FROM $TABLABD");

$encabezado = [];
$tiposDatos = [];


for ($i = 0; $i < pg_num_fields($result); $i++) {
    $campo = pg_field_name($result, $i);
    $encabezado[] = $campo;
    $tiposDatos[] = pg_field_type($result, $i);
}


$contenido = array();
while ($iter = pg_fetch_assoc($result)) {
    $contenido[] = $iter;
}
//"tiposDatos" => $tiposDatos, 
$datos = ["uniquePos" => 1, "encabezado" => $encabezado, "contenido" => $contenido, "totalRegistros" => pg_num_rows($resultTotal), "totalPaginaActual" => pg_num_rows($result)];

echo json_encode($datos);
?>
