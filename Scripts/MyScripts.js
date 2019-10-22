//Hide search input from datatables

var officeList;
var questionList;
var categoryList;
var questionNextElementList;
var outputTypeList;
var selectedOutcomeType;
var tableDiagramDOM;
var tableResultsDOM;
var tableOffice;
var tableDiagram;
var tableElement;
var tableOutcome;
var tableResults;
var diagramItemKey = 'diagrama';
var elementItemKey = 'elemento';
var outcomeItemKey = 'salida'
var selectedDiagramItem;
var selectedElementItem;
var selectedOutcomeItem;
var selectedRowDiagram;
var selectedRowElement;
var selectedRowOutcome;
var selectedElementType = "Pregunta";
var selectedEntity = "selectedEntity";
var selectedOffices;
var addOperation = "add";
var editOperation = "edit"
var deleteOperation = "delete";
var barSeparator = ' | ';
var dataResults = [];

$(document).ready(function () 
{
    loadDiagramDataTables(diagramItemKey)
    loadElementDataTables()
    loadOutcomeDataTables()
    loadOfficeDataTables()

    modifyTables()

    onChangeElementType()
    onClickTableDiagram()
    onClickTableElement()
    onClickTableOutcome()
    
    addDiagram()
    addElement()
    addOutcome()

    editDiagram()
    editElement()
    editOutcome()

    savingFunctions()
    editingFunctions()
    deleteEntity()
    
    onRun()
    setDropDownForExpression()
    viewNotificationMessages()
    closeModal()

    //$('#showResults').click(function()
    //{
    //    debugger
    //    alert('e')
       
    //});
    

});

function closeModal(){
    $(".closeModal").click(function()
    {
        var tbody = $(this).parents("div").find("tbody") 
        if(typeof tbody != "undefined")
        {
            tbody.children("tr").removeClass("selected")
            
        }
        hideAndResetModals(getForm(this))
    })
}

function clearValidation(formElement){
    debugger
    //Internal $.validator is exposed through $(form).validate()
    var validator = $(formElement).validate();
    
    if (typeof validator != 'undefined')
    {
        //Iterate through named elements inside of the form, and mark them as error free
        $('[name]',formElement).each(function(){
            validator.successList.push(this);//mark as error free
            validator.showErrors();//remove error messages if present
        });
        validator.resetForm();//remove error class on name elements and clear history
        validator.reset();//remove all error and success data
    }
   
}

function setDropDownForExpression()
{

    $("#ExpressionTypes").select2({
        maximumSelectionLength: 10,
        width: 570
    })
    .on("select2:select", function(e) { 
        
        var selected = $("#ExpressionTypes").select2('data')[0];
        $("#ExpressionTypesDiv").children().hide();
        switch(selected.id)
        {
            case "1":
                $("#NumericValueDiv").show();
                $("#NumericValueDiv").removeClass('hidden');
                
                
                break;
            case "2":
                $("#AphabeticValueDiv").show();
                $("#AphabeticValueDiv").removeClass('hidden');
                break;
            case "3":
                $("#ComparisonDiv").show();
                $("#ComparisonDiv").removeClass('hidden');
                break;
            case "4":
                $("#RangeDiv").show();
                $("#RangeDiv").removeClass('hidden');
                break;
            default:
                notifyMessage("Debe seleccionar un tipo de expresión");
                break;
        }
        
       
    });
}

function reloadTableByEntity(selectedEntity)
{
    debugger
    switch (selectedEntity)
    {
        case "diagrama":

            tableDiagram.ajax.reload()
            tableElement.ajax.reload()
            tableOutcome.ajax.reload()
            // onSelectedDiagram(tableDiagram.$('tbody tr.info'))

            break;

        case "elemento":
            tableElement.ajax.reload();
            tableOutcome.ajax.reload();
            //onSelectedElement()
            break;

        case "salida":
            tableOutcome.ajax.reload();
            //onSelectedOutcome()
            break;

        default:
            break;
    }
    //switchEntityFunction(selectedEntity, func)
    //onSelectedOutcome()
}

function switchEntityFunction(selectedEntity, func)
{
    switch (selectedEntity)
    {
        case "diagrama":
            func()
            break;
        case "elemento":
            func()
            break;
        case "salida":
            func()
            break;
        default:
            break;
    }
}

function onSelectedDiagram(tbodyTR)
{     
    if (tbodyTR.hasClass('info')) 
    {
        showRowUnselected(tbodyTR)
        selectedEntity = "";
        tableElement.column(':contains(IdDiagrama)').search(-1).draw();
        selectedRowDiagram = null;

    } else {
        //tableDiagram.$('tr.info').removeClass('info');
        //$(this).addClass('info');
        console.log("tableDiagramDOM click OOOOOOOOOOOOOOOOOOO");
        showRowSelected(tableDiagram,tbodyTR);
                
        selectedEntity = diagramItemKey;
        selectedRowDiagram = tableDiagram.row(tbodyTR).data();

        console.log("onSelectedDiagram - diagramItemKey : "+ diagramItemKey);
        console.log("onSelectedDiagram - window[selectedEntity] : "+ selectedEntity);
            
        //filterTable(tableElement, selectedRowDiagram, IdDiagrama)
        //  IMPLEMENT METHOD
        if(tableElement != null && selectedRowDiagram != null)
        {
            tableElement.column(':contains('+'IdDiagrama'+')').search(selectedRowDiagram.Id).draw();
        }
    }
}

function onSelectedElement(tbodyTR)
{       
    if (tbodyTR.hasClass('info')) 
    {
        showRowUnselected(tbodyTR)
        selectedEntity = "";
        selectedRowElement = null;
        tableOutcome.column(':contains(idElement)').search(-1).draw();
    } 
    else 
    {
        showRowSelected(tableElement, tbodyTR);
        selectedEntity = elementItemKey;
        selectedRowElement = tableElement.row(tbodyTR).data();

        if(tableOutcome != null)
        {
            tableOutcome.column(':contains(idElement)').search(selectedRowElement.Id).draw();
        }
    }  
}

function onClickTableDiagram()
{
    $(tableDiagramDOM).on('click', ' tbody tr', function () 
    {
        onSelectedDiagram($(this))
    });
}

function onClickTableOutcome()
{
    $(tableOutcomeDOM).on('click', ' tbody tr', function () 
    {
        onSelectedOutcome($(this))        
    });
}

function onSelectedOutcome(tbodyTR)
{   
    console.log("tableOutcomeDOM click");
       
    if (tbodyTR.hasClass('info')) 
    {
        showRowUnselected(tbodyTR)
        selectedEntity = ""
        selectedRowOutcome = null

    } else {
        showRowSelected(tableOutcome, tbodyTR);
        selectedEntity = outcomeItemKey; 
        selectedRowOutcome = tableOutcome.row(tbodyTR).data();
    }
        
    /* WIll be used
    var isTableEmpty = $("#DiagramsTable tbody tr td").hasClass('dataTables_empty');
    if (isTableEmpty == true) {
    }
    else if (isTableEmpty == false) {
        $("#DiagramsTable tbody tr").addClass("selected");
    }
    */
}

function showRowSelected(table, tbodyTR)
{
    table.$('tr.info').removeClass('info');
    tbodyTR.addClass('info');
}

function showRowUnselected(tbodyTR)
{
    tbodyTR.removeClass('info');
}

function filterTable(table, selectedRow, columnToFilter)
{
    if(tableElement != null && selectedRowDiagram != null)
    {
        tableElement.column(':contains('+'IdDiagrama'+')').search(selectedRowDiagram.Id).draw();
    }
}

function onClickTableElement()
{
    $(tableElementDOM).on('click', ' tbody tr', function () 
    {
        onSelectedElement($(this))
    });
}

function addDiagram()
{
    $("#createDiagramButton").click( function() 
    {
        prepareDiagramDialog(diagramItemKey, addOperation)
    })
}

function editDiagram()
{
    $("#editDiagramButton").click( function() 
    {
        if(selectedRowDiagram == null)
        {
            notifyMessage("Debe seleccionar un " + diagramItemKey)
        } else {
            prepareDiagramDialog(diagramItemKey, editOperation, selectedRowDiagram)
        } 
        
    });
}

function addElement()
{
    $("#createElementButton").click( function() 
    {
        debugger
        if(selectedRowDiagram == null)
        {
            notifyMessage("Debe seleccionar un " + diagramItemKey)
        }
        else
        {
            prepareElementDialog(diagramItemKey, selectedRowDiagram, addOperation)
            $("#createElementModal").modal('show')
        }
    })
}

function editElement()
{
    $("#editElementButton").click( function() 
    {
        debugger
        if(selectedRowDiagram == null || selectedEntity == "" )
        {
            notifyMessage("Debe seleccionar un " + elementItemKey);
        }
        else if(selectedRowElement == null)
        {
            notifyMessage("Debe seleccionar un " + elementItemKey + " para poder editarlo.");
        } else {
            prepareElementDialog(diagramItemKey, selectedRowElement, editOperation)
        } 
    });
}

function addOutcome()
{
    $("#createOutcomeButton").click( function() {
        debugger
        if(selectedRowElement == null)
        {
            notifyMessage("Debe seleccionar un " + elementItemKey)
        }
        else {
            prepareOutcomeDialog(elementItemKey, selectedRowElement, addOperation)
            $("#createOutcomeModal").modal('show')
        }
    })
}

function editOutcome()
{
    $("#editOutcomeButton").click( function() {
        debugger
        console.log(elementItemKey);
        if(selectedRowElement == null)
        {
            notifyMessage("Debe seleccionar un " + elementItemKey)           
        }  
        else if(selectedRowOutcome == null) 
        {
            notifyMessage("Debe seleccionar un " + outcomeItemKey) 
        } else {
            prepareOutcomeDialog(elementItemKey, selectedRowElement, editOperation)
            $("#createOutcomeModal").modal('show');
        }
    });
}

function onChangeElementType()
{
    $("#elementTypeRadioButtonDiv label input").change(function () {
        $("#inputSearchElement").val('');
        selectedElementType = $(this).attr("value");
        $("#inputSearchElement").attr("name",selectedElementType);        
        $("#inputSearchElement").attr("placeholder", "Escriba " +selectedElementType);
        debugger
        switch(selectedElementType)
        {
            case "Pregunta":
                searchElement("#formularioCreateElement", "Question", "SearchQuestion", "Pregunta");
                break;
            case "Categoria":
                searchElement("#formularioCreateElement", "Question", "SearchCategory", "Categoria");
                break;
            case "Resultado":
                searchElement("#formularioCreateElement", "Question", "SearchResult", "Resultado");
                break;
            case "Diagrama":
                searchElement("#formularioCreateElement", "Diagram", "SearchDiagram", "Diagrama");
                break;
        }
    });
}

function modifyTables()
{
    var inputSearch = $('#elementsTable_filter').find('input');
    $("#DiagramsTable_filter").find("label").hide(); 
    $("#elementsTable_filter").find("label").hide(); 
    $("#outcomesTable_filter").find("label").hide(); 
    
    $("#idComparisonOperator").addClass('form-control OneThirdWidth');
    $("#idFirstComparisonOperator").addClass('form-control OneFithWidth');
    $("#idSecondComparisonOperator").addClass('form-control OneFithWidth');

    tableElement.column(':contains(IdDiagrama)').search(-1).draw();
    tableOutcome.column(':contains(idElement)').search(-1).draw();
}

//  LOAD TABLE DATA

function loadDiagramDataTables(diagramItemKey)
{
    tableDiagramDOM = $('#DiagramsTable');
    tableDiagram = tableDiagramDOM.DataTable({
        paging: false,
        "searching": true,
        "scrollY":        "200px",
        "pageLength": 6,
        language: {
            sProcessing:     "Procesando...",
            sLengthMenu:     "Mostrar _MENU_ registros",
            sZeroRecords:    "No se encontraron resultados",
            sEmptyTable:     "Ningún dato disponible en esta tabla",
            sInfo:           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            sInfoEmpty:      "Mostrando registros del 0 al 0 de un total de 0 registros",
            sInfoFiltered:   "(filtrado de un total de _MAX_ registros)",
            sInfoPostFix:    "",
            sSearch:         "Buscar:",
            sUrl:            "",
            sInfoThousands:  ",",
            sLoadingRecords: "Cargando...",
            oPaginate: {
                sFirst:    "Primero",
                sLast:     "Último",
                sNext:     "Siguiente",
                sPrevious: "Anterior"
            },
            "oAria": {
                "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
        ajax: {
            url: "/Diagram/GetDiagramsJson",
            dataSrc: ''
        },
        columns: [
            { data: 'Id' },
            { data: 'Nombre' }
        ]
    });
    tableDiagram.column(':contains(Id)').visible(false);
}

function loadResultsDataTables(dataResults)
{
    tableResultsDOM = $('#ResultsMesaggesTable');
    tableResults = tableResultsDOM.DataTable({
        paging: false,
        "searching": true,
        "scrollY":        "200px",
        cache:false,
        "bAutoWidth": false, 
        "pageLength": 6,
        destroy: true,
        language: {
            sProcessing:     "Procesando...",
            sLengthMenu:     "Mostrar _MENU_ registros",
            sZeroRecords:    "No se encontraron resultados",
            sEmptyTable:     "Ningún dato disponible en esta tabla",
            sInfo:           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            sInfoEmpty:      "Mostrando registros del 0 al 0 de un total de 0 registros",
            sInfoFiltered:   "(filtrado de un total de _MAX_ registros)",
            sInfoPostFix:    "",
            sSearch:         "Buscar:",
            sUrl:            "",
            sInfoThousands:  ",",
            sLoadingRecords: "Cargando...",
            oPaginate: {
                sFirst:    "Primero",
                sLast:     "Último",
                sNext:     "Siguiente",
                sPrevious: "Anterior"
            },
            buttons: {
                copy: 'Copiar al portapapeles',
                excel: 'Excel',
                pdf: 'PDF',
                print: 'Imprimir'
            },
            "oAria": {
                "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataResults,
        columns: [
            { data: 'diagramID' },
            { data: 'diagramName'},
            { data: 'officeID'},
            { data: 'officeName' },
            { data: 'result'}
        ],
        dom: 'Bfrtip',
        buttons: [
           'copy', 'excel', 'pdf', 'print'
        ]
    });
    //tableResults.column(':contains(Id)').visible(false);
}

function loadElementDataTables()
{
    tableElementDOM = $('#elementsTable');    
    tableElement = tableElementDOM.DataTable({
        paging: false,
        select: true,
        "pageLength": 6,
        "scrollY": "200px",
        language: {
            sProcessing:     "Procesando...",
            sLengthMenu:     "Mostrar _MENU_ registros",
            sZeroRecords:    "No se encontraron resultados",
            sEmptyTable:     "Ningún dato disponible en esta tabla",
            sInfo:           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            sInfoEmpty:      "Mostrando registros del 0 al 0 de un total de 0 registros",
            sInfoFiltered:   "(filtrado de un total de _MAX_ registros)",
            sInfoPostFix:    "",
            sSearch:         "Buscar:",
            sUrl:            "",
            sInfoThousands:  ",",
            sLoadingRecords: "Cargando...",
            oPaginate: {
                sFirst:    "Primero",
                sLast:     "Último",
                sNext:     "Siguiente",
                sPrevious: "Anterior"
            },
            "oAria": {
                "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
        ajax: {
            url: "/Element/GetElementsJson",
            dataSrc: ''
        },
        columns: [
    { data: 'Id' },
    { data: 'IdDiagrama' },
    { data: 'Diagrama' },
    { data: 'Pregunta' }
        ]
    });
    tableElement.column(':contains(Id)').visible(true);
    tableElement.column(':contains(IdDiagrama)').visible(false);
    tableElement.column(2).visible(false);
    onChangeElementType();
}

function loadOutcomeDataTables()
{

    tableOutcomeDOM = $('#outcomesTable');    
    tableOutcome = tableOutcomeDOM.DataTable({
        paging: false,
        "autoWidth": false,
        "scrollY": "200px",
        "pageLength": 6,
        language: {
            sProcessing:     "Procesando...",
            sLengthMenu:     "Mostrar _MENU_ registros",
            sZeroRecords:    "No se encontraron resultados",
            sEmptyTable:     "Ningún dato disponible en esta tabla",
            sInfo:           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            sInfoEmpty:      "Mostrando registros del 0 al 0 de un total de 0 registros",
            sInfoFiltered:   "(filtrado de un total de _MAX_ registros)",
            sInfoPostFix:    "",
            sSearch:         "Buscar:",
            sUrl:            "",
            sInfoThousands:  ",",
            sLoadingRecords: "Cargando...",
            oPaginate: {
                sFirst:    "Primero",
                sLast:     "Último",
                sNext:     "Siguiente",
                sPrevious: "Anterior"
            },
            "oAria": {
                "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
        ajax: {
            url: "/Outcome/GetOutcomeJson",
            dataSrc: ''
        },
        columns: [
    { data: 'Id' },
    { data: 'idElement' },
    { data: 'outputType' },
    { data: 'idExpression' },
    { data: 'Valor' },
    { data: 'idNextElement' },
    { data: 'ProximoElemento' }
        ]
    });
    tableOutcome.column(':contains(Id)').visible(false);
    tableOutcome.column(':contains(idElement)').visible(false);
    tableOutcome.column(':contains(outputType)').visible(false);
    tableOutcome.column(':contains(idExpression)').visible(false);
    tableOutcome.column(':contains(idNextElement)').visible(false);

}

function loadOfficeDataTables()
{
    tableOfficeDOM = $('#OfficeTable');
    tableOffice = tableOfficeDOM.DataTable({
        paging: false,
        "searching": true,
        "scrollY":        "200px",
        "pageLength": 6,
        language: {
            sProcessing:     "Procesando...",
            sLengthMenu:     "Mostrar _MENU_ registros",
            sZeroRecords:    "No se encontraron resultados",
            sEmptyTable:     "Ningún dato disponible en esta tabla",
            sInfo:           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            sInfoEmpty:      "Mostrando registros del 0 al 0 de un total de 0 registros",
            sInfoFiltered:   "(filtrado de un total de _MAX_ registros)",
            sInfoPostFix:    "",
            sSearch:         "Buscar:",
            sUrl:            "",
            sInfoThousands:  ",",
            sLoadingRecords: "Cargando...",
            oPaginate: {
                sFirst:    "Primero",
                sLast:     "Último",
                sNext:     "Siguiente",
                sPrevious: "Anterior"
            },
            oAria: {
                "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            },
            buttons: {
                selectAll: 'Seleccionar todas',
                selectNone: 'Deseleccionar',
            }
        },
        ajax: {
            url: "/Office/GetOfficeListJson",
            dataSrc: ''
        },
        columns: [
    { data: 'IdOficina' },
    { data: 'Oficina' }
        ],
        dom: 'Bfrtip',
        buttons: [
            'selectAll',
            'selectNone'
        ],
        
        select: {
            style: 'multi'
        }
    })
    .on( 'select', function () 
    {
        var indexes = tableOffice.rows( '.selected' ).indexes()
        selectedOffices = tableOffice.rows( indexes ).data().toArray()
        console.log("selectedOffices", selectedOffices)
    })
    .on( 'deselect', function ( e, dt, type, indexes ) {
        
        if ( type === 'row' ) {
            tableOffice[ type ]( indexes ).nodes().to$().removeClass( '.selected' );
            var newSelectedIndexes = tableOffice.rows( '.selected' ).indexes()
            selectedOffices = tableOffice.rows( newSelectedIndexes ).data().toArray()
            console.log("selectedOffices", selectedOffices)
        }
    } );
}

function onRun()
{
    $("#buttonRunDiagram").on("click", function()
    {   
        if(selectedRowDiagram == null)
        {
            notifyMessage("Debe seleccionar al menos una oficina ")
        } 
        else // if(selectedOffices.length > 0)
        {
            var idDiagramaSeleccionado = selectedRowDiagram.Id;
            var diagramaSeleccionadoObj = {
                diagramID: idDiagramaSeleccionado
            };

            $.ajax({
                url:'/Diagram/EvaluateDiagram',
                type:'POST',
                contentType: 'application/json; charset=utf-8',
                cache:false,
                data:JSON.stringify(diagramaSeleccionadoObj),
                dataType:'json',
                beforeSend: function()
                {
                    //notifyMessage("Comenzó");
                    $.blockUI({ css: { 
                        border: 'none', 
                        padding: '15px', 
                        backgroundColor: '#000', 
                        '-webkit-border-radius': '15px', 
                        '-moz-border-radius': '15px', 
                        opacity: 1, 
                        color: '#fff' 
                    }, message: $('#domMessage') }); 
                    
                },
                success:function(jResults)
                {
                    if(jResults.length < 4)
                    {

                        for(var x = 0; x < jResults.length; x++)
                        {
                            notifyResult(jResults[x])
                        }

                    } else {
                        //Mostrar notificacion con link y evualar si puedo capturar el click en la notificacion
                        
                        
                        dataResults = [];
                        for(var x = 0; x < jResults.length; x++)
                        {
                            dataResults.push(jResults[x].vmResultMessage)
                        }

                            loadResultsDataTables(dataResults)
                        notifyMessage("Los resultados de la evaluacion pueden ser vistos dando click en la opción Resultados del  menú")
                        $("#buttonRunResults").find(".badge").text(jResults.length);
                    }
                    hideAndResetModals("#AsociarOficinaModal")
                },
                error:function(XMLHttpRequest, textStatus, errorThrown)
                {
                    notifyMessage("Error message: "+ JSON.stringify(errorThrown, null,4));
                }
            }).always(function() {
                //notifyMessage("Terminó")
                $.unblockUI()
            });
        }

    });    
}

function prepareAddDiagramDialog(diagramItemKey) 
{   
    debugger
    $("#inputSelectOffice").autocomplete({
        source: function(request, response)
        {
            debugger;
            var text = $("#inputSelectOffice").val();
            var searchTerm = { officeToSearch: text }
            console.log("searchTerm", searchTerm);

            $.ajax({
                url: 'Office/SearchOffice',
                contentType: 'application/json; charset=utf8',
                type: 'POST',
                cache: false,
                async: true,
                data: JSON.stringify(searchTerm),
                dataType: 'json',
                success: function (result) 
                {
                    if (result != null) 
                    {
                        officeList = result;
                        response(result.map(x=>x.Oficina));
                        tableDiagram.ajax.reload();
                    }
                },
                error: function (errormessage) {
                    notifyError("Error message: " + JSON.stringify(errormessage, null, 4))
                }
            });

        },
        minLength: 4,
        maxResults: 6, // Poner en todas las tablas
        appendTo: "#formularioCreateDiagram"
    });
    
}

//Me quede aqui
function prepareDiagramDialog(diagramItemKey, operationType, selectedRow) 
{   
    if(operationType == addOperation)
    {
        inputDiagramName.disabled = false
        $("#btnEditDiagram").hide()
        $("#btnCreateDiagram").show()
    }
    else if(operationType == editOperation)
    {
        var idDiagramaSeleccionado = JSON.stringify({ idDiagram: selectedRow.Id })
        $.ajax({
            url: 'Office/GetOfficeListByDiagramID',
            type:'POST', 
            contentType: 'application/json; charset=utf8',
            async: false,
            cache: false,
            data: idDiagramaSeleccionado,
            dataType:'json',
            success: function(result)
            {
                result.forEach(function(item)
                {
                    tableOffice.rows( function ( idx, data, node ) 
                    {
                        if(data.IdOficina == item.IdOficina)
                        {
                            tableOffice.rows( idx ).select()
                        }
                    })
                });
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                debugger
                var err = JSON.parse(XMLHttpRequest.responseText);
                notifyError("Error message: " + JSON.stringify(err, null, 4))
            }
        })

        inputDiagramName.value = selectedRow.Nombre
        inputDiagramName.disabled = false
        $("#btnCreateDiagram").hide()
        $("#btnEditDiagram").show()
    } 
     

    //Ocultar y mostrar boton de agregar o editar dependiendo del tipo de operacion
    
    $("#inputSelectOffice").autocomplete({
        source: function(request, response)
        {
            debugger;
            console.log("autocomplete");
            var text = $("#inputSelectOffice").val();
            var searchTerm = { officeToSearch: text }
            console.log("searchTerm", searchTerm);

            $.ajax({
                url: 'Office/SearchOffice',
                contentType: 'application/json; charset=utf8',
                method: 'POST',
                cache: false,
                async: true,
                data: JSON.stringify(searchTerm),
                dataType: 'json',
                success: function (result) 
                {
                    if (result != null) 
                    {
                        officeList = result;
                        response(result.map(x=>x.Oficina));
                        tableDiagram.ajax.reload();
                    }
                },
                error: function (errormessage) {
                    notifyError("Error message: " + JSON.stringify(errormessage, null, 4))
                }
            });
        },
        minLength: 4,
        maxResults: 6, 
        appendTo: "#formularioCreateDiagram"
    });
    $("#createDiagramModal").modal('show')
}

// Element Functions

function prepareElementDialog(tableName, selectedRow, operationType)
{
    debugger
    if(operationType == addOperation)
    {
        inputDiagramNameSelected.value = selectedRow.Nombre;
        searchElement("#formularioCreateElement", "Question", "SearchQuestion", "Pregunta")
        $("#inputSearchElement").focus()
        $("#btnEditElement").hide()
        $("#btnCreateElement").show()
    } 
    else if(operationType == editOperation) 
    {
        inputDiagramNameSelected.value = selectedRow.Diagrama;
        inputDiagramNameSelected.disabled = true
        searchElement("#formularioCreateElement", "Question", "SearchQuestion", "Pregunta")
        //$("#inputSearchElement").val(selectedRow.Pregunta)

        $("#btnCreateElement").hide()
        $("#btnEditElement").show()
    }
    $("#createElementModal").modal('show') 
}

function prepareOutcomeDialog(tableName, selectedRow, operationType)
{
    debugger
    if(operationType == addOperation)
    {
        inputElementNameSelected.value = selectedRow.Pregunta
        autoCompleteOutputType("#formularioCreateOutcome")
        searchQuestionNextElement("#formularioCreateOutcome", selectedRow.IdDiagrama)
        setDropDownForExpression()
    } 
    else if(operationType == editOperation) 
    {
        inputElementNameSelected.value = selectedRow.Pregunta
        autoCompleteOutputType("#formularioCreateOutcome")
        searchQuestionNextElement("#formularioCreateOutcome", selectedRow.IdDiagrama)
        setDropDownForExpression()
    }
}

function searchElement(formularioToAppend, controller, methodToSeach, subcategory)
{
    var maxResults = 6

    $("#inputSearchElement").autocomplete({
        minLength: 4,
        source: function(request, response)
        {
            var searchObject = new Object()
            searchObject.Text = $("#inputSearchElement").val()
            searchObject.Subcategory = subcategory

            var searchObjectJSON = JSON.stringify(searchObject)
            debugger
            $.ajax({
                url: controller+'/'+methodToSeach,
                type: 'POST',
                contentType: 'application/json; charset=utf8',
                async: true,
                cache: false,
                data: searchObjectJSON,
                dataType: 'json',
                success: function(result)
                {
                    debugger
                    if (result != null) 
                    {
                        if(selectedElementType == "Categoria")
                        {
                            categoryList = result;
                            response(result.slice(0,maxResults).map(x=>x.Categoria))
                        }
                        else 
                        {
                            questionList = result;
                            response(result.slice(0,maxResults).map(x=>x.Pregunta))
                        }
                    }
                },
                error: function(errorMessage)
                {
                    notifyError("Error message: " + JSON.stringify(errorMessage, null, 4))
                }
            })
        },
        
        focus: function (event, ui) {
            event.preventDefault();
            $(".ui-helper-hidden-accessible").hide();
            
        },
        messages: {
            noResults: '',
            results: function() {}
        },        
        appendTo: formularioToAppend
    })        
}

function searchQuestionNextElement(formularioToAppend, IdDiagrama)
{
    debugger;
    $("#inputNextElementId").autocomplete({
        source: function(request, response)
        {
            debugger;

            
            var QuestionTextOrId = $("#inputNextElementId").val();
            //Poner el diagrama y el elemento

            var searchTerm = { Text: QuestionTextOrId, Diagrama : IdDiagrama }

            $.ajax({
                url: 'Question/SearchQuestionAddedToDiagram',
                type: 'POST',
                contentType: 'application/json; charset=utf8',
                data: JSON.stringify(searchTerm),
                dataType: 'json',
                cache: false,
                async: true,
                success: function(result)
                {
                    debugger
                    if (result != null) 
                    {
                        questionNextElementList = result;
                        response(result.map(x=>x.Id + barSeparator + x.Pregunta ));
                    }
                },
                error: function(errorMessage)
                {
                    notifyError("Error message: " + JSON.stringify(errorMessage, null, 4))
                }
            });
        },
        focus: function (event, ui) {
            event.preventDefault();
            $(".ui-helper-hidden-accessible").hide();
            
        },
        messages: {
            noResults: '',
            results: function() {}
        },  
        minLength: 4,
        appendTo: formularioToAppend
    });

        
}

function autoCompleteOutputType(formularioToAppend)
{
    $("#inputExpressionType").autocomplete({
        source: function(request, response)
        {
            var outputType = $("#inputExpressionType").val();
            var searchTerm = { Text: outputType }

            $.ajax({
                url: 'OutputType/SearchOutputType',
                type: 'POST',
                contentType: 'application/json; charset=utf8',
                data: JSON.stringify(searchTerm),
                dataType: 'json',
                cache: false,
                async: true,
                success: function(result)
                {
                    if (result != null) 
                    {
                        outputTypeList = result;
                        response(result.map(x=>x.expressionType));
                    }
                },
                error: function(errorMessage)
                {
                    notifyError("Error message: " + JSON.stringify(errorMessage, null, 4))
                }
            });
        },
        minLength: 0,
        maxResults: 6,
        appendTo: formularioToAppend,
        select: function (a, b) {
            $(this).val(b.item.value);
            //alert("val selected: " + $(this).val());

            if($(this).val() == "Valor Numérico")
            {
                
            } 
            else if($(this).val() == "Valor Numérico")
            {
                $("#AphabeticValueDiv").removeClass('hidden'); 
            }

        }
    })
    .focus(function (){
        $(this).autocomplete('search', $(this).val())
    })
    .keypress(function(e) {
        if(e.which == 13) {
            alert('e');
        }
    });

        
}

//Saving functions
function getIdQuestionSelected()
{
    //Make function to deal dinamically with this
}

function getIdofficeSelected()
{
    //Make function to deal dinamically with this
}

function hideAndResetModals(modalID)
{
    debugger
    $(modalID).modal('hide');
    clearValidation(modalID);
    $(modalID).on('hidden.bs.modal', function () 
    {
        debugger
        $(modalID).find('form').trigger('reset');
       
        
    });
    
}

function getForm(obj)
{
    return $(obj).parents("div").find(".modal-body").find("form")
}

function savingFunctions()
{
    /* Make method receive the name of the selector that the autocomplete will be attached */
    $("#btnCreateDiagram").click(function ()
    {
        debugger
        var form =  getForm(this)
        form.validate()
        form.submit()
        

        if(selectedOffices == null)
        {
            notifyMessage("Debe seleccionar al menos una oficina ")
        } 
        else if(selectedOffices.length > 0)
        {

            var diagramObj = {
                diagramName: $("#inputDiagramName").val(), 
                Offices: selectedOffices
            }

            $.ajax({
                url: '/Diagram/AddDiagram',
                contentType: 'application/json; charset=utf-8',
                type: 'POST',
                async: true,
                cache: false,
                dataType: 'json',
                data: JSON.stringify(diagramObj),
                success: function (jResult) 
                {
                    debugger
                    notifyResult(jResult)
                    hideAndResetModals("#createDiagramModal")
                    reloadTableByEntity(diagramItemKey)
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    var err = JSON.parse(XMLHttpRequest.responseText);
                    notifyError(JSON.stringify(err, null, 4))
                }
            });
        }
        
        
    });

    $("#btnCreateElement").click(function ()
    {
        
        debugger;
        
        var form = getForm(this)
        form.validate()
        form.submit()
        

        var id_diagrama = selectedRowDiagram.Id;

        switch(selectedElementType)
        {
            case "Pregunta":
                
                var idQuestionFound; //create function getIdQuestionSelected()
                if (questionList.length === 0) {
                    // not found
                } else if (questionList.length === 1) {
                    idQuestionFound = questionList[0].IdPregunta
                } else {
                    idQuestionFound = questionList.find(x => x.Pregunta === $("#inputSearchElement").val()).IdPregunta
                }

                var elementObj = {
                    idDiagram: id_diagrama,
                    idPregunta:  idQuestionFound, //object must be equal to the one in the db in all it's attributes
                };
         
                //alert(JSON.stringify(idQuestionFound));
        
                $.ajax({
                    url: '/Element/AddElement',
                    contentType: 'application/json; charset=utf-8',
                    type: 'POST',
                    async: true,
                    cache: false,
                    dataType: 'json',
                    data: JSON.stringify(elementObj),
                    success: function (jResult) 
                    {
                        debugger;
                        notifyResult(jResult)
                        hideAndResetModals("#createElementModal")
                        reloadTableByEntity(selectedEntity)
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        var err = JSON.parse(XMLHttpRequest.responseText);
                        notifyError("Error message: " + JSON.stringify(err, null, 4))
                    }
                });

                break;

            case "Categoria":
                
                debugger;
                var questionObj = {
                    Pregunta: $("#inputSearchElement").val(),
                    SubCategoria:  "Categoria", //object must be equal to the one in the db in all it's attributes
                };
         
                //alert(JSON.stringify(questionObj));
        
                $.ajax({
                    url: '/Question/AddQuestion',
                    contentType: 'application/json; charset=utf-8',
                    type: 'POST',
                    async: true,
                    cache: false,
                    dataType: 'json',
                    data: JSON.stringify(questionObj),
                    success: function (resultAddCategory) 
                    {
                        debugger;
                        if(resultAddCategory.result == false)
                        {
                            notifyResult(resultAddCategory)
                        } else {
                            
                            hideAndResetModals("#createElementModal")
                            reloadTableByEntity(selectedEntity);

                            var elementObj = {
                                idDiagram: id_diagrama,
                                idPregunta:  resultAddCategory.Id, //object must be equal to the one in the db in all it's attributes
                            };
         
                            $.ajax({
                                url: '/Element/AddElement',
                                contentType: 'application/json; charset=utf-8',
                                type: 'POST',
                                async: true,
                                cache: false,
                                dataType: 'json',
                                data: JSON.stringify(elementObj),
                                success: function (resultAddElement) 
                                {
                                    debugger;
                                    if(resultAddElement.result == false)
                                    {
                                        notifyResult(resultAddElement)
                                    } else {
                                       
                                        hideAndResetModals("#createElementModal")
                                        reloadTableByEntity(selectedEntity);
                                    }
                                
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    var err = JSON.parse(XMLHttpRequest.responseText);
                                    notifyError("Error message: " + JSON.stringify(err, null, 4))
                                }
                            });
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        var err = JSON.parse(XMLHttpRequest.responseText);
                        notifyError("Error message: " + JSON.stringify(err, null, 4))
                    }
                });

                break;
            case "Resultado":
                
                debugger;
                var questionObj = {
                    Pregunta: $("#inputSearchElement").val(),
                    SubCategoria:  "Resultado", //object must be equal to the one in the db in all it's attributes
                };
         
                //alert(JSON.stringify(questionObj));
                
                $.ajax({
                    url: '/Question/AddQuestion',
                    contentType: 'application/json; charset=utf-8',
                    type: 'POST',
                    async: true,
                    cache: false,
                    dataType: 'json',
                    data: JSON.stringify(questionObj),
                    success: function (resultAddQuestion) 
                    {
                        debugger;
                       
                        var elementObj = {
                            idDiagram: id_diagrama,
                            idPregunta:  resultAddQuestion.Id, //object must be equal to the one in the db in all it's attributes
                        };
         
                        $.ajax({
                            url: '/Element/AddElement',
                            contentType: 'application/json; charset=utf-8',
                            type: 'POST',
                            async: true,
                            cache: false,
                            dataType: 'json',
                            data: JSON.stringify(elementObj),
                            success: function (jResult) 
                            {
                                debugger

                                hideAndResetModals("#createElementModal")
                                notifyResult(jResult)
                                reloadTableByEntity(selectedEntity);
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                var err = JSON.parse(XMLHttpRequest.responseText);
                                notifyError("Error message: " + JSON.stringify(err, null, 4))
                            }
                        });
                        
                        
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        var err = JSON.parse(XMLHttpRequest.responseText);
                        notifyError("Error message: " + JSON.stringify(err, null, 4))

                    }
                });
                
                break;

            case "Diagrama":
                
                debugger;
                var questionObj = {
                    Pregunta: $("#inputSearchElement").val(),
                    SubCategoria:  "Diagrama", 
                };
                
                $.ajax({
                    url: '/Question/AddQuestion',
                    contentType: 'application/json; charset=utf-8',
                    type: 'POST',
                    async: true,
                    cache: false,
                    dataType: 'json',
                    data: JSON.stringify(questionObj),
                    success: function (resultAddQuestion) 
                    {
                        debugger;
                       
                        var elementObj = {
                            idDiagram: id_diagrama,
                            idPregunta:  resultAddQuestion.Id, //object must be equal to the one in the db in all it's attributes
                        };
         
                        $.ajax({
                            url: '/Element/AddElement',
                            contentType: 'application/json; charset=utf-8',
                            type: 'POST',
                            async: true,
                            cache: false,
                            dataType: 'json',
                            data: JSON.stringify(elementObj),
                            success: function (jResult) 
                            {
                                debugger

                                hideAndResetModals("#createElementModal")
                                notifyResult(jResult)
                                reloadTableByEntity(selectedEntity);
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                var err = JSON.parse(XMLHttpRequest.responseText);
                                notifyError("Error message: " + JSON.stringify(err, null, 4))
                            }
                        });
                        
                        
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        var err = JSON.parse(XMLHttpRequest.responseText);
                        notifyError("Error message: " + JSON.stringify(err, null, 4))

                    }
                });
                
                break;
        }
    });

    $("#btnCreateOutcome").click(function()
    {
        debugger
   
        ////alert($("#ExpressionTypes").parent().find("select").id);
        var form = getForm(this)
        form.validate()
        form.submit()

        // var formValidates = $("#formularioCreateOutcome").validationEngine('validate')
        
        //if(formValidates == false)
        //{
        //    notifyError("Hay errores en el formulario")
        //} else if(formValidates == true) {

        //Ver el outcome e insertarlo en su tabla correspondiente
        var idExpression = $("#ExpressionTypes").select2('data')[0].id
        var splitValue = $("#inputNextElementId").val()
        var arrayString = splitValue.split(barSeparator)
        var qNextElement = ""
        for(var x = 1; x < arrayString.length; x++ )
        {
            qNextElement = qNextElement + arrayString[x]
        }
       
        switch (idExpression) 
        {
            case "1":
                
                var numValueObj = {
                    numValue: $("#inputNumericValue").val()
                };

                $.ajax({
                    url: '/ExpressionType/AddNumericValue',
                    contentType: 'application/json; charset=utf-8',
                    type: 'POST',
                    async: true,
                    cache: false,
                    dataType: 'json',
                    data: JSON.stringify(numValueObj),
                    success: function (idExpression) 
                    {
                        debugger;
                        //alert("id numeric value added: " +result);
                        var idNextQuestionFound; //create function getIdQuestionSelected()

                        if (questionNextElementList.length === 0) {
                            // not found
                        } else if (questionNextElementList.length === 1) {
                            idNextQuestionFound = questionNextElementList[0].IdPregunta
                        } else {
                            idNextQuestionFound = questionNextElementList.find(x => x.Pregunta === qNextElement).IdPregunta
                        }

                        var obj2 = {
                            idElement: selectedRowElement.Id,
                            outputType: $("#ExpressionTypes").select2('data')[0].text,
                            idExpression: idExpression,
                            idNextElement: idNextQuestionFound
                        };
                        
                        $.ajax({
                            url: '/ExpressionType/AddOutcomeTable',
                            contentType: 'application/json; charset=utf-8',
                            type: 'POST',
                            async: true,
                            cache: false,
                            dataType: 'json',
                            data: JSON.stringify(obj2),
                            success: function (jResult) 
                            {
                                debugger
                                hideAndResetModals("#createOutcomeModal")
                                notifyResult(jResult)
                                reloadTableByEntity(selectedEntity);
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                var err = JSON.parse(XMLHttpRequest.responseText);
                                notifyError("Error message: " + JSON.stringify(err, null, 4))
                            }
                        });
                        
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        var err = JSON.parse(XMLHttpRequest.responseText);
                        notifyError("Error message: " + JSON.stringify(err, null, 4))
                    }
                });

                break;
            case "2":
                

                var boolValueObj = {
                    value: $("#YesOrNoType :selected").text()
                };
                
                
                $.ajax({
                    url: '/ExpressionType/AddBooleanValue',
                    contentType: 'application/json; charset=utf-8',
                    type: 'POST',
                    async: true,
                    cache: false,
                    dataType: 'json',
                    data: JSON.stringify(boolValueObj),
                    success: function (idExpression) {
                        
                        debugger;
                        var idNextQuestionFound; //create function getIdQuestionSelected()

                        if (questionNextElementList.length === 0) {
                            // not found
                        } else if (questionNextElementList.length === 1) {
                            idNextQuestionFound = questionNextElementList[0].IdPregunta
                        } else {
                            idNextQuestionFound = questionNextElementList.find(x => x.Pregunta === qNextElement).IdPregunta
                        }

                        var obj2 = {
                            idElement: selectedRowElement.Id,
                            outputType: $("#ExpressionTypes").select2('data')[0].text,
                            idExpression: idExpression,
                            idNextElement: idNextQuestionFound
                        };
                        //alert(JSON.stringify(obj2))
                        
                        $.ajax({
                            url: '/Outcome/AddOutcomeTable',
                            contentType: 'application/json; charset=utf-8',
                            type: 'POST',
                            async: true,
                            cache: false,
                            dataType: 'json',
                            data: JSON.stringify(obj2),
                            success: function (result) 
                            {
                                debugger
                                hideAndResetModals("#createOutcomeModal")
                                notifyResult(result)
                                reloadTableByEntity(selectedEntity)
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                var err = JSON.parse(XMLHttpRequest.responseText);
                                notifyMessage("Error message: " + JSON.stringify(err, null, 4))
                            }
                        });
                        
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        var err = JSON.parse(XMLHttpRequest.responseText);
                        notifyError("Error message: " + JSON.stringify(err, null, 4))
                    }
                });
                
                break;
            case "3":
               

                var comparisonValueObj = {
                    idComparisonOperator: $("#idComparisonOperator :selected").val(),
                    knownValue: $("#inputknownValue").val()
                };
                //alert("Comparison: "+JSON.stringify(comparisonValueObj))
                
                $.ajax({
                    url: '/ExpressionType/AddComparisonTable',
                    contentType: 'application/json; charset=utf-8',
                    type: 'POST',
                    async: true,
                    cache: false,
                    dataType: 'json',
                    data: JSON.stringify(comparisonValueObj),
                    success: function (idExpression) 
                    {
                        // alert(idExpression)
                        
                        var idNextQuestionFound; //create function getIdQuestionSelected()

                        if (questionNextElementList.length === 0) {
                            // not found
                        } else if (questionNextElementList.length === 1) {
                            idNextQuestionFound = questionNextElementList[0].IdPregunta
                        } else {
                            idNextQuestionFound = questionNextElementList.find(x => x.Pregunta === qNextElement).IdPregunta
                        }
                        
                        var obj2 = {
                            idElement: selectedRowElement.Id,
                            outputType: $("#ExpressionTypes").select2('data')[0].text,
                            idExpression: idExpression,
                            idNextElement: idNextQuestionFound
                        };
                        //alert(JSON.stringify(obj2))
                        
                        $.ajax({
                            url: '/Outcome/AddOutcomeTable',
                            contentType: 'application/json; charset=utf-8',
                            type: 'POST',
                            async: true,
                            cache: false,
                            dataType: 'json',
                            data: JSON.stringify(obj2),
                            success: function (jResult) 
                            {
                                debugger
                                hideAndResetModals("#createOutcomeModal")
                                notifyResult(jResult)
                                reloadTableByEntity(selectedEntity);
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                var err = JSON.parse(XMLHttpRequest.responseText);
                                notifyError("Error message: " + JSON.stringify(err, null, 4))
                            }
                        });
                        
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        var err = JSON.parse(XMLHttpRequest.responseText);
                        notifyError("Error message: " + JSON.stringify(err, null, 4))
                    }
                });
                
                break;
            case "4":

                debugger;
                var rangeValueObj = {
                    firstKnownValue: $("#inputFirstKnownValue").val(),
                    idFirstComparisonOperator: $("#idFirstComparisonOperator :selected").val(),
                    idSecondComparisonOperator: $("#idSecondComparisonOperator :selected").val(),
                    secondKnownValue: $("#inputSecondknownValue").val()
                };
                
                //alert("Range: "+JSON.stringify(rangeValueObj))
               
                $.ajax({
                    url: '/ExpressionType/AddRangeTable',
                    contentType: 'application/json; charset=utf-8',
                    type: 'POST',
                    async: true,
                    cache: false,
                    dataType: 'json',
                    data: JSON.stringify(rangeValueObj),
                    success: function (idExpression) {
                        //alert(idExpression)
                        
                        var idNextQuestionFound; //create function getIdQuestionSelected()

                        if (questionNextElementList.length === 0) {
                            // not found
                        } else if (questionNextElementList.length === 1) {
                            idNextQuestionFound = questionNextElementList[0].IdPregunta
                        } else {
                            idNextQuestionFound = questionNextElementList.find(x => x.Pregunta === qNextElement).IdPregunta
                        }
                        
                        debugger;
                        var obj2 = {
                            idElement: selectedRowElement.Id,
                            outputType: $("#ExpressionTypes").select2('data')[0].text,
                            idExpression: idExpression,
                            idNextElement: idNextQuestionFound
                        };
                        // alert(JSON.stringify(obj2))
                        
                        $.ajax({
                            url: '/Outcome/AddOutcomeTable',
                            contentType: 'application/json; charset=utf-8',
                            type: 'POST',
                            async: true,
                            cache: false,
                            dataType: 'json',
                            data: JSON.stringify(obj2),
                            success: function (jResult) 
                            {
                                debugger
                                hideAndResetModals("#createOutcomeModal")
                                notifyResult(jResult)
                                reloadTableByEntity(selectedEntity);
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                var err = JSON.parse(XMLHttpRequest.responseText);
                                notifyError("Error message: " + JSON.stringify(err, null, 4))
                            }
                        });
                        
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log(("Error XMLHttpRequest: " + JSON.stringify(XMLHttpRequest, null, 4)))
                        
                    }
                });
                
                break;
           
            default:
                notifyError('Valor no valido. Escriba una pregunta, categoria o resultado en el campo "Conectar con Elemento"');
                break;
        }
        //}
    });
}

function getIdQuestionSelected(inputID)
{
    debugger
    var idQuestionFound; 

    if (questionList.length === 0) {
        // not found
    } else if (questionList.length === 1) {
        idQuestionFound = questionList[0].IdPregunta
    } else {
        idQuestionFound = questionList.find(x => x.Pregunta === $(inputID).val()).IdPregunta
    }
    return idQuestionFound;
}

function editingFunctions()
{
    $("#btnEditDiagram").click(function ()
    {
        
        var form = getForm(this)
        form.validate()
        form.submit()

        if(selectedOffices == null)
        {
            notifyMessage("Debe seleccionar al menos una oficina ")
        } 
        else //if(selectedOffices.length > 0)
        {
            var idDiagramaSeleccionado = selectedRowDiagram.Id;
            var diagramObj = {
                diagramID: idDiagramaSeleccionado,
                diagramName: $("#inputDiagramName").val(), 
                Offices: selectedOffices
            }

            $.ajax({
                url: '/Diagram/EditDiagram',
                contentType: 'application/json; charset=utf-8',
                type: 'POST',
                async: true,
                cache: false,
                dataType: 'json',
                data: JSON.stringify(diagramObj),
                success: function (jResult) 
                {
                    debugger
                    jResult.message = "Diagrama editado satisfactoriamente"
                    notifyResult(jResult)
                    hideAndResetModals("#createDiagramModal")
                    reloadTableByEntity(diagramItemKey)
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    var err = JSON.parse(XMLHttpRequest.responseText);
                    notifyError("Error message: " + JSON.stringify(err, null, 4))
                }
            });
        }
    });

    $("#btnEditElement").click(function ()
    {
        debugger
        
        var form = getForm(this)
        form.validate()
        form.submit()

        var id_element = selectedRowElement.Id

        switch(selectedElementType)
        {
            case "Pregunta":

                if($("#inputSearchElement").val().length <= 0)
                {
                    notifyError("Debe especificar un valor para el tipo elemento")
                } else {

                    var elementObj = {
                        elementID: selectedRowElement.Id,
                        newQuestionID: getIdQuestionSelected("#inputSearchElement") 
                    };
            
                    
                    //notifyMessage(JSON.stringify(elementObj))
                    //Poner en la estructura del json a enviar el id de la pregunta antigua, y de la que la sustituirá

                    $.ajax({
                        url: '/Element/EditElement',
                        contentType: 'application/json; charset=utf-8',
                        type: 'POST',
                        async: true,
                        cache: false,
                        dataType: 'json',
                        data: JSON.stringify(elementObj),
                        success: function (jResult) 
                        {
                            notifyResult(jResult)
                            hideAndResetModals("#createElementModal")
                            reloadTableByEntity(selectedEntity)
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            var err = JSON.parse(XMLHttpRequest.responseText);
                            notifyError("Error message: " + JSON.stringify(err, null, 4))
                        }
                    });
                }
                
                

                break;

            case "Categoria":
                
                debugger;
                var questionObj = {
                    Pregunta: $("#inputSearchElement").val(),
                    SubCategoria:  "Categoria", //object must be equal to the one in the db in all it's attributes
                };
         
                //alert(JSON.stringify(questionObj));
        
                $.ajax({
                    url: '/Question/AddQuestion',
                    contentType: 'application/json; charset=utf-8',
                    type: 'POST',
                    async: true,
                    cache: false,
                    dataType: 'json',
                    data: JSON.stringify(questionObj),
                    success: function (resultAddCategory) 
                    {
                        debugger;
                        if(resultAddCategory.result == false)
                        {
                            notifyResult(resultAddCategory)
                        } else {
                            
                            hideAndResetModals("#createElementModal")
                            reloadTableByEntity(selectedEntity);

                            var elementObj = {
                                idDiagram: id_diagrama,
                                idPregunta:  resultAddCategory.Id, //object must be equal to the one in the db in all it's attributes
                            };
         
                            $.ajax({
                                url: '/Element/AddElement',
                                contentType: 'application/json; charset=utf-8',
                                type: 'POST',
                                async: true,
                                cache: false,
                                dataType: 'json',
                                data: JSON.stringify(elementObj),
                                success: function (resultAddElement) 
                                {
                                    debugger;
                                    if(resultAddElement.result == false)
                                    {
                                        notifyResult(resultAddElement)
                                    } else {
                                       
                                        hideAndResetModals("#createElementModal")
                                        reloadTableByEntity(selectedEntity);
                                    }
                                
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    var err = JSON.parse(XMLHttpRequest.responseText);
                                    notifyError("Error message: " + JSON.stringify(err, null, 4))
                                }
                            });
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        var err = JSON.parse(XMLHttpRequest.responseText);
                        notifyError("Error message: " + JSON.stringify(err, null, 4))
                    }
                });

                break;
            case "Resultado":
                
                debugger;
                var questionObj = {
                    Pregunta: $("#inputSearchElement").val(),
                    SubCategoria:  "Resultado", //object must be equal to the one in the db in all it's attributes
                };
         
                //alert(JSON.stringify(questionObj));
                
                $.ajax({
                    url: '/Question/AddQuestion',
                    contentType: 'application/json; charset=utf-8',
                    type: 'POST',
                    async: true,
                    cache: false,
                    dataType: 'json',
                    data: JSON.stringify(questionObj),
                    success: function (resultAddQuestion) 
                    {
                        debugger;
                       
                        var elementObj = {
                            idDiagram: id_diagrama,
                            idPregunta:  resultAddQuestion.Id, //object must be equal to the one in the db in all it's attributes
                        };
         
                        $.ajax({
                            url: '/Element/AddElement',
                            contentType: 'application/json; charset=utf-8',
                            type: 'POST',
                            async: true,
                            cache: false,
                            dataType: 'json',
                            data: JSON.stringify(elementObj),
                            success: function (jResult) 
                            {
                                debugger

                                hideAndResetModals("#createElementModal")
                                notifyResult(jResult)
                                reloadTableByEntity(selectedEntity);
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                        
                                var err = JSON.parse(XMLHttpRequest.responseText);
                                notifyError("Error message: " + JSON.stringify(err, null, 4))
                            }
                        });
                        
                        
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        var err = JSON.parse(XMLHttpRequest.responseText);
                        notifyError("Error message: " + JSON.stringify(err, null, 4))

                    }
                });
                
                break;
        }
    });
}

function getSelectedRowBySelectedEntity(selectedEntity)
{
    var selectedRow = null;
    switch (selectedEntity)
    {
        case "diagrama":
            selectedRow = selectedRowDiagram;
            break;
        case "elemento":
            selectedRow = selectedRowElement;
            break;
        case "salida":
            selectedRow = selectedRowOutcome;
            break;
        default:
            break;
    }
    return selectedRow;
}

function deleteEntity()
{
    $("#deleteDiagramButton").click( function() 
    {
        bootbox.confirm({
            message: "Confirmar",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function(result){
                deleteDiagram(result)
            }
        });
    });

    $("#deleteElementButton").click( function() 
    {
        bootbox.confirm({
            message: "Confirmar",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function(result){
                deleteElement(result)
            }
        });

    });

    $("#deleteOutcomeButton").click( function() 
    {
        bootbox.confirm({
            message: "Confirmar",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function(result){
                deleteOutcome(result)
            }
        });
    });
}

function deleteDiagram(result)
{
    debugger
    if(result)
    {
        if(selectedRowDiagram != null)
        {
            var selectedObject = new Object();
            selectedObject.entity = diagramItemKey
            selectedObject.idEntity = selectedRowDiagram.Id;
            var jsonEntity = JSON.stringify(selectedObject);

            $.ajax({
                url: '/Home/DeleteFromFromEntity',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                async: true,
                cache: false,
                data: jsonEntity,
                dataType: 'json',
                success: function(resultDelete)
                {
                    debugger
                    notifyResult(resultDelete)
                    reloadTableByEntity(selectedEntity)
                },
                error:function(XMLHttpRequest, textStatus, errorThrown)
                {
                    var err = JSON.parse(XMLHttpRequest.responseText);                    
                    notifyMessage("Error al eliminar: " + JSON.stringify(err, null, 4))
                }
            });
            
           
        } else {
            console.log("window[selectedEntity]:"+" is undefined");
        }    
    } 
    else (!result)
    {
        notifyMessage("Eliminar entidad descartada")
    }
}

function deleteElement(result)
{
    debugger
    if (result) 
    {
        if(selectedRowElement!= null)
        {
            var selectedObject = new Object();
            selectedObject.entity = elementItemKey
            selectedObject.idEntity = selectedRowElement.Id;
            var jsonEntity = JSON.stringify(selectedObject);

            $.ajax({
                url: '/Home/DeleteFromFromEntity',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                async: true,
                cache: false,
                data: jsonEntity,
                dataType: 'json',
                success: function(resultDelete)
                {
                    debugger
                    notifyResult(resultDelete)
                    if(resultDelete.result == true)
                    {
                        reloadTableByEntity(selectedEntity);
                    } 
                },
                error:function(XMLHttpRequest, textStatus, errorThrown)
                {
                    var err = JSON.parse(XMLHttpRequest.responseText);
                    notifyMessage("Error al eliminar: " + JSON.stringify(err, null, 4))
                }
            });
            
           
        } else {
            console.log("window[selectedEntity]:"+" is undefined");
        }
    } 
    if (!result)
    {
        notifyMessage("Eliminar entidad descartada")
    }   

    
}

function deleteOutcome(result)
{
    debugger

    if (result) 
    {
        if(selectedRowOutcome != null)
        {
            var selectedObject = new Object();
            selectedObject.entity = outcomeItemKey
            selectedObject.idEntity = selectedRowOutcome.Id;
            var jsonEntity = JSON.stringify(selectedObject);

            $.ajax({
                url: '/Home/DeleteFromFromEntity',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                async: true,
                cache: false,
                data: jsonEntity,
                dataType: 'json',
                success: function(resultDelete)
                {
                    notifyResult(resultDelete)
                    if(resultDelete.result == true)
                    {
                        reloadTableByEntity(selectedEntity);
                    } 
                },
                error:function(XMLHttpRequest, textStatus, errorThrown)
                {
                    notifyMessage("Error al eliminar: " + JSON.stringify(err, null, 4))
                }
            });
        } else {
            notifyError("Debe seleccionar una salida para eliminar")
            console.log("window[selectedEntity]:"+" is undefined");
        }   
    } 
    else if (!result)
    {
        notifyMessage("Eliminar entidad descartada")
    }        
}

function notifyResult(jResult)
{
    var type

    if(jResult.result == false)
    {
        type = 'danger'
    } else {
        type = 'success'
    }

    $.notify({
        message: jResult.message
    },{
        delay: 1000,
        type: type,
        autoHide: true
    });
}

function notifyResultURL(urlMessage, urlCustom)
{
    debugger

    $.notify({
        message: urlMessage,
        url: urlCustom,
        target: "_self"
    },{
        delay: 0,
        type: 'success',
        autoHide: true,
        animate: {
            enter: 'animated fadeInRight',
            exit: 'animated fadeOutRight'
        }
    });
}

function notifyMessage(message)
{
    $.notify({
        message: message
    },{
        delay: 1000,
        type: 'info'
    });
}

function notifyError(message)
{
    $.notify({
        message: message
    },{
        delay:  0,
        type: 'danger',
        autoHide: false
    });
}

function viewNotificationMessages()
{
    $("#buttonRunResults").click(function(){
        
        $("#ResultsMesaggesModal").modal('show')
        .on('shown.bs.modal', function () 
        {
            $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
        })
    });
}
