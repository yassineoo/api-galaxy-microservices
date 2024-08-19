import { prismaClientSingleton } from "../utils/prismaClient";
import userModel from "./userModel";
const currentDate: Date = new Date();

export default class followsModel {
  static followUser = async (data: { userId: number; followingId: number }) => {
    const { userId, followingId } = data;
    const user = await userModel.getUserById(userId);
    if (!user || userId === followingId) {
      throw new Error("User not found !");
    }

    try {
      /*  const follow = await prismaClientSingleton.follows.create({
                data: {
                    users_follows_FollowerIDTousers: {
                        connect: { UserID: followingId },
                    },
                    users_follows_FollowingIDTousers: {
                        connect: { UserID: userId },
                    },
                },
            });
*/
      // console.log("Follow relation created: ", follow);
    } catch (error) {
      console.error("Error creating follow relation: ", error);
    }
  };

  static removeFollow = async (data: {
    userId: number;
    followerId: number;
  }) => {
    return 0;
  };
}
