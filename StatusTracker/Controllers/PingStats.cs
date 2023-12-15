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

            var count = query.AllKeys.Contains("count") ? int.TryParse(query.Get("count"), out var d) ? d : 100 : 100;
            var small = query.AllKeys.Contains("small") ? query.Get("small") == "true" : false;

            if (!query.AllKeys.Contains("service") || !int.TryParse(query.Get("service"), out var serviceId))
            {
                return new ResponseState()
                {
                    message = "Service Id Missing Or Malformed",
                    status = 400
                };
            }

            var service = await DataEngineMangment.targetServiceEngine.TryFind(x => x.Id == serviceId);

            if (service == null)
            {
                return new ResponseState()
                {
                    message = "Service Not Found",
                    status = 404
                };
            }

            var results = await DataEngineMangment.pingResultEngine.table.Query().Where(x => x.TargetServiceId == serviceId).OrderByDescending(x=>x.Id).Limit(count).ToArrayAsync();

            if (small)
            {
                return new ResponseState()
                {
                    message = "Ping Results",
                    data = results.Select(x=>x.Success ? x.MS : -1).ToArray()
                };
            }
            else
            {
                return new ResponseState()
                {
                    message = "Ping Results",
                    data = results
                };
            }
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

            var service = await DataEngineMangment.targetServiceEngine.TryFind(x => x.Id == serviceId);

            var results = await DataEngineMangment.pingResultEngine.Search(x => x.TargetServiceId == serviceId);

            if (service == null)
            {
                return new ResponseState()
                {
                    message = "Service Not Found",
                    status = 404
                };
            }

            if (results.Length == 0)
            {
                return new ResponseState()
                {
                    message = "Ping Results",
                    data = new
                    {
                        minMs = 0,
                        maxMs = 0,
                        avgMs = 0,
                        failures = 0,
                        total = 0
                    }
                };
            }

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
