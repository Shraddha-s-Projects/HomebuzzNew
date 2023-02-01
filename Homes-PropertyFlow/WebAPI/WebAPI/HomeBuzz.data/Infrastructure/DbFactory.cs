
using System;
using System.Collections.Generic;
namespace HomeBuzz.data
{
    public class DbFactory : Disposable, IDbFactory
    {
        HomeBuzzContext dbContext;

        public HomeBuzzContext Init(){          
            return dbContext ?? (dbContext = new HomeBuzzContext());
        }

        protected override void DisposeCore(){
            if(dbContext != null){
                dbContext.Dispose();
            }
        }
      
    }
}