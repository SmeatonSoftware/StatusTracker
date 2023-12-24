namespace StatusTracker.Data.Classes
{
    public class PingResult : DataClass
    {
        #region Constructors

        public PingResult()
        { }

        public PingResult(int targetServiceId, bool success, int statusCode, float mS)
        {
            TargetServiceId = targetServiceId;
            Success = success;
            StatusCode = statusCode;
            MS = mS;
        }

        #endregion Constructors

        #region Properties

        public float MS { get; set; }
        public int StatusCode { get; set; }
        public bool Success { get; set; }
        public int TargetServiceId { get; set; }

        #endregion Properties
    }
}