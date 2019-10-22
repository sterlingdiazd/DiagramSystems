using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NeedOfVigilante.Models.ExpressionTypes
{
    public class TextValue : Expression
    {
        public string value { get; set; }

        public override int evaluateExpression(Element element, Outcome outcome)
        {
            int idElement = 0;

            TextValue textValue = (TextValue)outcome.outputExpression;

            if (textValue.value.ToLower().Equals(element.entryValue.ToLower()))
            {
                idElement = outcome.nextIdElement;
            }
            return idElement;
        }

        public static string checkForBooleanResult(string result)
        {
            string resultChecked = null;
            if (result != null && result.Length >= 0)
            {
                if (result.Contains("Si"))
                {
                    resultChecked = "Si";
                }
                else if (result.Contains("No"))
                {
                    resultChecked = "No";
                }
            }
            return resultChecked;

        }
    }
}

