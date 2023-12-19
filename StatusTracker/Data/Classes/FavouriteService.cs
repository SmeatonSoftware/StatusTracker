using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StatusTracker.Data.Classes
{
    public class FavouriteService : DataClass
    {
        public int targetService {  get; set; }
        public int idenitityId {  get; set; }

        public FavouriteService() { }

        public FavouriteService(TargetService targetService, Identity identity)
        {
            this.targetService = targetService.Id;
            this.idenitityId = identity.Id;
        }
    }
}
