using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Runtime.CompilerServices;
using System.Web;

namespace NeedOfVigilante.Models
{
    public class LogWrapper
    {
        private DbContextDataContext dc;
        private PersistException persistException;

        public LogWrapper()
        {
            dc = new DbContextDataContext();
            persistException = new PersistException();
        }

        public void log(String message, String operationType)
        {
            OperationLog operationLog = new OperationLog();
            operationLog.operationType = operationType;
            operationLog.operationMessage = (message == null) ? "" : message;
            operationLog.operationDate = DateTime.Now;
            operationLog = GetDiagnosisMethod(operationLog);
            string hostName = Dns.GetHostName();
            operationLog.addressIP = Dns.GetHostByName(hostName).AddressList[0].ToString();
            
            
            operationLog.userOS = ""; //Capturar usuario

            try
            {
                dc.OperationLogs.InsertOnSubmit(operationLog);
                dc.SubmitChanges();
            }
            catch (Exception e)
            {
                persistException.Save(e, PersistException.ImpactLevel.High);
            }

        }

        [MethodImpl(MethodImplOptions.NoInlining)]
        public OperationLog GetDiagnosisMethod(OperationLog operationLog)
        {
            StackTrace st = new StackTrace();
            StackFrame sf = st.GetFrame(0);

            operationLog.FileName = "";// frame.GetFileName();
            operationLog.LineNumber = 0;//frame.GetFileLineNumber();
            operationLog.methodName = sf.GetMethod().Name;
            operationLog.className = sf.GetMethod().DeclaringType.ToString();

            return operationLog;
        }

    }
}