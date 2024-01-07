using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Persistense;
public class RequestLoggingAttribute : ActionFilterAttribute
{
    public async override Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        ILogger<RequestLoggingAttribute> logger = context.HttpContext.RequestServices.GetService(typeof(ILogger<RequestLoggingAttribute>)) as ILogger<RequestLoggingAttribute>;
        ICurrentUserAccessor currentUserAccessor = context.HttpContext.RequestServices.GetService(typeof(ICurrentUserAccessor)) as ICurrentUserAccessor;
        
        HttpRequest request = context.HttpContext.Request;
        string requestContent = string.Empty;
        List<string> ignoreLoggingProperties = new List<string>();

        if (request.Method != HttpMethods.Get && request.Method != HttpMethods.Options && request.Method != HttpMethods.Delete)
        {
            request.Body.Seek(0, SeekOrigin.Begin);

            using (StreamReader reader = new StreamReader(request.Body))
            {
                requestContent = await reader.ReadToEndAsync();
            }

            foreach (ControllerParameterDescriptor param in context.ActionDescriptor.Parameters)
            {
                if (param.ParameterInfo.CustomAttributes.Any(a => a.AttributeType == typeof(FromBodyAttribute)))
                {
                    var entity = context.ActionArguments[param.Name];
                    var type = entity.GetType();
                    var properties = type.GetProperties().Where(w => w.GetCustomAttributes(true).Any(a => a.GetType().Name == "IgnoreLoggingAttribute")).ToList();
                    ignoreLoggingProperties.AddRange(properties.Select(s => s.Name));

                    if (ignoreLoggingProperties.Count > 0)
                    {
                        JsonSerializerOptions options = new()
                        {
                            ReferenceHandler = ReferenceHandler.IgnoreCycles
                        };

                        ExpandoObject bodyObj = JsonSerializer.Deserialize<ExpandoObject>(requestContent, options);

                        var objDictionary = (IDictionary<string, object>)bodyObj;
                        var propertiesToBeRemoveds = objDictionary.Keys.Where(w => ignoreLoggingProperties.Any(a => a.Equals(w, StringComparison.OrdinalIgnoreCase))).ToList();

                        foreach (var prop in propertiesToBeRemoveds)
                        {
                            objDictionary.Remove(prop);
                        }

                        requestContent = JsonSerializer.Serialize(objDictionary, options);
                    }

                    break;
                }
            }
        }

        var json = new
        {
            TraceId = request.HttpContext.TraceIdentifier,
            Url = request.GetDisplayUrl(),
            CurrentUser = currentUserAccessor.UserId,
            CurrentProgramCode = currentUserAccessor.ProgramCode,
            User = currentUserAccessor.UserName,
            RequestParameters = requestContent
        };

        logger.LogInformation($"Request logging: {JsonSerializer.Serialize(json)}");

        await next();
    }
}
