using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using NeedOfVigilante.Models;

namespace NeedOfVigilante.Models
{
    public class Element
    {
        public int id { get; set; }
        public String idBranchOffice { get; set; } //Quitar y poner en la clase diagrama
        public int idQuestion { get; set; }
        public String question { get; set; }
        public String category { get; set; } // question (result is )/range
        public String subcategory { get; set; }
        public MyEnums.InputOutputTypes entryType { get; set; } // Example: NumericValue
        public String entryValue { get; set; }  // Value to compare from result of question. Ex.: 90
        public List<Outcome> outcomes { get; set; } //Will be a table 

        //Calculo de % de categoria ([PesoRespuesta]/[PesoPregunta]) * 100

       

    }



   
}