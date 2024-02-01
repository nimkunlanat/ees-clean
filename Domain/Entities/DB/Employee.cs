using System;

namespace Domain.Entities.DB;

public class Employee : EntityBase
{
    public string EmployeeCode { get; set; }
    public string EmployeeFirstnameTh { get; set; }
    public string EmployeeSurnameTh { get; set; }
    public string EmployeeFirstnameEn { get; set; }
    public string EmployeeSurnameEn { get; set; }
    public string PositionCode { get; set; }
    public Guid? TeamCode { get; set; }
    public string Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string Nationality { get; set; }
    public string Religion  { get; set; }
    public string PhoneNumber { get; set; }
    public string Email { get; set; }
    public int? UserId { get; set; }
    public int? SequeneId { get; set; }
    public string LanguageCode { get; set; }
    public bool? Active { get; set; }
}
