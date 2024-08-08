// OUTGOING (response) data - Exclude sensitive data
////
// When the retrived documnet is converted to Object or JSON format, sensitive data gets excluded from the document based on user role (see Schema options)
exports.excludeSensitiveFields = function (doc, ret, options) {
  if (!options.user) options.user = "user";
  if (options.user !== "admin") delete ret.isActive;

  // these gets excluded for everybody
  delete ret.password;
  delete ret.passwordChangedAt;

  return ret;
};

// INCOMING (request) data - Exclude sensitive data
////
// Clean incoming request from sesitive data
const cleanBody = function (body, ...except) {
  // these are excluded essentially
  const exclusions = [
    "resetTokenExpire",
    "passwordResetToken",
    "setInactiveAt",
    "passwordChangedAt",
  ];

  // add any additional exclusions
  if (except.length) exclusions.push(...except);

  exclusions.forEach((prop) => delete body[prop]);
};
