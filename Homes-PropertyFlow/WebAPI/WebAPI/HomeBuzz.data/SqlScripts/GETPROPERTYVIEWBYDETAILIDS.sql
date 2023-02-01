CREATE PROCEDURE [dbo].[GETPROPERTYVIEWBYDETAILIDS]
	-- Add the parameters for the stored procedure here
	@PropertyDetailIds NVARCHAR(MAX) = null,
	@userKey NVARCHAR(MAX) = null,
	@userId int = null

	
AS
BEGIN 
SET NOCOUNT ON;
	Select * from PropertyView where PropertyDetailId in (SELECT Item FROM DBO.SplitStrings(@PropertyDetailIds, ','))
	AND ((@userId IS NOT NULL  AND UserId = @userId)
	AND (@userKey IS NOT NULL AND UserKey != @userKey))

END