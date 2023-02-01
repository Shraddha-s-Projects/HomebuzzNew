using System;
using System.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using HomeBuzz.data;
using Microsoft.EntityFrameworkCore;
using HomeBuzz.data.Models;
using HomeBuzz.logic.Common;

namespace HomeBuzz.api.JwtTokenProvider
{
    /// <summary>
    /// Token generator middleware component which is added to an HTTP pipeline.
    /// This class is not created by application code directly,
    /// instead it is added by calling the <see cref="TokenProviderAppBuilderExtensions.UseSimpleTokenProvider(Microsoft.AspNetCore.Builder.IApplicationBuilder, TokenProviderOptions)"/>
    /// extension method.
    /// </summary>
    public class TokenProviderMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly TokenProviderOptions _options;
        private readonly ILogger _logger;
        private readonly JsonSerializerSettings _serializerSettings;
        private readonly HomeBuzzContext _context;
        private ErrorLogService errorlogservice;

        public TokenProviderMiddleware(
            RequestDelegate next,
            IOptions<TokenProviderOptions> options,
            ILoggerFactory loggerFactory,
            HomeBuzzContext context)
        {
            _context = context;
            _next = next;
            _logger = loggerFactory.CreateLogger<TokenProviderMiddleware>();
            _options = options.Value;
            ThrowIfInvalidOptions(_options);
            errorlogservice = new ErrorLogService(context);
            _serializerSettings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };
        }

        public Task Invoke(HttpContext context)
        {
            // If the request path doesn't match, skip
            if (!context.Request.Path.Equals(_options.Path, StringComparison.Ordinal))
            {
                return _next(context);
            }

            // Request must be POST with Content-Type: application/x-www-form-urlencoded
            if (!context.Request.Method.Equals("POST")
               || !context.Request.HasFormContentType)
            {
                context.Response.StatusCode = 400;
                return context.Response.WriteAsync("Bad request.");
            }

            _logger.LogInformation("Handling request: " + context.Request.Path);

            return GenerateToken(context);
        }

        private async Task GenerateToken(HttpContext context)
        {
            try
            {
                var username = context.Request.Form["Username"];
                var passwordHash = context.Request.Form["Password"];

                var User = _context.User
                                    .Where(m => (m.Email.Trim().ToLower() == username.ToString())
                                                && m.Password == passwordHash.ToString() 
                                                && m.IsActive == true
                                    ).FirstOrDefault();

                // If user not found
                if (User == null)
                {
                    context.Response.StatusCode = 401;
                    var InValidResponse = new
                    {
                        statusCode = 401,
                        errorCode = "1",
                        errorCase = "invalid credential",
                    };
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(InValidResponse, _serializerSettings));
                    return;
                }

                //// If user's email is not verified
                //if (!User.IsEmailVerified)
                //{
                //    context.Response.StatusCode = 401;
                //    var EmailNotVerifiedResponse = new
                //    {
                //        statusCode = 401,
                //        errorCode = "2",
                //        errorCase = "email not verified",
                //    };
                //    context.Response.ContentType = "application/json";
                //    await context.Response.WriteAsync(JsonConvert.SerializeObject(EmailNotVerifiedResponse, _serializerSettings));
                //    return;
                //}

                var now = DataUtility.GetCurrentDateTime();

                // You can add other claims here, if you want:
                // Specifically add the jti (nonce), iat (issued timestamp), and sub (subject/user) claims.
                var claims = new Claim[]
                {              
                    new Claim(JwtRegisteredClaimNames.Email,username),
                    new Claim(JwtRegisteredClaimNames.Sid, User.UserId.ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, await _options.NonceGenerator()),
                    new Claim(JwtRegisteredClaimNames.Iat, ToUnixEpochDate(now).ToString(), ClaimValueTypes.Integer64)
                };

                // Create the JWT and write it to a string
                var jwt = new JwtSecurityToken(
                    issuer: _options.Issuer,
                    audience: _options.Audience,
                    claims: claims,
                    notBefore: now,
                    expires: now.Add(_options.Expiration),
                    signingCredentials: _options.SigningCredentials);

                var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

                var model = new LoginVM();
                model.UserId = User.UserId;
                //model.IsSignUpFinished = User.IsSignUpFinished;

                var response = new
                {
                    access_token = encodedJwt,
                    expires_in = (int)_options.Expiration.TotalSeconds,
                    model = model
                };

                // Serialize and return the response
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(response, _serializerSettings));
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 401;
                errorlogservice.LogException(ex);
                var response = new
                {
                    errorCode = "3",
                    errorCase = "error from catch",
                    errorLog = ex.Message,
                    errorMessage = CommonMessage.DefaultErrorMessage
                };
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonConvert.SerializeObject(response, _serializerSettings));
            }
        }

        private static void ThrowIfInvalidOptions(TokenProviderOptions options)
        {
            if (string.IsNullOrEmpty(options.Path))
            {
                throw new ArgumentNullException(nameof(TokenProviderOptions.Path));
            }

            if (string.IsNullOrEmpty(options.Issuer))
            {
                throw new ArgumentNullException(nameof(TokenProviderOptions.Issuer));
            }

            if (string.IsNullOrEmpty(options.Audience))
            {
                throw new ArgumentNullException(nameof(TokenProviderOptions.Audience));
            }

            if (options.Expiration == TimeSpan.Zero)
            {
                throw new ArgumentException("Must be a non-zero TimeSpan.", nameof(TokenProviderOptions.Expiration));
            }

            if (options.SigningCredentials == null)
            {
                throw new ArgumentNullException(nameof(TokenProviderOptions.SigningCredentials));
            }

            if (options.NonceGenerator == null)
            {
                throw new ArgumentNullException(nameof(TokenProviderOptions.NonceGenerator));
            }
        }

        /// <summary>
        /// Get this datetime as a Unix epoch timestamp (seconds since Jan 1, 1970, midnight UTC).
        /// </summary>
        /// <param name="date">The date to convert.</param>
        /// <returns>Seconds since Unix epoch.</returns>
        public static long ToUnixEpochDate(DateTime date) => new DateTimeOffset(date).ToUniversalTime().ToUnixTimeSeconds();
    }
}