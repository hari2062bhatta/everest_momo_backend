

const isAdmin=(req,res,next)=>{

      if(req.user.role=="admin"){
        next();
      }
      else{
        res.status(403).json({success:false,message:"donot have permission"})
      }
}

export default isAdmin;