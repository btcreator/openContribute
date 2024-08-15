class FilterQuery {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.#filter();
  }

  #filter() {
    const queryObj = { ...this.queryString };
    const exclusions = ["fields", "sort", "limit", "page"];

    exclusions.forEach((filed) => delete queryObj[filed]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
  }
}

module.exports = FilterQuery;
