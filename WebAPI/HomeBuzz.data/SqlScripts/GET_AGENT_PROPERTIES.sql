CREATE PROCEDURE [dbo].[GET_AGENT_PROPERTIES]
	-- Add the parameters for the stored procedure here
	
	@userId int = null,
	@AgentOptionId int = null,
	@StartDate nvarchar(100) = null,
	@EndDate nvarchar(100) = null,
	@PageNum int
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @Records INT = 1
	DECLARE @SearchText NVARCHAR(MAX) = ''
	SET @PageNum = 1


	CREATE TABLE #AgentProperties
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
		ComparativeInterest				BIGINT,
		ViewBlock						BIGINT,
		PerformanceRange					BIGINT,
		HigherPerformanceRange			BIGINT,
		LowerPerformanceRange			BIGINT,
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
		OfferedCount					BIGINT,
		GoogleImage						NVARCHAR(1000),
        TotalCount                     BIGINT,
		MaxViewCount					BIGINT,
		AgentOptionId					INT,
		AgentOption			   VARCHAR(100),
		AgentId							BIGINT,
		DayLeft							BIGINT,
		CreatedOn				DateTime,
		AppraisalPrice			decimal(18,2)	
    );

	 DECLARE @TotalCount AS INT
	 DECLARE @MaxViewCount AS INT
	 DECLARE @ViewBlockSize As INT = 4
	 DECLARE @BlockDiff As INT = 2

	 	INSERT INTO #AgentProperties(
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
		ComparativeInterest,
		ViewBlock,
		PerformanceRange,
		HigherPerformanceRange,
		LowerPerformanceRange,
		OwnerId,
		Status,
		Description,
		Day,
		Time,
		ImageIds,
		UserLiked,
		UserOffered,
		OfferedCount,
		GoogleImage,
		TotalCount,
		MaxViewCount,
		AgentOptionId,
		AgentOption,
		AgentId,
		DayLeft
		,CreatedOn
		,AppraisalPrice
		)
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
	,pd.ViewCount
	,(dbo.ComparativeInterestFn(pd.ViewCount,p.Bedrooms, p.Bathrooms, pd.PropertyId, p.Suburb))
	,(SELECT CAST((pd.ViewCount/@ViewBlockSize) as DECIMAL(10,2))) As ViewBlock
	,(dbo.PerfomanceRangeFn(pd.ViewCount))
	,(dbo.HigherPerfomanceRangeFn(pd.ViewCount))
	,(dbo.LowerPerformanceRangeFn(pd.ViewCount))
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
	  ,(select COUNT(*) from PropertyOffer where PropertyDetailId = pd.Id) As OfferedCount
	  ,prd.GoogleImage
	,@TotalCount AS TotalCount
	,@MaxViewCount AS MaxViewCount
	,(CASE
	WHEN (@userId IS NULL OR @userId ='') THEN NULL
	ELSE (Select TOP 1 AgentOptionId from PropertyAgent where PropertyDetailId = pd.Id and OwnerId = @userId)
	END) as AgentOptionId
	, (ao.[Option]) as AgentOption
	, pa.OwnerId
	,CAST((CASE 
	  WHEN (@userId IS NULL OR @AgentOptionId != 1)  THEN NULL 
	  ELSE  28 -((select (DATEDIFF(dd,ClaimedOn, GETDATE())) from PropertyClaim Where PropertyDetailId = pd.Id))
	  END) as BIGINT)DayLeft
	  ,pa.CreatedOn
	  ,pa.AppraisalPrice
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
		pa.OwnerId = @userId and pa.AgentOptionId = @AgentOptionId
		--AND pa.CreatedOn between @StartDate and @EndDate
		AND ( (@StartDate between pd.ActivatedDate AND (dateadd(day, 28, pd.ActivatedDate)))
		OR (@EndDate between pd.ActivatedDate AND (dateadd(day, 28, pd.ActivatedDate))) )
		--AND ( (pd.ActivatedDate between @StartDate and @EndDate)
		--OR ((dateadd(day, 28, pd.ActivatedDate)) between @StartDate and @EndDate)
		--OR (pd.ActivatedDate <= @StartDate)  OR ((dateadd(day, 28, pd.ActivatedDate))>= @EndDate))
	
	 SELECT @TotalCount = COUNT(DISTINCT(Id)) FROM #AgentProperties
	 SELECT @MaxViewCount =  MAX(ViewCount) FROM #AgentProperties



	  BEGIN
        WITH SqlPaging AS
        (
            SELECT distinct TOP((100/@Records)* @PageNum) ROW_NUMBER() OVER (
			ORDER BY
			Id	
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
	,ComparativeInterest
	,ViewBlock
	,PerformanceRange
	,HigherPerformanceRange
	,LowerPerformanceRange
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
	,OfferedCount
	,GoogleImage
	--,(dbo.ufn_levenshtein(Address, @searchText))Matched,
	 ,@TotalCount AS TotalCount
	 ,@MaxViewCount AS MaxViewCount
	 ,AgentOptionId
	 ,AgentOption
	 ,AgentId
	 ,DayLeft
	 ,CreatedOn
	 ,AppraisalPrice
	from #AgentProperties SR 
	--Order by Matched desc
	)

        SELECT* FROM SqlPaging WITH(NOLOCK) WHERE ResultNum > ((@PageNum - 1) * 100)

    END
END