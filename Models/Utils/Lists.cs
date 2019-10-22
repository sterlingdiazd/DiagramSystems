using NeedOfVigilante.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NeedOfVigilante.Utils
{
    public class Lists
    {
        private static DbContextDataContext dc = new DbContextDataContext();

        public static SelectList getExpressionTypes()
        {
            IEnumerable<ExpressionTypeTable> modelExpTypeTable = dc.ExpressionTypeTables.ToList().AsEnumerable();
            return new SelectList(modelExpTypeTable, "id", "expressionType");
        }

        public static SelectList getYesOrNoOutputTypes()
        {
            List<SelectListItem> list = new List<SelectListItem>();
            list.Add(new SelectListItem() { Text = "Si", Value = "1" });
            list.Add(new SelectListItem() { Text = "No", Value = "2" });
            return new SelectList(list, "Value", "Text");
        }

        public static SelectList getOperatorSymbols()
        {
            IEnumerable<OperatorTable> modelOperator = dc.OperatorTables.ToList().AsEnumerable();
            return new SelectList(modelOperator, "id", "operator");
        }
        
    }
}