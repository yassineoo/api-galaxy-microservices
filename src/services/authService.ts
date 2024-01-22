import express from 'express';
import { AddUser, getHashedPassword, getUserByEmail, setLastLogin, } from '../models/userModel';
import { checkPassword, generateAuthToken, hashPassword } from '../utils/token';
import { addProfile } from '../models/profileModel';

require('dotenv').config();
const tokenSecret = process.env.TOKEN_SECRET;
const expiresIn = process.env.TOKEN_EXPIRES_IN;


export const registerService = async (data: any) => {
    const email = getUserByEmail(data.email);
    if (!email) {
        throw new Error('Email already exists');
    }

    const user = await AddUser({
        userName: data.userName,
        email: data.email,
        PasswordHash: data.PasswordHash
    });

    if (!user) {
        throw new Error('User could not be created');
    }

    const token = generateAuthToken(user.UserID, user.Email, tokenSecret || "", expiresIn || "");

    if (!token) {
        throw new Error('Token could not be generated');
    }

    const profile = addProfile({
        fullName: data.FullName,
        dateOfbirth: data.DateOfBirth,
        userId: data.UserID
    });

    if (!profile) {
        throw new Error('Profile could not be created');
    }

    return token;
}

export const loginService = async (data : {email : string , password: string}) => {
    const user = await getUserByEmail(data.email);
    if (!user || !user.IsActive) {
        throw new Error('email or password is incorrect');
    }
    const hashedPassword = (await hashPassword(data.password)).toString();

    const dbHashedPassword = (await getHashedPassword(user.UserID))?.toString();

    const isMatch = await checkPassword(dbHashedPassword || "", hashedPassword);
    
    if (!isMatch) {
        throw new Error('email or password is incorrect');
    }


    const token = generateAuthToken(user.UserID, user.Email, tokenSecret ||"", expiresIn || ""  );
    setLastLogin(user.UserID);

    return token;
}







