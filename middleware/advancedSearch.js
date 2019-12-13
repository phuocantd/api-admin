const createError = require('http-errors');

const advancedSearch = (model, populate) => async (req, res, next) => {
    let query, results;

    const reqQuery = {
        ...req.query
    };

    // don't need to find these fields
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // reqQuery[param] = reqQuery.param
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = model.find(JSON.parse(queryStr));

    // count total for paging
    const total = await model.find(JSON.parse(queryStr)).countDocuments();
    console.log(total);
    
    // ex: ?select=paymentPerHour,userInfo
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }


    // ex: ?select=paymentPerHour,userInfo&sort=name
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 8;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;


    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate);
    }


    try {
        results = await query;
    } catch (error) {
        return next(new createError(404, 'Resource not found'));
    }

    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.advancedSearch = {
        success: true,
        count: results.length,
        pagination,
        data: results
    };
    next();

}

module.exports = advancedSearch;