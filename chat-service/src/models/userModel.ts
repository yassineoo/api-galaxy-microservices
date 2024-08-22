import { prismaClientSingleton } from "../utils/prismaClient";
import { ID } from "../validators/chats/_common";
const currentDate: Date = new Date();

export default class userModel {
  static AddUser = async (data: {
    Username: string;
    Email: string;
    PasswordHash?: string;
    // PhoneNumber?: string;
    role?: string;
    image: string;
  }) => {
    try {
      const user = await prismaClientSingleton.user_entities.create({
        data: {
          username: data.Username,
          email: data.Email,
          password_hash: data.PasswordHash,
          // phone_number: data.PhoneNumber,
          image: data.image,

          date_created: currentDate.toISOString(),
          last_login: currentDate.toISOString(),
          is_active: true,
          role: data.role || "customer",
        },
      });
      return user;
    } catch (error) {
      console.error("Error in AddUser:", error);
      throw error;
    }
  };

  static updateUser = async (id: number, data: any) => {
    try {
      const updatedUser = await prismaClientSingleton.user_entities.update({
        where: {
          id: id,
        },
        data: data,
      });
      return updatedUser;
    } catch (error) {
      console.error("Error in updateUser:", error);
      throw error;
    }
  };

  static getUserById = async (id: number) => {
    try {
      const user = await prismaClientSingleton.user_entities.findUnique({
        where: {
          id: id,
        },
      });
      if (!user) {
        console.log("No data found for getUserById");
      }
      return user;
    } catch (error) {
      console.error("Error in getUserById:", error);
      throw error;
    }
  };

  static getUserByEmail = async (email: string) => {
    try {
      if (!email) {
        throw new Error("Email parameter is undefined");
      }
      const user = await prismaClientSingleton.user_entities.findUnique({
        where: {
          email: email,
        },
      });
      return user;
    } catch (error) {
      console.error("Error in getUserByEmail:", error);
      throw error;
    }
  };

  static getUserByPhoneNumber = async (phoneNumber: string) => {
    try {
      if (!phoneNumber) {
        throw new Error("PhoneNumber parameter is undefined");
      }
      const user = await prismaClientSingleton.user_entities.findUnique({
        where: {
          phone_number: phoneNumber.toString(),
        },
      });

      return user;
    } catch (error) {
      console.error("Error in getUserByPhoneNumber:", error);
      throw error;
    }
  };

  static getAllUsers = async () => {
    try {
      const users = await prismaClientSingleton.user_entities.findMany();
      if (users.length === 0) {
        console.log("No data found for getAllUsers");
      }
      return users;
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      throw error;
    }
  };

  static deleteUser = async (id: number) => {
    try {
      const transaction = await prismaClientSingleton.$transaction(
        async (prisma: any) => {
          await prisma.profiles.deleteMany({ where: { UserID: id } });
          await prisma.user_entities.delete({ where: { UserID: id } });
        }
      );
      return transaction;
    } catch (error) {
      console.error("Error in deleteUser transaction:", error);
      throw error;
    }
  };

  static setLastLogin = async (id: number) => {
    try {
      const user = await prismaClientSingleton.user_entities.update({
        where: {
          id,
        },
        data: {
          last_login: currentDate.toISOString(),
        },
      });
      return user;
    } catch (error) {
      console.error("Error in setLastLogin:", error);
      throw error;
    }
  };

  static getHashedPassword = async (id: number) => {
    try {
      const user = await prismaClientSingleton.user_entities.findUnique({
        where: {
          id,
        },
        select: {
          password_hash: true,
        },
      });
      if (!user) {
        console.log("No data found for getHashedPassword");
        throw new Error("No data found");
      }
      return user ? user.password_hash : null;
    } catch (error) {
      console.error("Error in getHashedPassword:", error);
      throw error;
    }
  };

  static isUserExist = async (id: ID) => {
    try {
      const user = await prismaClientSingleton.user_entities.findUnique({
        where: {
          id
        },
        select: {
          id: true,
          email: true
        }
      })

      if (!user || !user.email || !user.id) return false;
      return true
    } catch (error) {
      console.error("Error in isUserExist:", error);
      if (error instanceof Error) throw error
      if (typeof error === 'string') throw new Error(error)
      if (error && typeof error === "object" && "message" in error && typeof error.message === "string") throw new Error(error.message)
      throw new Error("Internal Server Error")
    }
  }
}
