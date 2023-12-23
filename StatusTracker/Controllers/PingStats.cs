using PIApp_Lib;
using StatusTracker.Data;
using System.Linq;
using System.Threading.Tasks;

namespace StatusTracker.Controllers
{
    public static class PingStats
    {
        #region Methods

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

            var results = await DataEngineMangment.pingResultEngine.table.Query().Where(x => x.TargetServiceId == serviceId).OrderByDescending(x => x.Id).Limit(count).ToArrayAsync();

            results = results.Reverse().ToArray();

            var stats = new
            {
                oldest = (long)0,
                failures = 0,
                total = 0
            };

            if (results.Length > 0)
                stats = new
                {
                    oldest = results.Last().CreatedAt.Ticks,
                    failures = results.Count(x => !x.Success),
                    total = results.Length
                };

            if (small)
            {
                return new ResponseState()
                {
                    message = "Ping Results",
                    data = new { log = results.Select(x => x.Success ? x.MS : -1).ToArray(), stats = stats }
                };
            }
            else
            {
                return new ResponseState()
                {
                    message = "Ping Results",
                    data = new { log = results, stats = stats }
                };
            }
        }

        #endregion Methods
    }
}