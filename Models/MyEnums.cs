using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NeedOfVigilante.Models
{
    public static class MyEnums
    {

        public static class OperationTypes
        {
            public static string SHOW = "SHOW";
            public static string ADD = "ADD";
            public static string EDIT = "EDIT";
            public static string DELETE = "DELETE";
            public static string SEARCH = "SEARCH";
            public static string LOGIC = "LOGIC";
        }

        public enum InputOutputTypes
        {
            YesOrNo,
            NumericValue,
            Comparison,
            Range
        }

        public enum InputOutputValues
        {
            Yes,
            No
        }
        public enum Categories
        {
            Pregunta,
            Valoracion,
            Decision
        }

        public enum Operators
        {
            LessThan,
            MoreThan,
            MoreAndEqualTo,
            LessAndEqualTo,
            Equal,
            NotEqual
        }

    }
}