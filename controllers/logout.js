

async function logout(req , res){

    try {

        const cookieOptions = {
            httpOnly: true,
            secure: true
        }

        return res.cookie('token','',cookieOptions).status(200).json({
            message: "Session out",
            success: true
        })
        
    }catch (err) {
       return res.status(500).json({
            message: err.message || err,
            err: true
        }) 
    }
}

module.exports = logout;