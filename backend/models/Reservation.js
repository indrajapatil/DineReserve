const mongoose = require("mongoose");
const {Schema} =mongoose;

const reservationSchema = new Schema({
    name:{ type:String, required:true, },
    email:{ type:String, required:true, },
    phone:{ type:String, required:true, },
    date:{ type:Date, required:true, },
    time:{ type:String, enum:["9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM"], required:true, },
    seats:{ type:Number, min:1, max:10, required:true, },
    status: { type: String, enum: ['Pending','Confirmed','Cancelled'], default: 'Pending' }
},{ timestamps: true });

const Reservation = mongoose.model("Reservation",reservationSchema);
module.exports = Reservation;