import { profile } from "console";
import profileModel from "../models/profileModel"


/**
 * UPMService class provides methods for managing user profiles.
 */
export default class UPMService {
    /**
     * Adds a new profile for a user.
     * @param data - The data for the new profile.
     * @returns The newly created profile.
     */
    static addProfile = (data: { userId: number; fullName: string; dateOfbirth: string; }) => {
        const { userId, fullName, dateOfbirth } = data;

        if (!Number.isInteger(userId)) {
            throw new Error("User ID must be an integer");
        }

        const profile = profileModel.addProfile(userId, {
            FullName: fullName,
            DateOfBirth: dateOfbirth
        });

        return profile;
    }

    /**
 * Retrieves a profile by profile ID.
 * @param id - The ID of the profile.
 * @returns The profile with the specified ID.
 * @throws Error if the ID is not an integer.
 */
    static getProfileById = (id: number) => {
        if (!Number.isInteger(id)) {
            throw new Error("ID must be an integer");
        }

        const profile = profileModel.getProfileById(id);

       

        return profile;
    }

    /**
     * Retrieves a profile by user ID.
     * @param id - The ID of the user.
     * @returns The profile associated with the user ID.
     * @throws Error if the ID is not an integer.
     */
    static getProfilesByUserId = (id: number) => {
        if (!Number.isInteger(id)) {
            throw new Error("ID must be an integer");
        }

        const profile = profileModel.getUserProfiles(id);

        return profile;
    }

    /**
     * Retrieves all profiles.
     * @returns {Array<Profile>} An array of profiles.
     */
    static getAllProfiles = () => {
        const profiles = profileModel.getAllProfiles();
        return profiles;
    }



    /**
     * Updates a profile by profile ID.
     * @param id - The ID of the profile.
     * @param data - The updated data for the profile.
     * @returns The updated profile.
     * @throws Error if the ID is not an integer.
     */
    static updateProfileById = (id: number, data: any) => {
        if (!Number.isInteger(id)) {
            throw new Error("ID must be an integer");
        }
        const profile = profileModel.updateProfile(id, data);
        return profile;
    }


    /**
     * Deletes a profile by profile ID.
     * @param id - The ID of the profile to delete.
     */
    static deleteProfileById = (id: number) => {
        if (!Number.isInteger(id)) {
            throw new Error("ID must be an integer");
        }

        profileModel.deleteProfile(id);
    }

    /**
     * Deletes a profile by user ID.
     * @param id - The ID of the user.
     */
    static deleteAllUserProfiles = async (id: number) => {
        if (!Number.isInteger(id)) {
            throw new Error("ID must be an integer");
        }
        profileModel.deleteAllUserProfiles(id);

    }
}