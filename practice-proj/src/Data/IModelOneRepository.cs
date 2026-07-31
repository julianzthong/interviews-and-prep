public interface IModelOneRepository where ModelOne :
{
  Task<ModelOne> GetById(Guid Id);

  Task<List<ModelOne>> GetAll();
}