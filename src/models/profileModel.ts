import { prismaClientSingleton } from '../utils/prismaClient';


export const addProfile = async (data: { userId: number; fullName: string; dateOfbirth: string; }) => {
    const { userId, fullName, dateOfbirth } = data;
    const profile = await prismaClientSingleton.profiles.create({
        data: {
            FullName: fullName,
            DateOfBirth: dateOfbirth,
            UserID: userId
        }
    });
    return profile;
}

export const updateProfile = async (id: number, data: any) => {
    const updatedUser = await prismaClientSingleton.profiles.update({
        where: {
            ProfileID: id
        },
        data: data
    });
    return updatedUser;
}

export const getProfileById = async (id: number) => {
    const profile = await prismaClientSingleton.profiles.findUnique({
        where: {
            ProfileID: id
        }
    });
    return profile;
}

export const getUserProfiles = async (id: number) => {
    const profile = await prismaClientSingleton.profiles.findMany({
        where: {
            UserID: id
        }
    });
    return profile;
}

export const deleteProfile = async (id: number) => {
    const profile = await prismaClientSingleton.profiles.delete({
        where: {
            ProfileID: id
        }
    });
    return profile;
}