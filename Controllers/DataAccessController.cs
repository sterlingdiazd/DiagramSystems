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
    public abstract class DataAccessController : Controller
    {
        protected DbContextDataContext dc = new DbContextDataContext();
        protected JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();
        protected PersistException persistException = new PersistException();
        protected LogWrapper logWrapper = new LogWrapper();

    }
}
