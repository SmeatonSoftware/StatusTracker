using System;

namespace StatusTracker
{
    public static class Consts
    {
        #region Fields

        public static string confFile = "./data/config.json";
        public static string databaseFile = "./data/database.db";
        public static DateTime startedAt = DateTime.UtcNow;
        public static string workingDir = "./data";

        #endregion Fields
    }
}