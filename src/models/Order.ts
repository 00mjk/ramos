import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    id: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    customerid: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    purchased: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    state: {
        type: mongoose.SchemaTypes.String,
    },
    dummy: mongoose.SchemaTypes.Boolean,
    refused: mongoose.SchemaTypes.Boolean,
})

const Order = mongoose.model('Order', orderSchema)
export default Order;
