using System.Threading;
using System.Threading.Tasks;

namespace Application.Interfaces;

public interface IActivityLogService
{
    Task RoleLog(string roleCode, string roleName, string description, string activityType, CancellationToken token);
    Task RoleProgramLog(string roleCode, string programCode, string activityType, CancellationToken token);
    Task UserLog(string userName, string description, string activityType, CancellationToken token);
    Task UserRoleLog(string userName, string roleCode, string activityType, CancellationToken token);
    Task UserDepartmentLog(string userName, string departmentCode, string activityType, CancellationToken token);
    Task SendEmailLog(string subject,string email,bool success,string error,CancellationToken token);
}
