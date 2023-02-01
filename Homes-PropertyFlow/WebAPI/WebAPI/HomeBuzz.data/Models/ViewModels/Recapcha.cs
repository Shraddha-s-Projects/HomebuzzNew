using System;
using System.Collections.Generic;
using System.Text;

namespace HomeBuzz.data.Models
{
    public class Recapcha
    {
        public string response { get; set; }

        public string secret { get; set; }

        public string remoteip { get; set; }

        public string success { get; set; }

        public DateTime challenge_ts { get; set; }

        public string hostname { get; set; }
    }
}
