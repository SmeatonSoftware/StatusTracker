using StatusTracker.Data;
using StatusTracker.Data.Classes;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.NetworkInformation;
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
                while (true)
                {
                    PingAll();
                    Thread.Sleep(6000);
                }
            });

            t.Start();
        }

        public static async void PingAll()
        {
            var services = await DataEngineMangment.targetServiceEngine.Search(x=>DateTime.UtcNow > x.lastRun + x.runFrequency || true);

            var pingResults = new List<PingResult>();
            var s = new Stopwatch();

            using (var client = new HttpClient()) { 
                foreach (var service in services)
                {
                    var req = new HttpRequestMessage(HttpMethod.Head,service.url);

                    s.Restart();
                    s.Start();

                    PingResult pingResult;

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

                    DataEngineMangment.targetServiceEngine.Update(service);
                    pingResults.Add(pingResult);
                }
            }

            Console.WriteLine($"Pinged {services.Length} Services");

            await DataEngineMangment.pingResultEngine.table.InsertBulkAsync(pingResults);
        }
    }
}
