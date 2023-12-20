using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StatusTracker.Data.Classes
{
    public class TargetService : DataClass
    {
        public string url { get; set; }
        public TimeSpan runFrequency { get; set; }
        public DateTime lastRun { get; set; }
        public int identityCreated { get; set; }
        public bool isFav { get; set; } = false;

        public TargetService() { }

        public TargetService(string url, TimeSpan runFrequency, Identity identity)
        {
            this.url = url;
            this.runFrequency = runFrequency;
            this.lastRun = DateTime.MinValue;
            this.identityCreated = identity.Id;
        }
    }
}
