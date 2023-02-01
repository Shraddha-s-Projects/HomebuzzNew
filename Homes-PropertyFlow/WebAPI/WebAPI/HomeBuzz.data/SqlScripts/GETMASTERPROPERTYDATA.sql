CREATE PROCEDURE [dbo].[GETMASTERPROPERTYDATA]
	-- Add the parameters for the stored procedure here
	@searchTerm NVARCHAR(300) = null,
	@addressType NVARCHAR(MAX) = null
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	--DECLARE @FIRSTSTRING AS NVARCHAR(100) 
	--DECLARE @SECONDSTRING AS NVARCHAR(MAX) 

	--SET  @FIRSTSTRING =  SUBSTRING(@searchTerm, 0, CHARINDEX(' ', @searchTerm))

	--SET  @SECONDSTRING =    SUBSTRING(@searchTerm, CHARINDEX(' ', @searchTerm) +1, DATALENGTH(@searchTerm) - CHARINDEX(' ', @searchTerm) +1 )

    -- Insert statements for procedure here

	    CREATE TABLE #SearchResult 
    (
	    Id INT ,
		PropertyCrudDataId INT,
        PropertyDetailId                              INT,
        Address                          NVARCHAR(100),
		Suburb                          NVARCHAR(100),
		City                          NVARCHAR(100),
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
        Day                        VARCHAR(100),
        Time                            VARCHAR(100),
		GoogleImage						VARCHAR(1000),
      --  ImageIds                              VARCHAR(100),
      --  UserLiked                         BIT,
     --   UserOffered                  BIT,
        TotalCount                     BIGINT,
		Matched							INT
    );

	 DECLARE @TotalCount AS INT

		INSERT INTO #SearchResult(
		Id,
		PropertyCrudDataId,
		PropertyDetailId,
		Address,
		Suburb,
		City,
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
		GoogleImage,
		--ImageIds,
	--	UserLiked,
	--	UserOffered,
		TotalCount
		,Matched)
SELECT DISTINCT 
--(p.Id) as Id
	(CASE WHEN pd.Id IS NULL THEN p.Id
		ELSE pd.PropertyId
		END)
	,pc.Id as PropertyCrudDataId
	,(pd.Id)PropertyDetailId
	,(CASE WHEN pd.Id IS NULL THEN p.Address
		ELSE pc.Address
		END)
	,(CASE WHEN pd.Id IS NULL THEN p.Suburb
		ELSE pc.Suburb
		END)
	,(CASE WHEN pd.Id IS NULL THEN p.City
		ELSE pc.City
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
	,p.GoogleImage
	  ,@TotalCount AS TotalCount
	  ,(CASE WHEN pd.Id IS NULL THEN dbo.FuzzySearch(p.Address, @searchTerm)
		ELSE dbo.FuzzySearch(pc.Address, @searchTerm)
		END) Matched
	from PropertyData p
	LEFT JOIN PropertyDetail pd ON p.Id = pd.PropertyId
	LEFT JOIN PropertyCrudData pc ON pc.PropertyDetailId = pd.Id
	WHERE  
	(@searchTerm LIKE p.Address + ', '+p.Suburb +', '+p.City +'%')
	OR 
	(@searchTerm LIKE pc.Address + ', '+pc.Suburb +', '+pc.City +'%')
	--	( p.Address LIKE  @FIRSTSTRING + ' ' + @SECONDSTRING + '%')
	--OR
 --       (pc.Address LIKE  @FIRSTSTRING + ' ' + @SECONDSTRING + '%')

 ORDER BY Matched desc

	 SELECT @TotalCount = COUNT(DISTINCT(Id)) FROM #SearchResult

	 BEGIN
        WITH SqlPaging AS
        (
            SELECT distinct TOP(100) ROW_NUMBER() OVER (
			ORDER BY
			Id	
			) AS ResultNum,
            	Id
	,PropertyDetailId
	,Address
	,Suburb
	,City
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
	,GoogleImage
	--, ImageIds
	,@TotalCount AS TotalCount
	,Matched
	from #SearchResult SR )

        SELECT* FROM SqlPaging WITH(NOLOCK)

    END
END