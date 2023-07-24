import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            unique: true,
            required: true,
        },
        purchase_datetime: {
            type: Date,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        purchaser: {
            type: String,
            required: true,
        },
        cartId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart",
        },
    },
    { timestamps: true } // Esta opción añade automáticamente los campos createdAt y updatedAt
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
