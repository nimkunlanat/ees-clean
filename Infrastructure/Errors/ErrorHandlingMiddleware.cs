using Application.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Application.Interfaces;
using System.Linq;

namespace Infrastructure.Errors;

public abstract record ErrorResponseType
{
    private readonly JsonSerializerOptions _jsonOption = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
    public record Error(string code) : ErrorResponseType()
    {
        public override string CreateResponse() => JsonSerializer.Serialize(this, _jsonOption);
    }
    public record RestError(ErrorMessage error) : ErrorResponseType()
    {
        public override string CreateResponse()
        {
            if (error.TranslateFlag == null || error.TranslateFlag == false) return JsonSerializer.Serialize(error, _jsonOption);
            else return this.error.TranslatedMessage;
        }
    }

    public record RestErrorList(IEnumerable<ErrorMessage> errorMessages, bool single) : ErrorResponseType()
    {
        public override string CreateResponse()
        {
            List<ErrorMessage> errors = errorMessages.Where(e => e.TranslateFlag == null || e.TranslateFlag == false).ToList();
            List<string> translateErrors = errorMessages.Where(e => e.TranslateFlag == true).Select(e => e.TranslatedMessage).ToList();
            string result = JsonSerializer.Serialize(new { single, errors, translateErrors }, _jsonOption);

            return result;
        }
    }

    private ErrorResponseType()
    {

    }
    public abstract string CreateResponse();
}

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;
    public ErrorHandlingMiddleware(ILogger<ErrorHandlingMiddleware> logger, RequestDelegate next)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context, ICleanDbContext db, ICurrentUserAccessor user)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error middleware");
            await HandleExceptionAsync(context, ex, db, user);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception, ICleanDbContext db, ICurrentUserAccessor user)
    {
        ErrorResponseType errorResponse = null;

        switch (exception)
        {
            case RestException re:

                List<ErrorMessage> translates = new();

                foreach (ErrorMessage error in re.Errors)
                {
                    ErrorMessage translated = await error.GetMessage(db, user.Language);
                    translates.Add(translated);
                }

                if (translates.Count == 1) errorResponse = new ErrorResponseType.RestError(translates[0]);
                else errorResponse = new ErrorResponseType.RestErrorList(translates, re.SingleMessage ?? false);

                context.Response.StatusCode = (int)re.Code;

                break;

            case DbUpdateConcurrencyException ce:
                errorResponse = new ErrorResponseType.Error("message.STD00011");
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;

                break;

            case DbUpdateException ue:
                if (ue.InnerException is SqlException) errorResponse = new ErrorResponseType.Error(GetExceptionMessage(ue.InnerException as SqlException));
                else errorResponse = new ErrorResponseType.Error(ue.InnerException.Message);

                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                break;

            case Exception e:
                errorResponse = new ErrorResponseType.Error(GetExceptionMessage(e));
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                break;

            default:
                errorResponse = new ErrorResponseType.Error(exception.Message);

                break;
        }

        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(errorResponse.CreateResponse());
    }

    private string GetExceptionMessage(SqlException exception)
    {
        if (exception.Number == 547) return exception.Message.ToLower().Contains("delete") ? $"message.SQL{exception.Number}D" : $"message.SQL{exception.Number}A";
        else return $"message.SQL{exception.Number}";
    }

    private string GetExceptionMessage(Exception exception)
    {
        if (exception.Message.Contains("Value cannot be null") && ((System.ArgumentException)exception).ParamName == "entity") return "message.STD00011";
        else if (string.IsNullOrEmpty(exception.Message)) return "Error";
        else return exception.Message;
    }
}
