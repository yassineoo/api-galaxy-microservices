import { prismaClientSingleton } from '../utils/prismaClient';
const currentDate: Date = new Date();

export default class userModel {
    static AddUser = async (data: { Username: string; Email: string; PasswordHash: string; role:string}) => {
        try {
            const { Username, Email, PasswordHash } = data;
            const user = await prismaClientSingleton.users.create({
                data: {
                    Username: Username,
                    Email: Email,
                    PasswordHash: PasswordHash,
                    DateCreated: currentDate.toISOString(),
                    LastLogin: currentDate.toISOString(),
                    IsActive: true,
                    role: data.role
                }
            });
            return user;
        } catch (error) {
            console.error("Error in AddUser:", error);
            throw error;
        }
    }

    static updateUser = async (id: number, data: any) => {
        try {
            const updatedUser = await prismaClientSingleton.users.update({
                where: {
                    UserID: id
                },
                data: data
            });
            return updatedUser;
        } catch (error) {
            console.error("Error in updateUser:", error);
            throw error;
        }
    }
    
    static getUserById = async (id: number) => {
        try {
            const user = await prismaClientSingleton.users.findUnique({
                where: {
                    UserID: id
                }
            });
            if (!user) {
                console.log("No data found for getUserById");
            }
            return user;
        } catch (error) {
            console.error("Error in getUserById:", error);
            throw error;
        }
    }

    static getUserByEmail = async (email: string) => {
        try {
            if (!email) {
                throw new Error("Email parameter is undefined");
            }
            const user = await prismaClientSingleton.users.findUnique({
                where: {
                    Email: email
                }
            });
            if (!user) {
                console.log("No data found for getUserByEmail");
            }
            return user;
        } catch (error) {
            console.error("Error in getUserByEmail:", error);
            throw error;
        }
    }
    
    static getAllUsers = async () => {   
        try {
            const users = await prismaClientSingleton.users.findMany();
            if (users.length === 0) {
                console.log("No data found for getAllUsers");
            }
            return users;
        } catch (error) {
            console.error("Error in getAllUsers:", error);
            throw error;
        }
    }

    static deleteUser = async (id: number) => {
        try {
            const transaction = await prismaClientSingleton.$transaction(async (prisma) => {
                await prisma.profiles.deleteMany({ where: { UserID: id } });
                await prisma.users.delete({ where: { UserID: id } });
            });
            return transaction;
        } catch (error) {
            console.error("Error in deleteUser transaction:", error);
            throw error;
        }
    }

    

    static setActivatedAccount = async (id: number, status: boolean) => {
        try {
            const user = await prismaClientSingleton.users.update({
                where: {
                    UserID: id
                },
                data: {
                    IsActive: status
                }
            });
            return user;
        } catch (error) {
            console.error("Error in setActivatedAccount:", error);
            throw error;
        }
    }
    
    static setTwoFactor = async (id: number, status: boolean) => {
        try {
            const user = await prismaClientSingleton.users.update({
                where: {
                    UserID: id
                },
                data: {
                    IsTwoFactor: status
                }
            });
            return user;
        } catch (error) {
            console.error("Error in setTwoFactor:", error);
            throw error;
        }
    }
    
    static setLastLogin = async (id: number) => {
        try {
            const user = await prismaClientSingleton.users.update({
                where: {
                    UserID: id
                },
                data: {
                    LastLogin: currentDate.toISOString()
                }
            });
            return user;
        } catch (error) {
            console.error("Error in setLastLogin:", error);
            throw error;
        }
    }
   
    static getHashedPassword = async (id: number) => {
        try {
            const user = await prismaClientSingleton.users.findUnique({
                where: {
                    UserID: id
                },
                select: {
                    PasswordHash: true
                }
            });
            if (!user) {
                console.log("No data found for getHashedPassword");
                throw new Error("No data found");
            }
            return user ? user.PasswordHash : null;
        } catch (error) {
            console.error("Error in getHashedPassword:", error);
            throw error;
        }
    }
}
