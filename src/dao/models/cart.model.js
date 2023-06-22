import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
        products: {
            type:[{
                id:{ 
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                    require: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                }
            }], default: []
    }
});

cartSchema.plugin(mongoosePaginate);

cartSchema.pre("findOne", function () {
    this.populate("products.product");
});

mongoose.set("strictQuery", false)

export const cartModel = mongoose.model(cartCollection, cartSchema);