using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NeedOfVigilante.Models
{
    public class JResult
    {
        public int Id {get; set;}
        public bool result { get; set; }
        public String message {get;set;}
        public String exceptionMessage { get; set; }
        public vmResultMessage vmResultMessage;
    }
}