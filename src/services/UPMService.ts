import profileModel from "../models/profileModel"


export default class UPMService {
    static addProfile = (data: { userId: number; fullName: string; dateOfbirth: string; }) => {
        const { userId, fullName, dateOfbirth } = data;
        const profile = profileModel.addProfile(
            userId
            , {
                FullName: fullName,
                DateOfBirth: dateOfbirth
            });
        return profile;
    }

    static getProfileByUserId = (id: number) => {

        if (!Number.isInteger(id)) {
            throw new Error("ID must be an integer");
        }
        //get profile by user id
        const profile = profileModel.getProfileById(id);
        return profile;

    }
    static getProfileById = (id: number) => {
        if (!Number.isInteger(id)) {
            throw new Error("ID must be an integer");
        }
        //get profile by id
        const profiles = profileModel.getUserProfiles(id);
        return profiles;
    }

    static updateProfile = (id: number, data: any) => { }
    static deleteProfile = (id: number) => { }
}