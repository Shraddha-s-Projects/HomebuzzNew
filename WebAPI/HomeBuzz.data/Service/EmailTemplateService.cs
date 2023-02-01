using HomeBuzz.data.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace HomeBuzz.data
{
    public partial class EmailTemplateService : ServiceBase<EmailTemplate>, IEmailTemplateService
    {
        private readonly IGetAllEmailTemplateRepository _getAllEmailTemplateRepository;

        public EmailTemplateService(IDbFactory dbFactory, IUnitOfWork unitOfWork, IGetAllEmailTemplateRepository getAllEmailTemplateRepository) : base(dbFactory, unitOfWork)
        {
            _getAllEmailTemplateRepository = getAllEmailTemplateRepository;
        }

        public EmailTemplate CheckInsertOrUpdate(EmailTemplate emailTemplate)
        {
            var existingItem = GetMany(t => t.EmailTemplateId == emailTemplate.EmailTemplateId).Result.FirstOrDefault();

            if (existingItem != null)
            {
                return UpdateEmailTemplate(existingItem, emailTemplate);
            }
            else
            {
                return InsertEmailTemplate(emailTemplate);
            }
        }

        public EmailTemplate InsertEmailTemplate(EmailTemplate emailTemplate)
        {
            var newItem = Add(emailTemplate);
            SaveAsync();

            return newItem;
        }

        public EmailTemplate UpdateEmailTemplate(EmailTemplate existingItem, EmailTemplate emailTemplate)
        {
            UpdateAsync(existingItem, existingItem.EmailTemplateId);
            SaveAsync();

            return existingItem;
        }

        public List<EmailTemplate> GetAllEmailTemplate(long userId, EmailTemplateFilter model)
        {
            SqlParameter[] parameters = new SqlParameter[] {
                new SqlParameter{ParameterName="@InfoCode", Value= model.InfoCode},
                new SqlParameter{ParameterName="@FilterInfoCode", Value= model.FilterInfoCode},
                new SqlParameter{ParameterName="@InfoId", Value= model.InfoId},
                new SqlParameter{ParameterName="@Query", Value= model.Query},
                new SqlParameter{ParameterName="@PageNum", Value= model.PageNum},
                new SqlParameter{ParameterName="@PageSize", Value= model.Take},
                new SqlParameter{ParameterName="@OrderColumnName", Value= model.OrderColumnName},
                new SqlParameter{ParameterName="@OrderColumnDir", Value= model.OrderColumnDir},

            };

            return _getAllEmailTemplateRepository.ExecuteSP<EmailTemplate>("GetAllEmailTemplate", parameters).ToList();
        }

        public EmailTemplate GetEmailTemplateByCode(string code)
        {
            var item = GetMany(t => t.TemplateCode.ToLower() == code.ToLower()).Result.FirstOrDefault();
            return item;
        }

        public EmailTemplate GetEmailTemplateById(long emailTemplateId)
        {
            return GetMany(x => x.EmailTemplateId == emailTemplateId).Result.FirstOrDefault();
        }
    }

    public partial interface IEmailTemplateService : IService<EmailTemplate>
    {
        EmailTemplate CheckInsertOrUpdate(EmailTemplate emailTemplate);

        EmailTemplate GetEmailTemplateByCode(string code);

        EmailTemplate GetEmailTemplateById(long emailTemplateId);

        List<EmailTemplate> GetAllEmailTemplate(long userId, EmailTemplateFilter model);
    }
}
