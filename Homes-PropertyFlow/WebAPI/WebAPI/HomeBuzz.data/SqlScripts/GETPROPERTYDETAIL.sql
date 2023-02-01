CREATE PROCEDURE [dbo].[GETPROPERTYDETAIL]
@PropertyDetailId INT,
@userId INT = null
AS
BEGIN

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
	  WHEN (select COUNT(Id) from PropertyLike Where PropertyDetailId = pd.Id and UserId = @userId ) > 0 THEN 1 
	  ELSE 0
	  END) as bit)UserLiked
	,CAST((CASE 
	  WHEN (select COUNT(Id) from PropertyOffer Where PropertyDetailId = pd.Id and UserId = @userId ) > 0 THEN 1
	  ELSE 0
	  END) as bit)UserOffered
	  ,prd.GoogleImage
	  ,pd.IsOpenHome
	from PropertyCrudData p
	LEFT JOIN PropertyDetail pd ON p.PropertyDetailId = pd.Id and pd.IsActive = 1
	LEFT JOIN PropertyData prd ON prd.Id = pd.PropertyId
	LEFT JOIN PropertyLike pl ON pl.PropertyDetailId = pd.Id
	LEFT JOIN PropertyOffer po ON po.PropertyDetailId = pd.Id
	LEFT JOIN PropertyImage poi ON poi.PropertyDetailId = pd.Id
	LEFT JOIN PropertyClaim prc ON prc.PropertyDetailId = pd.Id
	WHERE 
	p.PropertyDetailId = @PropertyDetailId

END