import {Review} from "../types/reviews"
import { prismaClientSingleton } from "../utils/prisma"



export default class ReviewModel {
    static async getApiReview(api_id:number){
        console.log(api_id)
        try {
            let reviews = await prismaClientSingleton.api_entities.findUnique({
                where : {
                    id : api_id
                },
                include: {
                    api_review_entities: {
                        include:{
                            user_entities:true
                        }
                    }
                }
            })

            if(!reviews?.api_review_entities.length){
                return []
            }
            reviews.api_review_entities.map((rev:any) => {
                if(rev.user_entities){
                    rev.name = rev.user_entities.username
                    rev.imagePath = rev.user_entities.image
                    delete rev.user_entities
                }
            })
            const jsonString = JSON.stringify(reviews.api_review_entities,(key,value)=>
                typeof value == "bigint" ? value.toString() : value  
              )
            return jsonString
        } catch (error) {
            throw error
        }
    }

    static async addReview(user_id:number,api_id:number,review:Review){
        try {
            console.log(user_id,api_id,review)
            await prismaClientSingleton.api_review_entities.create({
                data:{
                    comment:review.comment,
                    rating:review.rating,
                    user_entities:{
                        connect:{
                            id : user_id
                        }
                    },
                    api_entities:{
                        connect : {
                            id : api_id
                        }
                    }
                }
            })
            // get new Rating 
            const newRating = await prismaClientSingleton.api_review_entities.aggregate({
                where : {
                    api_id
                },
                _avg: {
                    rating : true
                }
            })

            // update api entity 
            await prismaClientSingleton.api_entities.update({
                where : {
                    id : api_id
                },
                data :{
                    rating:newRating._avg.rating
                }
            })
            return true
        } catch (error) {
            throw error
        }
    }

    static async reportAnComment(commentId : number,user_id : number,reason:string,description:string){
        try {
            const succes = await prismaClientSingleton.review_reports_entities.create({
                data : {
                    description,
                    reason,
                    user_entities:{
                        connect:{
                            id : user_id
                        }
                    },
                    api_review_entities:{
                        connect:{
                            id : commentId
                        }
                    }
                }
            })

            return true
        } catch (error) {
            throw error
        }
    }
}