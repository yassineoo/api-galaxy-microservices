export default async function TryCatch<T>(cb: Function): Promise<T> {
    try {
        return await cb();
    } catch (error) {
        console.error("Error in isUserExist:", error);
        if (error instanceof Error) throw error
        if (typeof error === 'string') throw new Error(error)
        if (error && typeof error === "object" && "message" in error && typeof error.message === "string") throw new Error(error.message)
        throw new Error("Internal Server Error")
    }
}