import { prismaClientSingleton } from "../utils/prisma"

export default class SettingsModel{
    static async updateTermsAndConditions(tC:string,adminId:number){
        try {
            // fetch last update
            const lastUpdate = await prismaClientSingleton.settings_entities.findFirst({
                orderBy:{
                    updated_at:"desc"
                }
            })

            await prismaClientSingleton.settings_entities.create({
                data : {
                    termsAndConditions:tC,
                    privacyAndPolicy:lastUpdate?.privacyAndPolicy,
                    earning_percentage:lastUpdate?.earning_percentage,
                    user_entities:{
                        connect:{
                            id:adminId
                        }
                    }
                }
            })

        return true
        } catch (error) {
            throw error
        }
    }


    // update policy and privacy 
    static async updatePolicyAndPrivacy(pap:string,adminId:number){
        try {
            // fetch last setting 
            const lastSetting = await prismaClientSingleton.settings_entities.findFirst({
                orderBy:{
                    updated_at:"desc"
                }
            })

            // create a new settings 
            await prismaClientSingleton.settings_entities.create({
                data : {
                    privacyAndPolicy:pap,
                    termsAndConditions:lastSetting?.termsAndConditions,
                    earning_percentage:lastSetting?.earning_percentage,
                    user_entities:{
                        connect:{
                            id : adminId
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