"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const profileModel_1 = __importDefault(require("../models/profileModel"));
/**
 * UPMService class provides methods for managing user profiles.
 */
class UPMService {
}
_a = UPMService;
/**
 * Adds a new profile for a user.
 * @param data - The data for the new profile.
 * @returns The newly created profile.
 */
UPMService.addProfile = (data) => {
    const { userId, fullName, dateOfbirth } = data;
    if (!Number.isInteger(userId)) {
        throw new Error("User ID must be an integer");
    }
    const profile = profileModel_1.default.addProfile(userId, {
        FullName: fullName,
        DateOfBirth: dateOfbirth
    });
    return profile;
};
/**
* Retrieves a profile by profile ID.
* @param id - The ID of the profile.
* @returns The profile with the specified ID.
* @throws Error if the ID is not an integer.
*/
UPMService.getProfileById = (id) => {
    if (!Number.isInteger(id)) {
        throw new Error("ID must be an integer");
    }
    const profile = profileModel_1.default.getProfileById(id);
    return profile;
};
/**
 * Retrieves a profile by user ID.
 * @param id - The ID of the user.
 * @returns The profile associated with the user ID.
 * @throws Error if the ID is not an integer.
 */
UPMService.getProfilesByUserId = (id) => {
    if (!Number.isInteger(id)) {
        throw new Error("ID must be an integer");
    }
    const profile = profileModel_1.default.getUserProfiles(id);
    return profile;
};
/**
 * Retrieves all profiles.
 * @returns {Array<Profile>} An array of profiles.
 */
UPMService.getAllProfiles = () => {
    const profiles = profileModel_1.default.getAllProfiles();
    return profiles;
};
/**
 * Updates a profile by profile ID.
 * @param id - The ID of the profile.
 * @param data - The updated data for the profile.
 * @returns The updated profile.
 * @throws Error if the ID is not an integer.
 */
UPMService.updateProfileById = (id, data) => {
    if (!Number.isInteger(id)) {
        throw new Error("ID must be an integer");
    }
    const profile = profileModel_1.default.updateProfile(id, data);
    return profile;
};
/**
 * Deletes a profile by profile ID.
 * @param id - The ID of the profile to delete.
 */
UPMService.deleteProfileById = (id) => {
    if (!Number.isInteger(id)) {
        throw new Error("ID must be an integer");
    }
    profileModel_1.default.deleteProfile(id);
};
/**
 * Deletes a profile by user ID.
 * @param id - The ID of the user.
 */
UPMService.deleteAllUserProfiles = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Number.isInteger(id)) {
        throw new Error("ID must be an integer");
    }
    profileModel_1.default.deleteAllUserProfiles(id);
});
exports.default = UPMService;
