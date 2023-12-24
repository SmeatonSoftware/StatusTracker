namespace StatusTracker.Data.Classes
{
    public class Identity : DataClass
    {
        #region Constructors

        public Identity()
        { }

        public Identity(string email, string password, string cookieKey, string salt)
        {
            Email = email;
            Password = password;
            CookieKey = cookieKey;
            Salt = salt;
        }

        #endregion Constructors

        #region Properties

        public string CookieKey { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Salt { get; set; }

        #endregion Properties
    }
}