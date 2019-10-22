using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NeedOfVigilante.Models
{
    public class NumericValue : Expression
    {
        public double value { get; set; }

        public override int evaluateExpression(Element element, Outcome outcome)
        {
            int idElement = 0;

            NumericValue numValue = (NumericValue) outcome.outputExpression;

            if (numValue.value == Double.Parse(element.entryValue))
            {
                idElement = outcome.nextIdElement;
            }
            return idElement;
        }
    }


}