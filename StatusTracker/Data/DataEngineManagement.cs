using LiteDB;
using LiteDB.Async;
using StatusTracker.Data.Classes;
using System;

namespace StatusTracker.Data
{
    public static class DataEngineMangment
    {
        public static DataEngine<RequestLog> requestLogEngine;

        #region Fields

        public static LiteDatabaseAsync db;

        #endregion Fields

        #region Methods

        public static void Init()
        {
            Console.WriteLine("Connecting To LiteDB");

            db = new LiteDatabaseAsync($"Filename={Consts.databaseFile}");

            requestLogEngine = new DataEngine<RequestLog>(db.GetCollection<RequestLog>("requestlog"));
        }

        #endregion Methods
    }
}