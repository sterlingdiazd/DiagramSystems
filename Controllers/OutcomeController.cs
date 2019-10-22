using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using NeedOfVigilante.Models;

namespace NeedOfVigilante.Controllers
{
    public class OutcomeController : DataAccessController
    {
        //OUTCOMES

        public string GetOutcomeJson()
        {
            var fullOutcome = dc.OutcomeTables.Select(outcome => new
            {
                Id = outcome.id,
                idElement = outcome.idElement,
                outputType = outcome.outputType,
                idExpression = outcome.idExpression,
                Valor = getValueFromExpression(outcome.outputType, outcome.idExpression),
                idNextElement = outcome.idNextElement,
                ProximoElemento = dc.ElementTables.Where(et => et.id == outcome.idNextElement).FirstOrDefault().QuestionTable.Pregunta
            });

            string result = javaScriptSerializer.Serialize(fullOutcome);
            return result;
        }

        public JsonResult AddOutcomeTable(OutcomeTable outcomeTable)
        {
            JResult jResult = new JResult();
            try
            {
                outcomeTable.idNextElement = dc.ElementTables.Where(et => et.idPregunta == outcomeTable.idNextElement).FirstOrDefault().id;
                dc.OutcomeTables.InsertOnSubmit(outcomeTable);
                dc.SubmitChanges();
                jResult.result = true;
                jResult.message = "Salida agregada satisfactoriamente";

            }
            catch (Exception e)
            {
                jResult.result = true;
                jResult.message = "Se produjo un error al agregar la salida. Contacte al Administrador del Sistema";
                jResult.exceptionMessage = e.Message;
                persistException.Save(e, PersistException.ImpactLevel.High, jResult.message);

            }

            return Json(jResult, JsonRequestBehavior.AllowGet);
        }

        public string getValueFromExpression(string outputType, int idExpression)
        {
            string value = String.Empty;

            switch (outputType)
            {
                case "Valor Numérico":

                    value = dc.NumericValueTables.Where(nv => nv.id == idExpression).FirstOrDefault().numValue.ToString();
                    break;

                case "Valor Alfabético/Booleano":

                    value = dc.AlphabheticBooleanTables.Where(nv => nv.id == idExpression).FirstOrDefault().value;
                    break;

                case "Comparación":

                    ComparisonTable comparison = dc.ComparisonTables.Where(nv => nv.id == idExpression).FirstOrDefault();
                    string unknownValueComparison = "x";
                    string operatorSymbol = comparison.OperatorTable.@operator;
                    string knownValue = comparison.knownValue.ToString();
                    value = unknownValueComparison + operatorSymbol + knownValue;
                    break;

                case "Rango":

                    RangeTable range = dc.RangeTables.Where(nv => nv.id == idExpression).FirstOrDefault();
                    string firstKnownValue = range.firstKnownValue.ToString();
                    string idFirstComparisonOperator = dc.OperatorTables.Where(idOp => idOp.id == range.idFirstComparisonOperator).FirstOrDefault().@operator;
                    string unknownValueRange = "x";
                    string idSecondComparisonOperator = dc.OperatorTables.Where(idOp => idOp.id == range.idSecondComparisonOperator).FirstOrDefault().@operator;
                    string secondKnownValue = range.secondKnownValue.ToString();
                    value = firstKnownValue + idFirstComparisonOperator + unknownValueRange + idSecondComparisonOperator + secondKnownValue;
                    break;
            }
            return value;
        }

        public static List<Outcome> adaptOutcomeTableToBasicOutcome(List<OutcomeTable> outcomeTableList)
        {
            List<Outcome> outcomeList = new List<Outcome>();
            foreach (OutcomeTable outcomeTable in outcomeTableList)
            {
                Outcome outcome = new Outcome();
                outcome.id = outcomeTable.id;
                outcome.nextIdElement = outcomeTable.idNextElement;
                outcome.outputType = new OutputTypeController().getOutputType(outcomeTable.outputType);
                outcome.outputExpression = new ExpressionTypeController().getExpression(outcomeTable.outputType, outcomeTable.idExpression);
                outcomeList.Add(outcome);
            }
            return outcomeList;
        }
    
    }
}
