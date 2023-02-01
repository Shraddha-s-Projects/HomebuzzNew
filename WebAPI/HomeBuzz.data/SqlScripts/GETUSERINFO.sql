CREATE PROCEDURE [dbo].[GETUSERINFO]
	-- Add the parameters for the stored procedure here
	@userId int = 30
AS
BEGIN
	SET NOCOUNT ON;

	select
	UserId,Email, FirstName,ProfilePicPath,IsEmailVerified,
	(select COUNT(pl.Id) from PropertyLike pl JOIN PropertyDetail pd on pd.Id = pl.PropertyDetailId where pl.UserId = @userId)likes,
	(select COUNT(po.Id) from PropertyOffer po JOIN PropertyDetail pd on pd.Id = po.PropertyDetailId where po.UserId = @userId)offers,
	(select COUNT(pc.Id) from PropertyClaim pc JOIN PropertyDetail pd on pd.Id = pc.PropertyDetailId where pc.OwnerId = @userId)claims,
	(select COUNT(Id) from PropertySearchHistory where UserId = @userId and IsDeleted = 0)searches
	 from Users Where UserId = @userId
END