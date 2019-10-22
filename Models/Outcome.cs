using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NeedOfVigilante.Models
{
    public class Outcome 
    {
        public int id { get; set; }
        // May should not be needed here   public String category { get; set; } // question (result is )/range
        public MyEnums.InputOutputTypes outputType { get; set; } // Example: NumericValue // Consider using System.Type
        public Expression outputExpression { get; set; }  // Value to compare from result of question. Ex.: 90
        public int nextIdElement { get; set; }

        public static Outcome addOutcome(MyEnums.InputOutputTypes outcomeType, Expression outcomeExpression, int nextIdElement)
        {
            Outcome outcome = new Outcome();
            outcome.outputType = outcomeType;
            outcome.outputExpression = outcomeExpression;
            outcome.nextIdElement = nextIdElement;
            return outcome;
        }
    }
}


