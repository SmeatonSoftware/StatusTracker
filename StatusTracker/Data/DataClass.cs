using System;

namespace StatusTracker.Data
{
    public class DataClass
    {
        #region Properties

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int Id { get; set; }

        #endregion Properties
    }
}