using PIApp_Lib;
using PIApp_Lib.Data;
using StatusTracker.Data;
using StatusTracker.Data.Classes;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace StatusTracker.Controllers
{
    public static class Services
    {
        #region Methods

        public static async Task<ResponseState> AddOrUpdate(RequestContext context)
        {
            var url = context.GetBody().Trim('\"');

            var query = context.context.Request.QueryString;

            var minutes = query.AllKeys.Contains("delay") ? int.TryParse(query.Get("delay"), out var d) ? d : 5 : 5;

            var delay = new TimeSpan(0, minutes, 0);

            var service = await DataEngineManagement.GetTable<TargetService>().TryFind(x => x.url == url);
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
                DataEngineManagement.GetTable<TargetService>().Add(service);
            }
            else
            {
                service.runFrequency = delay;
                DataEngineManagement.GetTable<TargetService>().Update(service);
            }

            return new ResponseState()
            {
                message = "Added or Updated Service",
                data = service
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

            var service = await DataEngineManagement.GetTable<TargetService>().TryFind(x => x.Id == serviceId);

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

            await DataEngineManagement.GetTable<PingResult>().table.DeleteManyAsync(x => x.TargetServiceId == serviceId);
            await DataEngineManagement.GetTable<TargetService>().Remove(serviceId);

            return new ResponseState()
            {
                message = "Deleted Service"
            };
        }

        public static async Task<ResponseState> GetAll(RequestContext context)
        {
            var iden = await Authorization.IdentityFromHeader(context);

            var favs = (await DataEngineManagement.GetTable<FavouriteService>().table.FindAllAsync());

            var results = await DataEngineManagement.GetTable<TargetService>().table.FindAllAsync();

            results = results.OrderByDescending(x => favs.Count(y => y.targetService == x.Id)).ToArray();

            if (iden != null)
            {
                foreach (var item in results)
                {
                    if (favs.Any(x => x.targetService == item.Id && x.idenitityId == iden.Id))
                    {
                        item.isFav = true;
                    }
                }
            }

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

            var favs = (await DataEngineManagement.GetTable<FavouriteService>().Search(x => x.idenitityId == iden.Id)).Select(x => x.targetService).ToArray();

            var servs = await DataEngineManagement.GetTable<TargetService>().Search(x => x.identityCreated == iden.Id || favs.Contains(x.Id));

            foreach (var item in servs)
            {
                item.isFav = favs.Contains(item.Id);
            }

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

            var service = await DataEngineManagement.GetTable<TargetService>().TryFind(x => x.Id == serviceId);

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

            var fav = await DataEngineManagement.GetTable<FavouriteService>().TryFind(x => x.targetService == serviceId);

            if (fav != null)
            {
                await DataEngineManagement.GetTable<FavouriteService>().Remove(fav.Id);
            }
            else
            {
                DataEngineManagement.GetTable<FavouriteService>().Add(new Data.Classes.FavouriteService(service, iden));
            }

            return new ResponseState()
            {
                message = "Toggled Favourite",
                data = new { favourite = fav == null }
            };
        }

        #endregion Methods
    }
}