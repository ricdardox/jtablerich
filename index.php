<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title></title>
        <link href="css/jTableRich.css" type="text/css" media="all" rel="stylesheet"/>

        <script src="js/jquery-1.8.2.js.js"></script> 
        <script src="js/jTableRich.js"></script> 
        <script>
            $().escuchadorClicBotones(
            function(campoUnico,boton)
            {
                alert(campoUnico);
                alert(boton);
            });
            $().jTableRich('php/test.php', '#table','REGISTRO DE DE PRUEBA PARA LA TABLA');
            
        </script>
        <style>
            #table{     
              height: 500px; 
            }
            
        </style>
    </head>
    <body>
        <div id="table"> 
        </div>

    </body>
</html>

<?php 
