CREATE PROCEDURE [dbo].[ADMIN_REMOVEUSER]
	-- Add the parameters for the stored procedure here
	@userId BIGINT
AS
BEGIN
	SET NOCOUNT ON;

	Update AgentPayment set Isdeleted = 1 where [User] = @userId
	delete from PropertyAgent where OwnerId = @userId
	delete from PropertyClaim where OwnerId = @userId
	Update PropertyDetail set OwnerId = NULL, IsClaimed = 0 where OwnerId = @userId
	delete from PropertyLike where UserId = @userId
	delete from PropertyNotify where UserId = @userId
	delete from PropertyOffer where UserId = @userId
	delete from PropertySearchHistory where UserId = @userId
	delete from PropertyView where UserId = @userId
	delete from UserKeyMap where UserId = @userId
	Update VerificationCode set IsDeleted = 1 where UserId = @userId
	Update Users set Isdeleted = 1 where UserId = @userId
	select * from Users where UserId = @userId and IsDeleted = 1

END