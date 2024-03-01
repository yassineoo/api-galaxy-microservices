import { NextFunction, Request, Response } from 'express';
import { decodeAuthToken } from '../utils/token';
import { statusCodes } from '../utils/http';
import { getPermissions } from '../models/permissions';
import userService from '../services/UAMService';
import userModel from '../models/userModel';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: number;
  }
}

require('dotenv').config();
const tokenSecret = process.env.JWT_SECRET;

export const verifyRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(statusCodes.unauthorized).send('No token provided');
      }

      const tokenData = decodeAuthToken(token, tokenSecret || '');
      if (typeof tokenData === 'string') {
        return res.status(statusCodes.unauthorized).send(tokenData);
      }

      const userRole = await userService.getUserRole(tokenData.userId);

      if (userRole === null) {
        return res.status(statusCodes.unauthorized).send('User role not found');
      }
      if (!allowedRoles.includes(userRole)) {
        return res
          .status(statusCodes.forbidden)
          .send('Insufficient permissions');
      }

      next();
    } catch (error: any) {
      res
        .status(401)
        .send(error instanceof Error ? error.message : 'Authentication failed');
    }
  };
};

export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(statusCodes.unauthorized).send('No token provided');
    }

    const tokenData = decodeAuthToken(token, tokenSecret || '');
    if (typeof tokenData === 'string') {
      return res.status(statusCodes.unauthorized).send(tokenData);
    }
    req.userId = tokenData.userId;
    next();
  } catch (error: any) {
    res
      .status(401)
      .send(error instanceof Error ? error.message : 'Authentication failed');
  }
};

export const verifyAuthWithId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(statusCodes.unauthorized).send('No token provided');
    }

    const tokenData = decodeAuthToken(token, tokenSecret || '');
    if (typeof tokenData === 'string') {
      return res.status(statusCodes.unauthorized).send(tokenData);
    }

    const id = tokenData.userId;
    if (!id) {
      return res.status(statusCodes.unauthorized).send('User not found');
    }

    const user = await userService.getUserById(id);
    if (user?.role === 'userClient' || user?.role === 'APIClient') {
      if (id !== parseInt(req.params.id)) {
        return res
          .status(statusCodes.forbidden)
          .send('Insufficient permissions');
      }
    }
    next();
  } catch (error: any) {
    res
      .status(401)
      .send(error instanceof Error ? error.message : 'Authentication failed');
  }
};

export const verifyModeratorPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
  permissions: Array<string>
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(statusCodes.unauthorized).send('No token provided');
    }

    const tokenData = decodeAuthToken(token, tokenSecret || '');
    if (typeof tokenData === 'string') {
      return res.status(statusCodes.unauthorized).send(tokenData);
    }

    const userPermissions = await getPermissions(tokenData.userId);
    if (!userPermissions) {
      return res.status(statusCodes.forbidden).send('Insufficient permissions');
    }

    const hasPermission = userPermissions.some((permission: any) =>
      permissions.includes(permission.Name)
    );
    if (!hasPermission) {
      return res.status(statusCodes.forbidden).send('Insufficient permissions');
    }

    next();
  } catch (error: any) {
    res
      .status(401)
      .send(error instanceof Error ? error.message : 'Authentication failed');
  }
};
