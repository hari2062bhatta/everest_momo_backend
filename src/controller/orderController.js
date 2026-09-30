import Order from "../models/orderModel.js";

export const orderCreate = async (req, res) => {
  const user = req.user._id;
  const { cart, totalAmount, totalQty } = req.body;
  // console.log(cart)
  try {
    const response = await Order.create({
      user,
      orderItem:cart,
      totalAmount,
      totalQty,
    });

    console.log(response)
    res
      .status(201)
      .json({ success: true, message: "order created", data: response });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateStatus=async(req,res)=>{
  const {id}=req.params;

  try{
    const response=await Order.findOneAndUpdate({
      _id:id,
      user:req.user._id
    },{
      paymentStatus:"success"
    },
    {new:true}
  )
  res.status(200).json({success:true,message:"order status changed",data:response})

  }

  catch(err){

  }

}


export const viewOrder=async(req,res)=>{
  try{
    const response=await Order.find({
      user:req.user._id
    })
  
    res.status(200).json({success:true,data:response})

  }
  catch(err){
    res.status(500).json({success:false,message:err.message})
  }
}

export const deleteOrder=async(req,res)=>{

  try{
    const response =await Order.deleteMany({
      user:req.user._id
    })
    res.status(200).json({success:true,message:"all order deleted"})

  }
  catch(err){

  }
}


export const viewAllOrder=async(req,res)=>{
try{

  const response =await Order.find().populate('user')

  res.status(200).json({success:true,data:response})

}
catch(err){

}


}
export const updateDelivary=async(req,res)=>{
  const {id}=req.params
  const {delevaryStatus}=req.body;
  console.log(delevaryStatus)
  try{

    const response =await Order.findOneAndUpdate({
      _id:id},
    { delevaryStatus }
    )
      res.status(200).json({success:true,message:"updated "})
  }
  catch(err){

  }

}
