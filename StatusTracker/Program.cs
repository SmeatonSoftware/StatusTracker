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
            RequestRegistrar.Register(new RequestFunc("/api/logs", "GET", Controllers.Logger.GetLog, new TimeSpan(0, 1, 0)));

            RequestRegistrar.Register(new RequestFunc("/api/services/all", "GET", Controllers.Services.GetAll, new TimeSpan(0, 0, 30)));
            RequestRegistrar.Register(new RequestFunc("/api/services/favs", "GET", Controllers.Services.GetFavourites));
            RequestRegistrar.Register(new RequestFunc("/api/services/togfav", "PUT", Controllers.Services.ToggleFavourite));
            RequestRegistrar.Register(new RequestFunc("/api/services/submit", "POST", Controllers.Services.AddOrUpdate));
            RequestRegistrar.Register(new RequestFunc("/api/services/delete", "DELETE", Controllers.Services.Delete));

            RequestRegistrar.Register(new RequestFunc("/api/pings/recent", "GET", Controllers.PingStats.Recent, new TimeSpan(0, 1, 0)));
            RequestRegistrar.Register(new RequestFunc("/api/pings/stats", "GET", Controllers.PingStats.Stats, new TimeSpan(0, 1, 0)));

            RequestRegistrar.Register(new RequestFunc("/api/auth/check", "GET", Controllers.Authorization.CheckAuth));
            RequestRegistrar.Register(new RequestFunc("/api/auth/signin", "POST", Controllers.Authorization.Signin));
            RequestRegistrar.Register(new RequestFunc("/api/auth/signup", "POST", Controllers.Authorization.Signup));
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
