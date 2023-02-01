using HomeBuzz.data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace HomeBuzz.data
{
    public partial class CurrencyService : ServiceBase<Currency>, ICurrencyService
    {
        public CurrencyService(IDbFactory dbFactory, IUnitOfWork unitOfWork) : base(dbFactory, unitOfWork)
        {

        }

        public Currency CheckInsertOrUpdate(Currency currency)
        {
            var existingItem = GetMany(t => t.CurrencyId == currency.CurrencyId).Result.FirstOrDefault();

            if (existingItem != null)
            {
                return UpdateCurrency(existingItem, currency);
            }
            else
            {
                return InsertCurrency(currency);
            }
        }

        public Currency InsertCurrency(Currency currency)
        {
            var newItem = Add(currency);
            SaveAsync();

            return newItem;
        }

        public Currency UpdateCurrency(Currency existingItem, Currency currency)
        {
            foreach (PropertyInfo property in currency.GetType().GetProperties())
            {
                if (!property.CanRead || (property.GetIndexParameters().Length > 0))
                    continue;

                PropertyInfo other = existingItem.GetType().GetProperty(property.Name);
                if ((other != null) && (other.CanWrite))
                    other.SetValue(existingItem, property.GetValue(currency, null), null);
            }

                UpdateAsync(existingItem, existingItem.CurrencyId);
                SaveAsync();

            return existingItem;
        }

        public List<Currency> GetAllCurrency(long userId)
        {
            return GetMany(x => x.IsDeleted == false).Result.ToList();
        }

        public Currency GetCurrencyById(long currencyId)
        {
            return GetMany(x => x.CurrencyId == currencyId).Result.FirstOrDefault();
        }

        public Currency GetDefaultCurrency()
        {
            return GetMany(x => x.IsDefaultCurrency == true).Result.FirstOrDefault();
        }

        public Currency GetCurrencyCodeById(long currencyId)
        {
            return GetMany(x => x.CurrencyId == currencyId).Result.FirstOrDefault();
        }
    }

    public partial interface ICurrencyService : IService<Currency>
    {
        Currency CheckInsertOrUpdate(Currency currency);

        List<Currency> GetAllCurrency(long userId);

        Currency GetCurrencyById(long currencyId);

        Currency GetCurrencyCodeById(long currencyId);

        Currency GetDefaultCurrency();
    }
}
