import express from "express"
import { getAdminSettings, getInactiveAPIS, publishAnAPI, updateEarningPercentage,updatePrivacyAndPolicy,updateTermsAndConditions } from "../../controllers/admin/adminService"

export const adminRouter=express.Router()
adminRouter.get("/settings",getAdminSettings)
adminRouter.put("/updateEarningPercentage",updateEarningPercentage)
adminRouter.put("/updateTerms&Conditions",updateTermsAndConditions)
adminRouter.put("/updatePrivacy&Policy",updatePrivacyAndPolicy)
adminRouter.post("/publish-api",publishAnAPI)
adminRouter.get("/getInactiveAPIS",getInactiveAPIS)
