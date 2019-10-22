using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using NeedOfVigilante.Models;

namespace NeedOfVigilante.Controllers
{
    public class ElementController : DataAccessController
    {

        public string GetElementsJson()
        {
            var elementList = dc.ElementTables.Select(E => new
            {
                Id = E.id,
                IdDiagrama = E.idDiagram,
                Diagrama = dc.DiagramTables.Where(x => x.id == E.idDiagram).Select(S => new { NombreDiagrama = S.name }).FirstOrDefault().NombreDiagrama,
                Pregunta = dc.QuestionTables.Where(x => x.Id == E.idPregunta).Select(S => new { Pregunta = S.Pregunta }).FirstOrDefault().Pregunta
            });
            string result = javaScriptSerializer.Serialize(elementList);
            return result;
        }

        public JsonResult AddElement(ElementTable elementTable)
        {
            JResult jResult = new JResult();
            //poder seleccionar tambien categoria y resultado del diagrama

            try
            {
                List<ElementTable> elementList = dc.ElementTables.Where(e => e.idDiagram == elementTable.idDiagram && e.idPregunta == elementTable.idPregunta).ToList();
                //  Verificar si existe el elemento
                dc.ElementTables.InsertOnSubmit(elementTable);
                dc.SubmitChanges();

                if (elementTable.id > 0)
                {
                    jResult.Id = elementTable.id;
                    jResult.message = "Elemento Insertado Satisfactoriamente";
                    jResult.result = true;
                    logWrapper.log(jResult.message, MyEnums.OperationTypes.ADD);
                }

            }
            catch (Exception e)
            {
                persistException.Save(e, PersistException.ImpactLevel.Medium, jResult.message);
            }

            return Json(jResult, JsonRequestBehavior.AllowGet);
        }

        public JsonResult EditElement(vmElementUpdate vmElementUpdate)
        {
            JResult jResult = new JResult();

            try
            {
                ElementTable elementTable = dc.ElementTables.FirstOrDefault(e => e.id == vmElementUpdate.elementID);
                elementTable.idPregunta = vmElementUpdate.newQuestionID;
                dc.SubmitChanges();

                if (elementTable.id > 0)
                {
                    jResult.Id = elementTable.id;
                    jResult.result = true;
                    jResult.message = "Elemento Editado Satisfactoriamente";
                }
            }
            catch (Exception e)
            {
                jResult.result = true;
                jResult.message = "Elemento no pudo ser editado Satisfactoriamente";
                jResult.exceptionMessage = e.Message;
                persistException.Save(e, PersistException.ImpactLevel.High, jResult.message);
            }

            return Json(jResult, JsonRequestBehavior.AllowGet);
        }

    }
}
