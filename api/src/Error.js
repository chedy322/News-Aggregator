const express=require('express')

class AppError extends Error{
    constructor(StatusCode,message){
        super(message);
        this.StatusCode = StatusCode;
    }
}

module.exports=AppError;
