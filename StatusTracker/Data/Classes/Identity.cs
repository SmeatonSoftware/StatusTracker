using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StatusTracker.Data.Classes
{
    public class Identity : DataClass
    {
        public string Username { get; set; }
        public string CookieKey { get; set; }

        public Identity() { }

        public Identity(string username, string cookieKey)
        {
            Username = username;
            CookieKey = cookieKey;
        }
    }
}
