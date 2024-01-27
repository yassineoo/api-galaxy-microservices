import { checkPassword, generateAuthToken, hashPassword } from '../utils/token';
import userModel from '../models/userModel';
import profileModel from '../models/profileModel';
import { Role } from '../models/enum';

require('dotenv').config();
const tokenSecret = process.env.TOKEN_SECRET;
const expiresIn = process.env.EXPIRES_IN;

type register = {
    Username: string;
    Email: string;
    password: string;
    FullName: string;
    DateOfBirth: string;
}

export default class authService {


    static register = async (data: register , role : Role) => {
        const Email = userModel.getUserByEmail(data.Email);
        if (!Email) {
            throw new Error('Email already exists');
        }

        const hashedPassword = (await hashPassword(data.password)).toString();

        const user = await userModel.AddUser({
            Username: data.Username,
            Email: data.Email,
            PasswordHash: hashedPassword,
            role: role
        });

        if (!user) {
            throw new Error('User could not be created');
        }

        const token = generateAuthToken(user.UserID, user.Email, tokenSecret || "", expiresIn || "");

        if (!token) {
            throw new Error('Token could not be generated');
        }

        const profile = profileModel.addProfile(
            user.UserID
            , {
                FullName: data.FullName,
                DateOfBirth: data.DateOfBirth,
            });

        if (!profile) {
            throw new Error('Profile could not be created');
        }

        return token;
    }

    static login = async (data: { Email: string, password: string }) => {
        const user = await userModel.getUserByEmail(data.Email);
        if (!user || !user.IsActive) {
            throw new Error('Email or password is incorrect ');
        }
        const dbHashedPassword = (await userModel.getHashedPassword(user.UserID))?.toString();

        const isMatch = await checkPassword(data.password, dbHashedPassword?.toString() || "");

        if (!isMatch) {
            throw new Error('Email or password is incorrect ');
        }


        const token = generateAuthToken(user.UserID, user.Email, tokenSecret || "", expiresIn || "");
        userModel.setLastLogin(user.UserID);

        return token;
    }

}





