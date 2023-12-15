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

        public TargetService() { }

        public TargetService(string url, TimeSpan runFrequency)
        {
            this.url = url;
            this.runFrequency = runFrequency;
            this.lastRun = DateTime.MinValue;
        }
    }
}
