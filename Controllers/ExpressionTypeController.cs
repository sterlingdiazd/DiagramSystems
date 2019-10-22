using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using NeedOfVigilante.Models;
using NeedOfVigilante.Models.ExpressionTypes;
namespace NeedOfVigilante.Controllers
{
    public class ExpressionTypeController : DataAccessController
    {
        public Expression getExpression(string outputType, int idExpression)
        {
            Expression expression = null;

            switch (outputType)
            {
                case "Valor Numérico":

                    NumericValueTable numValueTable = dc.NumericValueTables.Where(nv => nv.id == idExpression).FirstOrDefault();
                    NumericValue numValue = new NumericValue();
                    numValue.value = numValueTable.numValue;
                    expression = numValue;
                    break;

                case "Valor Alfabético/Booleano":

                    AlphabheticBooleanTable alphabheticBooleanTable = dc.AlphabheticBooleanTables.Where(nv => nv.id == idExpression).FirstOrDefault();
                    TextValue textValue = new TextValue();
                    textValue.value = alphabheticBooleanTable.value;
                    expression = textValue;
                    break;

                case "Comparación":

                    ComparisonTable comparisonTable = dc.ComparisonTables.Where(nv => nv.id == idExpression).FirstOrDefault();
                    Comparison comparison = new Comparison();
                    comparison.unknownValue = Double.Parse(comparisonTable.unknownValue.ToString());
                    comparison.comparisonOperator = getOperatorEnum(comparisonTable.OperatorTable.@operator);
                    comparison.knownValue = Double.Parse(comparisonTable.knownValue.ToString());
                    expression = comparison;
                    break;

                case "Rango":

                    RangeTable rangeTable = dc.RangeTables.Where(nv => nv.id == idExpression).FirstOrDefault();
                    Range range = new Range();
                    range.firstKnownValue = Double.Parse(range.firstKnownValue.ToString());
                    range.firstComparisonOperator = getOperatorEnum(dc.OperatorTables.Where(idOp => idOp.id == rangeTable.idFirstComparisonOperator).FirstOrDefault().@operator);
                    range.unknownValue = Double.Parse(rangeTable.unknownValue.ToString());
                    range.secondComparisonOperator = getOperatorEnum(dc.OperatorTables.Where(idOp => idOp.id == rangeTable.idSecondComparisonOperator).FirstOrDefault().@operator);
                    range.secondKnownValue = Double.Parse(range.secondKnownValue.ToString());
                    expression = range;
                    break;
            }

            return expression;
        }

        public MyEnums.Operators getOperatorEnum(string operatorValue)
        {
            MyEnums.Operators operatorVal = MyEnums.Operators.LessThan;
            switch (operatorValue)
            {
                case "<":
                    operatorVal = MyEnums.Operators.LessThan;
                    break;
                case ">":
                    operatorVal = MyEnums.Operators.MoreThan;
                    break;
                case ">=":
                    operatorVal = MyEnums.Operators.MoreAndEqualTo;
                    break;
                case "<=":
                    operatorVal = MyEnums.Operators.LessAndEqualTo;
                    break;
                case "==":
                    operatorVal = MyEnums.Operators.Equal;
                    break;
                case "<>":
                    operatorVal = MyEnums.Operators.NotEqual;
                    break;
            }

            return operatorVal;
        }

        public JsonResult AddNumericValue(NumericValueTable numericValueTable)
        {
            JResult jResult = new JResult();
            try
            {
                dc.NumericValueTables.InsertOnSubmit(numericValueTable);
                dc.SubmitChanges();
            }
            catch (Exception e)
            {
                jResult.exceptionMessage = e.Message;
                persistException.Save(e, PersistException.ImpactLevel.High, jResult.message);
            }

            return Json(numericValueTable.id, JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddBooleanValue(AlphabheticBooleanTable alphabheticBooleanTable)
        {
            JResult jResult = new JResult();
            try
            {
                dc.AlphabheticBooleanTables.InsertOnSubmit(alphabheticBooleanTable);
                dc.SubmitChanges();
            }
            catch (Exception e)
            {
                jResult.exceptionMessage = e.Message;
                persistException.Save(e, PersistException.ImpactLevel.High, jResult.message);
            }

            return Json(alphabheticBooleanTable.id, JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddComparisonTable(ComparisonTable comparisonTable)
        {
            JResult jResult = new JResult();
            try
            {
                dc.ComparisonTables.InsertOnSubmit(comparisonTable);
                dc.SubmitChanges();
            }
            catch (Exception e)
            {
                jResult.exceptionMessage = e.Message;
                persistException.Save(e, PersistException.ImpactLevel.High, jResult.message);
            }

            return Json(comparisonTable.id, JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddRangeTable(RangeTable rangeTable)
        {
            JResult jResult = new JResult();
            try
            {
                dc.RangeTables.InsertOnSubmit(rangeTable);
                dc.SubmitChanges();
            }
            catch (Exception e)
            {
                jResult.exceptionMessage = e.Message;
                persistException.Save(e, PersistException.ImpactLevel.High, jResult.message);
            }

            return Json(rangeTable.id, JsonRequestBehavior.AllowGet);
        }

    }
}
