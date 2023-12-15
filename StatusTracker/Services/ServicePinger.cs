using StatusTracker.Data;
using StatusTracker.Data.Classes;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace StatusTracker.Services
{
    public static class ServicePinger
    {
        public static void StartPingThreadLoop()
        {
            var t = new Thread(() =>
            {
                PingAll();
                Thread.Sleep(60000);
            });

            t.Start();
        }

        public static async void PingAll()
        {
            var s = new Stopwatch();
            var services = await DataEngineMangment.targetServiceEngine.Search(x=>DateTime.UtcNow > x.lastRun + x.runFrequency);

            var pingResults = new List<PingResult>();

            using (var client = new HttpClient()) { 
                foreach (var service in services)
                {
                    var req = new HttpRequestMessage(HttpMethod.Get, service.url);

                    s.Restart();
                    s.Start();

                    var res = await client.SendAsync(req);

                    s.Stop();

                    var pingResult = new PingResult(service.Id, res.IsSuccessStatusCode, (int)res.StatusCode, s.ElapsedMilliseconds);

                    pingResults.Add(pingResult);
                }
            }

            await DataEngineMangment.pingResultEngine.table.InsertBulkAsync(pingResults);
        }
    }
}
