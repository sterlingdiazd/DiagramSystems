using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NeedOfVigilante.Models
{
    public class Range : Expression
    {
        public double firstKnownValue;
        public MyEnums.Operators firstComparisonOperator { get; set; }
        public double unknownValue { get; set; }
        public MyEnums.Operators secondComparisonOperator { get; set; }
        public double secondKnownValue;

        public override int evaluateExpression(Element element, Outcome outcome)
        {
            int nextIdElement = 0;
            //Since the outcome it's a range, the expression type is Range 
            //and and should compare the values of the entryValye according to the operators defined
            Range range = (Range) outcome.outputExpression;
            range.unknownValue = Double.Parse(element.entryValue);

            List<MyEnums.Operators> operators = new List<MyEnums.Operators>();
            operators.Add(range.firstComparisonOperator);
            operators.Add(range.secondComparisonOperator);

            List<Comparison> comparisons = new List<Comparison>();

            Comparison firstComparison = new Comparison();
            firstComparison.unknownValue = range.unknownValue;
            firstComparison.comparisonOperator = range.firstComparisonOperator;
            firstComparison.knownValue = range.firstKnownValue;
            comparisons.Add(firstComparison);

            Comparison secondComparison = new Comparison();
            secondComparison.unknownValue = range.unknownValue;
            secondComparison.comparisonOperator = range.secondComparisonOperator;
            secondComparison.knownValue = range.secondKnownValue;
            comparisons.Add(secondComparison);

            for (int x = 0; x < comparisons.Count; x++)
            {
                //Evaluate the outcomes that are fullfil the comparison with the EntryValue.
                switch (operators.ElementAt(x))
                {
                    case MyEnums.Operators.LessAndEqualTo:

                        if (comparisons.ElementAt(x).unknownValue <= comparisons.ElementAt(x).knownValue)
                        {
                            comparisons.ElementAt(x).fulfillCondition = true;
                        }
                        break;

                    case MyEnums.Operators.LessThan:

                        if (comparisons.ElementAt(x).unknownValue < comparisons.ElementAt(x).knownValue)
                        {
                            comparisons.ElementAt(x).fulfillCondition = true;
                        }
                        break;

                    case MyEnums.Operators.MoreAndEqualTo:

                        if (comparisons.ElementAt(x).unknownValue >= comparisons.ElementAt(x).knownValue)
                        {
                            comparisons.ElementAt(x).fulfillCondition = true;
                        }
                        break;

                    case MyEnums.Operators.MoreThan:

                        if (comparisons.ElementAt(x).unknownValue > comparisons.ElementAt(x).knownValue)
                        {
                            comparisons.ElementAt(x).fulfillCondition = true;
                        }
                        break;
                }
            }

            if (firstComparison.fulfillCondition == true && secondComparison.fulfillCondition == true)
            {
                //This is the outcome to go!
                nextIdElement = outcome.nextIdElement;
            }

            return nextIdElement;
        }
    }
}