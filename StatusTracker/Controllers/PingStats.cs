using PIApp_Lib;
using StatusTracker.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StatusTracker.Controllers
{
    public static class PingStats
    {
        public static async Task<ResponseState> Recent(RequestContext context)
        {
            var query = context.context.Request.QueryString;

            if (!query.AllKeys.Contains("service") || !int.TryParse(query.Get("service"), out var serviceId))
            {
                return new ResponseState()
                {
                    message = "Service Id Missing Or Malformed",
                    status = 400
                };
            }

            var results = await DataEngineMangment.pingResultEngine.Search(x => x.TargetServiceId == serviceId);

            return new ResponseState()
            {
                message = "Ping Results",
                data = results
            };
        }

        public static async Task<ResponseState> Stats(RequestContext context)
        {
            var query = context.context.Request.QueryString;

            if (!query.AllKeys.Contains("service") || !int.TryParse(query.Get("service"), out var serviceId))
            {
                return new ResponseState()
                {
                    message = "Service Id Missing Or Malformed",
                    status = 400
                };
            }

            var results = await DataEngineMangment.pingResultEngine.Search(x => x.TargetServiceId == serviceId);

            return new ResponseState()
            {
                message = "Ping Results",
                data = new
                {
                    minMs = results.Min(x=>x.MS),
                    maxMs = results.Max(x=>x.MS),
                    avgMs = results.Average(x=>x.MS),
                    failures = results.Count(x=>!x.Success),
                    total = results.Length
                }
            };
        }
    }
}
