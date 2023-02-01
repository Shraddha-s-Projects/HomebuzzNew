using System;
using HomeBuzz.data.Models;
using System.Linq;

namespace HomeBuzz.data
{
    public partial class VerificationCodeService : ServiceBase<VerificationCode>, IVerificationCodeService
    {
        public VerificationCodeService(IDbFactory dbFactory, IUnitOfWork unitOfWork) : base(dbFactory, unitOfWork)
        {

        }

        public VerificationCode CheckInsertOrUpdate(VerificationCode verificationCode)
        {
            var existingItem = GetMany(t => t.Email.ToLower() == verificationCode.Email.ToLower() && t.VerificationFor.ToLower() == verificationCode.VerificationFor.ToLower() && t.IsUsed == false && t.UserId == verificationCode.UserId && t.IsDeleted == false).Result.FirstOrDefault();

            if (existingItem != null)
            {
                return UpdateVerificationCode(existingItem, verificationCode);
            }
            else
            {
                return InsertVerificationCode(verificationCode);
            }
        }

        public VerificationCode InsertVerificationCode(VerificationCode verificationCode)
        {
            var newItem = Add(verificationCode);
            SaveAsync();

            return newItem;
        }

        public VerificationCode UpdateVerificationCode(VerificationCode existingItem, VerificationCode verificationCode)
        {
            existingItem.VerificationFor = verificationCode.VerificationFor;
            existingItem.Code = verificationCode.Code;
            existingItem.IsUsed = verificationCode.IsUsed;
            existingItem.IsExpired = verificationCode.IsExpired;
            existingItem.ExpiredOn = verificationCode.ExpiredOn;
            existingItem.UpdatedOn = DataUtility.GetCurrentDateTime();

            UpdateAsync(existingItem, existingItem.VerificationCodeId);
            SaveAsync();

            return existingItem;
        }

        public void UpdateVerificationCode(VerificationCode verificationCode)
        {
            UpdateAsync(verificationCode, verificationCode.VerificationCodeId);
            SaveAsync();
        }

        public VerificationCode GetVerificationCodeDetail(string code, string email)
        {
            return GetMany(t => t.Code.ToLower() == code.ToLower() && t.IsUsed == false && t.Email.ToLower() == email.ToLower() && t.IsDeleted == false).Result.FirstOrDefault();
        }

        public VerificationCode GetVerificationCodeDetailByUserId(string code, long userId, string verifiCationFor)
        {
            return GetMany(t => t.Code.ToLower() == code.ToLower() && t.IsUsed == false && t.UserId == userId && t.VerificationFor.ToLower() == t.VerificationFor.ToLower() && t.IsDeleted == false).Result.FirstOrDefault();
        }

        public VerificationCode GetVerificationCodeByHash(string codeHash, long userId)
        {
            return GetMany(t => DataUtility.ShaHash.GetHash(t.Code) == codeHash && t.IsUsed == false && t.UserId == userId && t.IsDeleted == false).Result.FirstOrDefault();
        }
    }

    public partial interface IVerificationCodeService : IService<VerificationCode>
    {
        VerificationCode CheckInsertOrUpdate(VerificationCode verificationCode);

        void UpdateVerificationCode(VerificationCode verificationCode);

        VerificationCode GetVerificationCodeDetail(string code, string email);

        VerificationCode GetVerificationCodeDetailByUserId(string code, long userId, string verifiCationFor);

        VerificationCode GetVerificationCodeByHash(string codeHash, long userId);
    }
}
