CREATE PROCEDURE [dbo].[GETUSERPROPERTYCLAIMS]
	-- Add the parameters for the stored procedure here
	@userId int = 30
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	Select
	(pc.Id)Id,
	p.Landarea,
	(pd.Id)PropertyDetailId,
	p.Address,
	p.Suburb,
	p.City,
	p.AskingPrice,
	pd.Day,
	pd.Time,
	pd.Status,
	28 - (select (DATEDIFF(dd,pc.ClaimedOn, GETDATE()))) as DayLeft,
	(pd.ActivatedDate)ActivatedOn,
	(pc.ClaimedOn)PropertyClaimedDate,
	p.HomebuzzEstimate,p.Bedrooms,
	p.Bathrooms, p.CarSpace, (pd.Status)HomeStatus,
	(@userId)UserId
	from PropertyCrudData p
	INNER JOIN PropertyDetail pd
	ON p.PropertyDetailId = pd.Id
	INNER JOIN PropertyClaim pc
	ON pd.Id = pc.PropertyDetailId
	Where pc.OwnerId = @userId
END