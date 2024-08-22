import { prismaClientSingleton } from "../utils/prismaClient";

type ProfileCreation = {
  FullName: string;
  DateOfBirth: string;
  ProfilePicture?: string;
  Location?: string;
};

type ProfileUpdate = {
  FullName?: string;
  DateOfBirth?: Date;
  ProfilePicture?: string;
  Location?: string;
};

export default class profileModel {
  static addProfile = async (id: number, data: ProfileCreation) => {
    const profile = await prismaClientSingleton.profile_entities.create({
      data: {
        full_name: data.FullName,
        date_of_birth: new Date(data.DateOfBirth),
        user_entities: {
          connect: { id: id },
        },
        profile_picture: data.ProfilePicture,
        location: data.Location,
      },
    });
    return profile;
  };

  static updateProfile = async (id: number, data: ProfileUpdate) => {
    const updatedUser = await prismaClientSingleton.profile_entities.update({
      where: {
        id: id,
      },
      data: {
        full_name: data.FullName,
        date_of_birth: data.DateOfBirth,
        profile_picture: data.ProfilePicture,
        location: data.Location,
      },
    });
    return updatedUser;
  };

  static getAllProfiles = async () => {
    const profiles = await prismaClientSingleton.profile_entities.findMany();
    return profiles;
  };
  static getProfileById = async (id: number) => {
    const profile = await prismaClientSingleton.profile_entities.findUnique({
      where: {
        id: id,
      },
    });
    return profile;
  };

  static getUserProfiles = async (id: number) => {
    const profile = await prismaClientSingleton.profile_entities.findMany({
      where: {
        id: id,
      },
    });
    return profile;
  };

  static deleteProfile = async (id: number) => {
    const profile = await prismaClientSingleton.profile_entities.delete({
      where: {
        id: id,
      },
    });
    return profile;
  };

  static deleteAllUserProfiles = async (id: number) => {
    const profiles = await prismaClientSingleton.profile_entities.deleteMany({
      where: {
        id: id,
      },
    });
    return profiles;
  };
}
