import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { AppConfig } from '../../config/app.js';


export interface ICache extends mongoose.Document {
    section: "webacy" | "coingecko" | "bubble_map"
    key: string
    data: any
    createdAt: Date
}


const CacheSchema = new mongoose.Schema({
    section: {
        type: String,
        enum: ["webacy", "coingecko", "bubble_map"],
        required: true,
        index: true,
    },
    key: {
        type: String,
        required: true,
        unique: false,
        index: true,
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: AppConfig.cache_duration_in_sec, // expires in seconds (keeps DB Clear!)
    },
}, {
    timestamps: false,
});

CacheSchema.plugin(paginate);


const Cache = mongoose.model<ICache, mongoose.PaginateModel<ICache>>('caches', CacheSchema);
export default Cache;
