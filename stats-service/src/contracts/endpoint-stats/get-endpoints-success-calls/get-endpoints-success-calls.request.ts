import { z } from "zod";
import { durationValidator, idValidator } from "../_common";


const getEndpointsSuccessCallsQueryValidator = z.object({
    duration: durationValidator
})
const getEndpointsSuccessCallsBodyValidator = z.object({
    endpoint_ids: z.array(idValidator)
})

const getEndpointsSuccessCallsValidator = {
    body: getEndpointsSuccessCallsBodyValidator,
    query: getEndpointsSuccessCallsQueryValidator
}

export default getEndpointsSuccessCallsValidator