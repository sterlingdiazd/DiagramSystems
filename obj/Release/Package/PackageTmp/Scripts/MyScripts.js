//Hide search input from datatables

var officeList;
var questionList;
var categoryList;
var questionNextElementList;
var outputTypeList;
var selectedOutcomeType;
var tableDiagramDOM;
var tableOffice;
var tableDiagram;
var tableElement;
var tableOutcome;
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


$(document).ready(function () 
{
    loadDiagramDataTables(diagramItemKey)
    loadElementDataTables()
    loadOutcomeDataTables()
    loadOfficeDataTables()

    onSelectOffices()
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
});

function onSelectOffices()
{
    tableOffice
    
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
                alert("Debe seleccionar un tipo de expresión");
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
        $("#createDiagramModal").modal('show')
    });
}

function editDiagram()
{
    $("#editDiagramButton").click( function() 
    {
        debugger
        if(selectedRowDiagram == null)
        {
            alert("Debe seleccionar un " + diagramItemKey)
        } else {
            prepareDiagramDialog(diagramItemKey, editOperation)
            $("#createDiagramModal").modal('show')
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
            alert("Debe seleccionar un " + diagramItemKey)
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
            alert("Debe seleccionar un " + elementItemKey);
        }
        else if(selectedRowElement == null)
        {
            alert("Debe seleccionar un " + elementItemKey + " para poder editarlo.");
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
            alert("Debe seleccionar un " + elementItemKey)
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
        debugger;
        console.log(elementItemKey);
        if(selectedRowElement == null)
        {
            alert("Debe seleccionar un " + elementItemKey)           
        }  
        else if(selectedRowOutcome == null) 
        {
            alert("Debe seleccionar un " + outcomeItemKey) 
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
        switch(selectedElementType)
        {
            case "Pregunta":
                searchElement("#formularioCreateElement", "SearchQuestion", "Pregunta");
                break;
            case "Categoria":
                searchElement("#formularioCreateElement", "SearchCategory", "Categoria");
                break;
            case "Resultado":
                searchElement("#formularioCreateElement", "SearchResult", "Resultado");
                break;
        }
    });
}

function modifyTables()
{
    var inputSearch = $('#elementsTable_filter').find('input');
    $(".dataTables_filter").find("label").hide(); 
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
        ajax: {
            url: "/Home/GetDiagramsJson",
            dataSrc: ''
        },
        columns: [
    { data: 'Id' },
    { data: 'Nombre' }
        ]
    });
    tableDiagram.column(':contains(Id)').visible(false);
}

function loadElementDataTables()
{
    tableElementDOM = $('#elementsTable');    
    tableElement = tableElementDOM.DataTable({
        paging: false,
        "pageLength": 6,
        "scrollY": "200px",
        ajax: {
            url: "/Home/GetElementsJson",
            dataSrc: ''
        },
        columns: [
    { data: 'Id' },
    { data: 'IdDiagrama' },
    { data: 'Diagrama' },
    { data: 'Pregunta' }
        ]
    });
    tableElement.column(':contains(Id)').visible(false);
    tableElement.column(':contains(IdDiagrama)').visible(false);
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
        ajax: {
            url: "/Home/GetOutcomeJson",
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
        ajax: {
            url: "/Home/GetOfficeListJson",
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
    }).on( 'select', function () 
    {
        var indexes = tableOffice.rows( '.selected' ).indexes()
        selectedOffices = tableOffice.rows( indexes ).data().toArray()
        console.log("selectedOffices", selectedOffices)
    })
}
/*
function loadOfficeDataTables()
{
    tableOfficeDOM = $('#EditOfficeTable');
    tableOffice = tableOfficeDOM.DataTable({
        paging: false,
        "searching": true,
        "scrollY":        "200px",
        "pageLength": 6,
        ajax: {
            url: "/Home/GetOfficeListJson",
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
    }).on( 'select', function () 
    {
        var indexes = tableOffice.rows( '.selected' ).indexes()
        selectedOffices = tableOffice.rows( indexes ).data().toArray()
        console.log("selectedOffices", selectedOffices)
    });
}
*/
//

function onRun()
{
    $("#buttonRunDiagram").on("click", function()
    {   
        //$("#AsociarOficinaModal").modal('show'); 
        //$("#btnVinculateOfficesToDiagrams").click(function()
        //{
           
        //})

        debugger
        if(selectedRowDiagram == null)
        {
            alert("Debe seleccionar al menos una oficina ")
        } 
        else // if(selectedOffices.length > 0)
        {
            debugger
            var idDiagramaSeleccionado = selectedRowDiagram.Id;
            var diagramaSeleccionadoObj = {
                diagramID: idDiagramaSeleccionado
            };

            $.ajax({
                url:'/Home/EvaluateDiagrama',
                type:'POST',
                contentType: 'application/json; charset=utf-8',
                async:false,
                cache:false,
                data:JSON.stringify(diagramaSeleccionadoObj),
                dataType:'json',
                success:function(jResults)
                {
                    debugger
                    
                    for(var x = 0; x < jResults.length; x++)
                    {
                        var type = jResults[x].result
                        if(jResults[x].result == false)
                        {
                            type = 'danger'
                        } else {
                            type = 'success'
                        }
                        //console.log(jResults[x].exceptionMessage)
                        //jResults[x].message
                        $.notify({
                            message: 'hi'
                        },{
                            delay: 10000,
                            type: type
                        });
                    }
                    hideAndResetModals("#AsociarOficinaModal")   
                    
                },
                error:function(XMLHttpRequest, textStatus, errorThrown)
                {
                    alert("Error message: "+ JSON.stringify(errorThrown, null,4));
                }
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
            console.log("autocomplete");
            var text = $("#inputSelectOffice").val();
            var searchTerm = { officeToSearch: text }
            console.log("searchTerm", searchTerm);

            $.ajax({
                url: 'Home/SearchOffice',
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
                    alert("Error message: " + JSON.stringify(errormessage, null, 4));
                }
            });

        },
        minLength: 4,
        maxResults: 6, // Poner en todas las tablas
        appendTo: "#formularioCreateDiagram"
    });
    
}

function prepareDiagramDialog(diagramItemKey, operationType) 
{   
    debugger
    
    inputDiagramName.value = selectedRowDiagram.Nombre;
    inputDiagramName.disabled = true;

    $("#inputSelectOffice").autocomplete({
        source: function(request, response)
        {
            debugger;
            console.log("autocomplete");
            var text = $("#inputSelectOffice").val();
            var searchTerm = { officeToSearch: text }
            console.log("searchTerm", searchTerm);

            $.ajax({
                url: 'Home/SearchOffice',
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
                    alert("Error message: " + JSON.stringify(errormessage, null, 4));
                }
            });

        },
        minLength: 4,
        maxResults: 6, // Poner en todas las tablas
        appendTo: "#formularioCreateDiagram"
    });
    
}

// Element Functions

function prepareElementDialog(tableName, selectedRow, operationType)
{
    debugger
    
    if(operationType == addOperation)
    {
        inputDiagramNameSelected.value = selectedRow.Nombre;
        searchElement("#formularioCreateElement", "SearchQuestion", "Pregunta")
        $("#inputSearchElement").focus()
        $("#createElementModal").modal('show') 
    } 
    else if(operationType == editOperation) 
    {
        inputDiagramNameSelected.value = selectedRow.Diagrama;
        inputDiagramNameSelected.disabled = true
        searchElement("#formularioCreateElement", "SearchQuestion", "Pregunta")
        
        $("#createElementModal").modal('show') 
    }
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

function searchElement(formularioToAppend, methodToSeach, subcategory)
{
    $("#inputSearchElement").autocomplete({
        source: function(request, response)
        {
            var searchObject = new Object()
            searchObject.Text = $("#inputSearchElement").val()
            searchObject.Subcategory = subcategory

            var searchObjectJSON = JSON.stringify(searchObject)

            $.ajax({
                url: 'Home/'+methodToSeach,
                type: 'POST',
                contentType: 'application/json; charset=utf8',
                async: true,
                cache: false,
                data: searchObjectJSON,
                dataType: 'json',
                success: function(result)
                {
                    if (result != null) 
                    {
                        if(selectedElementType == "Categoria")
                        {
                            categoryList = result;
                            response(result.map(x=>x.Categoria))
                        }
                        else 
                        {
                            questionList = result;
                            response(result.map(x=>x.Pregunta))
                        }
                    }
                },
                error: function(errorMessage)
                {
                    alert("Error message: " + JSON.stringify(errorMessage, null, 4))
                }
            })
        },
        minLength: 4,
        maxResults: 6,
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
                /*url: 'Home/SearchQuestion',*/
                url: 'Home/SearchQuestionAddedToDiagram',
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
                        questionNextElementList = result;
                        response(result.map(x=>x.Pregunta));
                    }
                },
                error: function(errorMessage)
                {
                    alert("Error message: " + JSON.stringify(errorMessage, null, 4));
                }
            });
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
                url: 'Home/SearchOutputType',
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
                    alert("Error message: " + JSON.stringify(errorMessage, null, 4));
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

function hideAndResetModals(formID)
{
    debugger
    $(formID).modal('hide');
    $(formID).on('hidden.bs.modal', function () 
    {
        debugger
        $(formID).find('form').trigger('reset');
    });
}

function savingFunctions()
{
    /* Make method receive the name of the selector that the autocomplete will be attached */
    $("#btnCreateDiagram").click(function ()
    {
        debugger;
        /*
        var idOfficeFound; //create function getIdofficeSelected()

        if (officeList.length === 0) {
            // not found
        } else if (officeList.length === 1) {
            idOfficeFound = officeList[0].IdOficina
        } else {
            idOfficeFound = officeList.find(x => x.Oficina === $("#inputSelectOffice").val()).IdOficina
        }
        */

        if(selectedOffices == null)
        {
            alert("Debe seleccionar al menos una oficina ")
        } 
        else if(selectedOffices.length > 0)
        {
            //var idDiagramaSeleccionado = selectedRowDiagram.Id;
            //var diagramaSeleccionadoObj = {
            //    idDiagram: idDiagramaSeleccionado,
            //    Offices: selectedOffices
            //};

            var diagramObj = {
                diagramName: $("#inputDiagramName").val(), //object must be equal to the one in the db
                // idOficina: idOfficeFound
                Offices: selectedOffices
            }


            $.ajax({
                url: '/Home/AddDiagram',
                contentType: 'application/json; charset=utf-8',
                type: 'POST',
                async: true,
                cache: false,
                dataType: 'json',
                data: JSON.stringify(diagramObj),
                success: function (jResult) 
                {
                    debugger
                    if(jResult.result == false)
                    {
                        alert(jResult.message)
                    }
                
                    hideAndResetModals("#createDiagramModal")
                    reloadTableByEntity(diagramItemKey)
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Error message: " + JSON.stringify(errorThrown, null, 4));
                }
            });
        }

        
    });

    $("#btnCreateElement").click(function ()
    {
        
        debugger;

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
                    url: '/Home/AddElement',
                    contentType: 'application/json; charset=utf-8',
                    type: 'POST',
                    async: true,
                    cache: false,
                    dataType: 'json',
                    data: JSON.stringify(elementObj),
                    success: function (result) 
                    {
                        debugger;
                        $("#createElementModal").modal('hide');
                        $('#createElementModal').on('hidden.bs.modal', function () {
                            $(this).find('form').trigger('reset');
                        });
                        
                        reloadTableByEntity(selectedEntity)
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("Error message: " + JSON.stringify(result, null, 4));
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
                    url: '/Home/AddQuestion',
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
                            alert(resultAddCategory.message)
                        } else {

                            $("#createElementModal").modal('hide');
                            $('#createElementModal').on('hidden.bs.modal', function () {
                                $(this).find('form').trigger('reset');
                            });
                            //alert(result);
                            reloadTableByEntity(selectedEntity);

                            var elementObj = {
                                idDiagram: id_diagrama,
                                idPregunta:  resultAddCategory.Id, //object must be equal to the one in the db in all it's attributes
                            };
         
                            $.ajax({
                                url: '/Home/AddElement',
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
                                        alert(resultAddElement.message)
                                    } else {
                                        $("#createElementModal").modal('hide');
                                        $('#createElementModal').on('hidden.bs.modal', function () {
                                            $(this).find('form').trigger('reset');
                                        });
                                        //alert(result);
                                        reloadTableByEntity(selectedEntity);
                                    }
                                
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    alert("Error message: " + JSON.stringify(result, null, 4));
                                }
                            });
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("Error message: " + JSON.stringify(result, null, 4));
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
                    url: '/Home/AddQuestion',
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
                            url: '/Home/AddElement',
                            contentType: 'application/json; charset=utf-8',
                            type: 'POST',
                            async: true,
                            cache: false,
                            dataType: 'json',
                            data: JSON.stringify(elementObj),
                            success: function (result) 
                            {
                                debugger;
                                $("#createElementModal").modal('hide');
                                $('#createElementModal').on('hidden.bs.modal', function () {
                                    $(this).find('form').trigger('reset');
                                });
                                //alert(result.message);
                                reloadTableByEntity(selectedEntity);
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert("Error message: " + errorThrown);
                            }
                        });
                        
                        
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("Error message: " + errorThrown);
                    }
                });
                
                break;
        }

           
        

       
    });

    $("#btnCreateOutcome").click(function ()
    {
        //Ver el outcome e insertarlo en su tabla correspondiente
        
        //alert($("#ExpressionTypes").parent().find("select").id);
        var idExpression = $("#ExpressionTypes").select2('data')[0].id;


        switch (idExpression) {

            case "1":
                
                var numValueObj = {
                    numValue: $("#inputNumericValue").val()
                };

                $.ajax({
                    url: '/Home/AddNumericValue',
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
                            idNextQuestionFound = questionNextElementList.find(x => x.Pregunta === $("#inputNextElementId").val()).IdPregunta
                        }

                        var obj2 = {
                            idElement: selectedRowElement.Id,
                            outputType: $("#ExpressionTypes").select2('data')[0].text,
                            idExpression: idExpression,
                            idNextElement: idNextQuestionFound
                        };
                        
                        $.ajax({
                            url: '/Home/AddOutcomeTable',
                            contentType: 'application/json; charset=utf-8',
                            type: 'POST',
                            async: true,
                            cache: false,
                            dataType: 'json',
                            data: JSON.stringify(obj2),
                            success: function (result) 
                            {
                                debugger
                                $("#createOutcomeModal").modal('hide');
                                $('#createOutcomeModal').on('hidden.bs.modal', function () {
                                    $(this).find('form').trigger('reset');
                                })
                                reloadTableByEntity(selectedEntity);

                                //location.reload();
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert("Error message: " + JSON.stringify(result, null, 4));
                            }
                        });
                        
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("Error message: " + JSON.stringify(result, null, 4));
                    }
                });

                break;
            case "2":
                

                var boolValueObj = {
                    value: $("#YesOrNoType :selected").text()
                };
                
                
                $.ajax({
                    url: '/Home/AddBooleanValue',
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
                            idNextQuestionFound = questionNextElementList.find(x => x.Pregunta === $("#inputNextElementId").val()).IdPregunta
                        }

                        var obj2 = {
                            idElement: selectedRowElement.Id,
                            outputType: $("#ExpressionTypes").select2('data')[0].text,
                            idExpression: idExpression,
                            idNextElement: idNextQuestionFound
                        };
                        //alert(JSON.stringify(obj2))
                        
                        $.ajax({
                            url: '/Home/AddOutcomeTable',
                            contentType: 'application/json; charset=utf-8',
                            type: 'POST',
                            async: true,
                            cache: false,
                            dataType: 'json',
                            data: JSON.stringify(obj2),
                            success: function (result) 
                            {
                                debugger;   
                                $("#createOutcomeModal").modal('hide');
                                $('#createOutcomeModal').on('hidden.bs.modal', function () {
                                    $(this).find('form').trigger('reset');
                                })
                                // alert(result);
                                reloadTableByEntity(selectedEntity);
                                //location.reload();
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert("Error message: " + JSON.stringify(result, null, 4));
                            }
                        });
                        
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("Error message: " + JSON.stringify(result, null, 4));
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
                    url: '/Home/AddComparisonTable',
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
                            idNextQuestionFound = questionNextElementList.find(x => x.Pregunta === $("#inputNextElementId").val()).IdPregunta
                        }
                        
                        var obj2 = {
                            idElement: selectedRowElement.Id,
                            outputType: $("#ExpressionTypes").select2('data')[0].text,
                            idExpression: idExpression,
                            idNextElement: idNextQuestionFound
                        };
                        //alert(JSON.stringify(obj2))
                        
                        $.ajax({
                            url: '/Home/AddOutcomeTable',
                            contentType: 'application/json; charset=utf-8',
                            type: 'POST',
                            async: true,
                            cache: false,
                            dataType: 'json',
                            data: JSON.stringify(obj2),
                            success: function (result) 
                            {
                                debugger;   
                                $("#createOutcomeModal").modal('hide');
                                $('#createOutcomeModal').on('hidden.bs.modal', function () {
                                    $(this).find('form').trigger('reset');
                                })
                                //alert(result);
                                reloadTableByEntity(selectedEntity);
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert("Error message: " + JSON.stringify(result, null, 4));
                            }
                        });
                        
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("Error message: " + JSON.stringify(result, null, 4));
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
                    url: '/Home/AddRangeTable',
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
                            idNextQuestionFound = questionNextElementList.find(x => x.Pregunta === $("#inputNextElementId").val()).IdPregunta
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
                            url: '/Home/AddOutcomeTable',
                            contentType: 'application/json; charset=utf-8',
                            type: 'POST',
                            async: true,
                            cache: false,
                            dataType: 'json',
                            data: JSON.stringify(obj2),
                            success: function (result) 
                            {
                                debugger;
                                $("#createOutcomeModal").modal('hide');
                                $('#createOutcomeModal').on('hidden.bs.modal', function () {
                                    $(this).find('form').trigger('reset');
                                })
                                //alert(result);
                                reloadTableByEntity(selectedEntity);
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert("Error message: " + JSON.stringify(result, null, 4));
                            }
                        });
                        
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log(("Error XMLHttpRequest: " + JSON.stringify(XMLHttpRequest, null, 4)))
                        
                    }
                });
                
                break;
           
        
        }
       
    });
}

function editingFunctions()
{
    $("#btnEditDiagram").click(function ()
    {
        debugger;

        if(selectedOffices == null)
        {
            alert("Debe seleccionar al menos una oficina ")
        } 
        else //if(selectedOffices.length > 0)
        {
            //var diagramaSeleccionadoObj = {
            //    idDiagram: idDiagramaSeleccionado,
            //    Offices: selectedOffices
            //};
            debugger

            var idDiagramaSeleccionado = selectedRowDiagram.Id;
            var diagramObj = {
                diagramID: idDiagramaSeleccionado,
                diagramName: $("#inputEditDiagramName").val(), 
                Offices: selectedOffices
            }
            
            $.ajax({
                url: '/Home/EditDiagram',
                contentType: 'application/json; charset=utf-8',
                type: 'POST',
                async: true,
                cache: false,
                dataType: 'json',
                data: JSON.stringify(diagramObj),
                success: function (jResult) 
                {
                    debugger
                    if(jResult.result == false)
                    {
                        alert(jResult.message)
                    }
                    hideAndResetModals("#EditDiagramModal")
                    reloadTableByEntity(diagramItemKey)
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Error message: " + JSON.stringify(errorThrown, null, 4));
                }
            });
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
        debugger;
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
                    alert(resultDelete.message);
                    if(resultDelete.result == true)
                    {
                        reloadTableByEntity(selectedEntity);
                    } 
                },
                error:function(XMLHttpRequest, textStatus, errorThrown)
                {
                    alert("Error al eliminar: "+ JSON.stringify(errorThrown, null,4));
                }
            });
            
           
        } else {
            console.log("window[selectedEntity]:"+" is undefined");
        }
    });
    $("#deleteElementButton").click( function() 
    {
        debugger;
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
                    alert(resultDelete.message);
                    if(resultDelete.result == true)
                    {
                        reloadTableByEntity(selectedEntity);
                    } 
                },
                error:function(XMLHttpRequest, textStatus, errorThrown)
                {
                    alert("Error al eliminar: "+ JSON.stringify(errorThrown, null,4));
                }
            });
            
           
        } else {
            console.log("window[selectedEntity]:"+" is undefined");
        }
    });

    $("#deleteOutcomeButton").click( function() 
    {
        debugger;
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
                    alert(resultDelete.message);
                    if(resultDelete.result == true)
                    {
                        reloadTableByEntity(selectedEntity);
                    } 
                },
                error:function(XMLHttpRequest, textStatus, errorThrown)
                {
                    alert("Error al eliminar: "+ JSON.stringify(errorThrown, null,4));
                }
            });
            
           
        } else {
            console.log("window[selectedEntity]:"+" is undefined");
        }
    });

    //
    //deleteOutcomeButton


    //$(".glyphicon-remove").click( function() {
    //    console.log("deleteEntity");
    //    console.log("selectedEntity:"+ selectedEntity);

    //    var selectedRow = getSelectedRowBySelectedEntity(selectedEntity)

    //    if(selectedRow != null)
    //    {
    //        debugger;
    //        var selectedObject = new Object();
    //        selectedObject.entity = selectedEntity;
    //        selectedObject.idEntity = selectedRow.Id;
    //        var jsonEntity = JSON.stringify(selectedObject);

    //        $.ajax({
    //            url: '/Home/DeleteFromFromEntity',
    //            type: 'POST',
    //            contentType: 'application/json; charset=utf-8',
    //            async: true,
    //            cache: false,
    //            data: jsonEntity,
    //            dataType: 'json',
    //            success: function(resultDelete)
    //            {
    //                alert(resultDelete.message);
    //                if(resultDelete.result == true)
    //                {
    //                    reloadTableByEntity(selectedEntity);
    //                } 
    //            },
    //            error:function(XMLHttpRequest, textStatus, errorThrown)
    //            {
    //                alert("Error al eliminar: "+ JSON.stringify(errorThrown, null,4));
    //            }
    //        });
            
           
    //    } else {
    //        console.log("window[selectedEntity]:"+" is undefined");
    //    }
    //});

}
