using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StatusTracker
{
    public static class Consts
    {
        #region Fields

        public static string databaseFile = "./data/database.db";
        public static string workingDir = "./data";
        public static DateTime startedAt = DateTime.UtcNow;
        public static string confFile = "./data/config.json";

        #endregion Fields
    }
}
