using PIApp_Lib.Data;
using StatusTracker.Data;
using StatusTracker.Data.Classes;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net.Http;
using System.Threading;

namespace StatusTracker.Services
{
    public static class ServicePinger
    {
        #region Methods

        public static async void PingAll()
        {
            var services = await DataEngineManagement.GetTable<TargetService>().Search(x => DateTime.UtcNow > x.lastRun + x.runFrequency);

            var pingResults = new List<PingResult>();
            var s = new Stopwatch();

            using (var client = new HttpClient())
            {
                foreach (var service in services)
                {
                    var req = new HttpRequestMessage(HttpMethod.Head, service.url);

                    PingResult pingResult;

                    s.Restart();
                    s.Start();

                    try
                    {
                        var res = await client.SendAsync(req);
                        s.Stop();
                        pingResult = new PingResult(service.Id, res.StatusCode == System.Net.HttpStatusCode.OK, (int)res.StatusCode, s.ElapsedMilliseconds);
                    }
                    catch (Exception ex)
                    {
                        s.Stop();
                        pingResult = new PingResult(service.Id, false, 503, s.ElapsedMilliseconds);
                    }

                    service.lastRun = DateTime.UtcNow;

                    DataEngineManagement.GetTable<TargetService>().Update(service);
                    pingResults.Add(pingResult);
                }
            }

            //Console.WriteLine($"Pinged {services.Length} Services");

            await DataEngineManagement.GetTable<PingResult>().table.InsertBulkAsync(pingResults);
        }

        public static void StartPingThreadLoop()
        {
            var t = new Thread(() =>
            {
                while (true)
                {
                    PingAll();
                    Thread.Sleep(60000);
                }
            });

            t.Start();
        }

        #endregion Methods
    }
}