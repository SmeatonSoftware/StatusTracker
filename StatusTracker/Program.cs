using PIApp_Lib;
using StatusTracker.Controllers;
using StatusTracker.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StatusTracker
{
    internal class Program
    {
        private static void Init()
        {
            if (!Directory.Exists(Consts.workingDir))
                Directory.CreateDirectory(Consts.workingDir);

            if (!Config.TryLoadOrCreate())
            {
                Console.WriteLine("Please fill out the config file ./data/config.json");
                Environment.Exit(0);
            }

            Listener.log = Logger.Log;
            //Listener.middlewares.Add(Logger.Log);

            DataEngineMangment.Init();
            PIApp_Lib.Listener.Init();

            Services.ServicePinger.StartPingThreadLoop();
        }

        private static void RegisterEndpoints()
        {
            RequestRegistrar.Register(new RequestFunc("/api/logs", "GET", Controllers.Logger.GetLog, new TimeSpan(0, 0, 5)));

            RequestRegistrar.Register(new RequestFunc("/api/service/submit", "POST", Controllers.RegisterService.AddOrUpdate));

            RequestRegistrar.Register(new RequestFunc("/api/pings/recent", "GET", Controllers.PingStats.Recent));
            RequestRegistrar.Register(new RequestFunc("/api/pings/stats", "GET", Controllers.PingStats.Stats));
        }

        private static void Main(string[] args)
        {
            RegisterEndpoints();
            Init();

            Console.WriteLine("Type 'S' to Stop");

            while (true)
            {
                string s = Console.ReadLine();

                switch (s.ToLower())
                {
                    case "s":
                        Environment.Exit(0);
                        break;
                }
            }
        }
    }
}
