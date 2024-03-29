﻿using LiteDB.Async;
using StatusTracker.Data.Classes;
using System;

namespace StatusTracker.Data
{
    public static class DataEngineMangment
    {
        #region Fields

        public static LiteDatabaseAsync db;
        public static DataEngine<FavouriteService> favouriteServiceEngine;
        public static DataEngine<Identity> identityEngine;
        public static DataEngine<PingResult> pingResultEngine;
        public static DataEngine<RequestLog> requestLogEngine;
        public static DataEngine<TargetService> targetServiceEngine;

        #endregion Fields

        #region Methods

        public static void Init()
        {
            Console.WriteLine("Connecting To LiteDB");

            db = new LiteDatabaseAsync($"Filename={Consts.databaseFile}");

            requestLogEngine = new DataEngine<RequestLog>(db.GetCollection<RequestLog>());
            targetServiceEngine = new DataEngine<TargetService>(db.GetCollection<TargetService>());
            pingResultEngine = new DataEngine<PingResult>(db.GetCollection<PingResult>());
            identityEngine = new DataEngine<Identity>(db.GetCollection<Identity>());
            favouriteServiceEngine = new DataEngine<FavouriteService>(db.GetCollection<FavouriteService>());
        }

        #endregion Methods
    }
}