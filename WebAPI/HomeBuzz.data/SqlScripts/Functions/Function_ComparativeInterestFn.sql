CREATE FUNCTION [dbo].[ComparativeInterestFn] (
    @ViewCount BIGINT,
	@Bedrooms   VARCHAR(100),
    @Bathrooms  VARCHAR(100),
	@PropertyId INT,
	@Suburb NVARCHAR(100)
)
RETURNS decimal

AS
BEGIN
DECLARE @ComparativeInterest AS INT
DECLARE @TEMPDATA AS INT = NULL

	;WITH ACTIVECTE_VIEWCOUNT(Id,Address,Bathrooms,Bedrooms, ViewCount)
	AS(
	SELECT p.Id, Address,Bathrooms,Bedrooms, pd.ViewCount from PropertyCrudData p 
	LEFT JOIN PropertyDetail pd ON p.PropertyDetailId = pd.Id
	WHERE 
	p.Bedrooms = @Bedrooms 
	AND p.Bathrooms = @Bathrooms 
	AND p.Suburb = @Suburb
	AND ((@PropertyId IS NULL) OR (@PropertyId IS NOT NULL and pd.PropertyId != @PropertyId))
	)

	SELECT @ComparativeInterest =AVG(ViewCount) from ACTIVECTE_VIEWCOUNT

	SET @TEMPDATA = @ComparativeInterest

	IF(@TEMPDATA IS NULL)
	BEGIN
		SET @ComparativeInterest = 0
	END

 --Select @ComparativeInterest= ROUND(CAST(AVG(CAST(@ViewCount as DECIMAL(10,2))) AS DECIMAL(10,2)),0)
	--from PropertyCrudData pc
	--INNER JOIN PropertyDetail pd ON pc.PropertyDetailId = pd.Id 
	--WHERE 
	--pc.Bedrooms = @Bedrooms
	--AND pc.Bathrooms = @Bathrooms
	--AND pc.Suburb = @Suburb
	--AND ((@PropertyId IS NULL) OR (@PropertyId IS NOT NULL and pd.PropertyId != @PropertyId))

	RETURN @ComparativeInterest

END -- End Function
