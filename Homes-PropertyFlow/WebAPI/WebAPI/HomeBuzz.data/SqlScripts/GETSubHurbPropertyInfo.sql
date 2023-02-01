CREATE PROCEDURE [dbo].[GETSubHurbPropertyInfo]
	-- Add the parameters for the stored procedure here
	@SearchTerm nvarchar(1000)
AS
BEGIN
	SET NOCOUNT ON;

select 
distinct
(select COUNT(Id) from PropertyData where Suburb =  @SearchTerm )TotalProperties,
(select ROUND(AVG(HomebuzzEstimate), 0) from PropertyData where Suburb =  @SearchTerm) AverageEstimatePrice,
(select COUNT(pc4.Id) from PropertyCrudData pc4 INNER JOIN PropertyDetail pd4 ON pc4.PropertyDetailId = pd4.Id where Suburb = @SearchTerm)ActiveProperties,
(select COUNT(pd1.Id) from PropertyDetail pd1 
INNER JOIN PropertyCrudData pc1 on pd1.Id = pc1.PropertyDetailId  where pd1.Status = 'Not listed' 
AND  pc1.Suburb = @SearchTerm)ViewedProperties,
(select COUNT(pd2.Id) from PropertyDetail  pd2 
INNER JOIN PropertyCrudData pc2 on pd2.Id = pc2.PropertyDetailId where pd2.Status = 'Pre-market' 
AND pc2.Suburb = @SearchTerm )ClaimedProperties,
(select COUNT(pd3.Id) from PropertyDetail pd3 
INNER JOIN PropertyCrudData pc3 on pd3.Id = pc3.PropertyDetailId where pd3.Status = 'For sale' 
AND pc3.Suburb = @SearchTerm )ForSaleProperties

END