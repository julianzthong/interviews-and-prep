using Microsoft.EntityFrameworkCore.Storage;

namespace Data;

public interface IUnitOfWork
{
  IModelOneRepository ModelOnes { get;}
  IModelTwoRepository ModelTwos { get; }

  Task<int> SaveChangesAsync();
  Task<IDbContextTransaction> BeginTransactionAsync();
}