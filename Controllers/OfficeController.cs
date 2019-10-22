using NeedOfVigilante.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace NeedOfVigilante.Controllers
{
    public class OfficeController : DataAccessController
    {
        //  OFFICE

        public JsonResult GetOfficeList()
        {
            var officeList = dc.OfficeTables.Select(x => new { x.Oficina }).ToArray();
            return Json(officeList, JsonRequestBehavior.AllowGet);
        }

        public string GetOfficeListJson()
        {
            string result = "";
            try
            {
                var officeList = dc.OfficeTables.Select(E => new
                {
                    IdOficina = E.IdOficina,
                    Oficina = E.Oficina
                });
                result = javaScriptSerializer.Serialize(officeList);

                logWrapper.log("Obtener listado de oficinas en json", MyEnums.OperationTypes.SHOW);
            }
            catch (Exception e)
            {
                persistException.Save(e, PersistException.ImpactLevel.High, "No se obtuvieron las oficinas de la base de datos");
            }

            return result;
        }

        public string GetOfficeListByDiagramID(string idDiagram)
        {
            string result = "";
            try
            {
                var officeList = dc.DiagramOfficeTables.Where(ot => ot.idDiagram == Int32.Parse(idDiagram)).Select(o => new { IdOficina = o.idOffice });
                result = javaScriptSerializer.Serialize(officeList);

                logWrapper.log("Obtener listado de oficinas por id de diagrama", MyEnums.OperationTypes.SHOW);
            }
            catch (Exception e)
            {
                persistException.Save(e, PersistException.ImpactLevel.High, "No se obtuvieron las oficinas de la base de datos");
            }

            return result;
        }

        public string SearchOffice(string officeToSearch)
        {
            var officeList = dc.OfficeTables.Where(x => x.Oficina.Contains(officeToSearch)).Select(S => new { IdOficina = S.IdOficina, Oficina = S.Oficina }).ToList();
            return javaScriptSerializer.Serialize(officeList);
        }


        // LOS SIGUIENTES METODOS PUEDEN SER CREADOS O BORRADOS SI NO SE NECESITAN:


        // GET: /Office/
        //
        // GET: /Office/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /Office/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /Office/Create

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Office/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /Office/Edit/5

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Office/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /Office/Delete/5

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
