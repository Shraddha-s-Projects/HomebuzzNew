
CREATE FUNCTION [dbo].[HigherPerfomanceRangeFn] (
    @ViewCount BIGINT
)
RETURNS BIGINT

AS
BEGIN
DECLARE @ViewBlockSize As INT = 4
DECLARE @BlockDiff As INT = 0
--DECLARE @BlockDiff As INT = 2
DECLARE @ViewBlock	BIGINT
DECLARE @PerfomanceRange BIGINT
DECLARE @HigherPerfomanceRange BIGINT

	-- SELECT @ViewBlock = CAST((@ViewCount/@ViewBlockSize) as DECIMAL(10,2))
	SELECT @ViewBlock = CEILING(CAST((CAST(@ViewCount as DECIMAL(10,2))/CAST(@ViewBlockSize as DECIMAL(10,2))) as DECIMAL(10,2)))
	SELECT @PerfomanceRange = @ViewBlock +@BlockDiff
	SELECT @HigherPerfomanceRange = @ViewCount + @PerfomanceRange

	RETURN @HigherPerfomanceRange

END -- End Function
