using PIApp_Lib;
using StatusTracker.Data;
using StatusTracker.Data.Classes;
using System.Net;
using System.Threading.Tasks;

namespace StatusTracker.Controllers
{
    public static class Logger
    {
        #region Methods

        public static async Task<ResponseState> GetLog(RequestContext context)
        {
            var results = await DataEngineMangment.requestLogEngine.table.Query().OrderByDescending(x => x.Id).Limit(100).ToArrayAsync();

            return new ResponseState()
            {
                message = "Last 100 Requests",
                data = results
            };
        }

        public static void Log(HttpListenerContext context, long ms, bool cacheHit)
        {
            if (context.Request.Url.AbsolutePath.StartsWith("/api/logs") || context.Request.Url.AbsolutePath.EndsWith("favicon.ico"))
            {
                return;
            }

            var log = new RequestLog(context, ms, cacheHit);

            DataEngineMangment.requestLogEngine.Add(log);
        }

        #endregion Methods
    }
}