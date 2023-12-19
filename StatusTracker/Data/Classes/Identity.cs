using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StatusTracker.Data.Classes
{
    public class Identity : DataClass
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string CookieKey { get; set; }

        public Identity() { }

        public Identity(string email, string password, string cookieKey)
        {
            Email = email;
            Password = password;
            CookieKey = cookieKey;
        }
    }
}
