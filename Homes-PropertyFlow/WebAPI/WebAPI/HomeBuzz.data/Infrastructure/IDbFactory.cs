using System;

namespace HomeBuzz.data
{
    public interface IDbFactory : IDisposable
    {
        HomeBuzzContext Init();
    }
}