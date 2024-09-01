import { ZodError } from "zod";

type FormattedErrors = Record<string, string>;

export default function formatZodErrorsToList(error: ZodError): string[] {
    return error.errors.map(err => {
        // Join path parts to get the field name
        const field = err.path.join('.');
        return `${field}: ${err.message}`;
    });
}