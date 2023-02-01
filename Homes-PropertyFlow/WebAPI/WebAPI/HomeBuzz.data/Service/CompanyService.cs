using System;
using System.Collections.Generic;
using System.Linq;
using HomeBuzz.data.Models;

namespace HomeBuzz.data.Service {
    public partial class CompanyService : ServiceBase<Company>, ICompanyService {

        public CompanyService (IDbFactory dbFactory, IUnitOfWork unitOfWork) : base (dbFactory, unitOfWork) {

        }
        public List<Company> GetAllCompany () {
            return GetMany (x => x.IsDeleted == false).Result.ToList ();
        }

        public Company GetCompanyByName (string Name) {
            return GetMany (x => x.Name == Name && x.IsDeleted == false).Result.FirstOrDefault ();
        }

        public Company GetCompanyByPhoneNo (string Phone) {
            return GetMany (x => x.PhoneNo == Phone && x.IsDeleted == false).Result.FirstOrDefault ();
        }

        public Company GetCompanyByEmail (string Email) {
            return GetMany (x => x.Email == Email && x.IsDeleted == false).Result.FirstOrDefault ();
        }
        public Company GetCompanyById (int Id) {
            return GetMany (x => x.Id == Id && x.IsDeleted == false).Result.FirstOrDefault ();
        }

        public Company CheckInsertOrUpdate (Company company) {
            var existingItem = GetMany (t => t.Name == company.Name && t.IsDeleted == false).Result.FirstOrDefault ();
            if (existingItem != null) {
                return UpdateCompany (existingItem, company);
            }
            //Add new
            else {
                return InsertCompany (company);
            }
        }

        public Company UpdateCompany (Company existingItem, Company company) {
            existingItem.UpdatedOn = DateTime.Now;
            UpdateAsync (existingItem, company.Id);
            SaveAsync ();

            return existingItem;
        }

        public Company InsertCompany (Company company) {
            company.CreatedOn = DateTime.Now;
            var newItem = Add (company);
            SaveAsync ();

            return newItem;
        }
    }

    public partial interface ICompanyService : IService<Company> {

        List<Company> GetAllCompany ();
        Company GetCompanyByName (string Name);
        Company GetCompanyByEmail (string Name);
        Company GetCompanyById (int Id);
        Company CheckInsertOrUpdate (Company company);
        Company GetCompanyByPhoneNo (string Phone);
    }
}