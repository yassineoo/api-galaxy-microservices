import {Request,Response,NextFunction} from "express"
import { SystemError, UserError } from "../utils/errorHandler"
import apiService from "../services/apiService"
export const likeApi=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {user_id}=req.body
        const {api_id} = req.params
        console.log(user_id,api_id)
        if(!api_id || !user_id){
            throw new SystemError("something went wrong !")
        }
        const response = await apiService.likeAPI(user_id,Number(api_id))
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}


export const dislikeApi=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {api_id}=req.params
        const {user_id}=req.body
        if(!user_id || !api_id){
            throw new SystemError("something went wrong")
        }

        const response = await apiService.dislikeAPI(user_id,Number(api_id))
        res.status(200).json(response)
    } catch (error) {
        throw error
    }
}


export const getAllApis = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {page, limit, filter, search } = req.query;
        const  {userId} = req.params
        //console.log(req.query)
       // console.log(userId)
        if(!userId){
            throw new UserError("missing user Id")
        }
        const response = await apiService.getAllApis(Number(userId),limit,page,search)
        //console.log(response)
        return res.status(200).send(response)
    } catch (error:any) {
        console.log(error.message)
        next(error)
    }
}

export const getAPIReview=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {apiId} = req.params
        if(!apiId){
            throw new UserError("missing api ID !")
        }

        const reviews = await apiService.getApiReview(Number(apiId))
        res.status(200).send(reviews)
    } catch (error:any) {
        console.log(error.message)
        next(error)
    }
}

export const createReview=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {apiId}=req.params
        const {rating,comment,userId} = req.body
        if(!apiId || !userId || !comment){
            throw new UserError("something went wrong !")
        }

        await apiService.addReview(userId,Number(apiId),{rating,comment})
        res.status(201).send(true)
    } catch (error:any) {
        console.log(error.message)
        next(error)
    }
}

export const getAPIRating = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {apiId} = req.params
        if(!apiId)
        {
            throw new UserError("something went wrong")
        }
        const response = await apiService.getAPIRating(Number(apiId))
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

export const getAPISforAdmin = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {adminId}=req.params
        const {page,limit,search} = req.query
        if(!adminId){
            throw new SystemError("something went wrong")
        }
        const apis = await apiService.getApisFoAdmin(Number(adminId),page,limit,search)
        res.status(200).send(apis)
    } catch (error:any) {
        console.log(error.message)
        next(error)
    }
}


export const getUserApis= async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {userId} = req.params
        if(!userId){
            throw new SystemError("something went wrong")
        }

        const apis = await apiService.getUserAPIS(Number(userId))
        res.status(200).send(apis)
    } catch (error) {
        next(error)
    }
}

export const getUserFollowingsApis= async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {userId} = req.params
        if(!userId){
            throw new SystemError("something went wrong")
        }

        const apis = await apiService.getUserFollowingsApis(Number(userId))
        res.status(200).send(apis)
    } catch (error) {
        next(error)
    }
}

export const reportAnAPI=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {apiId}=req.params
        const {description,screenshots,userId}=req.body
        if(!description || !apiId || !userId ){
            throw new SystemError("missing information")
        }

        await apiService.reportAnAPI({description,screenshotsUrls:screenshots},Number(apiId),userId)
        res.status(201).send(true)
    } catch (error) {
        next(error)
    }
}


export const reportAnComment = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {commentId} = req.params
        const {description,reason,userId}=req.body
        if(!commentId || !reason || !userId){
            throw new SystemError("missing information")
        }
        await apiService.reportAnComment(reason,description,userId,Number(commentId))
        res.status(201).send(true)
    } catch (error) {
        next(error)
    }
}


export const getReportsForAdmin=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {limit,page,search}=req.query
        const reports = await apiService.getReports(Number(limit),Number(page),search)
        res.status(200).send(reports)
    } catch (error:any) {
        console.log(error.message)
        next(error)
    }
}

export const getReviwesReports=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {limit,page,search}=req.query
        const reports = await apiService.getReviewsReports(Number(limit),Number(page),search)
        res.status(200).send(reports)
    } catch (error:any) {
        next(error)
    }
}

export const deleteReportReview=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {reportId}= req.params
        console.log(reportId)
        await apiService.deleteReportReview(Number(reportId))
        res.status(200).send(true)
    } catch (error:any) {
        console.log(error.message)
        next(error)
    }
}