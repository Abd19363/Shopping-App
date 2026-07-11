const pool = require("../config/db")

const getProducts = async(req, res) =>{
    try{
        const result= await pool.query(
            `select * from products order by id`
        );

        res.status(200).json({
            success: true,
            products: result.rows
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

module.exports ={
    getProducts
};