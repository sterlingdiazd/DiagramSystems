using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using NeedOfVigilante.Models;

namespace NeedOfVigilante.Controllers
{
    public class QuestionController : DataAccessController
    {
        // QUESTION

        public JsonResult AddQuestion(QuestionTable questionTable)
        {
            JResult jresult = new JResult();
            //poder seleccionar tambien categoria y conclusiones del diagrama
            List<QuestionTable> questionList = dc.QuestionTables.Where(q => q.Pregunta.Contains(questionTable.Pregunta) && q.SubCategoria.Equals(questionTable.SubCategoria)).ToList();


            if (questionList.Count() <= 0)
            {
                dc.QuestionTables.InsertOnSubmit(questionTable);
                dc.SubmitChanges();
                if (questionTable.Id > 0)
                {
                    jresult.Id = questionTable.Id;
                    jresult.message = questionTable.SubCategoria + " Insertado Satisfactoriamente";
                    jresult.result = true;
                }
            }
            else
            {
                jresult.result = true;
                jresult.Id = questionList.FirstOrDefault().Id;
                jresult.message = questionTable.SubCategoria + " ya existe";
            }

            return Json(jresult, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SearchQuestion(string Text, string Subcategory)
        {
            var questionList = dc.QuestionTables.Where(x => x.Pregunta.Contains(Text) && x.SubCategoria.Equals(Subcategory)).Select(S => new { IdPregunta = S.Id, Pregunta = S.Pregunta, Categoria = S.Categoria }).ToList();
            return Json(questionList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SearchQuestionAddedToDiagram(string Text, string Diagrama)
        {
            var questionList = dc.ElementTables.Where(et => et.QuestionTable.Pregunta.Contains(Text) && et.DiagramTable.id == Int32.Parse(Diagrama)).Select(S => new { Id = S.id, IdPregunta = S.QuestionTable.Id, Pregunta = S.QuestionTable.Pregunta, Categoria = S.QuestionTable.Categoria }).ToList();
            return Json(questionList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SearchCategory(string Text, string Subcategory)
        {
            var questionList = dc.QuestionTables.Where(x => x.Categoria.Contains(Text)).Select(S => new { IdPregunta = S.Id, Pregunta = S.Pregunta, Categoria = S.Categoria }).ToList();
            var categories = questionList.Select(S => new { Categoria = S.Categoria }).Distinct();
            return Json(categories, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SearchResult(string Text, string Subcategory)
        {
            var questionList = dc.QuestionTables.Where(x => x.Pregunta.Contains(Text) && x.SubCategoria.Equals(Subcategory)).Select(S => new { IdPregunta = S.Id, Pregunta = S.Pregunta }).ToList();
            return Json(questionList, JsonRequestBehavior.AllowGet);
        }
    }
}
