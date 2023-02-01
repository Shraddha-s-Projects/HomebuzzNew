CREATE PROCEDURE [dbo].[GETPROPERTIESBYPAGINATION_New]
	-- Add the parameters for the stored procedure here
	@searchText NVARCHAR(MAX) = null,
	@from int = 0,
	@to int = 28,
	@userId int = null,
	@PageNum int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

	    CREATE TABLE #SearchResult 
    (
	    Id INT,
		PropertyCrudDataId INT,
        PropertyDetailId                              INT,
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
        Description                         VARCHAR(100),
        LatitudeLongitude                       VARCHAR(100),
        Day                        VARCHAR(100),
        Time                            VARCHAR(100),
        ImageIds                              VARCHAR(100),
        UserLiked                         BIT,
        UserOffered                  BIT,
        TotalCount                     BIGINT
    );

	 DECLARE @TotalCount AS INT

		INSERT INTO #SearchResult(
		Id,
		PropertyCrudDataId,
		PropertyDetailId,
		Address,
		HomebuzzEstimate,
		Bedrooms,
		Bathrooms,
		CarSpace,
		Landarea,
		LatitudeLongitude,
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
SELECT DISTINCT 
	(CASE WHEN pd.Id IS NULL THEN p.Id
		ELSE pd.PropertyId
		END)
	,pc.Id as PropertyCrudDataId
	,(pd.Id)PropertyDetailId
	,(CASE WHEN pd.Id IS NULL THEN p.Address
		ELSE pc.Address
		END)
	,(CASE WHEN pd.Id IS NULL THEN p.HomebuzzEstimate
		ELSE pc.HomebuzzEstimate
		END)
	,(CASE WHEN pd.Id IS NULL THEN p.Bedrooms
		ELSE pc.Bedrooms
		END)
	,(CASE WHEN pd.Id IS NULL THEN p.Bathrooms
		ELSE pc.Bathrooms
		END)
	,(CASE WHEN pd.Id IS NULL THEN p.CarSpace
		ELSE pc.CarSpace
		END)
	,(CASE WHEN pd.Id IS NULL THEN p.Landarea
		ELSE pc.Landarea
		END)
	,(CASE WHEN pd.Id IS NULL THEN p.LatitudeLongitude
		ELSE pc.LatitudeLongitude
		END)
	,pd.IsActive
	,pd.IsClaimed
	,pd.ViewCount
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
	  ,CAST((CASE WHEN pl.PropertyDetailId IS NOT NULL and pl.UserId = @userId  THEN 1 ELSE 0 END) as bit) UserLiked
	  ,CAST((CASE WHEN po.PropertyDetailId IS NOT NULL and po.UserId = @userId  THEN 1 ELSE 0 END) as bit) UserOffered
	 -- ,CASE WHEN po.PropertyDetailId IS NULL THEN 0 ELSE 1 END UserOffered
	  ,@TotalCount AS TotalCount
	from PropertyData p
	LEFT JOIN PropertyDetail pd ON p.Id = pd.PropertyId
	LEFT JOIN PropertyCrudData pc ON pc.PropertyDetailId = pd.Id
	LEFT JOIN PropertyLike pl ON pl.PropertyDetailId = pd.Id and (pl.UserId is NULL OR pl.UserId = @userId) 
	LEFT JOIN PropertyOffer po ON po.PropertyDetailId = pd.Id and (po.UserId is NULL OR po.UserId = @userId)
	--LEFT JOIN PropertyImage poi ON poi.PropertDetailId = pd.Id
	WHERE 
	((CHARINDEX(@searchText,pc.Address) > 0) OR(CHARINDEX(@searchText,p.Address) > 0))
	AND ((pd.ActivatedDate IS NULL) OR 
		--pd.ActivatedDate BETWEEN DATEADD(DD, -@from,GETDATE()) AND DATEADD(DD, -@to,GETDATE()))
		(pd.ActivatedDate <= DATEADD(DD, -@from,GETDATE())
			AND pd.ActivatedDate >= DATEADD(DD, -@to,GETDATE())))

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