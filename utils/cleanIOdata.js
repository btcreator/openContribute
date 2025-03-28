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
    'resetTokenExpire',
    'passwordResetToken',
    'setInactiveAt',
    'passwordChangedAt',
    'photo',
    'contributedAt',
    'guestPassToken',
    'slug',
    'coverImg',
    'resultImg',
    'progress',
    'createdAt',
    'images',
    'videos',
  ];

  // add any additional exclusions
  if (except.length) exclusions.push(...except);

  exclusions.forEach((prop) => delete cleaned[prop]);

  return cleaned;
};

exports.cleanQueryFields = function (queryFields, ...except) {
  const fields = queryFields.match(/-?\w+/g) ?? [];
  const exclusions = ['password', 'resetTokenExpire', 'passwordResetToken'];

  // add any additional exclusions
  if (except.length) exclusions.push(...except);

  return fields.filter((field) => !exclusions.includes(field)).join(',');
};
