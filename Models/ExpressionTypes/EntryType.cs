using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NeedOfVigilante.Models.ExpressionTypes
{
    public class EntryType
    {
        public static MyEnums.InputOutputTypes determinteEntryType(string entry)
        {
            MyEnums.InputOutputTypes entryType = MyEnums.InputOutputTypes.YesOrNo;
            try
            {
                double temp;
                if (Double.TryParse(entry, out temp))
                {
                    entryType = MyEnums.InputOutputTypes.NumericValue;
                }
            }
            catch (Exception)
            {
                entryType = MyEnums.InputOutputTypes.YesOrNo;
            }

            return entryType;
        }
    }
}