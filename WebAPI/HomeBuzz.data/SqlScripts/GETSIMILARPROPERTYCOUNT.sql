CREATE PROCEDURE [dbo].[GETSIMILARPROPERTYCOUNT]
	-- Add the parameters for the stored procedure here
	@searchText NVARCHAR(MAX) = null,
	@swlat DECIMAL(20,15),
	@nelat DECIMAL(20,15),
	@swlng DECIMAL(20,15),
	@nelng DECIMAL(20,15),
	@Bedrooms VARCHAR(100),
    @Bathrooms VARCHAR(100),
	@PropertyId INT = NULL
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	--PRINT(@swlat)
	--PRINT(@nelat)
	--PRINT(@swlng)
	--PRINT(@nelng)

--	DECLARE @FIRSTSTRING AS NVARCHAR(100) 
--	DECLARE @SECONDSTRING AS NVARCHAR(MAX) 

--	SET  @FIRSTSTRING =  SUBSTRING(@searchText, 0, CHARINDEX(' ', @searchText))
----	select @FIRSTSTRING

--	SET  @SECONDSTRING =    SUBSTRING(@searchText, CHARINDEX(' ', @searchText) +1, DATALENGTH(@searchText) - CHARINDEX(' ', @searchText) +1 )
----	select @SECONDSTRING

	DECLARE @ActiveHomes AS INT

	DECLARE @AvgCount AS INT

	DECLARE @AvgEstimatePrice AS DECIMAL
	DECLARE @AvgPercentagePrice AS FLOAT
	DECLARE @AvgPropLikes AS DECIMAL

	;WITH ACTIVECTE(Id,Address,Bathrooms,Bedrooms,Lattitude,Longitude, ViewCount, EstimatePrice)
	AS(
	SELECT p.Id, Address,Bathrooms,Bedrooms,Latitude,Longitude, pd.ViewCount, p.HomebuzzEstimate from PropertyCrudData p 
	LEFT JOIN PropertyDetail pd ON p.PropertyDetailId = pd.Id
	WHERE 
	p.Bedrooms = @Bedrooms 
	AND p.Bathrooms = @Bathrooms 
	AND (p.Longitude between @swlng AND @nelng)
	AND (p.Latitude between @swlat AND @nelat)
	AND ((@PropertyId IS NULL) OR (@PropertyId IS NOT NULL and pd.PropertyId != @PropertyId))
	)
	
	SELECT @ActiveHomes=COUNT(Id) from ACTIVECTE

	;WITH ACTIVECTE_VIEWCOUNT(Id,Address,Bathrooms,Bedrooms, ViewCount)
	AS(
	SELECT p.Id, Address,Bathrooms,Bedrooms, pd.ViewCount from PropertyCrudData p 
	LEFT JOIN PropertyDetail pd ON p.PropertyDetailId = pd.Id
	WHERE 
	p.Bedrooms = @Bedrooms 
	AND p.Bathrooms = @Bathrooms 
	AND (p.Longitude between @swlng AND @nelng)
	AND (p.Latitude between @swlat AND @nelat)
	AND ((@PropertyId IS NULL) OR (@PropertyId IS NOT NULL and pd.PropertyId != @PropertyId))
	)

	SELECT @AvgCount=AVG(ViewCount) from ACTIVECTE_VIEWCOUNT

	--;WITH ACTIVECTE_ESTIMATE(Id,Address,Bathrooms,Bedrooms, EstimatePrice)
	--AS(
	--SELECT p.Id, Address,Bathrooms,Bedrooms, p.HomebuzzEstimate from PropertyCrudData p 
	--LEFT JOIN PropertyDetail pd ON p.PropertyDetailId = pd.Id
	--WHERE 
	--p.Bedrooms = @Bedrooms 
	--AND p.Bathrooms = @Bathrooms 
	--AND (p.Longitude between @swlng AND @nelng)
	--AND (p.Latitude between @swlat AND @nelat)
	--AND ((@PropertyId IS NULL) OR (@PropertyId IS NOT NULL and pd.PropertyId != @PropertyId))
	--)

	--SELECT @AvgEstimatePrice=AVG(EstimatePrice) from ACTIVECTE_ESTIMATE

	DECLARE @InActiveHomes AS INT

	;With INACTIVECTE(Id,Address,Bathrooms,Bedrooms,Lattitude,Longitude)
	AS(
	Select p.Id, Address,Bathrooms,Bedrooms,
	LEFT(LatitudeLongitude,CHARINDEX(',',LatitudeLongitude)-1)Lattitude
	,RIGHT(LatitudeLongitude,CHARINDEX(',',LatitudeLongitude))Longitude 
	FROM PropertyData p LEFT JOIN PropertyDetail pd ON p.Id = pd.PropertyId
	WHERE 
	--Address LIKE  '%' + @searchText + '%' 
	--AND 
	p.Bedrooms = @Bedrooms 
	AND p.Bathrooms = @Bathrooms 
	AND pd.PropertyId IS NULL
	AND p.Longitude between @swlng AND @nelng
	AND p.Latitude between @swlat AND @nelat
	AND ((@PropertyId IS NULL) OR (@PropertyId IS NOT NULL and p.Id != @PropertyId))
	)


	SELECT @InActiveHomes=COUNT(Id) from INACTIVECTE I 

	;With INACTIVECTE_ESTIMATEPRICE(Id,Address,Bathrooms,Bedrooms,Lattitude,Longitude, EstimatePrice)
	AS(
	Select p.Id, Address,Bathrooms,Bedrooms,
	LEFT(LatitudeLongitude,CHARINDEX(',',LatitudeLongitude)-1)Lattitude
	,RIGHT(LatitudeLongitude,CHARINDEX(',',LatitudeLongitude))Longitude,
	p.HomebuzzEstimate
	FROM PropertyData p LEFT JOIN PropertyDetail pd ON p.Id = pd.PropertyId
	WHERE 
	--Address LIKE  '%' + @searchText + '%' 
	--AND 
	p.Bedrooms = @Bedrooms 
	AND p.Bathrooms = @Bathrooms 
	AND pd.PropertyId IS NULL
	AND p.Longitude between @swlng AND @nelng
	AND p.Latitude between @swlat AND @nelat
	--AND ((@PropertyId IS NULL) OR (@PropertyId IS NOT NULL and p.Id != @PropertyId))
	)


	SELECT @AvgEstimatePrice=AVG(EstimatePrice) from INACTIVECTE_ESTIMATEPRICE

	SELECT @AvgPercentagePrice = (HomebuzzEstimate/@AvgEstimatePrice) from PropertyData where Id = @PropertyId

	;WITH ACTIVECTEPROPERTYLIKESTEST(Id)
	AS(
	SELECT pl.Id
	from PropertyLike pl
	Left JOIN PropertyDetail pd ON pl.PropertyDetailId = pd.Id
	Left JOIN PropertyData p ON p.Id = pd.PropertyId
	
	WHERE 
	p.Bedrooms = @Bedrooms 
	AND p.Bathrooms = @Bathrooms 
	AND (p.Longitude between @swlng AND @nelng)
	AND (p.Latitude between @swlat AND @nelat)
	AND ((@PropertyId IS NULL) OR (@PropertyId IS NOT NULL and pd.PropertyId != @PropertyId))
	) 
	SELECT @AvgPropLikes = (COUNT(Id)/NULLIF(@ActiveHomes,0)) from ACTIVECTEPROPERTYLIKESTEST


	--PRINT pd.Id
	SELECT @InActiveHomes as InActiveHomes, @ActiveHomes as ActiveHomes, @AvgCount as AverageCount , @AvgEstimatePrice as AverageEstimatePrice,
	ROUND(@AvgPercentagePrice,2) as AveragePercentage, @AvgPropLikes as AveragePropertyLikes

END