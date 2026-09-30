import Cart from "../models/cartModels.js";

export const addCart = async (req, res) => {
  const { product_id } = req.body;

  const isAlready = await Cart.findOne({
    product: product_id,
    user: req.user._id,
  });
  if (isAlready) {
    const response = await Cart.updateOne(
      {
        product: product_id,
        user: req.user._id,
      },
      { qty: isAlready.qty + 1 },
    );
    return res.status(200).json({ success: true, message: "item increase" });
  }

  try {
    const response = await Cart.create({
      user: req.user._id,
      product: product_id,
      qty: 1,
    });

    res.status(201).json({
      succees: true,
      message: "item add successfully",
      data: response,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const viewCart = async (req, res) => {
  try {
    const response = await Cart.find({
      user: req.user._id,
    })
      .populate("user")
      .populate("product");
    res.status(200).json({ success: true, data: response });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const incrementCart = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await Cart.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $inc: { qty: 1 } },
      { new: true },
    );

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: response,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const decrementCart = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user._id;

  try {
    const response = await Cart.findOneAndUpdate(
      {
        _id: id,
        user: user_id,
        qty: { $gt: 1 },
      },
      { $inc: { qty: -1 } },
      { new: true }
    );

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found or quantity is already 1",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart quantity decreased",
      cart: response,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const removeCart = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await Cart.findOneAndDelete({ _id: id });

    res
      .status(200)
      .json({ success: true, message: "product remove form cart" });
  } catch (err) {
    res.status(500).json({ success: true, message: err.message });
  }
};

export const deleteAllCart=async(req,res)=>{

      try{
        const response=await Cart.deleteMany({
          user:req.user._id
        })
          res.status(200).json({success:true,message:"all cart removed"})
      }
      catch(err){


      }

}
