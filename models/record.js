const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _recordSchema = new Schema({
        key:{
            type:String,
            required:true,
        },
        value:{
            type:String,
            required:true,
        },
        count:{
            type: Array(Number),
            required:true
        }   
    },
    {
        timestamps: true
    }
)

const Records = mongoose.model('record',_recordSchema);
module.exports = Records;