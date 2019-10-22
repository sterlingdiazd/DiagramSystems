using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net; 
using System.Diagnostics;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text;

namespace NeedOfVigilante.Models
{
    public class PersistException
    {
        private DbContextDataContext dc;

        public PersistException()
        {
            dc = new DbContextDataContext();
        }

        public enum ImpactLevel
        {
            High = 0,
            Medium = 1,
            Low = 2,
        }

        public void Save(Exception ex)
        {
            Save(ex, ImpactLevel.Low, "");
        }
        public void Save(Exception ex, ImpactLevel impactLevel)
        {
            Save(ex, impactLevel, "");
        }

        public void Save(Exception ex, ImpactLevel impactLevel, string errorDescription)
        {
            LogException logException = new LogException();

            try
            {
                logException.ErrorDate = DateTime.Now;
                if (errorDescription != null && errorDescription != "")
                {
                    logException.ErrorShortDescription = errorDescription;
                }
                logException.ExceptionType = ex.GetType().FullName;
                var stackTrace = new StackTrace(ex, true);
                var allFrames = stackTrace.GetFrames().ToList();
                foreach (var frame in allFrames)
                {
                    logException.FileName = frame.GetFileName();
                    logException.LineNumber = frame.GetFileLineNumber();
                    var method = frame.GetMethod();
                    logException.MethodName = method.Name;
                    logException.ClassName = frame.GetMethod().DeclaringType.ToString();
                }

                logException.ImpactLevel = impactLevel.ToString();
                try
                {
                    logException.ApplicationName = Assembly.GetCallingAssembly().GetName().Name;
                }
                catch
                {
                    logException.ApplicationName = "";
                }

                logException.ErrorMessage = ex.Message;
                logException.StackTrace = ex.StackTrace;
                if (ex.InnerException != null)
                {
                    logException.InnerException = ex.InnerException.ToString();
                    logException.InnerExceptionMessage = ex.InnerException.Message;
                }

                string hostName = Dns.GetHostName(); // Retrive the Name of HOST  
                Console.WriteLine(hostName);
                
                string myIP = Dns.GetHostEntry(hostName).AddressList[0].ToString();

                logException.IpAddress = myIP; //get the ip address

                if (System.Diagnostics.Debugger.IsAttached)
                {
                    logException.IsProduction = false;
                }

                try
                {
                    dc.LogExceptions.InsertOnSubmit(logException);
                    dc.SubmitChanges();
                }
                catch (Exception eex)
                {

                }

            }
            catch (Exception e)
            {
                
            }

        }
    }
}