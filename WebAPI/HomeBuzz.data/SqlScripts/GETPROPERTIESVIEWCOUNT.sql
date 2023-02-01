CREATE PROCEDURE [dbo].[GETPROPERTIESVIEWCOUNT]
	-- Add the parameters for the stored procedure here
--	@searchText NVARCHAR(MAX) = null,
	@bedrooms int = null,
	@bathrooms int = null,
	@status int = null,
	@from int = 0,
	@to int = 28,
	@userId int = null,
	@PageNum int,
	@swlat DECIMAL(10,4),
	@nelat DECIMAL(10,4),
	@swlng DECIMAL(10,4),
	@nelng DECIMAL(10,4)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

		  CREATE TABLE #SearchResult 
    (
	    Id INT ,
        PropertyDetailId                              INT,
		PropertyId									  INT,
        Address                          NVARCHAR(100),
        HomebuzzEstimate                  decimal(18,2),
        Bedrooms                         VARCHAR(100),
        Bathrooms                        VARCHAR(100),
        CarSpace                       VARCHAR(100),
        Landarea                      VARCHAR(100),
        IsActive                        BIT,
        IsClaimed                     BIT,
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
        TotalCount                     BIGINT
    );

	 DECLARE @TotalCount AS INT

	 	INSERT INTO #SearchResult(
		Id,
		PropertyDetailId,
		PropertyId,
		Address,
		HomebuzzEstimate,
		Bedrooms,
		Bathrooms,
		CarSpace,
		Landarea,
		LatitudeLongitude,
		Latitude,
		Longitude,
		IsActive,
		IsClaimed,
		ViewCount,
		OwnerId,
		Status,
		Description,
		Day,
		Time,
		ImageIds,
		UserLiked,
		UserOffered,
		TotalCount)
	Select distinct
	p.Id
	,(pd.Id)PropertyDetailId
	,pd.PropertyId
	,p.Address
	,p.HomebuzzEstimate
	,p.Bedrooms
	,p.Bathrooms
	,p.CarSpace
	,p.Landarea
	,p.LatitudeLongitude
	,p.Latitude
	,p.Longitude
	,pd.IsActive
	,pd.IsClaimed
	,(select COUNT(*) from PropertyView Where PropertyDetailId = pd.Id) as ViewCount
	,pd.OwnerId
	,pd.Status
	,pd.Description
	,pd.Day
	,pd.Time
	,(SELECT  STUFF(( SELECT  ', ' + CAST(Id as VARCHAR(10))
                FROM    ( SELECT DISTINCT
                                    ID
                          FROM      PropertyImage pi
						  where  pi.PropertyDetailId = pd.Id
                        ) x
              FOR
                XML PATH('')
              ), 1, 2, '')) ImageIds
	,CAST((CASE 
	  WHEN (select COUNT(*) from PropertyLike Where PropertyDetailId = pd.Id ) > 0 THEN 1 
	  ELSE 0
	  END) as bit)UserLiked
	,CAST((CASE 
	  WHEN (select COUNT(*) from PropertyOffer Where PropertyDetailId = pd.Id and UserId = @userId ) > 0 THEN 1
	  ELSE 0
	  END) as bit)UserOffered
	,@TotalCount AS TotalCount
	from PropertyCrudData p
	LEFT JOIN PropertyDetail pd ON p.PropertyDetailId = pd.Id and pd.IsActive = 1
	LEFT JOIN PropertyLike pl ON pl.PropertyDetailId = pd.Id
	LEFT JOIN PropertyOffer po ON po.PropertyDetailId = pd.Id
	LEFT JOIN PropertyImage poi ON poi.PropertyDetailId = pd.Id
	LEFT JOIN PropertyView pv ON pv.PropertyDetailId = pd.Id
	WHERE 
		(CAST(p.Longitude AS DECIMAL(10,4))  between @swlng AND @nelng
		AND (CAST(p.Latitude  AS DECIMAL(10,4)) between @swlat AND @nelat))
		AND pd.ActivatedDate between DATEADD(DD, DATEDIFF(DD, @to, GETDATE()), 0) AND DATEADD(DD, -@from,GETDATE())
		AND (@bedrooms IS NULL OR p.Bedrooms = @bedrooms)
		AND (@bathrooms IS NULL OR p.Bathrooms = @bathrooms)
		AND (@status IS NULL OR pd.StatusId = @status)

	 SELECT @TotalCount = COUNT(DISTINCT(Id)) FROM #SearchResult

	  BEGIN
        WITH SqlPaging AS
        (
            SELECT distinct TOP(100* @PageNum) ROW_NUMBER() OVER (
			ORDER BY
			Id	
			) AS ResultNum,
            	Id
	,PropertyDetailId
	,PropertyId
	,Address
	,HomebuzzEstimate
	,Bedrooms
	,Bathrooms
	,CarSpace
	,Landarea
	,IsActive
	,IsClaimed
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
	,UserOffered,
	 @TotalCount AS TotalCount
	from #SearchResult SR )

        SELECT* FROM SqlPaging WITH(NOLOCK) WHERE ResultNum > ((@PageNum - 1) * 100)

    END
END

