import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import randomBytes from "random-bytes";

//this was just created for that token datadata const
interface TokenData {
  userId: number;
  email: string;
  authToken: string;
}

interface TokenEmailData {
  id: number;
  email: string;
  authToken: string;
}

//this is the function that will hash the password
const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

//this is the function that will check the password
const checkPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

//this is the function that will generate the token
const generateAuthToken = async (
  userId: number,
  email: string,
  tokenSecret: string,
  tokenExpiry: string | number
): Promise<{ token: string; expiry: string | number }> => {
  const authToken: string = (await randomBytes(32)).toString("hex");
  const tokenData: TokenData = { userId, email, authToken };
  const signedToken: string = jwt.sign(
    tokenData,
    tokenSecret,
    {
      expiresIn: tokenExpiry,
    });

  return { token: signedToken, expiry: tokenExpiry };
};

const generateEmailToken = async (
  email: string,
  id: number,
  tokenSecret: string,
  tokenExpiry: string | number
): Promise<string> => {
  const authToken: string = (await randomBytes(32)).toString("hex");
  const tokenData: TokenEmailData = { email, id, authToken };
  const signedToken = jwt.sign(tokenData, tokenSecret, {
    expiresIn: tokenExpiry,
  });

  return signedToken;
};

//this is the function that will decode the token
const decodeAuthToken = (
  token: string,
  tokenSecret: string
) => {
  try {
    // Attempt to verify and decode the token
    const decoded = jwt.verify(token, tokenSecret) as TokenData;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token has expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    } else {
      throw new Error("Token verification failed");
    }
  }
};

const decodeEmailToken = (
  token: string,
  tokenSecret: string
): TokenEmailData | string => {
  try {
    // Attempt to verify and decode the token
    const decoded = jwt.verify(token, tokenSecret) as TokenEmailData;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return "Token has expired";
    } else if (error instanceof jwt.JsonWebTokenError) {
      return "Invalid token";
    } else {
      return "Token verification failed";
    }
  }
};

export {
  hashPassword,
  checkPassword,
  generateAuthToken,
  generateEmailToken,
  decodeAuthToken,
  decodeEmailToken,
};
