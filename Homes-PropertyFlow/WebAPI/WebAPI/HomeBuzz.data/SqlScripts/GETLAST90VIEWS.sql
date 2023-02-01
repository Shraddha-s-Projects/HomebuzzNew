CREATE PROCEDURE [dbo].[GETLAST90VIEWS]
	-- pass all 4 cordinates here from map
	@swlat DECIMAL(20,15),
	@nelat DECIMAL(20,15),
	@swlng DECIMAL(20,15),
	@nelng DECIMAL(20,15),
	@Suburb VARCHAR(500) = NULL,
	@from int = 0,
	@to int = 28,
	@Bedrooms INT = null,
	@Bathrooms INT = null,
	@Status NVARCHAR(50) = null,
	@IsExactMatchBed Bit = false,
	@IsExactMatchBath Bit = false,
	@MinPrice BIGINT = null,
	@MaxPrice BIGINT= null,
	@IsSurroundingSuburb Bit = false
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @TOTALPROPERTIES INT = 0
	DECLARE @TOTALVIEWS INT = 0

	-- Get all active properties in area

	CREATE TABLE #ActiveProperty (
		PropertyDetailId					INT, 
		PropertyId							INT, 
		Address								NVARCHAR(100), 
		Suburb                          NVARCHAR(100),
		City                          NVARCHAR(100),
        HomebuzzEstimate                  decimal(18,2),
		AskingPrice                  decimal(18,2),
        Bedrooms                         VARCHAR(100),
        Bathrooms                        VARCHAR(100),
        CarSpace                       VARCHAR(100),
        Landarea                      VARCHAR(100),
        IsActive                        BIT,
        IsClaimed                     BIT,
		IsShowAskingPrice				BIT,
        ViewCount                        BIGINT,
		OwnerId                     BIGINT,
        Status                          VARCHAR(100),
        Description                         NVARCHAR(MAX),
        LatitudeLongitude                       VARCHAR(100),
		Latitude                       VARCHAR(100),
		Longitude                       VARCHAR(100),
        Day                        VARCHAR(100),
        Time                            VARCHAR(100),
		LastViewed                       DATETIME
	)
	CREATE TABLE #Last90Views (
		PropertyDetailId					INT, 
		PropertyId							INT, 
		Address								NVARCHAR(100), 
		Suburb                          NVARCHAR(100),
		City                          NVARCHAR(100),
        HomebuzzEstimate                  decimal(18,2),
		AskingPrice                  decimal(18,2),
        Bedrooms                         VARCHAR(100),
        Bathrooms                        VARCHAR(100),
        CarSpace                       VARCHAR(100),
        Landarea                      VARCHAR(100),
        IsActive                        BIT,
        IsClaimed                     BIT,
		IsShowAskingPrice				BIT,
        ViewCount                        BIGINT,
		OwnerId                     BIGINT,
        Status                          VARCHAR(100),
        Description                         NVARCHAR(MAX),
        LatitudeLongitude                       VARCHAR(100),
		Latitude                       VARCHAR(100),
		Longitude                       VARCHAR(100),
        Day                        VARCHAR(100),
        Time                            VARCHAR(100),
		ViewedDate						DATETIME,
		LastViewed						DATETIME)

	INSERT INTO #ActiveProperty
	SELECT pd.Id,pd.PropertyId, p.Address, p.Suburb, p.City, p.HomebuzzEstimate,
	p.AskingPrice, p.Bedrooms, p.Bathrooms, p.CarSpace, p.Landarea,
	pd.IsActive, pd.IsClaimed, pd.IsShowAskingPrice, pd.ViewCount, pd.OwnerId,
	pd.Status,pd.Description, p.LatitudeLongitude, p.Latitude, p.Longitude, pd.Day, pd.Time, pd.ViewedDate  from PropertyDetail pd
	INNER JOIN PropertyCrudData p ON pd.Id = p.PropertyDetailId
		Where (p.Longitude between @swlng AND @nelng)
	AND (p.Latitude between @swlat AND @nelat)
	AND (ISNULL(@Suburb, '') = '' OR p.Suburb LIKE '%'+ @Suburb +'%')
	AND (pd.ActivatedDate between DATEADD(DD, DATEDIFF(DD, @to, GETDATE()), 0) AND DATEADD(DD, -@from,GETDATE()) 
				OR (pd.ActivatedDate < DATEADD(DD, DATEDIFF(DD, @to, GETDATE()), 0) AND pd.IsClaimed = 1))
	AND ((@bedrooms IS NULL) OR (@IsExactMatchBed = 1 AND p.Bedrooms = @Bedrooms) OR (@IsExactMatchBed = 0 AND p.Bedrooms >= @Bedrooms))
	AND ((@Bathrooms IS NULL) OR (@IsExactMatchBath = 1 AND p.Bathrooms = @Bathrooms) OR (@IsExactMatchBath = 0 AND p.Bathrooms >= @Bathrooms))
	AND (@status IS NULL OR pd.StatusId IN (select Item from dbo.SplitStrings(@Status,',')))
	AND (@MinPrice IS NULL OR p.HomebuzzEstimate >= @MinPrice)
	AND (@MaxPrice IS NULL OR p.HomebuzzEstimate <= @MaxPrice)
	--Where (p.Longitude between @swlng AND @nelng)
	--AND (p.Latitude between @swlat AND @nelat)
	--AND (ISNULL(@Suburb, '') = '' OR p.Suburb LIKE '%'+ @Suburb +'%')
	--AND (pd.ActivatedDate between DATEADD(DD, DATEDIFF(DD, @to, GETDATE()), 0) AND DATEADD(DD, -@from,GETDATE()) 
	--			OR (pd.ActivatedDate < DATEADD(DD, DATEDIFF(DD, @to, GETDATE()), 0) AND pd.IsClaimed = 1))
	Order by pd.ViewedDate Desc

	INSERT INTO #Last90Views
	Select pv.PropertyDetailId, a.PropertyId,a.Address,a.Suburb, a.City,a.HomebuzzEstimate,a.AskingPrice
	,a.Bedrooms, a.Bathrooms,a.CarSpace, a.Landarea, a.IsActive, a.IsClaimed, a.IsShowAskingPrice, a.ViewCount,
	a.OwnerId, a.Status, a.Description, a.LatitudeLongitude, a.Latitude, a.Longitude,
	a.Day, a.Time,pv.ViewDate,a.LastViewed
	from #ActiveProperty a INNER JOIN PropertyView pv ON a.PropertyDetailId = pv.PropertyDetailId order by pv.ViewDate desc

		SELECT * from #Last90Views order by ViewedDate DESC
END