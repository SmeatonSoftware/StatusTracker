using PIApp_Lib;
using PIApp_Lib.Data;
using StatusTracker.Controllers;
using StatusTracker.Data.Classes;
using System;
using System.IO;

namespace StatusTracker
{
    internal class Program
    {
        #region Methods

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

            PIApp_Lib.Listener.Init();

            Services.ServicePinger.StartPingThreadLoop();
        }

        private static void Main(string[] args)
        {
            RegisterEndpoints();
            RegisterTables();
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

        private static void RegisterTables()
        {
            DataEngineManagement.Init();
            DataEngineManagement.SummonTable<FavouriteService>();
            DataEngineManagement.SummonTable<Identity>();
            DataEngineManagement.SummonTable<PingResult>();
            DataEngineManagement.SummonTable<RequestLog>();
            DataEngineManagement.SummonTable<TargetService>();
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

            RequestRegistrar.Register(new RequestFunc("/api/auth/check", "GET", Controllers.Authorization.CheckAuth));
            RequestRegistrar.Register(new RequestFunc("/api/auth/signin", "POST", Controllers.Authorization.Signin));
            RequestRegistrar.Register(new RequestFunc("/api/auth/signup", "POST", Controllers.Authorization.Signup));
        }

        #endregion Methods
    }
}