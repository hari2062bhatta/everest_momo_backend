import Product from "../models/productModels.js";

export const productCreate = async (req, res) => {
  // todo
  // collect the data
  // check the data , is empty or not
  // console.log(req.body);
  // console.log(req.file.filename);
  // res.json(req.body);
  // console.log(req.files.filename)
   console.log(req.body)
  let { p_name, p_price, p_rating, p_description,p_category } = req.body;

  if (
    !p_name.trim() ||
    !p_price ||
    !p_rating ||
    !p_description.trim()||
    !p_category
  ) {
    res.status(400).json({
      success: false,
      message: "all field are required",
    });
  }
  try {
    const response = await Product.create({
      p_name,
      p_price,
      p_rating,
      p_description,
      p_category,
      p_img:req.file.filename,
    });
    res
      .status(201)
      .json({ success: true, message: "product created", data: response });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const productView = async (req, res) => {
  // todo
  // - first find the data or query in the databse
  // - check the data , is there empty array or data
  try {
    const response = await Product.find();

    if (response) {
      res.status(200).json({
        success: true,
        data: response,
      });
    } else {
      res.status(500).json({ success: false, message: "some server error " });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const productDelete = async (req, res) => {
  // todo
  // get id from params
  //check either id exist or not
  //if id exist then delete if not donot do anything

  const { id } = req.params;
  let isExist = await Product.findById(id);

  if (isExist) {
    try {
      const response = await Product.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: response });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "given id is not found ",
    });
  }
};

export const productUpdate = async (req, res) => {
  // todo
  // get id from params
  //check either id exist or not
  //if id exist then update if not donot do anything

  const { id } = req.params;
  let isExist = await Product.findById(id);

  if (isExist) {
    try {
      const response = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json({
        success: true,
        message: "product update successfully",
        data: response,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  } else {
    res.status(400).json({ success: false, message: "id not found " });
  }
};

export const productFilter=async(req,res)=>{
const category=req.query.category
    console.log(req.query.category)
      if(["veg","chicken","buff"].includes((category).toLowerCase()||category.toUpperCase())){

        try{
          const response=await Product.find({
            p_category:category.toLowerCase(),
          })
          res.status(200).json({success:true,data:response})

        }
        catch(err){
              res.status(500).json({success:false,messaage:err.messaage})
        }
      }
      else{
        res.status(400).json({success:false,message:"invalid categories"})
      }

}
