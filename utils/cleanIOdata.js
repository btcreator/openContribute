// OUTGOING (response) data
////
// When the retrived documnet is converted to Object or JSON format, sensitive data gets excluded from the document (see Schema options)
exports.excludeSensitiveFields = function (doc, ret) {
  // remove isActive field when the docment is created
  if (doc.$locals.isNew) delete ret.isActive;

  // these gets excluded for everybody
  delete ret.password;
  delete ret.passwordChangedAt;

  return ret;
};

// INCOMING (request) data
////
// Clean incoming request from sesitive data to not to write or overwrite in DB
exports.cleanBody = function (body, ...except) {
  const cleaned = { ...body };

  // these are excluded essentially - not even for admins are allowed to rewrite
  const exclusions = [
    "resetTokenExpire",
    "passwordResetToken",
    "setInactiveAt",
    "passwordChangedAt",
  ];

  // add any additional exclusions
  if (except.length) exclusions.push(...except);

  exclusions.forEach((prop) => delete cleaned[prop]);

  return cleaned;
};
