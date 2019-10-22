using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using NeedOfVigilante.Models;
namespace NeedOfVigilante.Controllers
{
    public class OutputTypeController : DataAccessController
    {
        public MyEnums.InputOutputTypes getOutputType(string outputTypeString)
        {
            MyEnums.InputOutputTypes outputType = MyEnums.InputOutputTypes.NumericValue;
            switch (outputTypeString)
            {
                case "Valor Numérico":
                    outputType = MyEnums.InputOutputTypes.NumericValue;
                    break;

                case "Valor Alfabético/Booleano":
                    outputType = MyEnums.InputOutputTypes.YesOrNo;
                    break;
                case "Comparación":
                    outputType = MyEnums.InputOutputTypes.Comparison;
                    break;
                case "Rango":
                    outputType = MyEnums.InputOutputTypes.Range;
                    break;
            }
            return outputType;
        }

        public JsonResult SearchOutputType(string Text)
        {
            var outputTypeList = dc.ExpressionTypeTables.Where(x => x.expressionType.Contains(Text)).Select(S => new { Id = S.id, expressionType = S.expressionType }).ToList();
            return Json(outputTypeList, JsonRequestBehavior.AllowGet);
        }
    }
}
