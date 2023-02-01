CREATE PROCEDURE [dbo].[GETUSERPROPERTYLIKES]
	-- Add the parameters for the stored procedure here
	@userId int = 30
AS
BEGIN
	SET NOCOUNT ON;

	Select
	(pl.Id)Id,
	(pd.Id)PropertyDetailId,
	p.Address,
	p.Suburb,
	p.City,
	(@userId)UserId
	from PropertyCrudData p
	INNER JOIN PropertyDetail pd
	ON p.PropertyDetailId = pd.Id
	INNER JOIN PropertyLike pl
	ON pd.Id = pl.PropertyDetailId
	Where pl.UserId = @userId
END