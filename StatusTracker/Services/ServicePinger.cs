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
                    Thread.Sleep(60000);
                }
            });

            t.Start();
        }

        public static async void PingAll()
        {
            var services = await DataEngineMangment.targetServiceEngine.Search(x=>DateTime.UtcNow > x.lastRun + x.runFrequency);

            var pingResults = new List<PingResult>();

            using (var client = new HttpClient()) { 
                foreach (var service in services)
                {
                    var p = new Ping();
                    var host = new Uri(service.url).Host;

                    var res = await p.SendPingAsync(host);

                    var pingResult = new PingResult(service.Id, res.Status == IPStatus.Success, (int)res.Status, res.RoundtripTime);

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
