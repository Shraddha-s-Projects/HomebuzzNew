CREATE PROCEDURE [dbo].[GETVIEWERSTRENGTH]
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

	CREATE TABLE #ActiveProperty (PropertyDetailId INT, PropertyId INT)
	CREATE TABLE #Last90Views (PropertyDetailId INT, ViewedDate DATETIME)
	CREATE TABLE #Last66Views (PropertyDetailId INT, ViewedDate DATETIME)

	INSERT INTO #ActiveProperty
	SELECT p.Id,p.PropertyId FROM PropertyDetail p
	INNER JOIN PropertyCrudData pd ON p.Id = pd.PropertyDetailId
	Where (pd.Longitude between @swlng AND @nelng)
	AND (pd.Latitude between @swlat AND @nelat)
	AND (ISNULL(@Suburb, '') = '' OR pd.Suburb LIKE '%'+ @Suburb +'%')
	AND (p.ActivatedDate between DATEADD(DD, DATEDIFF(DD, @to, GETDATE()), 0) AND DATEADD(DD, -@from,GETDATE()) 
				OR (p.ActivatedDate < DATEADD(DD, DATEDIFF(DD, @to, GETDATE()), 0) AND p.IsClaimed = 1))
	AND ((@bedrooms IS NULL) OR (@IsExactMatchBed = 1 AND pd.Bedrooms = @Bedrooms) OR (@IsExactMatchBed = 0 AND pd.Bedrooms >= @Bedrooms))
	AND ((@Bathrooms IS NULL) OR (@IsExactMatchBath = 1 AND pd.Bathrooms = @Bathrooms) OR (@IsExactMatchBath = 0 AND pd.Bathrooms >= @Bathrooms))
	AND (@status IS NULL OR p.StatusId IN (select Item from dbo.SplitStrings(@Status,',')))
	AND (@MinPrice IS NULL OR pd.HomebuzzEstimate >= @MinPrice)
	AND (@MaxPrice IS NULL OR pd.HomebuzzEstimate <= @MaxPrice)
	Order by p.ViewedDate Desc

	INSERT INTO #Last90Views
	Select pv.PropertyDetailId,pv.ViewDate from #ActiveProperty a INNER JOIN PropertyView pv ON a.PropertyDetailId = pv.PropertyDetailId order by pv.ViewDate desc

	SET @TOTALPROPERTIES = (SELECT COUNT(DISTINCT PropertyDetailId) from #Last90Views)
	SET @TOTALVIEWS = (SELECT COUNT(*) from #Last90Views)

	DECLARE @66PERCENTAGE INT
	--SET @66PERCENTAGE = FLOOR((66.6*@TOTALVIEWS)/100);
	SET @66PERCENTAGE = FLOOR((66*@TOTALVIEWS)/100);
	INSERT INTO #Last66Views
		SELECT TOP (@66PERCENTAGE) PropertyDetailId,ViewedDate FROM #Last90Views 
		--order by ViewedDate DESC

	CREATE TABLE #VIEW30(PropertyDetailId INT, ViewCount INT)
	CREATE TABLE #VIEW60(PropertyDetailId INT, ViewCount INT)

	CREATE TABLE #BLOCK30(PropertyDetailId INT, ViewCount INT)
	CREATE TABLE #BLOCK60(PropertyDetailId INT, ViewCount INT)

	CREATE TABLE #RANKED30(PropertyDetailId INT, Views_30 INT,RANKED_30 INT)
	CREATE TABLE #RANKED60(PropertyDetailId INT, Views_60 INT,RANKED_60 INT)

	CREATE TABLE #RANKED(PropertyDetailId INT, PropertyId INT,Ranked60 INT, Ranked30 INT, Ranked INT,Status VARCHAR(50), LastViewed DateTime)

	--CREATE TABLE #MAXRANKED(PropertyDetailId INT, Ranking INT)
	--CREATE TABLE #MINRANKED(PropertyDetailId INT, Ranking INT)

	--CREATE TABLE #FINALRANKED(PropertyId INT,PropertyDetailId INT, Ranked INT, Latitude DECIMAL(20,15),Longitude DECIMAL(20,15))


	IF(@TOTALPROPERTIES = 2 AND @TOTALVIEWS = 2)
		BEGIN
		PRINT('properties: ' + CAST(@TOTALPROPERTIES AS VARCHAR )+ ' views: ' + CAST(@TOTALVIEWS AS VARCHAR))

		-- #VIEW30: insert first moste time stamped
		INSERT INTO #VIEW30 
		SELECT TOP 1 PropertyDetailId,1 FROM #Last66Views order by ViewedDate DESC

		-- #VIEW30: insert rest properties with 0
		INSERT INTO #VIEW30 
		SELECT TOP 1 PropertyDetailId,0 FROM #Last66Views order by ViewedDate ASC

		-- #VIEW60: insert rest properties with 0
		INSERT INTO #VIEW60 
		SELECT TOP 1 PropertyDetailId,1 FROM #Last66Views order by ViewedDate ASC

		-- #VIEW60: insert first property with 0
		INSERT INTO #VIEW60 
		SELECT TOP 1 PropertyDetailId,0 FROM #Last66Views order by ViewedDate DESC

		END
	ELSE IF (@TOTALPROPERTIES >= 2 AND @TOTALVIEWS = 3)
		BEGIN 
		PRINT('properties: ' + CAST(@TOTALPROPERTIES AS VARCHAR )+ ' views: ' + CAST(@TOTALVIEWS AS VARCHAR))

		-- #VIEW30: insert first moste time stamped
		INSERT INTO #VIEW30 
		SELECT TOP 1 PropertyDetailId,1 FROM #Last66Views order by ViewedDate DESC

		-- #VIEW30: insert rest properties with 0
		INSERT INTO #VIEW30 
		SELECT TOP 2 PropertyDetailId,0 FROM #Last66Views order by ViewedDate ASC

		-- #VIEW60: insert rest properties with 0
		INSERT INTO #VIEW60 
		SELECT TOP 2 PropertyDetailId,1 FROM #Last66Views order by ViewedDate ASC

		-- #VIEW60: insert first property with 0
		INSERT INTO #VIEW60 
		SELECT TOP 1 PropertyDetailId,0 FROM #Last66Views order by ViewedDate DESC

		END
	ELSE IF (@TOTALPROPERTIES >= 2 AND @TOTALVIEWS = 4)
		BEGIN 
		PRINT('properties: ' + CAST(@TOTALPROPERTIES AS VARCHAR )+ ' views: ' + CAST(@TOTALVIEWS AS VARCHAR))

		-- #VIEW30: insert first moste time stamped
		INSERT INTO #VIEW30 
		SELECT TOP 1 PropertyDetailId,1 FROM #Last66Views order by ViewedDate DESC

		-- #VIEW30: insert rest properties with 0
		INSERT INTO #VIEW30 
		SELECT TOP 3 PropertyDetailId,0 FROM #Last66Views order by ViewedDate ASC

		-- #VIEW60: insert rest properties with 0
		INSERT INTO #VIEW60 
		SELECT TOP 3 PropertyDetailId,1 FROM #Last66Views order by ViewedDate ASC

		-- #VIEW60: insert first property with 0
		INSERT INTO #VIEW60 
		SELECT TOP 1 PropertyDetailId,0 FROM #Last66Views order by ViewedDate DESC

		END
	ELSE 
		BEGIN 
		PRINT('properties: ' + CAST(@TOTALPROPERTIES AS VARCHAR )+ ' views: ' + CAST(@TOTALVIEWS AS VARCHAR))

		DECLARE @33PER INT
		DECLARE @66PER INT

		SET @33PER = CEILING((33.3*@TOTALVIEWS)/100);
		SET @66PER = FLOOR((66.6*@TOTALVIEWS)/100);

		--PRINT('33: ' + CAST(@33PER AS VARCHAR(10))+ ' 66: ' + CAST(@66PER AS VARCHAR(10)))

		-- #VIEW30: insert first moste time stamped
		INSERT INTO #VIEW30 
		SELECT TOP (@33PER) PropertyDetailId,1 FROM #Last66Views order by ViewedDate DESC

		-- #VIEW60: insert rest properties with 0
		INSERT INTO #VIEW60 
		SELECT TOP (@66PER) PropertyDetailId,1 FROM #Last66Views order by ViewedDate ASC

		-- #VIEW30: insert rest properties with 0
		INSERT INTO #VIEW30 
		SELECT PropertyDetailId,0 FROM #VIEW60

		-- #VIEW60: insert first property with 0
		INSERT INTO #VIEW60 
		SELECT PropertyDetailId,0 FROM #VIEW30
		
		END

		INSERT INTO #BLOCK30
		select DISTINCT PropertyDetailId, SUM(ViewCount) from #VIEW30 GROUP BY PropertyDetailId
		
		INSERT INTO #BLOCK60
		select DISTINCT PropertyDetailId, SUM(ViewCount) from #VIEW60 GROUP BY PropertyDetailId
	
		INSERT INTO #RANKED30
		Select PropertyDetailId,ViewCount,DENSE_RANK() OVER (ORDER BY ViewCount DESC)RANKED from #BLOCK30

		INSERT INTO #RANKED60
		Select PropertyDetailId,ViewCount,DENSE_RANK() OVER (ORDER BY ViewCount DESC)RANKED from #BLOCK60

		INSERT INTO #RANKED
		SELECT 
		R30.PropertyDetailId
		,pd.PropertyId
		,R60.RANKED_60
		,R30.RANKED_30
		,(R60.RANKED_60 - R30.RANKED_30)Ranking 
		, (CASE
			WHEN ((R60.RANKED_60 - R30.RANKED_30) > 0 AND pd.ViewCount > 1 ) THEN 'hot'
			WHEN ((R60.RANKED_60 - R30.RANKED_30) < 0) THEN 'cooling'
			ELSE 'stable'
			END) as Status
		--, (CASE
		--	WHEN ((R60.RANKED_60 - R30.RANKED_30) > 0) THEN 'hot'
		--	WHEN ((R60.RANKED_60 - R30.RANKED_30) < 0) THEN 'cooling'
		--	ELSE 'stable'
		--	END) as Status
		,pd.ViewedDate
		FROM 
		#RANKED30 R30 INNER JOIN #RANKED60 R60 ON R30.PropertyDetailId = R60.PropertyDetailId
		INNER JOIN PropertyDetail pd ON R30.PropertyDetailId = pd.Id

		SELECT * from #RANKED order by Ranked DESC
		--order by LastViewed DESC
END