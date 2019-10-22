using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NeedOfVigilante.Models
{
    public abstract class Expression
    {
        public abstract int evaluateExpression(Element element, Outcome outcome);

        public List<Outcome> selectOutcomesOfSameType(List<Outcome> outcomes, MyEnums.InputOutputTypes entryType)
        {
            return (from o in outcomes where o.outputType == entryType select o).ToList();
        }
    }
}