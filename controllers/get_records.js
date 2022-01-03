const Records = require("../models/record");

/**
 * this function checks if date is valid or not.
 * @param {*} date 
 * @returns 
 */
const isDate = (date) => {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

/**
 * This function check if number is valid or not.
 * @param {*} number 
 * @returns 
 */
const isNumber = (number) => {
    return !isNaN(number);
}

/**
 * This is the controller function which perform json payload checks and pull data from db and push data
 * @param {*} req 
 * @param {*} res 
 */
const getRecords = (req, res) => {
    var code = 0;
    var message = "Success";
    //checking for json load exists or not.
    if (!(req.body)) {
        code = 1;
        message = "Json Payload is missing";
        res.json({
            "code":code,
            "msg": message
        })
    }
    else {
        //array to contains all messages related to json fields
        var msg_parts = [];
        //checking for start date exist and a valid date
        if (!(req.body.startDate && isDate(req.body.startDate))) {
            code = 2; // changing code value to indicate that recived json payload contains error
            msg_parts.push("Invalid start Date"); // pushing error message to msg part
        }
        //checking for start date exist and a valid date
        if (!(req.body.endDate && isDate(req.body.startDate))) {
            code = 2;// changing code value to indicate that recived json payload contains error
            msg_parts.push("Invalid end Date");// pushing error message to msg part
        }
        if (!(req.body.maxCount && isNumber(req.body.maxCount))) {
            code = 2;// changing code value to indicate that recived json payload contains error
            msg_parts.push("Invalid max Count");// pushing error message to msg part
        }
        if (!(req.body.minCount && isNumber(req.body.minCount))) {
            code = 2;// changing code value to indicate that recived json payload contains error
            msg_parts.push("Invalid min Count");// pushing error message to msg part
        }
        if (code === 0) { //checking if code is zero which mean we don't have any error
            /*first we are calling match in date then we are calling sum function because some 
              is expensive function in comparison to match so we don't want to call sum on all items 
              and after sum if we will call count filter.
            */
            Records.aggregate(
                [   {"$match":{
                            createdAt:{
                                    "$lte": new Date(req.body.endDate),
                                    "$gte": new Date(req.body.startDate),
                                }
                        }
                    },
                    { "$addFields": { 
                        totalCount: {
                                "$sum": "$counts" 
                            } 
                        } 
                    },
                    {"$match":{
                        totalCount:{
                                "$lte":req.body.maxCount,
                                "$gte":req.body.minCount,
                        }
                    }

                    },
                    { "$project":{
                            _id:0,
                            key:"$key",
                            createdAt:"$createdAt",
                            totalCount:"$totalCount"
                        }
                    }

                ]
            )
            .then((result) => {
                    res.json({
                        "code":code,
                        "message":message,
                        "records":result
                    }) // returning json result
            })
        }
        else{
            message = "Invalid Json Playload \n"+msg_parts.join("\n"); // combining msg parts
            res.json({
                "code":code,
                "msg": message
            })
        }
    }



}

module.exports = {
    getRecords
}