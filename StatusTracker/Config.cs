using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StatusTracker
{
    public class Config
    {
        public static Config _config;

        public static bool TryLoadOrCreate()
        {
            if (File.Exists(Consts.confFile))
            {
                _config = Jil.JSON.Deserialize<Config>(File.ReadAllText(Consts.confFile));
                return true;
            }
            else
            {
                _config = new Config();
                File.WriteAllText(Consts.confFile, Jil.JSON.Serialize<Config>(_config));
                return false;
            }
        }
    }
}
