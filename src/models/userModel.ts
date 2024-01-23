import { prismaClientSingleton } from '../utils/prismaClient';
const currentDate: Date = new Date();


export const AddUser = async (data: { Username: string; Email: string; PasswordHash: string; }) => {
    const { Username, Email, PasswordHash } = data;
    const user = await prismaClientSingleton.users.create({
        data: {
            Username: Username,
            Email: Email,
            PasswordHash: PasswordHash,
            DateCreated: currentDate.toISOString(),
            LastLogin: currentDate.toISOString(),
            IsActive: true
        }
    });
    return user;
}

export const UpdateUser = async (id: number, data: any) => {
    const updatedUser = await prismaClientSingleton.users.update({
        where: {
            UserID: id
        },
        data: data
    });
    return updatedUser;
}


export const getUserById = async (id: number) => {
    const user = await prismaClientSingleton.users.findUnique({
        where: {
            UserID: id
        }
    });
    return user;
}

export const getUserByEmail = async (email: string) => {
    if (!email) {
        throw new Error("Email parameter is undefined");
    }
    const user = await prismaClientSingleton.users.findUnique({
        where: {
            Email: email
        }
    });
    return user;
}



export const setActivatedAccount = async (id: number, status: boolean) => {
    const user = await prismaClientSingleton.users.update({
        where: {
            UserID: id
        },
        data: {
            IsActive: status
        }
    });
    return user;
}

export const setTwoFactor = async (id: number, status: boolean) => {
    const user = await prismaClientSingleton.users.update({
        where: {
            UserID: id
        },
        data: {
            IsTwoFactor: status
        }
    });
    return user;
}

export const setLastLogin = async (id: number) => {
    const user = await prismaClientSingleton.users.update({
        where: {
            UserID: id
        },
        data: {
            LastLogin: currentDate.toDateString()
        }
    });
    return user;
}

export const deleteUser = async (id: number) => {

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

export const getHashedPassword = async (id: number) => {
    const user = await prismaClientSingleton.users.findUnique({
        where: {
            UserID: id
        },
        select: {
            PasswordHash: true
        }
    });
    return user ? user.PasswordHash : null;
}




