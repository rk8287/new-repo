const ErrorHandlers = require('../utils/errorhander');

module.exports = (err,req,res,next)=>{

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error"


    //MongoDb cast Error

    if(err.name ===  "CastError"){
        const message = `Resource not found ${err.path}`;

        err = new ErrorHandlers(message,400);
    }

    res.status(err.statusCode).json({
        success:false,
        message :err.message
    })
}
