using System;

namespace StatusTracker.Data.Classes
{
    public class TargetService : DataClass
    {
        #region Constructors

        public TargetService()
        { }

        public TargetService(string url, TimeSpan runFrequency, Identity identity)
        {
            this.url = url;
            this.runFrequency = runFrequency;
            this.lastRun = DateTime.MinValue;
            this.identityCreated = identity.Id;
        }

        #endregion Constructors

        #region Properties

        public int identityCreated { get; set; }
        public bool isFav { get; set; } = false;
        public DateTime lastRun { get; set; }
        public TimeSpan runFrequency { get; set; }
        public string url { get; set; }

        #endregion Properties
    }
}