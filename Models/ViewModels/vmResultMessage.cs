using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NeedOfVigilante.Models
{
    public class vmResultMessage
    {
        public String diagramID {get; set;}
        public String diagramName {get; set;}
        public String officeID {get; set;}
        public String officeName {get; set;}
        public String result { get; set; }

        public vmResultMessage(String diagramID, String diagramName, String officeID, String officeName, String result)
        {
            this.diagramID = diagramID;
             this.diagramName = diagramName;
             this.officeID = officeID;
             this.officeName = officeName;
             this.result = result;
        }

        public vmResultMessage()
        {
        }
    }
}