using System.IO;

namespace StatusTracker
{
    public class Config
    {
        #region Fields

        public static Config _config;

        #endregion Fields

        #region Methods

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

        #endregion Methods
    }
}