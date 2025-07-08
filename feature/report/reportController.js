const asyncHandler = require("express-async-handler");
const NumberDetail = require("../number/model/numberDetailsModel");
const { ResultMessage } = require("../../app/pattern/response/resultMessage");
const { LOTTERY_TYPE, MESSAGE, CODE } = require("../../app/constant/constants");
const { v4: uuidv4 } = require('uuid');


//@desc Get report
//@route POST /api/report/fetch
//@access private
const getReport = asyncHandler(async (req, res) => {
    const { start_date, end_date, group, type } = req.body;
    
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
        filter.group = group;
    }

    if (type) {
        filter.type = type;
    }

    const reportData = await NumberDetail.aggregate([
        {
            $match: filter
        },
        {
            $group: {
                _id: "$user_id",
                total_page: { $addToSet: "$page_no" }, // Unique page_no
                total_number: { $sum: 1 }              // Count docs        
            }
        },
        {
            $project: {
                total_page: { $size: "$total_page" },  // Count unique page_no
                total_number: 1
            }
        },
        {
            $addFields: {
                user_id_obj: { $toObjectId: "$_id" }   // Convert _id to ObjectId
            }
        },
        {
            $lookup: {
                from: "ltr_user_details",              // Make sure this is the correct collection name
                localField: "user_id_obj",             // ✅ Use the converted ObjectId here
                foreignField: "_id",                   // Join on _id in ltr_user_details
                as: "userInfo"
            }
        },
        {
            $unwind: {
                path: "$userInfo",
                preserveNullAndEmptyArrays: true       // Keep even if no match
            }
        },
        {
            $project: {
                _id: 1,
                username: "$userInfo.username",         // ✅ Add username
                total_page: 1,
                total_number: 1
            }
        }
    ]);

    // Add `no` field
    const reportWithNo = reportData.map((item, index) => ({
        no: index + 1, // Start from 1
        ...item
    }));

    return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, reportWithNo));
});

module.exports = { 
    getReport
};
