const pool = require("../config/db");

const bcrypt= require("bcrypt");

const registerUser =async (req, res) => {
     console.log(req.body);
   try {

     const {username, email, password, full_name, phone}= req.body;
     const hashedPassword =await bcrypt.hash(password, 10);

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

     const result = await pool.query(
        `Insert into users (full_name, username, email, phone_no, password )
         values ($1, $2, $3, $4, $5)
         returning *`,
         [full_name, username, email, phone, hashedPassword]
     );

     res.status(201).json({
        success: true,
        message: "User Registered Successfully",
        user: result.rows[0]
     });
   } 
   catch(error){
       console.error(error);
       res.status(500).json({
           success: false,
           message: "Server Error"
       });
    }

};

const loginUser = async (req, res) => {

    try{

        const { username, password } = req.body;

        // console.log(req.body);
        // console.log(username);
        // console.log(hashedPassword);

        const result = await pool.query(

            "SELECT * FROM users WHERE LOWER(username)=LOWER($1)",
            [username]

        );
        // console.log(result.rows);

        if(result.rows.length===0){

            return res.status(404).json({

                success:false,
                message:"User not found"

            });

        }

        const user=result.rows[0];
        const passwordMatch=await bcrypt.compare(
            password,
            user.password
        );

        if(!passwordMatch){

            return res.status(401).json({

                success:false,
                message:"Incorrect Password"

            });

        }

        const {password: _, ...userWithoutPassword }=user

        res.status(200).json({

            success:true,
            message:"Login Successful",
            user:userWithoutPassword
        });

    }

    catch(error){

    console.error("LOGIN ERROR:", error);

    res.status(500).json({

        success:false,
        message:error.message

    });

}

};

module.exports={
    registerUser,
    loginUser
};