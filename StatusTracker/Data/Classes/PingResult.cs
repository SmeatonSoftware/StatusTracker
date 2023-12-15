using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StatusTracker.Data.Classes
{
    public class PingResult : DataClass
    {
        public int TargetServiceId { get; set; }
        public bool Success { get; set; }
        public int StatusCode { get; set; }
        public float MS { get; set; }

        public PingResult() { }

        public PingResult(int targetServiceId, bool success, int statusCode, float mS)
        {
            TargetServiceId = targetServiceId;
            Success = success;
            StatusCode = statusCode;
            MS = mS;
        }
    }
}
