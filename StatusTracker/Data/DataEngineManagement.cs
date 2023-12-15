using LiteDB;
using LiteDB.Async;
using StatusTracker.Data.Classes;
using System;

namespace StatusTracker.Data
{
    public static class DataEngineMangment
    {
        public static DataEngine<RequestLog> requestLogEngine;
        public static DataEngine<TargetService> targetServiceEngine;
        public static DataEngine<PingResult> pingResultEngine;

        #region Fields

        public static LiteDatabaseAsync db;

        #endregion Fields

        #region Methods

        public static void Init()
        {
            Console.WriteLine("Connecting To LiteDB");

            db = new LiteDatabaseAsync($"Filename={Consts.databaseFile}");

            requestLogEngine = new DataEngine<RequestLog>(db.GetCollection<RequestLog>());
            targetServiceEngine = new DataEngine<TargetService>(db.GetCollection<TargetService>());
            pingResultEngine = new DataEngine<PingResult>(db.GetCollection<PingResult>());
        }

        #endregion Methods
    }
}