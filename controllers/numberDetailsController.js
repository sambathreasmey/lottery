const asyncHandler = require("express-async-handler");
const NumberDetail = require("../models/numberDetailsModel");
const { ResultMessage } = require("../pattern/response/resultMessage");
const { LOTTERY_TYPE, MESSAGE, CODE } = require("../constants");


//@desc Get all number detail
//@route GET /api/number_detail
//@access private
const getAllNumberDetail = asyncHandler(async (req, res) => {
    const numberDetail = await NumberDetail.find({ type: LOTTERY_TYPE.LOTTERY_NUMBER});

    //DEV ONLY delete all
    // numberDetail.forEach(async num => {
    //     console.log(num._id);
    //     const resDel = await NumberDetail.deleteOne({ _id: num._id });
    // });

    return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, numberDetail));
});

//@desc Get by id number detail
//@route GET /api/number_detail
//@access private
const getNumberDetailById = asyncHandler(async (req, res) => {
    try {
        const numberDetail = await NumberDetail.findOne({ _id: req.params.id,  type: LOTTERY_TYPE.LOTTERY_NUMBER });
        if (!numberDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, numberDetail));
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }
});

//@desc create number detail
//@route POST /api/number_detail
//@access private
const createNumberDetail = asyncHandler(async (req, res) => {
    const dataEntries = [];

    req.body.forEach(item => {
        const { page_no, date, time, group, datas } = item;

        datas.forEach(data => {
            const { column_no, main_row } = data;

            main_row.forEach(rowItem => {
                const { row, post, schedule } = rowItem;

                row.forEach(rowData => {
                    const { number, amount, currency } = rowData;
                    const formattedData = {
                        page_no,
                        date,
                        time,
                        group,
                        column_no,
                        number,
                        amount,
                        currency,
                        post,
                        schedule
                    };

                    dataEntries.push(formattedData);
                });
            });
        });
    });

    const newDataEntries = await Promise.all(dataEntries.map(async (entry) => {
        const { page_no, date, time, group, column_no, number, amount, currency, post, schedule } = entry;

        return await NumberDetail.create({
            type: LOTTERY_TYPE.LOTTERY_NUMBER,
            page_no,
            date,
            time,
            group,
            column_no,
            number,
            amount,
            currency,
            post,
            schedule
        });
    }));
    res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.INSERTED, newDataEntries));
});

//@desc Delete number detail
//@route DELETE /api/number_detail/:id
//@access private
const deleteNumberDetail = asyncHandler(async (req, res) => {

    try {
        const numberDetail = await NumberDetail.findOne({ _id: req.params.id, type: LOTTERY_TYPE.LOTTERY_RESULT});
        if (!numberDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (numberDetail.user_id.toString() !== req.user.id) {
            return res.status(200).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const resDel = await NumberDetail.deleteOne({ _id: req.params.id });
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.DELETED, resDel));
    } catch (error) {
        return res.status(500).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    }

});

//@desc Update number detail
//@route PUT /api/number_detail/:id
//@access private
const updateNumberDetail = asyncHandler(async (req, res) => {
    try {
        const numberDetail = await NumberDetail.findOne({ _id: req.params.id, type: LOTTERY_TYPE.LOTTERY_RESULT});
        if (!numberDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (numberDetail.user_id.toString() !== req.user.id) {
            return res.status(200).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const updateRes = await NumberDetail.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.UP, updateRes));
    } catch (error) {
        res.status(500).json({ code: CODE.GENERAL_EXCEPTION, message: MESSAGE.GENERAL_EXCEPTION });
    }
});

//@desc POST number details filtered by schedule, date, group, and page number
//@route POST /api/number_details/inp_check
//@access private
const inputCheckNumberFilter = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { schedule, date, group, page_no } = req.body;

    // Build the query object based on provided filters
    const query = {};
    if (schedule) {
        query.schedule = schedule;
    }
    if (date) {
        query.date = date;
    }
    if (group) {
        query.group = group;
    }
    if (page_no) {
        query.page_no = page_no;
    }

    try {
        const numberDetails = await NumberDetail.find(query).exec();

        const reconstructedData = [];
        const grouped = {};
        numberDetails.forEach(entry => {
            const { page_no, date, time, group, column_no, number, amount, currency, post, schedule } = entry;
            
            const key = `${page_no}|${date}|${time}|${group}`;
            if (!grouped[key]) {
                grouped[key] = { page_no, date, time, group, datas: {} };
            }
        
            if (!grouped[key].datas[column_no]) {
                grouped[key].datas[column_no] = { column_no, main_row: {} };
            }
        
            const postKey = `${post}|${schedule}`;
            if (!grouped[key].datas[column_no].main_row[postKey]) {
                grouped[key].datas[column_no].main_row[postKey] = { post, schedule, row: [] };
            }
        
            grouped[key].datas[column_no].main_row[postKey].row.push({ number, amount, currency });
        });
        
        // Convert back to the original array structure
        for (const key in grouped) {
            const { page_no, date, time, group, datas } = grouped[key];
            const formattedDatas = Object.values(datas).map(({ column_no, main_row }) => ({
                column_no,
                main_row: Object.values(main_row)
            }));
        
            reconstructedData.push({ page_no, date, time, group, datas: formattedDatas });
        }
        
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.UP, reconstructedData));
    } catch (error) {
        return res.status(500).json(new ResultMessage(CODE.ERROR, MESSAGE.ERROR, error.message));
    }
});


module.exports = { getAllNumberDetail, getNumberDetailById, createNumberDetail, deleteNumberDetail, updateNumberDetail, inputCheckNumberFilter };
