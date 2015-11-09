var mongoose require('mongoose');
    Schema = mongoose.Schema;

var TradeSchema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var trades = new Schema({
    _id: ObjectId,
    seq: String,
    timestamp: Number,
    price: Number, 
    amount: Number
    
});