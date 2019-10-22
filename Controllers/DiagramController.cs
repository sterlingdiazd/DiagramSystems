
using NeedOfVigilante.Models;
using NeedOfVigilante.Models.ExpressionTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NeedOfVigilante.Controllers
{
    public class DiagramController : DataAccessController
    {
        //DIAGRAMS

        public string GetDiagramsJson()
        {
            var diagramasList = dc.DiagramTables.Select(E => new
            {
                Id = E.id,
                Nombre = E.name
            });
            string result = javaScriptSerializer.Serialize(diagramasList);
            return result;
        }

        public JsonResult AddDiagram(vmDiagramasOficinas diagramasOficinas)
        {
            JResult jResult = new JResult();
            //Agregar diagrama si no existe, 
            //y luego agregar las oficinas que tiene asociada ese diagrama, si tiene

            //si el diagrama no existe, agregarlo

            if (diagramasOficinas.diagramName != null && diagramasOficinas.diagramName.Count() > 0 && dc.DiagramTables.Where(d => d.name.Contains(diagramasOficinas.diagramName)).ToList().Count() <= 0)
            {
                DiagramTable diagramTable = new DiagramTable();
                diagramTable.name = diagramasOficinas.diagramName;
                try
                {
                    dc.DiagramTables.InsertOnSubmit(diagramTable);
                    dc.SubmitChanges();

                    QuestionTable questionTable = new QuestionTable();
                    questionTable.Pregunta = diagramTable.name;
                    questionTable.Categoria = "";
                    questionTable.SubCategoria = "Diagrama";

                    List<QuestionTable> questionList = dc.QuestionTables.Where(q => q.Pregunta.Contains(questionTable.Pregunta) && q.SubCategoria.Equals(questionTable.SubCategoria)).ToList();

                    if (questionList.Count() <= 0)
                    {
                        dc.QuestionTables.InsertOnSubmit(questionTable);
                        dc.SubmitChanges();
                    }

                }
                catch (Exception e)
                {
                    jResult.result = false;
                    jResult.message = "No se pudo agregar el diagrama. \n" + e.Message;
                    jResult.exceptionMessage = e.Message;
                    persistException.Save(e, PersistException.ImpactLevel.High, jResult.message);
                }

                //Agregar, en la tabla intermedia, las oficinas relacionadas
                foreach (OfficeTable officeTable in diagramasOficinas.Offices)
                {
                    DiagramOfficeTable diagramOfficeTable = new DiagramOfficeTable();
                    diagramOfficeTable.idDiagram = diagramTable.id;
                    diagramOfficeTable.idOffice = officeTable.IdOficina;
                    dc.DiagramOfficeTables.InsertOnSubmit(diagramOfficeTable);
                    dc.SubmitChanges();
                }

                jResult.result = true;
                jResult.message = "Diagrama creado Satisfactoriamente";
            }
            else
            {
                jResult.result = false;
                jResult.message = "Diagrama no pudo ser creado. Debe seleccionar un nombre y una o más oficinas";
            }

            return Json(jResult, JsonRequestBehavior.AllowGet);
        }

        public JsonResult EditDiagram(vmDiagramasOficinas diagramasOficinas)
        {
            JResult jResult = new JResult();
            //Agregar diagrama si no existe, 
            //y luego agregar las oficinas que tiene asociada ese diagrama, si tiene

            //si el diagrama no existe, agregarlo
            DiagramTable diagramTable = dc.DiagramTables.Where(d => d.id == diagramasOficinas.diagramID).FirstOrDefault();

            if (diagramTable != null)
            {
                try
                {
                    diagramTable.name = diagramasOficinas.diagramName;

                    //Limpiar tables y luego insertar las oficinas seleccionadas luego de la edicion
                    dc.DiagramOfficeTables.DeleteAllOnSubmit(dc.DiagramOfficeTables.Where(dOf => dOf.idDiagram == diagramasOficinas.diagramID));

                    //Agregar, en la tabla intermedia, las oficinas relacionadas
                    foreach (OfficeTable officeTable in diagramasOficinas.Offices)
                    {
                        DiagramOfficeTable diagramOfficeTable = new DiagramOfficeTable();
                        diagramOfficeTable.idDiagram = diagramTable.id;
                        diagramOfficeTable.idOffice = officeTable.IdOficina;
                        dc.DiagramOfficeTables.InsertOnSubmit(diagramOfficeTable);

                    }

                    jResult.result = true;
                    jResult.message = "Diagrama creado Satisfactoriamente";

                    dc.SubmitChanges();
                }
                catch (Exception e)
                {
                    jResult.result = false;
                    jResult.message = "No se pudo agregar el diagrama. \n" + e.Message;
                    jResult.exceptionMessage = e.Message;
                    persistException.Save(e, PersistException.ImpactLevel.High, jResult.message);
                }
            }
            else
            {
                jResult.result = false;
                jResult.message = "Diagrama no encontrado";
            }

            return Json(jResult, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SearchDiagram(string Text, string Subcategory)
        {
            var questionList = dc.QuestionTables.Where(x => x.Pregunta.Contains(Text) && x.SubCategoria.Equals(Subcategory)).Select(S => new { IdPregunta = S.Id, Pregunta = S.Pregunta }).ToList();
            return Json(questionList, JsonRequestBehavior.AllowGet);
        }


        public JsonResult EvaluateDiagram(vmDiagramasOficinas diagramasOficinas)
        {
            //Metodo recibe un diagrama con sus elementos y salidas a evaluar.
            List<vmResultMessage> vmResultMessages = new List<vmResultMessage>();
            List<JResult> jResults = new List<JResult>();
            String result = String.Empty;

            //Buscar diagrama por id:
            DiagramTable diagram = dc.DiagramTables.Where(d => d.id == diagramasOficinas.diagramID).FirstOrDefault();

            List<DiagramOfficeTable> diagramOfficeTableList = dc.DiagramOfficeTables.Where(ot => ot.idDiagram == diagram.id).ToList();

            if (diagramOfficeTableList.Count <= 0)
            {
                JResult jResult = new JResult();
                jResult.result = false;
                jResult.message = "No hay oficinas asociadas al diagrama: " + diagram.name;
                jResults.Add(jResult);
            }
            else
            {
                List<OfficeTable> officeList = new List<OfficeTable>();
                foreach (DiagramOfficeTable diagramOfficeTable in diagramOfficeTableList)
                {
                    OfficeTable office = dc.OfficeTables.Where(o => o.IdOficina == diagramOfficeTable.idOffice).FirstOrDefault();
                    officeList.Add(office);
                }

                foreach (OfficeTable office in officeList)
                {
                    JResult jResult = new JResult();
                    List<ElementTable> elementTableList = diagram.ElementTables.Where(p => p.QuestionTable.SubCategoria != "Resultado").ToList();
                    List<Element> elementList = new List<Element>();
                    List<int> nextItems = new List<int>();

                    foreach (ElementTable elementTable in elementTableList)
                    {
                        Element element = new Element();
                        element.id = elementTable.id;
                        element.idBranchOffice = office.IdOficina;
                        element.idQuestion = elementTable.idPregunta;
                        element.question = elementTable.QuestionTable.Pregunta;
                        element.category = elementTable.QuestionTable.Categoria;
                        string categoryParam = elementTable.QuestionTable.SubCategoria;
                        element.subcategory = categoryParam;

                        string resultado = String.Empty;
                        if (element.subcategory == "Diagrama")
                        {
                            String resultadoLargo = dc.fn_GetResultFromDiagramQuestion(element.idQuestion.ToString(), element.idBranchOffice.ToString(), "Resultado");
                            resultado = TextValue.checkForBooleanResult(resultadoLargo);
                        }
                        else
                        {
                            resultado = dc.fn_GetResultado(office.IdOficina, categoryParam, element.question);
                        }

                        if (resultado != null)
                        {
                            element.entryValue = resultado;
                            element.entryType = EntryType.determinteEntryType(element.entryValue);
                            //Buscar los outcomes con el id del elemento
                            List<OutcomeTable> outcomeTableList = dc.OutcomeTables.Where(o => o.idElement == elementTable.id).ToList();
                            if (outcomeTableList.Count > 0)
                            {
                                try
                                {
                                    element.outcomes = OutcomeController.adaptOutcomeTableToBasicOutcome(outcomeTableList);
                                    elementList.Add(element);
                                }
                                catch (Exception e)
                                {
                                    jResult.result = false;
                                    jResult.exceptionMessage = e.Message;
                                    persistException.Save(e, PersistException.ImpactLevel.High, jResult.message);
                                }

                            }
                            else
                            {
                                jResult.result = false;
                                jResult.message = "Todos los elementos deben tener al menos 1 salida. \nEl Elemento \"" + element.question + "\" debe no posee salidas asociadas.";
                                logWrapper.log(jResult.message, MyEnums.OperationTypes.LOGIC);

                                Exception e = new Exception();
                                persistException.Save(e, PersistException.ImpactLevel.High, jResult.message);
                            }
                        }
                        else
                        {
                            jResult.result = false;
                            jResult.message = "No hay resultados para la pregunta: " + element.question + ", oficina: " + office.IdOficina + " y diagrama: " + diagramasOficinas.diagramID + ".";
                        }
                    }

                    try
                    {
                        ElementEvaluation elementOperator = new ElementEvaluation(elementList, diagramasOficinas);
                        nextItems = elementOperator.RunElement(office.IdOficina);

                        ElementTable ultimoElemento = dc.ElementTables.Where(p => p.id == nextItems.Last()).FirstOrDefault();
                        String resultado = ultimoElemento.QuestionTable.Pregunta;
                        jResult.vmResultMessage = new vmResultMessage(diagram.id.ToString(), diagram.name, office.IdOficina, office.Oficina, resultado);
                        jResult.message = "El resultado del diagrama " + diagram.name + "(" + diagram.id + ")" + " para la oficina " + office.Oficina + "(" + office.IdOficina + ")" + " es: " + resultado;
                        jResult.result = true;

                        try
                        {
                            logWrapper.log("Resultado de la evaluación", MyEnums.OperationTypes.LOGIC);
                        }
                        catch (Exception e)
                        {
                            persistException.Save(e, PersistException.ImpactLevel.High);
                        }

                        jResults.Add(jResult);




                    }
                    catch (System.Exception e)
                    {
                        jResult.result = false;
                        jResult.message = "No hay datos para analizar para el diagrama: " + diagram.name + "(" + diagram.id + ")" + " para la oficina " + office.Oficina + "(" + office.IdOficina + ")";
                        jResult.exceptionMessage = e.Message;
                        persistException.Save(e, PersistException.ImpactLevel.High, jResult.message);
                    }


                }
            }

            return Json(jResults, JsonRequestBehavior.AllowGet);
        }

        // LOS SIGUIENTES METODOS PUEDEN SER CREADOS O BORRADOS SI NO SE NECESITAN:
        //
        // GET: /Diagrams/

        public ActionResult Index()
        {
            ViewBag.ExpressionTypes = Utils.Lists.getExpressionTypes();
            ViewBag.YesOrNoType = Utils.Lists.getYesOrNoOutputTypes();
            ViewBag.OperatorSymbol = Utils.Lists.getOperatorSymbols();
            
            return View();
        }

        //
        // GET: /Diagrams/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /Diagrams/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /Diagrams/Create

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Diagrams/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /Diagrams/Edit/5

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Diagrams/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /Diagrams/Delete/5

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
