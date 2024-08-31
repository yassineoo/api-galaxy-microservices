import { z } from "zod";
import { durationValidator, idValidator } from "../_common";


const getEndpointsErrorCallsQueryValidator = z.object({
    duration: durationValidator
})
const getEndpointsErrorCallsBodyValidator = z.object({
    endpoint_ids: z.array(idValidator)
})

const getEndpointsErrorCallsValidator = {
    body: getEndpointsErrorCallsBodyValidator,
    query: getEndpointsErrorCallsQueryValidator
}

export default getEndpointsErrorCallsValidator

