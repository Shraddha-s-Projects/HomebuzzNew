namespace HomeBuzz.data
{
    using System;

    public class DataAccessObject : IDisposable
    {
        private HomeBuzzContext _context;

        public DataAccessObject()
        {
            _context = new HomeBuzzContext();
        }

        protected HomeBuzzContext Context
        {
            get { return _context; }
        }

        public bool CommitImmediately { get; set; }

        public void Dispose()
        {
            if (_context != null)
            {
                _context.Dispose();
            }
        }
    }
}