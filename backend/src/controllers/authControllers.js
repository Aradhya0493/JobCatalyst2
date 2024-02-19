const User=require("../models/User");
const OTP=require("../models/OTP");
const otpGenerator=require("otp-generator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
require("dotenv").config(); //load the configuration
const mailSender = require("../utils/mailSender");

exports.home=async(req,res)=>{
    try{
        res.status(200).send('Home Page');
    }
    catch(error){
        console.log(error);
    }
}    
exports.signup=async(req,res)=>{
    try{
        //date fetch from request ki body
        const{username,
            email,
            password,confirmPassword,
            otp
        }=req.body
    
    
        //validate data 
        console.log("hello");
        if(!username || !email || !password || !otp
            ){
                return res.status(403).json({
                    success:false,
                    message:"All fields are required",
                })
        }
        //2 password user dalega usko match karlo
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and ConfirmPassowrd values does not match, Please try again",
            })
        }
        //check user already exist or not
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"USER IS ALREADY REGISTERED PLEASE SIGN IN TO CONTINUE",
            })
        }
        //find most recent otp for the user
        //fetch recent most value from the list of data->using sort
        const response=await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log("Recent Otp ",response);
    
        //validate otp
        if(response.length==0){
            //otp not found
            return res.status(400).json({
                success:false,
                message:"OTP NOT FOUND"
            })
        }
        else if(otp!==response[0].otp){
            //otpm does not match
            return res.status(400).json({
                success:false,
                message:"INVALID OTP",
            })
        }

        //hash password
        const hashedPassword=await bcrypt.hash(password,10);
        //entry create in db
    
        const user=await User.create({
            username,
            email,
            password:hashedPassword,
        })
        //return res
        return res.status(200).json({
            success:true,
            user,
            message:"USER IS REGISTERED SUCCESSFULLY",
        });
        
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"USER CAN NOT BE REGISTERED. PLEASE TRY AGAIN",
        })
    }


}



//login
exports.login=async(req,res)=>{
    try{
        //get data from req body
        const {email,password}=req.body;
        //validation data
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"ALL FIELDS ARE REQUIRED, PLEASE TRY AGAIN",
            })
        }
        //user check if not registered
        const user=await User.findOne({email})
        //without populate also it will work
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered, please signup first",
            })
        }
        //generate jwt token after password matching
        if(await bcrypt.compare(password,user.password)){
            //create the tocken using sign method
            const payload={
                email:user.email,
                id:user._id,
            }
            //create jwt tocken using sign
            const token=jwt.sign(payload,process.env.JWT_SECRET_KEY,{
                expiresIn:"2h",
            });
            user.token=token;
            user.password=undefined;

            //create cookie and response send 
            const options={
                expires: new Date(Date.now() + 3*34+60*60*1000), //this mean 3days after 3 cays cookies will get destroyed
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in succesfully",
            })

        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect",
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login Failer, please try again "
        })
    }
}
exports.sendotp = async (req, res) => {
	try {
		const { email } = req.body;

		// Check if user is already present
		// Find user with provided email
		const checkUserPresent = await User.findOne({ email });
		// to be used in case of signup

		// If user found with provided email
		if (checkUserPresent) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is Already Registered`,
			});
		}

		var otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		const result = await OTP.findOne({ otp: otp });
		console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
		}
		const otpPayload = { email, otp };
		const otpBody = await OTP.create(otpPayload);
        console.log("OTP CREATED");
		console.log("OTP Body", otpBody);
		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ success: false, error: error.message });
	}
};

