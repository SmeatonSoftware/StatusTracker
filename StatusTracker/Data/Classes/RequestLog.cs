using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace StatusTracker.Data.Classes
{
    public class RequestLog : DataClass
    {
        public string Url { get; set; }
        public string Method { get; set; }
        public string Origin { get; set; }
        public long ms { get; set; }
        public int statusCode { get; set; }
        public bool cacheHit { get; set; }

        public RequestLog() { }

        public RequestLog(HttpListenerContext context, long ms, bool cacheHit) { 
            this.ms = ms;
            this.cacheHit = cacheHit;
            this.Url = context.Request.Url.AbsolutePath;
            this.statusCode = context.Response.StatusCode;
            this.Method = context.Request.HttpMethod.ToString();
            this.Origin = context.Request.Headers.AllKeys.Contains("X-Real-IP") ? context.Request.Headers["X-Real-IP"] : "error";
        }
    }
}
