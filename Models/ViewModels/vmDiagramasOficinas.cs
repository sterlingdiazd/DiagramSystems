using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NeedOfVigilante.Models
{
    public class vmDiagramasOficinas
    {
        public int diagramID { get; set; }
        public String diagramName { get; set; }
        public List<OfficeTable> Offices { get; set; }
    }
}