CREATE PROCEDURE [dbo].[GETPROPERTIES]
	-- Add the parameters for the stored procedure here
	@addressType NVARCHAR(MAX) = null,
	@searchText NVARCHAR(MAX) = null,
	@from int = 0,
	@to int = 28,
	@userId int = null,
	@PageNum int,
	@swlat DECIMAL(10,4),
	@nelat DECIMAL(10,4),
	@swlng DECIMAL(10,4),
	@nelng DECIMAL(10,4)
   ,@Bedrooms INT = null,
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

	PRINT(@swlat)
	PRINT(@nelat)
	PRINT(@swlng)
	PRINT(@nelng)
	--DECLARE @StatusId NVARCHAR(20) 
	--SET @StatusId = Replace(@Status ,'''','')
	PRINT(@Status)
    -- Insert statements for procedure here
	DECLARE @Records INT = 1
	IF @addressType = 'street_address'
	BEGIN
	SET @PageNum = 1
	SET @Records = 1
	END

	CREATE TABLE #SearchResult 
    (
	    Id INT ,
        PropertyDetailId                              INT,
		PropertyId									  INT,
		ActivatedDate				DateTime,
        Address                          NVARCHAR(100),
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
        ImageIds                              NVARCHAR(MAX),
        UserLiked                         BIT,
        UserOffered                  BIT,
		GoogleImage						NVARCHAR(1000),
		Matched							BIGINT,
        TotalCount                     BIGINT,
		MaxViewCount					BIGINT,
		AgentOptionId					INT,
		AgentOption			   VARCHAR(100),
		AgentId							BIGINT,
		IsAgentListProperty				BIT
    );

	 DECLARE @TotalCount AS INT
	 DECLARE @MaxViewCount AS INT
	--  DECLARE @ViewBlockSize As INT = 4
	--  DECLARE @BlockDiff As INT = 2

	 	INSERT INTO #SearchResult(
		Id,
		PropertyDetailId,
		PropertyId,
		ActivatedDate,
		Address,
		Suburb,
		City,
		HomebuzzEstimate,
		AskingPrice,
		Bedrooms,
		Bathrooms,
		CarSpace,
		Landarea,
		LatitudeLongitude,
		Latitude,
		Longitude,
		IsActive,
		IsClaimed,
		IsShowAskingPrice,
		ViewCount,
		OwnerId,
		Status,
		Description,
		Day,
		Time,
		ImageIds,
		UserLiked,
		UserOffered,
		GoogleImage,
		Matched,
		TotalCount,
		MaxViewCount,
		AgentOptionId,
		AgentOption,
		AgentId,
		IsAgentListProperty)
	Select distinct
	p.Id
	,(pd.Id)PropertyDetailId
	,pd.PropertyId
	,pd.ActivatedDate
	,p.Address
	,p.Suburb
	,p.City
	,p.HomebuzzEstimate
	,p.AskingPrice
	,p.Bedrooms
	,p.Bathrooms
	,p.CarSpace
	,p.Landarea
	,p.LatitudeLongitude
	,p.Latitude
	,p.Longitude
	,pd.IsActive
	,pd.IsClaimed
	,pd.IsShowAskingPrice
	--,pd.ViewCount
	--,CAST((CASE 
	--  WHEN (@userId IS NULL OR @userId = '')  THEN pd.ViewCount 
	--  WHEN (@userId IS NOT NULL AND @userId != '' AND @from = 0 AND @to = 28 ) THEN  (select  COUNT(distinct UserId) from PropertyView Where PropertyDetailId = pd.Id
	--        AND (ViewDate between DATEADD(DD, DATEDIFF(DD, @to, GETDATE()), 0) AND DATEADD(DD, DATEDIFF(DD, @from, GETDATE()), 0) + '23:59:59'))
	--  ELSE (select COUNT(*) from PropertyView Where PropertyDetailId = pd.Id
	--AND (ViewDate between DATEADD(DD, DATEDIFF(DD, @to, GETDATE()), 0) AND DATEADD(DD, DATEDIFF(DD, @from, GETDATE()), 0) + '23:59:59'))
	--  END) as INT)ViewCount
	,CAST((CASE 
	  WHEN ((@userId IS NULL OR @userId = '') OR (@from = 0 AND @to = 28))  THEN pd.ViewCount 
	  --WHEN (@userId IS NOT NULL AND @userId != '' AND @from = 0 AND @to = 28 ) THEN  (select  COUNT(distinct UserId) from PropertyView Where PropertyDetailId = pd.Id
	  --      AND (ViewDate between DATEADD(DD, DATEDIFF(DD, @to, GETDATE()), 0) AND DATEADD(DD, DATEDIFF(DD, @from, GETDATE()), 0) + '23:59:59'))
	  ELSE (select COUNT(*) from PropertyView Where PropertyDetailId = pd.Id
	AND (ViewDate between DATEADD(DD, DATEDIFF(DD, @to, GETDATE()), 0) AND DATEADD(DD, DATEDIFF(DD, @from, GETDATE()), 0) + '23:59:59'))
	  END) as INT)ViewCount
	,pd.OwnerId
	,pd.Status
	,pd.Description
	,pd.Day
	,pd.Time
	,(SELECT  STUFF(( SELECT  ', ' + CAST(Id as VARCHAR(100))
                FROM    ( SELECT DISTINCT
                                    ID
                          FROM      PropertyImage pi
						  where  pi.PropertyDetailId = pd.Id
                        ) x
              FOR
                XML PATH('')
              ), 1, 2, '')) ImageIds
	,CAST((CASE 
	  WHEN (select COUNT(Id) from PropertyLike Where PropertyDetailId = pd.Id and UserId = @userId ) > 0 THEN 1 
	  ELSE 0
	  END) as bit)UserLiked
	,CAST((CASE 
	  WHEN (select COUNT(Id) from PropertyOffer Where PropertyDetailId = pd.Id and UserId = @userId ) > 0 THEN 1
	  ELSE 0
	  END) as bit)UserOffered
	  ,prd.GoogleImage
	  ,(dbo.FuzzySearch(p.Address, @searchText))Matched
	,@TotalCount AS TotalCount
	,@MaxViewCount AS MaxViewCount
	,(CASE
	WHEN (@userId IS NULL OR @userId ='') THEN NULL
	ELSE (Select TOP 1 AgentOptionId from PropertyAgent where PropertyDetailId = pd.Id and OwnerId = @userId)
	END) as AgentOptionId
	--,(CASE
	--WHEN (@userId IS NULL OR @userId ='') THEN NULL
	--ELSE (Select [Option] from AgentOption where PropertyDetailId = pd.Id and OwnerId = @userId)
	--END) as AgentOptionId
	--, pa.AgentOptionId as AgentOptionId
	, (ao.[Option]) as AgentOption
	, pa.OwnerId
	,CAST((CASE 
	  WHEN (select COUNT(Id) from PropertyAgent Where PropertyDetailId = pd.Id and AgentOptionId = 1 ) = 1 THEN 1 
	  ELSE 0
	  END) as bit)IsAgentListProperty
	from PropertyCrudData p
	LEFT JOIN PropertyDetail pd ON p.PropertyDetailId = pd.Id and pd.IsActive = 1
	LEFT JOIN PropertyData prd ON prd.Id = pd.PropertyId
	LEFT JOIN PropertyLike pl ON pl.PropertyDetailId = pd.Id
	LEFT JOIN PropertyOffer po ON po.PropertyDetailId = pd.Id
	LEFT JOIN PropertyImage poi ON poi.PropertyDetailId = pd.Id 
	LEFT JOIN PropertyAgent pa ON pd.Id = pa.PropertyDetailId and pa.OwnerId = @userId 
	LEFT JOIN AgentOption ao ON pa.AgentOptionId = ao.Id
	
	--LEFT JOIN PropertyClaim pc ON pc.PropertyDetailId = pd.Id
	--INNER JOIN PropertyStatus ps ON pd.Status = ps.Id
	WHERE 
	  --Address like IIF(@addressType = 'street_address', '%', '%' + @searchText + '%')
	  --(@searchText is NULL OR Address LIKE '%'+ @searchText + '%' OR Address Like '')
	  --AND

	   (@IsSurroundingSuburb = 'true' OR p.Suburb LIKE  '%'+@searchText+'%')
	   AND
	   (CAST(p.Longitude AS DECIMAL(10,4)) between @swlng AND @nelng)
		AND ((CAST(p.Latitude  AS DECIMAL(10,4)) between @swlat AND @nelat))
		AND (pd.ActivatedDate between DATEADD(DD, DATEDIFF(DD, @to, GETDATE()), 0) AND DATEADD(DD, -@from,GETDATE()) 
				OR (pd.ActivatedDate < DATEADD(DD, DATEDIFF(DD, @to, GETDATE()), 0) AND pd.IsClaimed = 1))
		--AND (pc.ClaimedOn between DATEADD(DD, DATEDIFF(DD, @to, GETDATE()), 0) AND DATEADD(DD, -@from,GETDATE()) 
		--		OR (pc.ClaimedOn < DATEADD(DD, DATEDIFF(DD, @to, GETDATE()), 0) AND pd.IsClaimed = 1))
		AND ((@bedrooms IS NULL) OR (@IsExactMatchBed = 1 AND p.Bedrooms = @Bedrooms) OR (@IsExactMatchBed = 0 AND p.Bedrooms >= @Bedrooms))
		AND ((@Bathrooms IS NULL) OR (@IsExactMatchBath = 1 AND p.Bathrooms = @Bathrooms) OR (@IsExactMatchBath = 0 AND p.Bathrooms >= @Bathrooms))
		AND (@status IS NULL OR pd.StatusId IN (select Item from dbo.SplitStrings(@Status,',')))
		AND (@MinPrice IS NULL OR p.HomebuzzEstimate >= @MinPrice)
		AND (@MaxPrice IS NULL OR p.HomebuzzEstimate <= @MaxPrice)
		--OR (@IsSurroundingSuburb = 'true' AND p.Address LIKE  '%'+@searchText+'%')
		--AND pa.OwnerId = @userId
		--AND (@Bedrooms IS NULL OR p.Bedrooms = @Bedrooms)
	    --AND (@bathrooms IS NULL OR p.Bathrooms = @bathrooms)

		
	
	 SELECT @TotalCount = COUNT(DISTINCT(Id)) FROM #SearchResult
	 SELECT @MaxViewCount =  MAX(ViewCount) FROM #SearchResult

	  BEGIN
        WITH SqlPaging AS
        (
            SELECT distinct TOP((100/@Records)* @PageNum) ROW_NUMBER() OVER (
			ORDER BY
			Matched	desc
			) AS ResultNum,
	  Id
	,PropertyDetailId
	,PropertyId
	,ActivatedDate
	,Address
	,Suburb
	,City
	,HomebuzzEstimate
	,AskingPrice
	,Bedrooms
	,Bathrooms
	,CarSpace
	,Landarea
	,IsActive
	,IsClaimed
	,IsShowAskingPrice
	,ViewCount
	,OwnerId
	,Status
	,Description
	,LatitudeLongitude
	,Latitude
	,Longitude
	,Day
	,Time
	, ImageIds
	,UserLiked
	,UserOffered
	,GoogleImage
	,Matched
	,@TotalCount AS TotalCount
	 ,@MaxViewCount AS MaxViewCount
	 ,AgentOptionId
	 ,AgentOption
	 ,AgentId
	 ,IsAgentListProperty
	from #SearchResult SR 
	--Order by Matched desc
	)

       SELECT* FROM SqlPaging 
	   WITH(NOLOCK) WHERE ResultNum > ((@PageNum - 1) * 100)

    END
END