using System.Web;
using System.Web.Optimization;

namespace NeedOfVigilante
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.IgnoreList.Clear();

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/themes/base/jquery.ui.css"
                 , "~/Content/site.css"
                 , "~/Content/bootstrap.min.css"
                  
                //,"~/Content/themes/base/core.css"
                //,"~/Content/themes/base/resizable.css"
                //,"~/Content/themes/base/selectable.css"
                //,"~/Content/themes/base/accordion.css"
                //,"~/Content/themes/base/autocomplete.css"
                //,"~/Content/themes/base/button.css"
                //,"~/Content/themes/base/dialog.css"
                //,"~/Content/themes/base/slider.css"
                //,"~/Content/themes/base/tabs.css"
                //,"~/Content/themes/base/datepicker.css"
                //,"~/Content/themes/base/progressbar.css"
                //,"~/Content/themes/base/theme.css"
                //,"~/Content/DecisionMakerStyles.css"
                 , "~/Content/datatables.css"
                //,"~/Content/select.foundation.min.css"
                 , "~/Content/buttons.dataTables.css"
                 , "~/Content/css/select2.min.css"
                //,"~/Content/css/waves.css"
                , "~/Content/css/animate.css"
                ));

            //bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include());

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));


            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-2.1.1.min.js",
                "~/Scripts/jquery-ui-1.12.1.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap.js").Include(
                "~/Scripts/bootstrap.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/librariesjs").Include(
               "~/Scripts/datatables.js",
               "~/Scripts/dataTables.select.min.js",
               "~/Scripts/buttons.bootstrap.min.js",
               "~/Scripts/select2.min.js",
               "~/Scripts/bootstrap-select.js",
               "~/Scripts/jquery.slimscroll.js",
               "~/Scripts/bootstrap-notify.js",
              "~/Scripts/waves.js",
              "~/Scripts/notifications.js",
              "~/Scripts/jquery.validate.min.js",
              "~/Scripts/localization/messages_es.js",
              "~/Scripts/jquery.mask.min.js",
              //"~/Scripts/bootstrap-confirmation.min.js",
              "~/Scripts/jquery.blockUI.js",
               "~/Scripts/bootbox.min.js",

               "~/Scripts/JSZip-2.5.0/jszip.js",
               "~/Scripts/JSZip-2.5.0/jszip.min.js",
               "~/Scripts/pdfmake-0.1.32/pdfmake.js",
               "~/Scripts/pdfmake-0.1.32/pdfmake.min.js",
               "~/Scripts/buttons.print.min.js"
               ));
           
            bundles.Add(new ScriptBundle("~/bundles/validator.js").Include(
              
               ));

            bundles.Add(new ScriptBundle("~/bundles/myscripts.js").Include(
               "~/Scripts/MyScripts.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            //bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
            //            "~/Content/themes/base/jquery.ui.core.css",
            //            "~/Content/themes/base/jquery.ui.resizable.css",
            //            "~/Content/themes/base/jquery.ui.selectable.css",
            //            "~/Content/themes/base/jquery.ui.accordion.css",
            //            "~/Content/themes/base/jquery.ui.autocomplete.css",
            //            "~/Content/themes/base/jquery.ui.button.css",
            //            "~/Content/themes/base/jquery.ui.dialog.css",
            //            "~/Content/themes/base/jquery.ui.slider.css",
            //            "~/Content/themes/base/jquery.ui.tabs.css",
            //            "~/Content/themes/base/jquery.ui.datepicker.css",
            //            "~/Content/themes/base/jquery.ui.progressbar.css",
            //            "~/Content/themes/base/jquery.ui.theme.css",
            //            "~/Content/themes/base/jquery.ui.css"
            //));
            BundleTable.EnableOptimizations = false;

        }
    }
}