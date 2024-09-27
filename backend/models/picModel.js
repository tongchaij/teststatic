import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const tagSchema = mongoose.Schema({
    value:{
        type:String,
        required:true,
        select:true
    },
    title:{
        type:String,
        required:true
    }
});

const picSchema = mongoose.Schema({
    src: {
        type: String,
        required: true
    },
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    tags: {
        type: [tagSchema],
        required: true,
//        select:true
    }
},{
    timestamps: true
});

picSchema.plugin(mongoosePaginate)

export const Pic = mongoose.model('Pic', picSchema);
