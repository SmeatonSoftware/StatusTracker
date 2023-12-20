using PIApp_Lib;
using StatusTracker.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StatusTracker.Controllers
{
    public static class Services
    {
        public static async Task<ResponseState> GetAll(RequestContext context)
        {
            var favs = await DataEngineMangment.favouriteServiceEngine.table.FindAllAsync();

            var results = await DataEngineMangment.targetServiceEngine.table.FindAllAsync();

            results = results.OrderByDescending(x => favs.Count(y => y.targetService == x.Id));

            return new ResponseState()
            {
                message = "All Services",
                data = results
            };
        }
        public static async Task<ResponseState> GetFavourites(RequestContext context)
        {
            var iden = await Authorization.IdentityFromHeader(context);

            if (iden == null)
            {
                return new ResponseState()
                {
                    message = "No Login",
                    status = 401
                };
            }

            var favs = (await DataEngineMangment.favouriteServiceEngine.Search(x => x.idenitityId == iden.Id)).Select(x=>x.targetService);

            var servs = await DataEngineMangment.targetServiceEngine.Search(x => x.identityCreated == iden.Id || favs.Contains(x.Id));

            return new ResponseState()
            {
                message = "Your Favs",
                data = servs
            };
        }

        public static async Task<ResponseState> ToggleFavourite(RequestContext context)
        {
            var query = context.context.Request.QueryString;

            if (!query.AllKeys.Contains("service") || !int.TryParse(query.Get("service"), out var serviceId))
            {
                return new ResponseState()
                {
                    message = "Service Id Missing Or Malformed",
                    status = 400
                };
            }

            var service = await DataEngineMangment.targetServiceEngine.TryFind(x => x.Id == serviceId);

            if (service == null)
            {
                return new ResponseState()
                {
                    message = "Service Not Found",
                    status = 404
                };
            }

            var iden = await Authorization.IdentityFromHeader(context);

            if (iden == null)
            {
                return new ResponseState()
                {
                    message = "No Login",
                    status = 401
                };
            }

            var fav = await DataEngineMangment.favouriteServiceEngine.TryFind(x => x.targetService == serviceId);

            if (fav!= null)
            {
                await DataEngineMangment.favouriteServiceEngine.Remove(fav.Id);
            }
            else
            {
                await DataEngineMangment.favouriteServiceEngine.Add(new Data.Classes.FavouriteService(service, iden));
            }

            return new ResponseState()
            {
                message = "Toggled Favourite",
                data = new { favourite = fav == null }
            };
        }

        public static async Task<ResponseState> Delete(RequestContext context)
        {
            var query = context.context.Request.QueryString;

            if (!query.AllKeys.Contains("service") || !int.TryParse(query.Get("service"), out var serviceId))
            {
                return new ResponseState()
                {
                    message = "Service Id Missing Or Malformed",
                    status = 400
                };
            }

            var service = await DataEngineMangment.targetServiceEngine.TryFind(x => x.Id == serviceId);

            if (service == null)
            {
                return new ResponseState()
                {
                    message = "Service Not Found",
                    status = 404
                };
            }

            var iden = await Authorization.IdentityFromHeader(context);

            if (iden == null || service.identityCreated != iden.Id)
            {
                return new ResponseState()
                {
                    message = "You Didnt Create This.",
                    status = 401
                };
            }

            await DataEngineMangment.pingResultEngine.table.DeleteManyAsync(x => x.TargetServiceId == serviceId);
            await DataEngineMangment.targetServiceEngine.Remove(serviceId);

            return new ResponseState()
            {
                message = "Deleted Service"
            };
        }

        public static async Task<ResponseState> AddOrUpdate(RequestContext context)
        {

            var url = context.GetBody().Trim('\"');

            var query = context.context.Request.QueryString;

            var minutes = query.AllKeys.Contains("delay") ? int.TryParse(query.Get("delay"), out var d) ? d : 5 : 5;

            var delay = new TimeSpan(0, minutes, 0);

            var service = await DataEngineMangment.targetServiceEngine.TryFind(x => x.url == url);
            bool existingService = service != null;

            var iden = await Authorization.IdentityFromHeader(context);

            if (iden == null || (existingService && service.identityCreated == iden.Id))
            {
                return new ResponseState()
                {
                    message = "Login Not Granted",
                    status = 401
                };
            }

            if (!existingService)
            {
                service = new Data.Classes.TargetService(url, delay, iden);
                await DataEngineMangment.targetServiceEngine.Add(service);
            }
            else
            {
                service.runFrequency = delay; 
                DataEngineMangment.targetServiceEngine.Update(service);
            }

            return new ResponseState()
            {
                message = "Added or Updated Service",
                data = service
            };
        }
    }
}
