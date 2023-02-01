CREATE Procedure[dbo].[GETUSERSFORADMIN]
(
    @PageNum            INT,
    @PageSize           INT,
    @OrderColumnName    VARCHAR(50) = NULL,
    @OrderColumnDir     VARCHAR(50) = NULL,
    @FirstName          VARCHAR(200) = NULL,
    @LastName           VARCHAR(200) = NULL,
    @UserName         VARCHAR(200) = NULL,
    @Email           VARCHAR(200) = NULL,
    @IsActive     VARCHAR(50) = NULL,
	@RoleId			INT = NULL,
	@AgentAdminId		INT = NULL	
)
AS
BEGIN

    DECLARE @SearchUserResult TABLE
    (
        UserId                          INT,
        Email                           NVARCHAR(100),
        PhoneNo                         VARCHAR(100),
        FirstName                       VARCHAR(100),
        LastName                        VARCHAR(100),
		UserName						VARCHAR(100),
		RoleId							INT,
		Role							VARCHAR(100),
        CreatedOn                     DATETIME,
        IsActive					    BIT
    );

            DECLARE @TotalCount AS INT


    SET @TotalCount = (SELECT COUNT(DISTINCT UserId) FROM Users

            WHERE(ISNULL(@FirstName, '') = '' OR FirstName LIKE '%' + @FirstName + '%')

                AND(ISNULL(@LastName, '') = '' OR LastName LIKE '%' + @LastName + '%')

                AND(ISNULL(@UserName, '') = '' OR (ISNULL(UserName,'') = '' OR UserName LIKE '%' + @UserName + '%'))

                AND(ISNULL(@Email, '') = '' OR (ISNULL(Email,'') = '' OR Email LIKE '%' + @Email + '%'))

				AND (((@AgentAdminId IS NOT NULL) AND (RoleId = @RoleId OR RoleId = @AgentAdminId  ))

				OR (ISNULL(@RoleId, '') = '' OR RoleId = @RoleId))

				AND(ISNULL(@IsActive, '') = '' OR IsActive = @IsActive)

				AND IsDeleted = 0 

				)

  INSERT INTO @SearchUserResult
          (
           UserId,
            Email,
            PhoneNo,
             FirstName, 
			 LastName,
			 UserName,
			 RoleId,
			 Role,
			 CreatedOn,
			 IsActive)

    SELECT DISTINCT 
			U.UserId,
            U.Email,
            U.PhoneNo,
            U.FirstName,
            U.LastName,
			U.UserName,
			U.RoleId,
			UR.Role,
			U.CreatedOn,
			U.IsActive
    FROM Users U
	LEFT JOIN UserRoles UR
	ON U.RoleId = UR.Id

     WHERE(ISNULL(@FirstName, '') = '' OR U.FirstName LIKE '%' + @FirstName + '%')

                AND(ISNULL(@LastName, '') = '' OR U.LastName LIKE '%' + @LastName + '%')

                AND(ISNULL(@UserName, '') = '' OR (ISNULL(U.UserName,'') = '' OR U.UserName LIKE '%' + @UserName + '%'))

                AND(ISNULL(@Email, '') = '' OR (ISNULL(U.Email,'') = '' OR U.Email LIKE '%' + @Email + '%'))

				AND (((@AgentAdminId IS NOT NULL) AND (RoleId = @RoleId OR RoleId = @AgentAdminId  ))

				OR (ISNULL(@RoleId, '') = '' OR RoleId = @RoleId))

				AND(ISNULL(@IsActive, '') = '' OR U.IsActive = @IsActive)

				AND IsDeleted = 0 


    SELECT @TotalCount = COUNT(DISTINCT(UserId)) FROM @SearchUserResult


    BEGIN
        WITH SqlPaging AS
        (
            SELECT TOP(@PageSize* @PageNum) ROW_NUMBER() OVER (
                ORDER BY

                CASE WHEN @OrderColumnName = 'FirstName' and @OrderColumnDir = 'asc'

                THEN FirstName END ASC,
                CASE WHEN @OrderColumnName = 'FirstName' and @OrderColumnDir = 'desc'

                THEN FirstName END DESC,
                CASE WHEN @OrderColumnName = 'LastName' and @OrderColumnDir = 'asc'

                THEN LastName END ASC,
                CASE WHEN @OrderColumnName = 'LastName' and @OrderColumnDir = 'desc'

                THEN LastName END DESC,
                CASE WHEN @OrderColumnName = 'UserName' and @OrderColumnDir = 'asc'

                THEN UserName END ASC,
                CASE WHEN @OrderColumnName = 'UserName' and @OrderColumnDir = 'desc'

                THEN UserName END DESC,
                CASE WHEN @OrderColumnName = 'Email' and @OrderColumnDir = 'asc'

                THEN Email END ASC,
                CASE WHEN @OrderColumnName = 'Email' and @OrderColumnDir = 'desc'

                THEN Email END DESC,
                CASE WHEN @OrderColumnName IS NULL
                THEN UserId END DESC

            ) AS ResultNum,
           UserId,
            Email,
            PhoneNo,
             FirstName, 
			 LastName,
			 UserName,
			 RoleId,
			 Role,
			 CreatedOn,
			 IsActive,
            @TotalCount AS TotalCount

            FROM @SearchUserResult SR

            WHERE(ISNULL(@FirstName, '') = '' OR FirstName LIKE '%' + @FirstName + '%')

                AND(ISNULL(@LastName, '') = '' OR LastName LIKE '%' + @LastName + '%')

                AND(ISNULL(@UserName, '') = '' OR (ISNULL(UserName,'') = '' OR UserName LIKE '%' + @UserName + '%'))

                AND(ISNULL(@Email, '') = '' OR (ISNULL(Email,'') = '' OR Email LIKE '%' + @Email + '%'))

				AND (((@AgentAdminId IS NOT NULL) AND (RoleId = @RoleId OR RoleId = @AgentAdminId  ))

				OR (ISNULL(@RoleId, '') = '' OR RoleId = @RoleId))

				AND(ISNULL(@IsActive, '') = '' OR IsActive = @IsActive)
	
        )
            
        SELECT* FROM SqlPaging WITH(NOLOCK) WHERE ResultNum > ((@PageNum - 1) * @PageSize)

    END
END
