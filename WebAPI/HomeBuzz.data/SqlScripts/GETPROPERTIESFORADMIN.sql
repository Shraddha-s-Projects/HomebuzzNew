CREATE Procedure[dbo].[GETPROPERTIESFORADMIN]
(
    @PageNum            INT,
    @PageSize           INT,
    @OrderColumnName    VARCHAR(50) = NULL,
    @OrderColumnDir     VARCHAR(50) = NULL,
    @Address          VARCHAR(200) = NULL,
    @Suburb           VARCHAR(200) = NULL,
    @City         VARCHAR(200) = NULL,
	@Bedrooms         VARCHAR(200) = NULL,
	@Bathrooms         VARCHAR(200) = NULL,
	@CarSpace         VARCHAR(200) = NULL,
	@Landarea		  VARCHAR(200)= NULL,
    @Isactive      BIT = false
)
AS
BEGIN

    DECLARE @SearchPropertiesResult TABLE
    (
        Id											 INT ,
		PropertyDetailId							 INT,
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
        Status                          VARCHAR(100),
        Description                         NVARCHAR(MAX),
        LatitudeLongitude                       VARCHAR(100),
		Latitude                       VARCHAR(100),
		Longitude                       VARCHAR(100)
    );

            DECLARE @TotalCount AS INT

  INSERT INTO @SearchPropertiesResult
          (
		   Id,
		   PropertyDetailId,
        Address,
		Suburb,
		City,
        HomebuzzEstimate,
		AskingPrice,
        Bedrooms,
        Bathrooms,
        CarSpace,
        Landarea,
        IsActive,
        Status ,
        Description,
        LatitudeLongitude,
		Latitude,
		Longitude
          )

    SELECT DISTINCT 
			(CASE WHEN pd.Id IS NOT NULL THEN pc.Id
			ELSE p.Id
			END),
			(CASE WHEN pd.Id IS NOT NULL THEN pd.Id
			ELSE NULL
			END),
			(CASE WHEN pd.Id IS NOT NULL THEN pc.Address
			ELSE p.Address
			END),
			(CASE WHEN pd.Id IS NOT NULL THEN pc.Suburb
			ELSE p.Suburb
			END),
			(CASE WHEN pd.Id IS NOT NULL THEN pc.City
			ELSE p.City
			END),
			(CASE WHEN pd.Id IS NOT NULL THEN pc.HomebuzzEstimate
			ELSE p.HomebuzzEstimate
			END),
			(CASE WHEN pd.Id IS NOT NULL THEN pc.AskingPrice
			ELSE NULL
			END),
			(CASE WHEN pd.Id IS NOT NULL THEN pc.Bedrooms
			ELSE p.Bedrooms
			END),
			(CASE WHEN pd.Id IS NOT NULL THEN pc.Bathrooms
			ELSE p.Bathrooms
			END),
			(CASE WHEN pd.Id IS NOT NULL THEN pc.CarSpace
			ELSE p.CarSpace
			END),
			(CASE WHEN pd.Id IS NOT NULL THEN pc.Landarea
			ELSE p.Landarea
			END),
			(CASE WHEN pd.Id IS NOT NULL THEN 1
			ELSE 0
			END),
			(CASE WHEN pd.Id IS NOT NULL THEN pd.Status
			ELSE NULL
			END),
			(CASE WHEN pd.Id IS NOT NULL THEN pd.Description
			ELSE NULL
			END),
			(CASE WHEN pd.Id IS NOT NULL THEN pc.LatitudeLongitude
			ELSE p.LatitudeLongitude
			END),
			(CASE WHEN pd.Id IS NOT NULL THEN pc.Latitude
			ELSE p.Latitude
			END),
			(CASE WHEN pd.Id IS NOT NULL THEN pc.Longitude
			ELSE p.Longitude
			END)
		 
    FROM PropertyData  p
	LEFT JOIN PropertyDetail pd ON p.Id = pd.PropertyId
	LEFT JOIN PropertyCrudData pc ON pc.PropertyDetailId = pd.Id

				WHERE 
				 --((ISNULL(@IsActive, '') = '' OR (@Isactive = 1 AND pd.Id IS NOT NULL) OR (@Isactive = 0 AND pd.Id IS NULL) ))
				  ((@Isactive IS NULL)  OR (@Isactive = 1 AND pd.Id IS NOT NULL) OR (@Isactive = 0 AND pd.Id IS NULL) )
				AND
				(ISNULL(@Address, '') = '' OR (@Isactive = 0 AND p.Address LIKE '%' + @Address + '%' AND pd.Id IS NULL)
			OR (@Isactive = 1 AND pc.Address LIKE '%' + @Address + '%'))
			AND
			(ISNULL(@Suburb, '') = '' OR (@Isactive = 0 AND p.Suburb LIKE '%' + @Suburb + '%' AND pd.Id IS NULL)
			OR (@Isactive = 1 AND pc.Suburb LIKE '%' + @Suburb + '%'))
			AND
			 (ISNULL(@City, '') = '' OR (@Isactive = 0 AND p.City LIKE '%' + @City + '%' AND pd.Id IS NULL)
			OR (@Isactive = 1 AND pc.City LIKE '%' + @City + '%'))
			AND
			(ISNULL(@Bedrooms, '') = '' OR (@Isactive = 0 AND p.Bedrooms LIKE '%' + @Bedrooms + '%' AND pd.Id IS NULL)
			OR (@Isactive = 1 AND pc.Bedrooms LIKE '%' + @Bedrooms + '%'))
			AND 
			(ISNULL(@Bathrooms, '') = '' OR (@Isactive = 0 AND p.Bathrooms LIKE '%' + @Bathrooms + '%' AND pd.Id IS NULL)
			OR (@Isactive = 1 AND pc.Bathrooms LIKE '%' + @Bathrooms + '%'))
			AND 
			(ISNULL(@CarSpace, '') = '' OR (@Isactive = 0 AND p.CarSpace LIKE '%' + @CarSpace + '%' AND pd.Id IS NULL)
			OR (@Isactive = 1 AND pc.CarSpace LIKE '%' + @CarSpace + '%'))
			AND
			(ISNULL(@Landarea, '') = '' OR (@Isactive = 0 AND p.Landarea LIKE '%' + @CarSpace + '%' AND pd.Id IS NULL )
			OR (@Isactive = 1 AND pc.Landarea LIKE '%' + @Landarea + '%'))

			--OR (@IsActive = 0 AND pd.Id IS NULL)

			--OR(ISNULL(@IsActive, '') = '' OR pd.IsActive = @IsActive)



    SELECT @TotalCount = COUNT(DISTINCT(Id)) FROM @SearchPropertiesResult


    BEGIN
        WITH SqlPaging AS
        (
            SELECT TOP(@PageSize* @PageNum) ROW_NUMBER() OVER (
                ORDER BY

                CASE WHEN @OrderColumnName = 'Address' and @OrderColumnDir = 'asc'

                THEN Address END ASC,
                CASE WHEN @OrderColumnName = 'Address' and @OrderColumnDir = 'desc'

                THEN Address END DESC,
                CASE WHEN @OrderColumnName = 'Suburb' and @OrderColumnDir = 'asc'

                THEN Suburb END ASC,
                CASE WHEN @OrderColumnName = 'Suburb' and @OrderColumnDir = 'desc'

                THEN Suburb END DESC,
                CASE WHEN @OrderColumnName = 'City' and @OrderColumnDir = 'asc'

                THEN City END ASC,
                CASE WHEN @OrderColumnName = 'City' and @OrderColumnDir = 'desc'

                THEN City END DESC,
				CASE WHEN @OrderColumnName = 'HomebuzzEstimate' and @OrderColumnDir = 'asc'

                THEN HomebuzzEstimate END ASC,
                CASE WHEN @OrderColumnName = 'HomebuzzEstimate' and @OrderColumnDir = 'desc'

                THEN HomebuzzEstimate END DESC,
                CASE WHEN @OrderColumnName = 'Bedrooms' and @OrderColumnDir = 'asc'

                THEN Bedrooms END ASC,
                CASE WHEN @OrderColumnName = 'Bedrooms' and @OrderColumnDir = 'desc'

                THEN Bedrooms END DESC,

				CASE WHEN @OrderColumnName = 'Bathrooms' and @OrderColumnDir = 'asc'

                THEN Bathrooms END ASC,
                CASE WHEN @OrderColumnName = 'Bathrooms' and @OrderColumnDir = 'desc'

                THEN Bathrooms END DESC,
				CASE WHEN @OrderColumnName = 'CarSpace' and @OrderColumnDir = 'asc'

                THEN CarSpace END ASC,
                CASE WHEN @OrderColumnName = 'CarSpace' and @OrderColumnDir = 'desc'

                THEN CarSpace END DESC,
				CASE WHEN @OrderColumnName = 'Landarea' and @OrderColumnDir = 'asc'

                THEN Landarea END ASC,
                CASE WHEN @OrderColumnName = 'Landarea' and @OrderColumnDir = 'desc'

                THEN Landarea END DESC,
                CASE WHEN @OrderColumnName IS NULL
				 THEN Id END ASC
                --THEN Id END DESC

            ) AS ResultNum,
            Id,
			PropertyDetailId,
        Address,
		Suburb,
		City,
        HomebuzzEstimate,
		AskingPrice,
        Bedrooms,
        Bathrooms,
        CarSpace,
        Landarea,
        IsActive,
        Status ,
        Description,
        LatitudeLongitude,
		Latitude,
		Longitude,
            @TotalCount AS TotalCount

            FROM @SearchPropertiesResult SR

             WHERE(ISNULL(@Address, '') = '' OR Address LIKE '%' + @Address + '%')

                AND(ISNULL(@Suburb, '') = '' OR Suburb LIKE '%' + @Suburb + '%')

                AND(ISNULL(@City, '') = '' OR (ISNULL(City,'') = '' OR City LIKE '%' + @City + '%'))

                AND(ISNULL(@Bedrooms, '') = '' OR (ISNULL(Bedrooms,'') = '' OR Bedrooms = @Bedrooms))

				AND(ISNULL(@Bathrooms, '') = '' OR (ISNULL(Bathrooms,'') = '' OR Bathrooms = @Bathrooms))

				AND(ISNULL(@CarSpace, '') = '' OR (ISNULL(CarSpace,'') = '' OR CarSpace = @CarSpace))

				AND(ISNULL(@Landarea, '') = '' OR (ISNULL(Landarea,'') = '' OR Landarea = @Landarea))

				AND Id IS NOT NULL
				
				AND ((@Isactive IS NULL)  OR (@Isactive = 1 AND PropertyDetailId IS NOT NULL) OR (@Isactive = 0 AND PropertyDetailId IS NULL) )

				--OR(ISNULL(@IsActive, '') = '' OR IsActive = @IsActive)
	
        )
            
        SELECT* FROM SqlPaging WITH(NOLOCK) WHERE ResultNum > ((@PageNum - 1) * @PageSize)

    END
END