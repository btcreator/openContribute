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

  project() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query.select(fields);
    }

    !this.query.selectedInclusively() && this.query.select('-__v');
    return this;
  }

  paginate() {
    const limit = +this.queryString.limit || 0;
    const page = +this.queryString.page || 1;

    limit && this.query.limit(limit).skip((page - 1) * limit);

    return this;
  }

  refine(searchFilter) {
    this.filter(searchFilter).sort().project().paginate();
    return this.query;
  }
}

module.exports = RefineQuery;
