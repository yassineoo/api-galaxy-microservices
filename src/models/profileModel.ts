import { prismaClientSingleton } from '../utils/prismaClient';

type ProfileCreation = {
    FullName: string;
    DateOfBirth: string;
    ProfilePicture?: string;
    Location?: string;
}

type ProfileUpdate = {
    FullName?: string;
    DateOfBirth?: Date;
    ProfilePicture?: string;
    Location?: string;
}



export default class profileModel {

    static addProfile = async (userid : number ,data : ProfileCreation) => {;
        const profile = await prismaClientSingleton.profiles.create({
            data: {
                FullName: data.FullName,
                DateOfBirth: new Date(data.DateOfBirth),
                users: {
                    connect: { UserID: userid }
                },
                ProfilePicture: data.ProfilePicture,
                Location: data.Location
            }
        });
        return profile;
    }

    static updateProfile = async (id: number, data: ProfileUpdate) => {
        const updatedUser = await prismaClientSingleton.profiles.update({
            where: {
                ProfileID: id
            },
            data: data
        });
        return updatedUser;
    }

    static getProfileById = async (id: number) => {
        const profile = await prismaClientSingleton.profiles.findUnique({
            where: {
                ProfileID: id
            }
        });
        return profile;
    }

    static getUserProfiles = async (id: number) => {
        const profile = await prismaClientSingleton.profiles.findMany({
            where: {
                UserID: id
            }
        });
        return profile;
    }

    static deleteProfile = async (id: number) => {
        const profile = await prismaClientSingleton.profiles.delete({
            where: {
                ProfileID: id
            }
        });
        return profile;
    }

}