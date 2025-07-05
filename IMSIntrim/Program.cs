using Humanizer;
using IMSIntrim.Application.Interfaces;
using IMSIntrim.Application.Services;
using IMSIntrim.Applications.DependencyInjections;
using IMSIntrim.Applications.Interfaces;
using IMSIntrim.Applications.MiddleWares;
using IMSIntrim.Applications.Services;
using IMSIntrim.Applications.Utils;
using IMSIntrim.Domain.Interfaces;
using IMSIntrim.Infrastructure.Persistance;
using IMSIntrim.Infrastructure.Persistance.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Serilog;
using Serilog.Events;
using Serilog.Formatting.Json;
using System.Buffers.Text;
using System.Composition;
using System.Net;
using System.Reflection.Metadata;
using System.Runtime.InteropServices;
using System.Text;
using static System.Net.Mime.MediaTypeNames;

namespace IMSIntrim
{
    public class Program
    {
        public static void Main(string[] args)
        {
            /* compiler will decide which data type we can assign to this variable
            because it is decalred as using var key word.*/
            /* WebApplication.CreateBuilder(args) this method is used to create a 'builder' project
            which helps to build and configure the web application.*/
            /*the builder object sets up the services, middleware, configuration, and the components
             needed for the web application.
            it prepares the infrastructure for dependency injection, setting up the services, middleware etc. */
            var builder = WebApplication.CreateBuilder(args);



            /* this builder.services.AddControllers() method register controller services
             * with the dependency injection container.
             * it enables MVC styles controller
             * without this we can not recognize the controller classes like CustomerController etc.
             */
            builder.Services.AddControllers();




            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            /*
             * this adds support for api endpoints discovery
             * it scans up your endpoints methods and make them available for the api documentation
             */
            builder.Services.AddEndpointsApiExplorer();




            /*Swagger is a tool, automatically creates documentation of api and make a web-ui to access the endpoints
             *In this first line you are saying that how to describe your api and how to handle security
             */
            builder.Services.AddSwaggerGen(c =>
            {
                //This is for versioned api documentaion
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "IMS API", Version = "v1" });
                //for security we are using JWT token for authentication and authorization.
                //this is simply the defination to set up the security for authentication and authorization
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                    {
                        In = ParameterLocation.Header,
                        Description = "Enter 'Bearer' followed by space and JWT token",
                        Name = "Authorization",
                        Type = SecuritySchemeType.ApiKey,
                        Scheme = "Bearer"
                    });
                /*This method tells all api need the token for authentication and authorization*/
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                {
                new OpenApiSecurityScheme
                    {
                        Reference=new OpenApiReference
                            {
                                Type=ReferenceType.SecurityScheme,
                                Id="Bearer"
                            }
                    },
                    new string[] { }
                 }
                     });
            });
            


            builder.Services.AddSwaggerGen();
            var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
            var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            builder.Services.AddSwaggerGen(c =>
            {
                c.IncludeXmlComments(xmlPath);
            });


            /*Insurance Db context is a custom class that defines how the app interacts with the database.*/
            /*UseSqlServer() method tell the EF core that to use sql server as the database provider*/
            builder.Services.AddDbContext<InsuranceDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            
            /*this AddApplicationServices() is a custom extension method, that help to register the app specific
             servics inside the dependecny injection file
            it uses 'cofiguration' to set up services your app needs.
             */
            builder.Services.AddApplicationServices(builder.Configuration);
            /*This sets up automapper, this library that helps you to map one object with anothe object like from database model to DTO's
             * AppDomain.CurrentDomain.GetAssemblies() this will help us to scan all assemblies in the project for
             * mapping profiles.
             * in .NET an assembly means basically the compiled .dll or .exe file.
             * 
             * look through the all assemblies that are present in the project
             * find any classes that are inherited from profile
             * Automatically register those mapping rules
             */
            builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            //Adds a service that lets you access the current HTTP request (like headers, cookies, etc.) from anywhere in your code.
            builder.Services.AddHttpContextAccessor();

            //Reads the JWT settings (like secret key, issuer, audience) from your appsettings.json file.
            var jwtSettings = builder.Configuration.GetSection("JwtSettings");

            //Gets the secret key used to sign and verify JWT tokens
            var secretKey = jwtSettings["SecretKey"];

            //Converts the secret key into a format that can be used for encryption.
            var key = Encoding.ASCII.GetBytes(secretKey);


            /*Tells ASP.NET Core to use JWT Bearer authentication.
            This means the app expects a JWT token in the request to verify the user.*/
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            /* Configurations of JWT Bearer
             * Check if the token is from the correct issuer.
             * Check if the token is meant for the correct audience.
             * Check if the token is still valid (not expired).
             * Check if the token was signed with the correct secret key
             */
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)

                };
                //token from cookies
                /*This part tells the app to look for the JWT token in cookies (named "jwt").
                    If found, it uses that token for authentication.*/
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        //we are storing the token in a browser cookie instead of sending it in the header
                        var token = context.Request.Cookies["jwt"];
                        if (!string.IsNullOrEmpty(token))
                        {
                            context.Token = token;
                        }
                        return Task.CompletedTask;
                    }
                };
            });



            builder.Services.AddAutoMapper(typeof(Program));
            builder.Services.AddControllers();


            //cors: cross origin resource sharing
            //CORS is a security feature in web browsers that controls which websites are allowed to access your backend API.
            /*Reads a setting called "allowedOrigins" from your appsettings.json.
              Splits it into a list of URLs (if you have multiple origins separated by commas).
              Example: "http://localhost:4200,http://example.com" becomes a list of two origins.
              Note: In the code you posted, this variable is not used in the CORS policy below — maybe it's intended for dynamic configuration later.
            */
            var allowedOrigins = builder.Configuration.GetValue<string>("allowedOrigins")!.Split(",");

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", builder =>
                {
                    //Only allows requests from http://localhost:4200.
                    builder.WithOrigins("http://localhost:4200")
                           .AllowAnyHeader()
                           .AllowAnyMethod()
                           .AllowCredentials(); // Only if using cookies/sessions
                });
            });

            //This builds the web application using all the services and configurations you've set up earlier.
            var app = builder.Build();

            app.UseMiddleware<ExceptionMiddleware>();

            //This sets up a fallback error handler for unhandled exceptions.
            //If something goes wrong and isn’t caught by your middleware, this block will handle it.
            app.UseExceptionHandler(errorApp =>
            {
                errorApp.Run(async context =>
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.ContentType = "application/json";

                    var response = new { Message = "An unexpected error occurred." };
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(response));
                });
            });

            // Configure the HTTP request pipeline.
            //It enables Swagger, which provides a web-based UI to explore and test your API.
            //SwaggerEndpoint points to the generated API documentation.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "IMSIntrim v1");
                });
            }
            //it is used to show the detailed error to the developer
            app.UseDeveloperExceptionPage();
            //it is used to redirect the http to https if it is needed at that time
            app.UseHttpsRedirection();
            //Applies the CORS policy you defined earlier.
            //Allows your frontend(e.g., Angular on localhost: 4200) to access the backend.
            app.UseCors("AllowFrontend");
            //is used for authentication and authorization
            app.UseAuthentication();
            app.UseAuthorization();
            /*Maps your controller classes (like UserController, ProductController) to routes.
            Enables your API endpoints to respond to HTTP requests.*/
            app.MapControllers();
            //starts the web application
            app.Run();
        }
    }
}