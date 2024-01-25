import { prismaClientSingleton } from '../utils/prismaClient';
import { getUserById } from './userModel';
const currentDate: Date = new Date();


export const addFollower = async (data: { userId: number; followerId: number; }) => {
    const { userId, followerId } = data;
    const user = await getUserById(userId);
    if ((!user) || (userId === followerId)) {
        throw new Error("User not found");
    }

    try {
        const follow = await prismaClientSingleton.follows.create({
            data: {
                users_follows_FollowerIDTousers: {
                    connect: { UserID: followerId },
                },
                users_follows_FollowingIDTousers: {
                    connect: { UserID: userId },
                },
            },
        });

        console.log('Follow relation created: ', follow);
    } catch (error) {
        console.error('Error creating follow relation: ', error);
    }
}
