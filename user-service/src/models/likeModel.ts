import { UserError } from "../utils/errorHandler"
import {prismaClientSingleton} from "../utils/prisma"


export default class LikeModel{
    static async addLike(user_id:number | bigint,api_id:number | bigint){
        try {
            // check if existing api is Liked 
            const existingLike = await prismaClientSingleton.like_entities.findUnique({
                where : {
                    user_id_api_id:{
                        user_id,
                        api_id
                    }
                }
            })

            if(existingLike){
                throw new UserError("this api is already liked !")
            }else{
                await prismaClientSingleton.like_entities.create({
                    data : {
                        user_id,
                        api_id
                    }
                })

                return true
            }


        } catch (error:any) {
            console.log(error.message)
            throw error
        }
    }

    static async dislikeApi(user_id:number | bigint,api_id:number | bigint){
        try {
            await prismaClientSingleton.like_entities.delete({
                where : {
                    user_id_api_id:{
                    user_id,
                    api_id
                }
                }
                
            })
        } catch (error) {
            throw error
        }
    }
}