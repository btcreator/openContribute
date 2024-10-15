class RefineQuery {
  constructor(query, queryString) {
    this.query = query.clone();
    this.queryString = queryString;
  }

  filter(searchFilter) {
    const queryObj = Object.assign({ ...this.queryString }, searchFilter);
    const exclusions = ['fields', 'sort', 'limit', 'page'];

    exclusions.forEach((filed) => delete queryObj[filed]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else {
      this.query.sort('-createdAt');
    }

    return this;
  }

  project(selector) {
    // just in developement to warn developer that when project is used, dont use select before on the query (except +field - dont count in mongo as "selection").
    if (process.env.NODE_ENV === 'development')
      if (this.query.selectedInclusively() || this.query.selectedExclusively())
        throw new Error(`No select before query project ${this.query.constructor.name}`);

    // initial conditions
    const selectFields = [];
    const allowedFields = selector?.split(' ') ?? [];

    // from exclusion in an include selection is just the _id is an exception, so add it to the selected fields wehn present
    if (allowedFields.includes('-_id')) {
      allowedFields.splice(allowedFields.indexOf('-_id'), 1);
      selectFields.push('-_id');
    }

    // separate user selections
    // prettier-ignore
    const requestInclusionFields = this.queryString.fields?.split(',').join(' ').match(/(?<![+-])\b\S+\b/g) ?? []; // photo email ...
    // prettier-ignore
    const requestExclusionFields = this.queryString.fields?.split(',').join(' ').match(/-\S+/g) ?? []; // -photo -email ...

    // add the fields to selected ones based on restriction and user selection
    if (allowedFields.length > 0) {
      // add user selected, which are allowed fields
      // else add all allowed fields, except user excluded ones
      if (requestInclusionFields.length > 0) {
        allowedFields.forEach((field) => requestInclusionFields.includes(field) && selectFields.push(field));
      } else {
        allowedFields.forEach((field) => requestExclusionFields.includes(`-${field}`) || selectFields.push(field));
      }
    } else {
      // all fields are allowed which user selected - !!the query needs to be cleaned from sensitive fileds beforehand
      // else add all fields, except user excluded ones
      if (requestInclusionFields.length > 0) {
        selectFields.push(...requestInclusionFields);
      } else {
        selectFields.push(...requestExclusionFields);
      }
    }

    // select those fields
    this.query.select(selectFields.join(' '));
    // when possible remove mongo version field
    !this.query.selectedInclusively() && this.query.select('-__v');
    return this;
  }

  paginate() {
    const limit = +this.queryString.limit || 0;
    const page = +this.queryString.page || 1;

    limit && this.query.limit(limit).skip((page - 1) * limit);

    return this;
  }

  refine(searchFilter, selector) {
    this.filter(searchFilter).sort().project(selector).paginate();
    return this.query;
  }
}

module.exports = RefineQuery;
