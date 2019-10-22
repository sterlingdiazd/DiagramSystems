using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NeedOfVigilante.Models
{
    public class Comparison : Expression
    {
        public double unknownValue { get; set; }
        public MyEnums.Operators comparisonOperator { get; set; }
        public double knownValue;
        public bool fulfillCondition { get; set; }

        public override int evaluateExpression(Element element, Outcome outcome)
        {
            int nextIdElement = 0;

            //Since the outcome it's a comparison, the expression type is Comparison 
            //and and should compare the values of the entryValye according to the operator defined
            Comparison comparison = (Comparison) outcome.outputExpression;
            comparison.unknownValue = Double.Parse(element.entryValue);
            

            //Evaluate the outcomes that are fullfil the comparison with the EntryValue.
            switch (comparison.comparisonOperator)
            {
                case MyEnums.Operators.LessAndEqualTo:
                    if (comparison.unknownValue <= comparison.knownValue)
                    {
                        nextIdElement = outcome.nextIdElement;
                    }
                    break;
                case MyEnums.Operators.LessThan:
                    if (comparison.unknownValue < comparison.knownValue)
                    {
                        nextIdElement = outcome.nextIdElement;
                    }
                    break;
                case MyEnums.Operators.MoreAndEqualTo:
                    if (comparison.unknownValue >= comparison.knownValue)
                    {
                        nextIdElement = outcome.nextIdElement;
                    }
                    break;
                case MyEnums.Operators.MoreThan:
                    if (comparison.unknownValue > comparison.knownValue)
                    {
                        nextIdElement = outcome.nextIdElement;
                    }
                    break;
            }

            return nextIdElement;
        }
    }
}