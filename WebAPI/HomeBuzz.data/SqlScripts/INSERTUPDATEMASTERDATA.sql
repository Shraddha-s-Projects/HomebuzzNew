CREATE PROCEDURE [dbo].[INSERTUPDATEMASTERDATA]
	-- Add the parameters for the stored procedure here
	
AS
BEGIN
	
	SET NOCOUNT ON;    
  
	DECLARE @Id int ,@Address nvarchar(MAX),
		@City varchar(1000),
		@Suburb varchar(1000),
		@HomebuzzEstimate decimal(18,2),
		@Bedrooms varchar(500),
		@Bathrooms varchar(500),
		@CarSpace varchar(500),
		@Landarea varchar(500),
		@LatitudeLongitude varchar(500),
		@Latitude decimal(30,15),
		@Longitude decimal(30,15);
  
  
	DECLARE emp_cursor CURSOR FOR     
	SELECT Id,Address,City, Suburb, HomebuzzEstimate, Bedrooms, Bathrooms,
	CarSpace, LandArea, LatitudeLongitude, Latitude, Longitude 
	FROM TempMasterData where LatitudeLongitude IS NOT NULL 
	and LatitudeLongitude != 'null'
	and HomebuzzEstimate IS NOT NULL
	order by Id ;    
  
	OPEN emp_cursor    
  
	FETCH NEXT FROM emp_cursor     
	INTO @Id,@Address,
	@City,
	@Suburb,
	@HomebuzzEstimate,
	@Bedrooms ,
	@Bathrooms ,
	@CarSpace ,
	@Landarea ,
	@LatitudeLongitude,
	@Latitude,
	@Longitude
     
  
	WHILE @@FETCH_STATUS = 0    
	BEGIN    
  
      IF EXISTS (SELECT distinct  1  FROM PropertyData WHERE HomebuzzEstimate = @HomebuzzEstimate and Address LIKE  @Address + '%')
		BEGIN
			Update PropertyData set Address = @Address, City = @City, Suburb = @Suburb,
			 HomebuzzEstimate = @HomebuzzEstimate,
			Bedrooms = @Bedrooms,Bathrooms  = @Bathrooms , CarSpace = @CarSpace, 
			Landarea = @Landarea , LatitudeLongitude = @LatitudeLongitude, Latitude = @Latitude,
			Longitude = @Longitude where 
			Address LIKE  @Address + '%' and HomebuzzEstimate = @HomebuzzEstimate 
		END
	  ELSE
		BEGIN
			INSERT PropertyData (Address, City, Suburb, HomebuzzEstimate, Bedrooms, Bathrooms, CarSpace, Landarea, 
			LatitudeLongitude, Latitude, Longitude) VALUES
			(@Address,@City, @Suburb, @HomebuzzEstimate, @Bedrooms, @Bathrooms, @CarSpace, @Landarea, 
			@LatitudeLongitude, @Latitude, @Longitude)
		END

	FETCH NEXT FROM emp_cursor     
	INTO @Id,@Address,
	@City,
	@Suburb,
	@HomebuzzEstimate,
	@Bedrooms ,
	@Bathrooms ,
	@CarSpace ,
	@Landarea ,
	@LatitudeLongitude,
	@Latitude,
	@Longitude
   
	END     
	CLOSE emp_cursor;    
	DEALLOCATE emp_cursor;
	
	    INSERT INTO InvalidPropertyData (Address, HomebuzzEstimate, Bedrooms, Bathrooms, CarSpace, Landarea, 
			LatitudeLongitude, MasterFileUpload) 
			select  Address, HomebuzzEstimate, Bedrooms, Bathrooms, CarSpace, Landarea, 
			LatitudeLongitude, MasterFileUpload from TempMasterData where LatitudeLongitude IS NULL 
			OR LatitudeLongitude = 'null'
			OR HomebuzzEstimate IS  NULL

			delete from  TempMasterData
END