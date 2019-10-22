using NeedOfVigilante.Controllers;
using NeedOfVigilante.Models.ExpressionTypes;
using NeedOfVigilante.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NeedOfVigilante.Models
{
    public class ElementEvaluation
    {
        private List<Element> elements;
        private DbContextDataContext dc = new DbContextDataContext();
        private List<HistoricTable> listHistoricRun;
        private vmDiagramasOficinas diagramasOficinas;

        public ElementEvaluation(List<Element> elements, vmDiagramasOficinas diagramasOficinas)
        {
            this.elements = elements;
            this.diagramasOficinas = diagramasOficinas;
            listHistoricRun = new List<HistoricTable>();
        }

        //Ajustar cambios de diagramas
        public List<int> RunElement(string idOficina)
        {
            List<int> nextIdElements = new List<int>();
            OfficeTable officeTable = dc.OfficeTables.Where(o => o.IdOficina == idOficina).FirstOrDefault();

            foreach (Element element in elements)
            {
                HistoricTable historicRun = new HistoricTable();
                historicRun.idDiagram =  diagramasOficinas.diagramID;
                historicRun.idOficina = idOficina;
                historicRun.NombreOficina = officeTable.Oficina;
                historicRun.idElement = element.id;
                historicRun.ResultadoElemento = element.entryValue;
                historicRun.CategoriaElemento = element.subcategory;
                historicRun.idPregunta = element.idQuestion;
                historicRun.Pregunta = element.question;
                historicRun.date = DateTime.Now;

                int idElement = 0;
                foreach(Outcome outcome in element.outcomes)
                {
                    switch (outcome.outputType)
                    {
                        case MyEnums.InputOutputTypes.NumericValue:

                            idElement = new NumericValue().evaluateExpression(element, outcome);
                            if (idElement > 0)
                            {
                                historicRun.idOutcome = outcome.id;
                                Expression exp = outcome.outputExpression;
                                OutcomeTable outcomeTable = dc.OutcomeTables.Where(o => o.id == outcome.id).FirstOrDefault();
                                int idExpression = outcomeTable.idExpression;
                                string outputTypeString = outcomeTable.outputType;
                                string valueOutput = new OutcomeController().getValueFromExpression(outputTypeString, idExpression);
                                historicRun.valueOutput = valueOutput;
                            }
                            break;

                        case MyEnums.InputOutputTypes.YesOrNo:

                            idElement = new TextValue().evaluateExpression(element, outcome);
                            if (idElement > 0)
                            {
                                historicRun.idOutcome = outcome.id;
                                Expression exp = outcome.outputExpression;
                                OutcomeTable outcomeTable = dc.OutcomeTables.Where(o => o.id == outcome.id).FirstOrDefault();
                                int idExpression = outcomeTable.idExpression;
                                string outputTypeString = outcomeTable.outputType;
                                string valueOutput = new OutcomeController().getValueFromExpression(outputTypeString, idExpression);
                                historicRun.valueOutput = valueOutput;
                            }
                            break;

                        case MyEnums.InputOutputTypes.Comparison:

                            idElement = new Comparison().evaluateExpression(element, outcome);
                            if (idElement > 0)
                            {
                                historicRun.idOutcome = outcome.id;
                                Expression exp = outcome.outputExpression;
                                OutcomeTable outcomeTable = dc.OutcomeTables.Where(o => o.id == outcome.id).FirstOrDefault();
                                int idExpression = outcomeTable.idExpression;
                                string outputTypeString = outcomeTable.outputType;
                                string valueOutput = new OutcomeController().getValueFromExpression(outputTypeString, idExpression);
                                historicRun.valueOutput = valueOutput;
                            }
                            break;

                        case MyEnums.InputOutputTypes.Range:

                            idElement = new Range().evaluateExpression(element, outcome);
                            if (idElement > 0)
                            {
                                historicRun.idOutcome = outcome.id;
                                Expression exp = outcome.outputExpression;
                                OutcomeTable outcomeTable = dc.OutcomeTables.Where(o => o.id == outcome.id).FirstOrDefault();
                                int idExpression = outcomeTable.idExpression;
                                string outputTypeString = outcomeTable.outputType;
                                string valueOutput = new OutcomeController().getValueFromExpression(outputTypeString, idExpression);
                                historicRun.valueOutput = valueOutput;
                            }
                            break;
                    }
                    
                    //Buscar con el id del proximo elemento la categoria
                    ElementTable proximoElemento = dc.ElementTables.Where(e => e.id == idElement).FirstOrDefault();
                    if (idElement != 0 && proximoElemento != null && proximoElemento.QuestionTable.SubCategoria != "Resultado" && proximoElemento.QuestionTable.SubCategoria != "Categoria")
                    {
                        nextIdElements.Add(idElement);
                        break;
                    }
                    else if (proximoElemento != null && proximoElemento.QuestionTable.SubCategoria == "Resultado")
                    {
                        dc.HistoricTables.InsertOnSubmit(historicRun);
                        dc.SubmitChanges();

                        nextIdElements.Add(idElement);
                        HistoricTable historicRunResult = new HistoricTable();
                        historicRunResult.idDiagram = diagramasOficinas.diagramID;
                        historicRunResult.idElement = proximoElemento.id;
                        historicRunResult.idPregunta = proximoElemento.idPregunta;
                        historicRunResult.Pregunta = proximoElemento.QuestionTable.Pregunta;
                        historicRunResult.idOficina = idOficina;
                        historicRunResult.NombreOficina = officeTable.Oficina;
                        historicRunResult.ResultadoElemento = proximoElemento.QuestionTable.Pregunta;
                        historicRunResult.CategoriaElemento = proximoElemento.QuestionTable.SubCategoria;
                        historicRunResult.date = DateTime.Now;
                        dc.HistoricTables.InsertOnSubmit(historicRunResult);
                        dc.SubmitChanges();

                        return nextIdElements;
                    }
                }
                dc.HistoricTables.InsertOnSubmit(historicRun);
                dc.SubmitChanges();
            }
            return nextIdElements;
        }

        private string getOutcomeValue(Outcome outcome)
        {
            switch (outcome.outputType)
            {
                case MyEnums.InputOutputTypes.YesOrNo:

                    break;
                case MyEnums.InputOutputTypes.NumericValue:
                    break;
                case MyEnums.InputOutputTypes.Comparison:
                    break;
                case MyEnums.InputOutputTypes.Range:
                    break;
                default:
                    break;
            }
            return "";
        }
    }
}