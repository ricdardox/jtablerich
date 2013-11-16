/*
 *JTableRich es una tabla que se carga dinamicamente con los datos proporcionados
 *de consltas sql ejecutadas desde php.
 *Es necesario jquery version 1.7 en adelante.
 *Desarrollado por: 
 *@autor Ricardo Jose Montes Rodriguez correo:ricardomontesrodriguez@gmail.com
 */

var config = {
    //ESTOS SON LOS PARAMETROS EDITABLES, EDITE SEGUN LA NECESIDAD
    menuBarVisible: {
        clicRow: true, //HABILITA EL SELECCIONADO DE LA FILA CUANDO SE PRESIONA CLIC SOBRE ESTA
        menuBar: true, //MUESTRA BARRA DE MENU 
        nav: true, //MUESTRA LOS CONTROLES DE NAVEGACION DE LA TABLA
        totalReg: true, // MUESTRA EL NUMERO DE REGISTROS QUE DEVULVE LA CONSULTA Y EL DE LA PAGINA ACTUAL
        numRegistrosPorPagina: true, // MUESTRA EL NUMERO DE PAGINAS QUE HAY Y LA PAGINA ACTUAL
        orderClickHeader: true, //HABILITA QUE SE MUESTREN ORDENADOS LOS REGISTROS CUANDO SE LE DE CLIC SOBRE EL CAMPO(TITULO) Y LO ORDENA POR ESTE CRITERIO(EL CANCABEZDO DE LA COLUMNA)
        search: true, //PERMITEMOSTRAR EL MODULO DE BUSQUEDA EN LA BARRA DE HERRAMIENTAS  
        buttons: true//MUESTRA LOS BOTONES QUE PERMITEN HACER LA BUSQUEDA EN LA TABLA POR LOS DIFERENTES CRITERIOS       buttons:true //MUESTRA LOS BOTONES LOS CUALES SON LOS QUE SE TOMAN LA DE LA VARIABLE menuBarTextOptions en el item buttons
    },
    //ESTOS SON LOS PARAMETROS EDITABLES, EDITE SEGUN LA NECESIDAD
    menuBarTextOptions: {
        textTotalReg: 'registros',
        paginas: 'Pag',
        ultimaPagina: 'Ir a ultima pagina',
        primeraPagina: 'Ir a primera pagina',
        siguientePagina: 'Ir a la pagina siguiente',
        anteriorPagina: 'Ir a la pagina anterior',
        recargarPagina: 'Recargar pagina',
        numeroRegistros: 'Numero de registros por pagina',
        textoBuscar: 'Buscar por:',
        buscarPagina: 'Presione para ocultar o mostrar el modulo de busqueda',
        buttons: {
            procesar: 'Procesar'
        }
    },
    //ESTOS SON LOS PARAMETROS EDITABLES, EDITE SEGUN LA NECESIDAD
    elemento: '', //es el elemento en elcual se va a mostrar la tabla
    titleTable: '', // es el titulo que va a contener la tabla
    url: '', // es la url del archivo php que rotorna el json con la informacion para alimentar la tabla
    numReg: 10, // numero de registros que se desea empezar a mostrar inicialmente
    registrosAMostrar: [1, 2, 3, 5, 7, 8, 9, 10, 20, 30], // contiene la lista de los registros que se desean mostrar en la pagina segun escoja el usuario
    campoOrden: 1, //es el campo por el cual se desear ordenar los registros devueltos por la consulta
    tipoOrden: 'asc', // es el orden en que se quiere los registros devueltos por la consulta asc o desc



    //NO EDITE ESTOS PARAMETROS YA QUE POSEEN LOS VALORES PREDETERMINADOS PARA EL FUNCIONAMIENTO DE LA TABLA
    paginaInicio: 0, //es el inicio desde donde se va a empezar a mostrar los registros, es decir el valor que va a tomar el offset en la consulta
    numTotalReg: 0, // son todos los registros que contiene la tabla de la relacion devuelta por la consulta 
    numRegPaginaActual: 0, // almacena el numero de registros de la pagina actual, ya que estos pueden ser diferentes a lo que se esten mostrando, ejemplo se muestran 10 registros por pagina pero no hay 10 si no 5 entonces se almacena 5 en la variable
    numPaginas: 1, //almacena el numero de pagianas segun el numero de registros que se esten mostrarndo
    pagActual: 1, //almacena la pagina actual 






    /*
     *Permite evaluar una variable para ver si esta definida o no
     *@param variable es la variable que se desea evaluar
     */
    definido: function(variable) {
        if (typeof variable === "undefined")
        {
            return false;
        }
        else {
            return true;
        }  },
    /*
     *Permite cargar los controles de navegacion siguiente anterior y los registros que se muestran 
     *en cada pagina visualizada 
     */
    navegacion: function() {


        var homeCell = $('<div class="richCell"></div>');
        var homePage = $('<div title="' + config.menuBarTextOptions.primeraPagina + '" class="richHome"></div>');
        homeCell.append(homePage);

        var endCell = $('<div class="richCell"></div>');
        var endPage = $('<div title="' + config.menuBarTextOptions.ultimaPagina + '" class="richEnd"></div>');
        endCell.append(endPage);

        var backCell = $('<div  class="richCell"></div>');
        var backPage = $('<div title="' + config.menuBarTextOptions.anteriorPagina + '" class="richBack"></div>');
        backCell.append(backPage);

        var nextCell = $('<div class="richCell"></div>');
        var nextPage = $('<div title="' + config.menuBarTextOptions.siguientePagina + '" class="richNext"></div>');
        nextCell.append(nextPage);

        homePage.on('click', function() {
            if (config.pagActual > 1) {
                config.paginaInicio = 0;
                config.pagActual = 1;
                $().searchData();
            }
        });
        endPage.on('click', function() {
            if (config.pagActual < config.numPaginas) {
                config.paginaInicio = parseInt(config.numPaginas) * parseInt(config.numReg) - parseInt(config.numReg);
                config.pagActual = config.numPaginas;
                $().searchData();
            }

        });

        backPage.on('click', function() {
            if (config.paginaInicio > 0) {
                config.paginaInicio = parseInt(config.paginaInicio) - parseInt(config.numReg);
                config.pagActual = parseInt(config.pagActual) - 1;
                $().searchData();
            }
        });
        nextPage.on('click', function() {
            config.numPaginas = parseInt((parseFloat(config.numTotalReg / config.numReg) + 0.9));
            if (config.pagActual < config.numPaginas) {
                config.paginaInicio = parseInt(config.paginaInicio) + parseInt(config.numReg);
                config.pagActual = parseInt(config.pagActual) + 1;
                $().searchData();
            }


        });




        return [homeCell, backCell, config.paginaActual(), nextCell, endCell];
    },
    /*
     *Crear un objeto jquery celda con el total de registros de la consulta php 
     *@return retorna un objeto jquery que es una celda con los datos del total de registros y los registros de la pagina actual
     */
    totalRegistos: function() {
        var totalRegCell = $('<div class="richCell"></div>');
        var totalRegUl = config.numRegPaginaActual + ' de ' + config.numTotalReg + ' ' + config.menuBarTextOptions.textTotalReg;
        totalRegCell.text(totalRegUl);
        return totalRegCell;
    },
    /*
     *Muestra la informacion del numero paginas y la pagina actual
     **@return retorna un objeto jquery que es una celda con los datos de la pagina acutual y el total de registros
     */
    paginaActual: function() {
        return $('<div class="richCell"> ' + config.menuBarTextOptions.paginas + ' ' + config.pagActual + ' de ' + config.numPaginas + ' </div>');
    },
    /*
     *Verifica si el orden  en que se estan mostrando los regisros es descendenteo o ascendente
     **@return retorna verdadero si es ascendente de lo contrario retorna falso
     */
    verificarOrden: function() {
        if (config.tipoOrden === "asc")
        {
            return true;
        }
        else {

            return false;
        }
    },
    /*
     *Cambia el orden de los registros cuando se presiona click sobre un campo de la cabecera de la tabla
     */
    ordenClic: function() {
        $('.richHeader .richCell').live('click', function() {

            if (config.definido(config.menuBarVisible.orderClickHeader) && config.menuBarVisible.orderClickHeader)
            {
                config.campoOrden = parseInt($(this).index('.richCell')) + 1;

                if (config.verificarOrden())
                {
                    config.tipoOrden = "desc";
                }
                else {
                    config.tipoOrden = "asc";
                }

                $().searchData();
            }
        });

    },
    /*
     *Permite mostrar los controles de navegacion ya cargados
     *@param menuBar es el objeto jquery que se refiere a la barra de menu donde se desea mostrar los controles
     */
    mostrarNav: function(menuBar) {

        var recargarCell = $('<div class="richCell"></div>');
        var recargar = $('<div title="' + config.menuBarTextOptions.recargarPagina + '" id="loading" class="richReload"></div>');
        recargarCell.append(recargar);

        menuBar.append(recargarCell);
        $.each(config.navegacion(), function(i, vec) {
            menuBar.append(vec);
        });
        recargar.on('click', function() {
            $().searchData();
        });
    },
    /*
     *Permite mostrar la barra de navegacion la cual es el menuBar
     *@param data son los datos que devuelve el json de la consulta php
     *@param menuBar es el objeto jquery que se refiere a la barra de menu donde se desea mostrar los controles
     *@param elem es el elemento que contiene toda la tabla 
     */
    mostrarMenuBar: function(data, menuBar, elem) {
        config.numTotalReg = data.totalRegistros;
        config.numRegPaginaActual = data.totalPaginaActual;

        elem.append(menuBar);
        var div = (parseFloat(config.numTotalReg / config.numReg));
        if (div > parseInt(div)) {
            div = parseInt(div) + 1;
        }
        config.numPaginas = div === 0 ? 1 : div;

    },
    /*
     *Permite mostrar el numero de registros de la consulta y el numero de registros por pagina
     *@param data son los datos que devuelve el json de la consulta php
     *@param menuBar es el objeto jquery que se refiere a la barra de menu donde se desea mostrar los controles
     */
    mostrarNumRegistros: function(data, menuBar) {
        config.numTotalReg = data.totalRegistros;
        config.numRegPaginaActual = data.totalPaginaActual;
        menuBar.append(config.totalRegistos());
    },
    /*
     *Permite mostrar el el select para escoger el numero de registros por pagina que a devolver la consulta
     *@param data son los datos que devuelve el json de la consulta php
     *@param menuBar es el objeto jquery que se refiere a la barra de menu donde se desea mostrar los controles
     */
    mostrarNumRegistrosPorPaginas: function(menuBar) {
        var registrosAMostrar = $('<select title="' + config.menuBarTextOptions.numeroRegistros + '" ></select>');
        var opciones = $('<div  class="richCell"></div>');

        $.each(config.registrosAMostrar, function(i, vec) {
            registrosAMostrar.append('<option value="' + vec + '">' + vec + '</option>');
        });
        opciones.append(registrosAMostrar);
        registrosAMostrar.val(config.numReg);
        registrosAMostrar.on('change', function() {
            config.pagActual = 1;
            config.paginaInicio = 0;
            config.numReg = $(this).val();
            $().searchData();


        });
        menuBar.append(opciones);

    },
    /*Esta funcion se ejecuta cuando se presiona click sobre los botones de la barra de navegacion
     *@param data son los datos que devuelve el json de la consulta php
     *@param menuBar es el objeto jquery que se refiere a la barra de menu donde se desea mostrar los controles
     */
    eventoBotones: function(campoUnico, boton) {
        //sobre escribir esta funcion para darle un comportamiento diferente 
    },
    /*Permite mostrar los botones en la barra de navegacion para realizar acciones 
     *@param menuBar es el objeto jquery que se refiere a la barra de menu donde se desea mostrar los controles
     *@param uniquePos es el valor del campo con el se referencia el registro seleccionado como unico
     */
    mostrarBotones: function(menuBar, uniquePos) {
        var botones = [];
        var indice = 0;
        $.each(config.menuBarTextOptions.buttons, function(nombre, valor) {
            var cell = $('<div class="richCell"></div>');
            var button = $('<button>' + valor + '</button>');
            button.on('click', function() {
                config.eventoBotones($('#richRowSelected :nth-child(' + uniquePos + ')').text(), valor);
            });
            cell.append(button);
            botones[indice] = cell;
            indice++;
        });
        menuBar.append(botones);
    },
    /*
     *Permite crear  el modulo para implementar la busqueda en la tabla por los direntes criterios
     *@param data son los datos que devuelve el json de la consulta php
     *@param menuBar es el objeto jquery que se refiere a la barra de menu donde se desea mostrar los controles
     */
    mostrarBusqueda: function(data, menuBar, searchBar) {
        var textCellSearch = $('<div class="richCell">' + config.menuBarTextOptions.textoBuscar + '</div>');
        var cellSearchSelect = $('<div class="richCell"></div>');
        var cellSearchField = $('<div class="richCell"></div>');
        var field = $('<input type="text" id="richSearch" />');
        cellSearchField.append(field);
        var select = $('<select></select>');
        $.each(data.encabezado, function(i, vec) {
            select.append('<option value="' + vec + '">' + vec + '</option>');
        });


        cellSearchField.on('keydown', function(key) {
            
            if (key.which === 13) {
                var todos = $(".jTableRich .richContent");
                if (field.val() === '')
                {
                    todos.show();
                    config.numRegPaginaActual = todos.length;
                    field.css('background', '#f3f3f3');
                }
                else {
                    var encontro = false;
                    var numEncontrados = 0;
                    $.each($(".jTableRich .richContent"), function(i) {
                        $.each($(this).children('.richCell'), function(j) {
                            if ($(this).data('nombreHeader') === (select.val())) {
                                if (parseInt(($(this).text().toLowerCase()).indexOf(field.val().toLowerCase())) === 0)
                                {
                                    numEncontrados++;
                                    encontro = true;
                                    $(this).parent().show();
                                }
                                else {
                                    $(this).parent().hide();
                                }

                            }
                        });


                    });
                    if (!encontro) {
                        todos.show();
                        field.css('background', '#fddcd2');
                    } else {
                        field.css('background', ' #f0fdd2');
                        config.numRegPaginaActual = numEncontrados;
                    }

                }
                $('#richTotalRegistros').html(config.totalRegistos());
            }
            else if (field.val() === '')
            {
                field.css('background', '#f3f3f3');
            }
        });

        var iconSearch = $('<div title="' + config.menuBarTextOptions.buscarPagina + '" class="richSearch"></div>');
        iconSearch.on('click', function() {
            if (searchBar.css('display') === 'block')
            {
                searchBar.fadeOut('slow');
            }
            else {
                searchBar.fadeIn('slow');
            }
        });
        var celdaSearch = $('<div class="richCell"></div>');
        celdaSearch.append(iconSearch);
        menuBar.append(celdaSearch);

        cellSearchSelect.append(select);
        searchBar.append(textCellSearch);
        searchBar.append(cellSearchSelect);
        searchBar.append(cellSearchField);
    }



};

/*
 *Crea la tabla con los campos de la base de datos y los modulos que se desean activar
 *@param data es el json devuelto por el archvo php
 *@param config es un json con los modulos que se desean activar de la tabla
 */
jQuery.fn.jtableRichData = function(data) {
    var tabla = $('<div class="jTableRich"><div>');
    var tituloTabla = $('<div class="richTitleTable">' + config.titleTable + '</div>');
    tabla.append(tituloTabla);
    var encabezado = $('<div class="richHeader"></div>');
    var atributo = 'richDown';
    var indice = 1;
    tituloTabla.append('<div style="float:right" class="jTableRichIcon"></div>');
    $.each(data.encabezado, function(i) {
        var cellHeader = $('<div class="richCell">' + data.encabezado[i] + '</div>');

        if (indice === parseInt(config.campoOrden)) {
            if (config.verificarOrden()) {
                atributo = 'richUp';
            }
            cellHeader.attr('id', atributo);
            encabezado.append(cellHeader);
        } else {
            encabezado.append(cellHeader);
        }
        indice++;
    });
    tabla.append(encabezado);
    $.each(data.contenido, function(i) {
        var fila = $('<div class="richRow richContent"></div>');


        $.each(data.encabezado, function(j) {
            var cellContent = $('<div class="richCell">' + data.contenido[i][data.encabezado[j]] + '</div>');
            cellContent.data('nombreHeader', data.encabezado[j]);
            fila.append(cellContent);
        });
        tabla.append(fila);
    });
    $(this).append(tabla);
    if (config.definido(config.menuBarVisible.menuBar) && config.menuBarVisible.menuBar) {
        var menuBar = $('<div class="richMenuBar" ></div>');
        menuBar.width($('.richRow').width());
        var searchBar = $('<div style="display:none"  class="richMenuBar"></div>');
        searchBar.width($('.richRow').width());
        $(this).append(searchBar);

        if (config.definido(config.menuBarVisible.search)) {
            if (config.menuBarVisible.search) {
                config.mostrarBusqueda(data, menuBar, searchBar);
            }
        } else {
            config.mostrarBusqueda(data, menuBar, searchBar);
        }


        config.mostrarMenuBar(data, menuBar, $(this));
        if (config.definido(config.menuBarVisible.totalReg)) {
            if (config.menuBarVisible.totalReg) {
                config.mostrarNumRegistros(data, menuBar);
            }
        } else {
            config.mostrarNumRegistros(data, menuBar);
        }
        if (config.definido(config.menuBarVisible.numRegistrosPorPagina)) {
            if (config.menuBarVisible.numRegistrosPorPagina) {
                config.mostrarNumRegistrosPorPaginas(menuBar);
            }
        } else {
            config.mostrarNumRegistrosPorPaginas(menuBar);
        }
        if (config.definido(config.menuBarVisible.nav)) {
            if (config.menuBarVisible.nav) {
                config.mostrarNav(menuBar);
            }
        } else {
            config.mostrarNav(menuBar);
        }
        if (config.definido(config.menuBarVisible.buttons)) {
            if (config.menuBarVisible.buttons) {
                config.mostrarBotones(menuBar, data.uniquePos);
            }
        } else {
            config.mostrarBotones(menuBar, data.uniquePos);
        }

    }
    if (config.definido(config.menuBarVisible.clicRow) && config.menuBarVisible.clicRow) {
        $('.richRow').jtableRichClickRow('#richRowSelected');
    }
};


/*
 *Permite seleccionar una fila de la tabla cuando a esta se le da clic
 *@param idSeleccionado es el selector id el cual tendra la fila seleccionada 
 */
jQuery.fn.jtableRichClickRow = function(idSeleccionado) {

    $(this).on('click', function() {

        var id = idSeleccionado.substring(1);
        if ($(this).attr('id') === id) {
            $(this).removeAttr('id');
        }
        else {
            $(idSeleccionado).removeAttr('id');
            $(this).attr('id', id);
        }
    });
};


/*
 *Permite seleccionar una fila de la tabla cuando a esta se le da clic
 *@param rutaArchivo es la ruta del archivo php
 *@param opcionesTabla es un json con los modulos que se desean activar de la tabla
 *@param selector es el selector de la tabla al cual se de sea cargar con la informacion de la consulta php
 *
 */
jQuery.fn.searchData = function() {
    $('#loading').addClass('loading');
    $(config.elemento).css('cursor', 'progress');
    $.ajax({
        url: config.url,
        data: {
            pagInicio: config.paginaInicio,
            numRegistros: config.numReg,
            campoOrden: config.campoOrden,
            tipoOrden: config.tipoOrden
        },
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            $(config.elemento).css('cursor', 'default');
            $(config.elemento).html('');
            $('#loading').removeClass('loadding');
            $(config.elemento).jtableRichData(data);

        },
        error: function() {

            console.log('Error al cargar los registros.');

        },
        statusCode: {
            404: function() {
                console.log('no exite la pagina');
            },
            500: function() {
                console.log('Error en el servidor');
            },
            408: function() {
                console.log('tiempo agotado');
            }
        }
    });

};

jQuery.fn.jTableRich = function(url, elemento, titulotabla) {
    config.url = url;
    config.elemento = elemento;
    config.titleTable = titulotabla;
    $(function() {
        $().searchData();
        config.ordenClic();
    });
};


jQuery.fn.escuchadorClicBotones = function(funcion) {
    config.eventoBotones = funcion;
}

$(function() {
    $(window).resize(function() {
        $('.jTableRich').width($(this).width());
        $('.richMenuBar').width($('.richRow').width());
    });
    $(config.elemento).scroll(function() {
        $('.richMenuBar').width($('.richRow').width());
    });
})