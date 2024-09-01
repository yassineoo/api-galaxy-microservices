import { prismaClientSingleton } from "../utils/prismaClient";
export default class userVerification {
    static async addVerification(userId:number,OTP:string){
        try {
            const userverification = await prismaClientSingleton.userVerification_entities.create({
                data:{
                    otp:OTP,
                    expired : new Date(Date.now() + 5*60*1000),
                user_entities:{
                        connect:{
                            id:userId
                        }
                    }
                },
            })
            if(!userverification){
                throw Error("Server error occured")
            }
            return true
        } catch (error) {
            throw error
        }
    }   

    static async getUserVerification(userId:number){
        try {
            const verification = await prismaClientSingleton.userVerification_entities.findFirst({
                where:{
                    user_entities:{
                        id:userId
                    }
                },
                orderBy:{
                    expired:"desc"
                }
            })
            console.log(verification)
            if(verification){
                return verification
            }
            return null
        } catch (error:any) {
            return {
                error:true,
                message:error?.message
            }
        }
    }
    static async deleteUserVerification(userId:number){
        try {
            const deleteuserverification = await prismaClientSingleton.userVerification_entities.deleteMany({
                where:{
                    user_entities:{
                        id : userId
                    }
                }
            })
           
            if(!deleteuserverification){
                throw Error("delete OTP is impossible")
            }
        } catch (error:any) {
            return {
                error:true,
                message: error.message
            }            
        }
    }

}