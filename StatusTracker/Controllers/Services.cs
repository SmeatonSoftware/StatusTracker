using PIApp_Lib;
using StatusTracker.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StatusTracker.Controllers
{
    public static class Services
    {
        public static async Task<ResponseState> GetAll(RequestContext context)
        {
            var results = await DataEngineMangment.targetServiceEngine.table.FindAllAsync();

            return new ResponseState()
            {
                message = "All Services",
                data = results
            };
        }

        public static async Task<ResponseState> AddOrUpdate(RequestContext context)
        {
            var url = context.GetBody();

            var query = context.context.Request.QueryString;

            var minutes = query.AllKeys.Contains("delay") ? int.TryParse(query.Get("delay"), out var d) ? d : 5 : 5;

            var delay = new TimeSpan(0, minutes, 0);

            var service = await DataEngineMangment.targetServiceEngine.TryFind(x => x.url == url);
            bool existingService = service != null;

            if (!existingService)
            {
                service = new Data.Classes.TargetService(url, delay);
                DataEngineMangment.targetServiceEngine.Add(service);
            }
            else
            {
                service.runFrequency = delay; 
                DataEngineMangment.targetServiceEngine.Update(service);
            }

            return new ResponseState()
            {
                message = "Added or Updated Service",
                data = service
            };
        }
    }
}
