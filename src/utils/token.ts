import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import randomBytes from 'random-bytes';


//this was just created for that token datadata const
interface TokenData {
  userId: number;
  email: string;
  authToken: string;
}

//this is the function that will hash the password
const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};



//this is the function that will check the password
const checkPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};


//this is the function that will generate the token
const generateAuthToken = (
  userId: number,
  email: string,
  tokenSecret: string,
  tokenExpiry: string | number
): { token: string; expiry: string | number } => {
  const authToken: string = randomBytes(32).toString();
  const tokenData: TokenData = { userId, email, authToken };
  const signedToken: string = jwt.sign(tokenData, tokenSecret, {
    expiresIn: tokenExpiry
  });

  return { token: signedToken, expiry: tokenExpiry };
};

//this is the function that will decode the token 
const decodeAuthToken = (token: string, tokenSecret: string): TokenData | string => {
  try {
      // Attempt to verify and decode the token
      const decoded = jwt.verify(token, tokenSecret) as TokenData;
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

export { hashPassword, checkPassword, generateAuthToken, decodeAuthToken };
