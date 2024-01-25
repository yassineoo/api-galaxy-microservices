import express from 'express';
import { AddUser, getHashedPassword, getUserByEmail, setLastLogin, } from '../models/userModel';
import { checkPassword, generateAuthToken, hashPassword } from '../utils/token';
import { addProfile } from '../models/profileModel';

require('dotenv').config();
const tokenSecret = process.env.TOKEN_SECRET;
const expiresIn = process.env.EXPIRES_IN;


export const registerService = async (data: any) => {
    const Email = getUserByEmail(data.Email);
    if (!Email) {
        throw new Error('Email already exists');
    }

    const hashedPassword = (await hashPassword(data.password)).toString();

    const user = await AddUser({
        Username: data.Username,
        Email: data.Email,
        PasswordHash: hashedPassword
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
        userId: user.UserID
    });

    if (!profile) {
        throw new Error('Profile could not be created');
    }

    return token;
}

export const loginService = async (data : {Email : string , password: string}) => {
    const user = await getUserByEmail(data.Email);
    if (!user || !user.IsActive) {
        throw new Error('Email or password is incorrect ');
    }
    const dbHashedPassword = (await getHashedPassword(user.UserID))?.toString();

    const isMatch = await checkPassword(data.password,dbHashedPassword?.toString() || "");
    
    if (!isMatch) {
        throw new Error('Email or password is incorrect ');
    }


    const token = generateAuthToken(user.UserID, user.Email, tokenSecret ||"", expiresIn || ""  );
    setLastLogin(user.UserID);

    return token;
}







