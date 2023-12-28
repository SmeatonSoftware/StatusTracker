using PIApp_Lib.Data;

namespace StatusTracker.Data.Classes
{
    public class FavouriteService : DataClass
    {
        #region Constructors

        public FavouriteService()
        { }

        public FavouriteService(TargetService targetService, Identity identity)
        {
            this.targetService = targetService.Id;
            this.idenitityId = identity.Id;
        }

        #endregion Constructors

        #region Properties

        public int idenitityId { get; set; }
        public int targetService { get; set; }

        #endregion Properties
    }
}