using PIApp_Lib;
using Scrypt;
using StatusTracker.Data;
using StatusTracker.Data.Classes;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace StatusTracker.Controllers
{
    public static class Authorization
    {
        #region Fields

        private static ScryptEncoder encoder = new ScryptEncoder();
        private static Random rnd = new Random();
        private static string rndChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        #endregion Fields

        #region Methods

        private static string RandomString(int len = 64)
        {
            var s = "";

            for (int i = 0; i < len; i++)
            {
                var r = rnd.Next(0, rndChars.Length);

                s += rndChars[r];
            }

            return s;
        }

        public static async Task<ResponseState> CheckAuth(RequestContext context)
        {
            var identity = await Authorization.IdentityFromHeader(context);

            if (identity != null)
            {
                identity.CookieKey = "";
                identity.Password = "";
                identity.Salt = "";
            }

            return new ResponseState()
            {
                status = identity == null ? 401 : 200,
                data = identity,
                message = identity == null ? "No Auth" : "Have Auth"
            };
        }

        public static async Task<Identity> IdentityFromHeader(RequestContext context)
        {
            var head = context.context.Request.Headers;

            var id = head.Get("id");
            var key = head.Get("key");

            if (id != null && key != null && id.Length > 0 && key.Length > 0 && int.TryParse(id, out var _id))
            {
                var youare = await DataEngineMangment.identityEngine.Get(_id);

                if (youare != null && encoder.Compare(key + youare.Salt, youare.CookieKey))
                {
                    return youare;
                }
            }

            return null;
        }

        public static async Task<ResponseState> Signin(RequestContext context)
        {
            var iam = context.GetBody<Identity>();

            if (iam == null)
            {
                return new ResponseState()
                {
                    status = 400,
                    message = "Malformed Request"
                };
            }

            var youare = await DataEngineMangment.identityEngine.TryFind(x => x.Email == iam.Email);

            if (youare == null)
            {
                return new ResponseState()
                {
                    status = 401,
                    message = "Account Doesnt Exist"
                };
            }

            if (!encoder.Compare(iam.Password + youare.Salt, youare.Password))
            {
                return new ResponseState()
                {
                    status = 401,
                    message = "Password Wrong"
                };
            }

            iam.Id = youare.Id;
            iam.CookieKey = RandomString();
            iam.Password = "";

            youare.CookieKey = encoder.Encode(iam.CookieKey + youare.Salt);

            DataEngineMangment.identityEngine.Update(youare);

            return new ResponseState()
            {
                status = 200,
                message = "Signed in",
                data = iam
            };
        }

        public static async Task<ResponseState> Signup(RequestContext context)
        {
            var iam = context.GetBody<Identity>();

            if (await DataEngineMangment.identityEngine.TryFind(x => x.Email == iam.Email) != null)
            {
                return new ResponseState()
                {
                    status = 401,
                    message = "Account Exists"
                };
            }

            if (iam.Email.Length == 0 || iam.Email.Count(x => x == '@') != 1 || !iam.Email.Split('@')[1].Contains('.'))
            {
                return new ResponseState()
                {
                    status = 401,
                    message = "Email Appears Faulty"
                };
            }

            if (iam.Password.Length == 0)
            {
                return new ResponseState()
                {
                    status = 401,
                    message = "Stronger Password Please"
                };
            }

            iam.CookieKey = RandomString();
            iam.Salt = RandomString(8);

            var youare = new Identity(iam.Email, encoder.Encode(iam.Password + iam.Salt), encoder.Encode(iam.CookieKey + iam.Salt), iam.Salt);

            await DataEngineMangment.identityEngine.Add(youare);

            iam.Id = youare.Id;
            iam.Password = "";

            return new ResponseState()
            {
                status = 200,
                message = "Signed up",
                data = iam
            };
        }

        #endregion Methods
    }
}