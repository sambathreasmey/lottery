const asyncHandler = require("express-async-handler");
const NumberDetail = require("../number/model/numberDetailsModel");
const { ResultMessage } = require("../../app/pattern/response/resultMessage");
const { LOTTERY_TYPE, MESSAGE, CODE } = require("../../app/constant/constants");
const { v4: uuidv4 } = require('uuid');


//@desc Get report
//@route POST /api/report/fetch
//@access private
const getReport = asyncHandler(async (req, res) => {
    const { start_date, end_date, group } = req.body;
    
    // Check if the dates are valid and convert them to Date objects
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Ensure the dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json(new ResultMessage(CODE.INVALID_INPUT, MESSAGE.INVALID_DATE_FORMAT));
    }

    // Build the filter condition
    const filter = {
        date: {
            $gte: startDate,  // Start date (greater than or equal to)
            $lte: endDate     // End date (less than or equal to)
        }
    };

    if (group) {
        filter.group = group; // Optional filter by group
    }

    // Aggregate the report data, grouping by user_id
    const reportData = await NumberDetail.aggregate([
        {
            $match: filter // Apply filters
        },
        {
            $group: {
                _id: "$user_id", // Group by user_id
                total_page: { $sum: "$page_no" }, // Sum of page_no for each user
                total_number: { $sum: "$_id" } // Sum of _id for each user
            }
        }
    ]);

    return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, reportData));
});

module.exports = { 
    getReport
};