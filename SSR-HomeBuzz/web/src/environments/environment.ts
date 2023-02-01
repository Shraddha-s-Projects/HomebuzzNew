// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   APIURL: "http://203.192.235.219:5051/api/api",
//   // APIURL: "http://192.168.1.188/api/api",
//   // APIURL: "http://192.168.1.33:9091/api/api",
//   ProfilePicUrl: "/userprofile/profilepic/",
//   NotificationUrl: "ws://localhost:5000/notifications?token=[TokenId]",
//   whitelistedDomains: ["203.192.235.219,192.168.1.33"],
//   blacklistedRoutes: [],
//   WEBURL: "http://203.192.235.219:5051/web",
//   StaticUrl: "/web/property"
// };
export const environment = {
  production: false,
  APIURL: "http://localhost:5000/api",
  ProfilePicUrl: "/userprofile/profilepic/",
  NotificationUrl: "ws://localhost:5000/notifications?token=[TokenId]",
  whitelistedDomains: ["localhost:5000", "betaapi.homebuzz.com"],
  blacklistedRoutes: [],
  WEBURL: "http://localhost:4200",
  StaticUrl: "/property"     
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
