using NeedOfVigilante.Models;
using NeedOfVigilante.Models.ExpressionTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using NeedOfVigilante.Utils;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using System.Data;
using System.Data.SqlClient;
using System.Data.Linq;
using System.Data.EntityClient;
using System.Data.Common;
using System.Data.Objects;
using System.Globalization;

namespace NeedOfVigilante.Controllers
{
    public class HomeController : DataAccessController
    { 
        //  VISTAS

        public ActionResult Index()
        {
            ViewBag.Message = "";
            try
            {
                logWrapper.log("Mostrar index", MyEnums.OperationTypes.SHOW);
            }
            catch (Exception)
            {
                
            }
            
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public JsonResult DeleteFromFromEntity(string entity, string idEntity)
        {
            JResult jResult = new JResult();

            if (entity != null && idEntity != null)
            {
                try
                {
                    switch (entity)
                    {
                        case "diagrama":

                            DiagramTable diagram = dc.DiagramTables.Where(x => x.id == Int32.Parse(idEntity)).FirstOrDefault();

                            if (diagram != null)
                            {
                                List<ElementTable> elementList = dc.ElementTables.Where(e => e.idDiagram == diagram.id).ToList();
                                if (elementList.Count <= 0)
                                {
                                    try
                                    {
                                        dc.DiagramTables.DeleteOnSubmit(diagram);
                                        jResult.result = true;
                                    }
                                    catch (Exception e)
                                    {
                                        jResult.result = false;
                                        jResult.exceptionMessage = e.Message;
                                        persistException.Save(e, PersistException.ImpactLevel.High, jResult.message);
                                    }
                                }
                                else
                                {
                                    jResult.result = false;
                                    jResult.message = "No puede eliminar un diagrama que posee elementos usados. Elimine primero los elementos";
                                }
                            }
                            else
                            {
                                jResult.result = false;
                                jResult.message = "Diagrama no fue encontrado";
                            }
                            break;

                        case "elemento":
                            ElementTable elementTable = dc.ElementTables.Where(x => x.id == Int32.Parse(idEntity)).FirstOrDefault();
                            if (elementTable != null)
                            {
                                List<OutcomeTable> outcomeTableList = dc.OutcomeTables.Where(x => x.idElement == elementTable.id).ToList();
                                List<OutcomeTable> outcomeTableList2 = dc.OutcomeTables.Where(x => x.idNextElement == Int32.Parse(idEntity)).ToList();
                                if (outcomeTableList2.Count > 0)
                                {
                                    jResult.result = false;
                                    jResult.message = "No puede eliminar un elemento esté asociado a una salida de otro elemento";

                                }
                                if (outcomeTableList.Count > 0)
                                {
                                    jResult.result = false;
                                    jResult.message = "No puede eliminar un elemento que posea salidas asociadas. Elimine primero las salidas";

                                }
                                else
                                {
                                    try
                                    {
                                        dc.ElementTables.DeleteOnSubmit(elementTable);
                                        jResult.result = true;
                                    }
                                    catch (Exception e)
                                    {
                                        jResult.result = false;
                                        jResult.message = "El elemento no pudo ser eliminado. Contacte al Administrador del Sistema";
                                        jResult.exceptionMessage = e.Message;
                                        persistException.Save(e, PersistException.ImpactLevel.High, jResult.message);
                                    }
                                }
                            }
                            
                            
                            break;

                        case "salida":
                            OutcomeTable outcomeTable = dc.OutcomeTables.Where(x => x.id == Int32.Parse(idEntity)).FirstOrDefault();
                            if (outcomeTable != null)
                            {
                                try
                                {
                                    dc.OutcomeTables.DeleteOnSubmit(outcomeTable);
                                    jResult.result = true;
                                }
                                catch (Exception e)
                                {
                                    jResult.result = false;
                                    jResult.message = "La  salida no pudo ser eliminada. Contacte al Administrador del Sistema";
                                    jResult.exceptionMessage = e.Message;
                                    persistException.Save(e, PersistException.ImpactLevel.High, jResult.message);
                                }
                            }
                            break;
                    }

                    if (jResult.result)
                    {
                        try
                        {
                            dc.SubmitChanges();
                            string Entity = new CultureInfo("en-US").TextInfo.ToTitleCase(entity);
                            jResult.message = "Entidad " + Entity + " eliminada satisfactoriamente";
                        }
                        catch (Exception e)
                        {
                            jResult.result = false;
                            jResult.message = "La operación no pudo ser realizada. Contacte al Administrador del Sistema";
                            jResult.exceptionMessage = e.Message;
                            persistException.Save(e, PersistException.ImpactLevel.High, jResult.message);
                        }
                    }
                }
                catch (Exception e)
                {
                    jResult.result = false;
                    jResult.message = "Error al eliminar entidad";
                    jResult.exceptionMessage = e.Message;
                    persistException.Save(e, PersistException.ImpactLevel.High, jResult.message);
                }
            }
            else
            {
                jResult.result = false;
                jResult.message = "No se enviaron los datos requeridos para la función eliminar";
            }
            return Json(jResult, JsonRequestBehavior.AllowGet);
        }

    }
}
