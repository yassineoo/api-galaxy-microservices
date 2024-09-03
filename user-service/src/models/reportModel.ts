import {prismaClientSingleton} from "../utils/prisma"
import {Report} from "../types/report"
export default class ReportModel{
    static async addReport(report:Report,user_id:number,api_id:number){
        try {
            await prismaClientSingleton.api_report_entities.create({
                data:{
                    description:report.description,
                    screenshots:report.screenshotsUrls,
                    api_entities:{
                        connect:{
                            id: api_id
                        }
                    },
                    user_entities:{
                        connect : {
                            id:user_id
                        }
                    }
                }
            })
            return true
        } catch (error) {
            throw error
        }
    }

    static async getReports(limit:number,page:number,search:string=""){
        try {
            console.log(limit,page)
            const whereConditions = {} as any 
            if(search){
                whereConditions.description=
                {
                            contains:search,
                            mode:"insensitive"
                        
                    }
                
            }
            const reports = await prismaClientSingleton.api_report_entities.findMany({
                where : whereConditions,
                include:{
                    api_entities:{
                        select : {
                            name: true
                        }
                    }
                },
                skip:(page - 1) * limit,
                take:limit
            })

            const flattenedReport = reports.map((report : any)=> flattenObject(report))
            const finalReports= JSON.stringify(flattenedReport,(key,value)=>
                typeof(value) == "bigint" ? value.toString() : value
            )
            return finalReports
        } catch (error) {
            throw error
        }
    }


    static async getReviewReports(limit:number,page:number,search:string=""){
        try {

            const whereConditions={} as any
            if(search){
                whereConditions.OR=[
                    {
                        reason : {
                        contains: search,
                        mode:"insensitive"
                    }
                },
                    {description : {
                        contains: search,
                        mode:"insensitive"
                    }}
                ]
            }

            const reportReviews = await prismaClientSingleton.review_reports_entities.findMany({
                where : whereConditions,
                include : {
                    api_review_entities: {
                        select:{
                            comment: true,
                            user_entities:{
                                select:{
                                    username: true
                                }
                            }
                        }
                    }
                },
                skip:(page - 1) * limit,
                take:limit
            })

            const flattenedReport = reportReviews.map((report:any)=>flattenObject(report))
            const jsonString = JSON.stringify(flattenedReport,(key,value)=>
                typeof(value) == "bigint" ? value.toString() : value
            )
            return jsonString
        } catch (error) {
            throw error
        }
    }

    static async deleteReviewReport(id:number){
        try {
            const isDeleted = await prismaClientSingleton.review_reports_entities.delete({
                where : {
                    id:id
                }
            })
            return true
        } catch (error) {
            throw error
        }
    }
}


function flattenObject(obj:any, res : any = {}) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                flattenObject(obj[key], res);
            } else {
                res[key] = obj[key];
            }
        }
    }
    return res;
}