using PIApp_Lib;
using Scrypt;
using StatusTracker.Data;
using StatusTracker.Data.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StatusTracker.Controllers
{
    public static class Authorization
    {
        private static ScryptEncoder encoder = new ScryptEncoder();
        private static Random rnd = new Random();
        private static string rndChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

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

        public static async Task<Identity> IdentityFromHeader(RequestContext context)
        {
            var head = context.context.Request.Headers;

            var id = head.Get("id");
            var key = head.Get("key");

            if (id.Length>0 && key.Length>0 && int.TryParse(id, out var _id))
            {
                var youare = await DataEngineMangment.identityEngine.Get(_id);

                if (youare != null && encoder.Compare(key, youare.CookieKey))
                {
                    return youare;
                }
            }

            return null;
        }

        public static async Task<ResponseState> CheckAuth(RequestContext context)
        {
            var identity = await Authorization.IdentityFromHeader(context);
            
            if (identity != null)
            {
                identity.CookieKey = "";
            }

            return new ResponseState()
            {
                status = 200,
                data = identity,
                message = identity == null ? "No Auth" : "Have Auth"
            };

        }

        public static async Task<ResponseState> ConfirmAuth(RequestContext context)
        {
            var iam = context.GetBody<Identity>();

            if (iam == null || iam.Username.Length == 0) return new ResponseState()
            {
                status = 401,
                message = "No Auth"
            };

            var youare = await DataEngineMangment.identityEngine.Get(iam.Id);

            if (youare == null || iam.CookieKey == null || iam.CookieKey.Length == 0)
            {
                iam.CookieKey = RandomString();
                youare = new Identity(iam.Username, encoder.Encode(iam.CookieKey));
                await DataEngineMangment.identityEngine.Add(youare);
                
                return new ResponseState()
                {
                    status = 201,
                    message = "Created New Auth",
                    data = new Identity(iam.Username, iam.CookieKey) { Id = youare.Id }
                };
            }
            else if (!encoder.Compare(iam.CookieKey, youare.CookieKey))
            {
                return new ResponseState()
                {
                    status = 401,
                    message = "No Auth"
                };
            }

            return new ResponseState()
            {
                status = 200,
                message = "Existing Auth Accepted"
            };
        }
    }
}
