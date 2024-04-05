require('express-async-errors')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')
const Job = require('../models/Job')

const getAllJobs = async(req, res)=>{
    //filtering out the jobs created by the particular user.
    const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs, count: jobs.length})
}

const createJob = async(req, res)=>{
    req.body.createdBy = req.user.userId // adding job poster info to the body to finally drop in the db.
    const job = await Job.create(req.body)// all the extra info given in the req body will filtered with JobSchema.
    res.status(StatusCodes.CREATED).json({job})
}

const getJob = async(req, res)=>{
    const {user:{userId}, params:{id:jobId}} = req
    const job = await Job.findOne({_id:jobId, createdBy:userId})
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}

const updateJob = async(req, res)=>{
    const {user:{userId},
     params:{id:jobId},
    body:{company, position}
     }= req

     if(company === '' || position === ''){
        throw new BadRequestError('Enter values!')
     }
    const job = await Job.findByIdAndUpdate({_id:jobId, createdBy:userId}, req.body, 
        {new:true, runValidators:true})
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}

const deleteJob = async(req, res)=>{
    const {user:{userId},
    params:{id:jobId},
    } = req

    const job = await Job.findByIdAndRemove({_id:jobId, createdBy:userId})
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({msg:'job successfully deleted'})
}

module.exports = {
    getAllJobs,
    createJob,
    getJob,
    updateJob,
    deleteJob
}
