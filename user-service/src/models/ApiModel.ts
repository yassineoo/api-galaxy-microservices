import {prismaClientSingleton} from "../utils/prisma"
import {api_entities,like_entities} from "@prisma/client"



export default class APIModel {
    static async getAPIS(userId:number,limit:string="10",page:string="1",search:string=""){
       // Convert page and limit to integers
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
     // console.log(userId)
    // Build the filtering and search conditions
    const whereConditions = {} as any;

    if (search) {
        whereConditions.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ];
    }
        try {
            const apis = await prismaClientSingleton.api_entities.findMany({
              where:whereConditions,
                include: {
                  user_likes: {
                    where: {
                      user_id : userId
                    },
                    select: {
                      user_id: true,
                    },
                  },
                },
                skip: (pageInt - 1) * limitInt,
      take: limitInt,
              });
          
              // Map products to include the isLiked field
              const finalApis = apis.map((api) => {
                let newAPI = {
                  ...api,
                  category_id : Number(api.category_id),
                  provider_id : Number(api.provider_id),
                  id : Number(api.id)
                }
                //console.log(newAPI)
                /*delete (newAPI as any).id;
                Object.assign(newAPI,{
                  api_id : Number(api.id)
                })*/
                return {
                  ...newAPI,
                  isLiked: api.user_likes.length > 0,
                }
              });
             // console.log(finalApis)
          const jsonString = JSON.stringify(finalApis,(key,value)=>
            typeof value == "bigint" ? value.toString() : value  
          )
          //console.log(jsonString)
              return jsonString
        } catch (error:any) {
          //console.log(error.message)
            throw error
        }
    }

    static async getAPIRating(api_id:number){
      try {
        const  apiRating = await prismaClientSingleton.api_entities.findUnique({
          where : {
            id : api_id
          },
          select:{
            rating:true
          }
        })
        return apiRating
      } catch (error) {
        throw error
      }
    }

    static async getAPIListForAdmin(admin_id:number,page:any,limit:any,search:any){
      try {
        const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
     // console.log(userId)
    // Build the filtering and search conditions
    const whereConditions = {} as any;

    if (search) {
        whereConditions.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ];
    }
        const apis = await prismaClientSingleton.user_entities.findUnique({
          where : {
            id: admin_id
          },
          select : {
            api_entities:{
              where : whereConditions,
              skip: (pageInt - 1) * limitInt,
              take: limitInt,
            }
          }
        })
        const jsonString = JSON.stringify(apis?.api_entities,(key,value)=>
          typeof value == "bigint" ? value.toString() : value  
        )
        //console.log(jsonString)
            return jsonString
      } catch (error) {
        throw error
      }
    }

    static async getAPISForUser(user_id:number){
      try {
        const apis = await prismaClientSingleton.user_entities.findUnique({
          where : {
            id: user_id
          },
          select : {
            api_entities: true
          }
        })
        const jsonString = JSON.stringify(apis?.api_entities,(key,value)=>
          typeof value == "bigint" ? value.toString() : value  
        )
        //console.log(jsonString)
            return jsonString
      } catch (error) {
        throw error
      }
    }

    static async getUserFollowingApis(user_id:number){
      try {
        const followingApis = await prismaClientSingleton.user_entities.findUnique({
          where : {
            id : user_id
          },
          select:{
            likes: {
              select : {
                api:true
              }
            }
          }
        })
        const finalFollowings = JSON.stringify(followingApis?.likes,(key,value)=>
          typeof value == "bigint" ? value.toString() : value  
        )
        //console.log(jsonString)
            return finalFollowings
      } catch (error) {
        throw error
      }
    }
}
