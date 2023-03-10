 SET IDENTITY_INSERT [dbo].[AgentOption] ON 

INSERT [dbo].[AgentOption] ([Id], [Option]) VALUES ( 1, N'List Property')
INSERT [dbo].[AgentOption] ([Id], [Option]) VALUES ( 2, N'Sales Leads')
INSERT [dbo].[AgentOption] ([Id], [Option]) VALUES ( 3, N'Track Property')
 SET IDENTITY_INSERT [dbo].[AgentOption] OFF
 SET IDENTITY_INSERT [dbo].[PropertyAction] ON 

INSERT [dbo].[PropertyAction] ([Id], [Action], [IsDeleted]) VALUES (1, N'Claim', 0)
INSERT [dbo].[PropertyAction] ([Id], [Action], [IsDeleted]) VALUES (2, N'UnClaim', 0)
INSERT [dbo].[PropertyAction] ([Id], [Action], [IsDeleted]) VALUES (3, N'Renew', 0)
INSERT [dbo].[PropertyAction] ([Id], [Action], [IsDeleted]) VALUES (4, N'TransferOwnership', 0)
SET IDENTITY_INSERT [dbo].[PropertyAction] OFF

SET IDENTITY_INSERT [dbo].[PropertyStatus] ON 
INSERT [dbo].[PropertyStatus] ([Id], [Name], [IsDeleted]) VALUES (1, N'Not listed', 0)
INSERT [dbo].[PropertyStatus] ([Id], [Name], [IsDeleted]) VALUES (2, N'Pre-market', 0)
INSERT [dbo].[PropertyStatus] ([Id], [Name], [IsDeleted]) VALUES (3, N'Open home / Owner active', 1)
INSERT [dbo].[PropertyStatus] ([Id], [Name], [IsDeleted]) VALUES (4, N'For sale', 0)
INSERT [dbo].[PropertyStatus] ([Id], [Name], [IsDeleted]) VALUES (5, N'All', 0)
SET IDENTITY_INSERT [dbo].[PropertyStatus] OFF

 SET IDENTITY_INSERT [dbo].[SubscriptionPlan] ON 
INSERT [dbo].[SubscriptionPlan] ([Id], [Name], [CreatedOn], [UpdatedOn], [IsDeleted]) VALUES (1, N'Executive plan', CAST(N'2020-05-05T00:00:00.0000000' AS DateTime2), NULL, 0)
INSERT [dbo].[SubscriptionPlan] ([Id], [Name], [CreatedOn], [UpdatedOn], [IsDeleted]) VALUES (2, N'Small branch plan', CAST(N'2020-05-05T00:00:00.0000000' AS DateTime2), NULL, 0)
INSERT [dbo].[SubscriptionPlan] ([Id], [Name], [CreatedOn], [UpdatedOn], [IsDeleted]) VALUES (3, N'Medium branch plan', CAST(N'2020-05-05T00:00:00.0000000' AS DateTime2), NULL, 0)
INSERT [dbo].[SubscriptionPlan] ([Id], [Name], [CreatedOn], [UpdatedOn], [IsDeleted]) VALUES (4, N'Enterprise plan', CAST(N'2020-05-05T00:00:00.0000000' AS DateTime2), NULL, 0)
SET IDENTITY_INSERT [dbo].[SubscriptionPlan] OFF

SET IDENTITY_INSERT [dbo].[SubscriptionPlanDetail] ON 
INSERT [dbo].[SubscriptionPlanDetail] ([Id], [SubscriptionPlan], [Agents], [TrialPeriod], [IsListingReferrals], [IsSalesLeadsAndTracking], [IsMetricsAndAnalytics], [IsReporting], [IsFindAgentListing], [IsRealtimeMarketUpdates], [NetWorkDashboard], [CreatedOn], [UpdatedOn], [IsDeleted], [Price]) VALUES (1, 1, N'1', 30, 1, 1, 1, 1, 1, 1, NULL, CAST(N'2020-05-05T00:00:00.0000000' AS DateTime2), NULL, 0, CAST(49.95 AS Decimal(18, 2)))
INSERT [dbo].[SubscriptionPlanDetail] ([Id], [SubscriptionPlan], [Agents], [TrialPeriod], [IsListingReferrals], [IsSalesLeadsAndTracking], [IsMetricsAndAnalytics], [IsReporting], [IsFindAgentListing], [IsRealtimeMarketUpdates], [NetWorkDashboard], [CreatedOn], [UpdatedOn], [IsDeleted], [Price]) VALUES (2, 2, N'2 - 9', 30, 1, 1, 1, 1, 1, 1, NULL, CAST(N'2020-05-05T00:00:00.0000000' AS DateTime2), NULL, 0, CAST(45.95 AS Decimal(18, 2)))
INSERT [dbo].[SubscriptionPlanDetail] ([Id], [SubscriptionPlan], [Agents], [TrialPeriod], [IsListingReferrals], [IsSalesLeadsAndTracking], [IsMetricsAndAnalytics], [IsReporting], [IsFindAgentListing], [IsRealtimeMarketUpdates], [NetWorkDashboard], [CreatedOn], [UpdatedOn], [IsDeleted], [Price]) VALUES (3, 3, N'11 - 50', 30, 1, 1, 1, 1, 1, 1, NULL, CAST(N'2020-05-05T00:00:00.0000000' AS DateTime2), NULL, 0, CAST(40.95 AS Decimal(18, 2)))
INSERT [dbo].[SubscriptionPlanDetail] ([Id], [SubscriptionPlan], [Agents], [TrialPeriod], [IsListingReferrals], [IsSalesLeadsAndTracking], [IsMetricsAndAnalytics], [IsReporting], [IsFindAgentListing], [IsRealtimeMarketUpdates], [NetWorkDashboard], [CreatedOn], [UpdatedOn], [IsDeleted], [Price]) VALUES (4, 4, N'50+', 30, 1, 1, 1, 1, 1, 1, NULL, CAST(N'2020-05-05T00:00:00.0000000' AS DateTime2), NULL, 0, NULL)
SET IDENTITY_INSERT [dbo].[SubscriptionPlanDetail] OFF

SET IDENTITY_INSERT [dbo].[UserRoles] ON 
INSERT [dbo].[UserRoles] ([Id], [Role]) VALUES (1, N'Customer')
INSERT [dbo].[UserRoles] ([Id], [Role]) VALUES (2, N'Agent')
INSERT [dbo].[UserRoles] ([Id], [Role]) VALUES (3, N'Admin')
INSERT [dbo].[UserRoles] ([Id], [Role]) VALUES (4, N'Visitor')
INSERT [dbo].[UserRoles] ([Id], [Role]) VALUES (5, N'Agent_Admin')
SET IDENTITY_INSERT [dbo].[UserRoles] OFF

SET IDENTITY_INSERT [dbo].[EmailTemplate] ON 
INSERT [dbo].[EmailTemplate] ([EmailTemplateId], [TemplateName], [TemplateCode], [Description], [TemplateHtml], [CreatedOn], [UpdatedOn], [IsDeleted], [DeletedOn]) VALUES (1, N'SIGUP', N'SIGUP', N'SIGUP', N'<div style="border:1px solid #dedede; box-shadow:0px 0px 5px #dddddd; padding:10px">  <p>Welcome</p>    <p>Thank you for using PropertyFlow.</p>    <p>To complete the identification process, please verify your email address.</p>    <p><a href="[VerifyUrl]" target="_blank">Click here to verify your email address</a></p>    <p>Verification Code: [VerificationCode]</p>    <p><strong>As a verified PropertyFlow user you will be able to</strong></p>    <ul>   <li>View Flowinterest across properties weekly for deeper analytics</li>   <li>As a buyer send no obligation offers direct to any property owner in New Zealand</li>   <li>As a property owner view offers and contact buyers directly</li>  </ul>    <p>If you have any queries or feedback email us at support@propertyflow.co.nz</p>    <p>We hope you enjoy your PropertyFlow experience.</p>    <p>The PropertyFlow team</p>  </div>', NULL, NULL, 0, NULL)
INSERT [dbo].[EmailTemplate] ([EmailTemplateId], [TemplateName], [TemplateCode], [Description], [TemplateHtml], [CreatedOn], [UpdatedOn], [IsDeleted], [DeletedOn]) VALUES (2, N'EVERN', N'EVERN', N'EVERN', N'<div style="border:1px solid #dedede; box-shadow:0px 0px 5px #dddddd; padding:10px">
<p>Dear [ToName],</p>

<p>Your email address verified successfully.</p>

<p>Regards,</p>

<p>[CompanyName]</p>

<p>THIS IS AN AUTOMATED EMAIL, PLEASE DO NOT REPLY</p>
</div>

<div style="border:1px solid #dedede; box-shadow:0px 0px 5px #dddddd; padding:10px">&nbsp;</div>
', NULL, NULL, 0, NULL)
INSERT [dbo].[EmailTemplate] ([EmailTemplateId], [TemplateName], [TemplateCode], [Description], [TemplateHtml], [CreatedOn], [UpdatedOn], [IsDeleted], [DeletedOn]) VALUES (3, N'PSWRT', N'PSWRT', N'PSWRT', N'<div style="border:1px solid #dedede;box-shadow: 0px 0px 5px #dddddd;padding:10px;">  <p>Dear [ToName],<br />  Verify your url: <a href="[VerifyUrl]" target="_blank">Click here.</a>   Verification Code: [VerificationCode]</p>    <p><br />  Regards,</p>    <p>[CompanyName]</p>    <p>THIS IS AN AUTOMATED EMAIL, PLEASE DO NOT REPLY</p>  </div>', NULL, NULL, 0, NULL)
INSERT [dbo].[EmailTemplate] ([EmailTemplateId], [TemplateName], [TemplateCode], [Description], [TemplateHtml], [CreatedOn], [UpdatedOn], [IsDeleted], [DeletedOn]) VALUES (4, N'ECVRC', N'ECVRC', N'ECVRC', N'<div style="border:1px solid #dedede;box-shadow: 0px 0px 5px #dddddd;padding:10px;">  <p>Dear [ToName],<br /> 
Your New Email :- [NewEmail]   VerificationCode :- [VerificationCode]    <p><br />  Regards,</p>    <p>[CompanyName]</p>    <p>THIS IS AN AUTOMATED EMAIL, PLEASE DO NOT REPLY</p>  </div>    <div style="border:1px solid #dedede;box-shadow: 0px 0px 5px #dddddd;padding:10px;">&nbsp;</div>', NULL, NULL, 0, NULL)
INSERT [dbo].[EmailTemplate] ([EmailTemplateId], [TemplateName], [TemplateCode], [Description], [TemplateHtml], [CreatedOn], [UpdatedOn], [IsDeleted], [DeletedOn]) VALUES (5, N'NEGOTIATE OFFER', N'NEOFF', N'NEGOTIATE OFFER', N'<div style="border:1px solid #dedede; box-shadow:0px 0px 5px #dddddd; padding:10px">  <p>Welcome</p>    <p>Thank you for using PropertyFlow.</p>    <p>You recently placed an offer of $[OfferingAmount] on&nbsp;</p>    <p><a href="[AddressUrl]" target="_blank">[Address]</a></p>    <p>The property owner has viewed your offer and wished to enter into negotiations.</p>    <p>The property owners details are:</p>    <p>Name: [UserName]</p>    <p>Contact: [Email]</p>    <p><strong>What happens next</strong></p>    <p>The property owner is waiting on your reply.</p>    <p>If you wish to enter into&nbsp;negotiations or undertake further due diligence contact the property owner.</p>    <p>If you wish to not proceed with your offer you can go to your account and remove your offer.</p>    <p>Happy property buying</p>    <p>The PropertyFlow team</p>  </div>  ', NULL, NULL, 0, NULL)
INSERT [dbo].[EmailTemplate] ([EmailTemplateId], [TemplateName], [TemplateCode], [Description], [TemplateHtml], [CreatedOn], [UpdatedOn], [IsDeleted], [DeletedOn]) VALUES (6, N'REMOVE OFFER', N'REOFF', N'REMOVE OFFER', N'<div style="border:1px solid #dedede; box-shadow:0px 0px 5px #dddddd; padding:10px"><p>Welcome</p>    <p>Thank you for using PropertyFlow.</p>    <p>You recently removed your offer of $[OfferingAmount] on&nbsp;</p>    <p><a href="[AddressUrl]" target="_blank">[Address]</a></p>    <p>If you wish to place another offer on this property click the above link.</p>    <p>Happy property buying</p>    <p>The PropertyFlow team</p></div>', NULL, NULL, 0, NULL)
INSERT [dbo].[EmailTemplate] ([EmailTemplateId], [TemplateName], [TemplateCode], [Description], [TemplateHtml], [CreatedOn], [UpdatedOn], [IsDeleted], [DeletedOn]) VALUES (7, N'CLAIM HOME', N'CLAIM', N'CLAIM HOME', N'<div style="border:1px solid #dedede; box-shadow:0px 0px 5px #dddddd; padding:10px">
<p>Welcome</p>

<p>Thank you for using PropertyFlow.</p>

<p>You recently claimed</p>

<p><a href="[AddressUrl]" target="_blank">[Address]</a></p>

<p>As the owner you can create more interest in your property by adding photos, a description and a price. You can also view no obligation offers placed on your property and contact buyers directly or use an&nbsp;agent, it is your choice.</p>

<p>Your property claim duration is for 28 days. You can renew your property at any time back to the maximum of 28 days by clicking the EDIT button on your property tile.</p>

<p>Happy property selling</p>

<p>The PropertyFlow team</p>
</div>', NULL, NULL, 0, NULL)
INSERT [dbo].[EmailTemplate] ([EmailTemplateId], [TemplateName], [TemplateCode], [Description], [TemplateHtml], [CreatedOn], [UpdatedOn], [IsDeleted], [DeletedOn]) VALUES (8, N'RENEW CLAIM', N'RENEW', N'RENEW CLAIM', N'<div style="border:1px solid #dedede; box-shadow:0px 0px 5px #dddddd; padding:10px">  <p>Welcome</p>    <p>Thank you for using PropertyFlow.</p>    <p>You recently renewed your claim for</p>    <p><a href="[AddressUrl]" target="_blank">[Address]</a></p>    <p>Want more interest in your property?</p>    <p>Look at what "hot" properties in the area are doing to attract interest with their listings. Add more photos and edit your property''s description, and share your property''s listing on social media to attract more interest and drive offers.</p>    <p>Happy property selling</p>    <p>The PropertyFlow team</p>  </div>  ', NULL, NULL, 0, NULL)
INSERT [dbo].[EmailTemplate] ([EmailTemplateId], [TemplateName], [TemplateCode], [Description], [TemplateHtml], [CreatedOn], [UpdatedOn], [IsDeleted], [DeletedOn]) VALUES (9, N'UNCLAIM', N'UNCLM', N'UNCLAIM', N'<div style="border:1px solid #dedede; box-shadow:0px 0px 5px #dddddd; padding:10px">  <p>Welcome</p>    <p>Thank you for using PropertyFlow.</p>    <p>You recently unclaimed</p>    <p><a href="[AddressUrl]" target="_blank">[Address]</a></p>    <p>We hope you sold your property and can be of help to you in the near future.</p>    <p>Happy property selling</p>    <p>The PropertyFlow team</p>  </div>  ', NULL, NULL, 0, NULL)
INSERT [dbo].[EmailTemplate] ([EmailTemplateId], [TemplateName], [TemplateCode], [Description], [TemplateHtml], [CreatedOn], [UpdatedOn], [IsDeleted], [DeletedOn]) VALUES (10, N'EXPIRE OFFER', N'EXOFF', N'EXPIRE OFFER', N'<div style="border:1px solid #dedede; box-shadow:0px 0px 5px #dddddd; padding:10px">  <p>Welcome</p>    <p>Thank you for using PropertyFlow.</p>    <p>Your offer of&nbsp; $[OfferingAmount] has expired that you placed on</p>    <p><a href="[AddressUrl]" target="_blank">[Address]</a></p>    <p><strong>What happens next</strong></p>    <p>As the property owner did not take any action, if you are still interested in this property you can make another offer on it to let the property owner know.</p>    <p>If you have any further questions please email us at support@propertyflow.co.nz</p>    <p>Happy property buying</p>    <p>The PropertyFlow team</p>  </div>', NULL, NULL, 0, NULL)
INSERT [dbo].[EmailTemplate] ([EmailTemplateId], [TemplateName], [TemplateCode], [Description], [TemplateHtml], [CreatedOn], [UpdatedOn], [IsDeleted], [DeletedOn]) VALUES (11, N'MAKE OFFER', N'MKOFF', N'MAKE OFFER', N'<div style="border:1px solid #dedede; box-shadow:0px 0px 5px #dddddd; padding:10px">  <p>Welcome</p>    <p>Thank you for using PropertyFlow.</p>    <p>We confirm you recently submitted an offer of $[OfferingAmount] on&nbsp;</p>    <p><a href="[AddressUrl]" target="_blank">[Address]</a></p>    <p>You can edit your offer at any time by clicking on the above link and place another offer.</p>    <p><strong>What happens next</strong></p>    <p>If the property owner wants to negotiate your offer they will reply via email to you with their contact details.</p>    <p>If the propertyowner declines your offer you will receive a notification email.</p>    <p>Happy property buying.</p>    <p>The PropertyFlow team</p>  </div>  ', NULL, NULL, 0, NULL)
INSERT [dbo].[EmailTemplate] ([EmailTemplateId], [TemplateName], [TemplateCode], [Description], [TemplateHtml], [CreatedOn], [UpdatedOn], [IsDeleted], [DeletedOn]) VALUES (12, N'NOTIFICATION OFFER', N'MNOFF', N'NOTIFICATION OFFER', N'<div style="border:1px solid #dedede; box-shadow:0px 0px 5px #dddddd; padding:10px"><p>Welcome</p>

<p>Offers have been submitted on a property you are the owner of at the following address:</p>

<p><a href="[AddressUrl]" target="_blank">[Address]</a></p>

<p>The buyer is awaiting you reply as to whether you wish to disscuss or decline their offer.</p>

<p><strong>What happens next</strong></p>

<p>If you wish to view their offer go to your account where you will be able to select an option to either negotiate with the</p>

<p>buyer further or decline their offer.</p>

<p>The buyer can remove their offer at anytime without notification so the quicker you reply the more chance you have</p>

<p>of securing the buyer.</p>

<p>Happy property selling</p>

<p>The PropertyFlow team</p></div>', NULL, NULL, 0, NULL)
INSERT [dbo].[EmailTemplate] ([EmailTemplateId], [TemplateName], [TemplateCode], [Description], [TemplateHtml], [CreatedOn], [UpdatedOn], [IsDeleted], [DeletedOn]) VALUES (13, N'SINGLE OFFER NOTIFICATION', N'SNOFF', N'SINGLE OFFER NOTIFICATION', N'<div style="border:1px solid #dedede; box-shadow:0px 0px 5px #dddddd; padding:10px">  <p>Welcome</p>    <p>An Offer&nbsp;has been submitted on a property you are the owner of at the following address:</p>    <p><a href="[AddressUrl]" target="_blank">[Address]</a></p>    <p>The buyer is awaiting you reply as to whether you wish to disscuss or decline their offer.</p>    <p><strong>What happens next</strong></p>    <p>If you wish to view their offer go to your account where you will be able to select an option to either negotiate with the</p>    <p>buyer further or decline their offer.</p>    <p>The buyer can remove their offer at anytime without notification so the quicker you reply the more chance you have</p>    <p>of securing the buyer.</p>    <p>Happy property selling</p>    <p>The PropertyFlow team</p>  </div>  ', NULL, NULL, 0, NULL)
INSERT [dbo].[EmailTemplate] ([EmailTemplateId], [TemplateName], [TemplateCode], [Description], [TemplateHtml], [CreatedOn], [UpdatedOn], [IsDeleted], [DeletedOn]) VALUES (10005, N'NOTIFY PROPERTY EMAIL', N'NOPRO', N'NOTIFY PROPERTY EMAIL', N'<div style="border:1px solid #dedede; box-shadow:0px 0px 5px #dddddd; padding:10px">  <p>Welcome</p>    <p>The property [Address] has open home on [OpenedDate] at [Day], [Time] .</p><p>The PropertyFlow team</p>  </div>  ', NULL, NULL, 0, NULL)
INSERT [dbo].[EmailTemplate] ([EmailTemplateId], [TemplateName], [TemplateCode], [Description], [TemplateHtml], [CreatedOn], [UpdatedOn], [IsDeleted], [DeletedOn]) VALUES (10006, N'TRANSFER  PROPERTY OWNERSHIP', N'TRANS', N'TRANSFER  PROPERTY OWNERSHIP', N'<div style="border:1px solid #dedede; box-shadow:0px 0px 5px #dddddd; padding:10px">  <p>Welcome</p>    <p>The property [Address] has transfer ownership.</p><p>The PropertyFlow team</p>  </div>  ', NULL, NULL, 0, NULL)
INSERT [dbo].[EmailTemplate] ([EmailTemplateId], [TemplateName], [TemplateCode], [Description], [TemplateHtml], [CreatedOn], [UpdatedOn], [IsDeleted], [DeletedOn]) VALUES (20006, N'NOTIFY AGENT SIGNUP', N'AGSIG', N'NOTIFY AGENT SIGNUP', N'<div style="border:1px solid #dedede; box-shadow:0px 0px 5px #dddddd; padding:10px">  
<p>Welcome</p>    
<p>Thank you for using PropertyFlow.</p>  
<p> AgentEmails: [AgentEmails]</p>       
<p>If you have any queries or feedback email us at support@propertyflow.co.nz</p>    
<p>We hope you enjoy your PropertyFlow experience.</p>    
<p>The PropertyFlow team</p>  </div>', NULL, NULL, 0, NULL)
INSERT [dbo].[EmailTemplate] ([EmailTemplateId], [TemplateName], [TemplateCode], [Description], [TemplateHtml], [CreatedOn], [UpdatedOn], [IsDeleted], [DeletedOn]) VALUES (20007, N'VERIFY AGENT ACCOUNT COMPNY EMAIL NOTIFICATION', N'VECMP', N'VERIFY AGENT ACCOUNT COMPNY EMAIL NOTIFICATION', N'<div style="border:1px solid #dedede; box-shadow:0px 0px 5px #dddddd; padding:10px">  
<p>Dear [ToName],</p>      
<p>Your Agent: [AgentEmail] email verified successfully.</p>
<p>Regards,</p>   
 <p>[CompanyName]</p>    
 <p>THIS IS AN AUTOMATED EMAIL, PLEASE DO NOT REPLY</p> 
 </div>   
<div style="border:1px solid #dedede; box-shadow:0px 0px 5px #dddddd; padding:10px">&nbsp;</div> ', NULL, NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[EmailTemplate] OFF
