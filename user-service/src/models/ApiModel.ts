import { prismaClientSingleton } from "../utils/prisma";
import { api_entities, like_entities } from "@prisma/client";

export default class APIModel {
  static async getAPIS(
    userId: number,
    limit: string = "10",
    page: string = "1",
    search: string = "",
    filter?: number
  ) {
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    const whereConditions = {} as any;

    // Apply search filtering if present
    if (search) {
      whereConditions.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Apply category filter if present
    if (filter) {
      whereConditions.category_id = filter;
    }

    try {
      const apis = await prismaClientSingleton.api_entities.findMany({
        where: whereConditions,
        include: {
          user_likes: {
            where: {
              user_id: userId,
            },
            select: {
              user_id: true,
            },
          },
        },
        skip: (pageInt - 1) * limitInt,
        take: limitInt,
      });

      const finalApis = apis.map((api) => {
        const newAPI = {
          ...api,
          category_id: Number(api.category_id),
          provider_id: Number(api.provider_id),
          id: Number(api.id),
        };
        return {
          ...newAPI,
          isLiked: api.user_likes.length > 0,
        };
      });

      const jsonString = JSON.stringify(finalApis, (key, value) =>
        typeof value == "bigint" ? value.toString() : value
      );

      return jsonString;
    } catch (error: any) {
      throw error;
    }
  }

  static async getAPIRating(api_id: number) {
    try {
      const apiRating = await prismaClientSingleton.api_entities.findUnique({
        where: {
          id: api_id,
        },
        select: {
          rating: true,
        },
      });
      return apiRating;
    } catch (error) {
      throw error;
    }
  }

  static async getAPIListForAdmin(
    admin_id: number,
    page: any,
    limit: any,
    search: any
  ) {
    try {
      const pageInt = parseInt(page);
      const limitInt = parseInt(limit);
      // console.log(userId)
      // Build the filtering and search conditions
      const whereConditions = {} as any;

      if (search) {
        whereConditions.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }
      const apis = await prismaClientSingleton.user_entities.findUnique({
        where: {
          id: admin_id,
        },
        select: {
          api_entities: {
            where: whereConditions,
            skip: (pageInt - 1) * limitInt,
            take: limitInt,
          },
        },
      });
      const jsonString = JSON.stringify(apis?.api_entities, (key, value) =>
        typeof value == "bigint" ? value.toString() : value
      );
      //console.log(jsonString)
      return jsonString;
    } catch (error) {
      throw error;
    }
  }

  static async getAPISForUser(user_id: number) {
    try {
      const apis = await prismaClientSingleton.user_entities.findUnique({
        where: {
          id: user_id,
        },
        select: {
          api_entities: true,
        },
      });
      const jsonString = JSON.stringify(apis?.api_entities, (key, value) =>
        typeof value == "bigint" ? value.toString() : value
      );
      //console.log(jsonString)
      return jsonString;
    } catch (error) {
      throw error;
    }
  }

  static async getUserFollowingApis(user_id: number) {
    try {
      const followingApis =
        await prismaClientSingleton.user_entities.findUnique({
          where: {
            id: user_id,
          },
          select: {
            likes: {
              select: {
                api: true,
              },
            },
          },
        });
      const finalFollowings = JSON.stringify(
        followingApis?.likes,
        (key, value) => (typeof value == "bigint" ? value.toString() : value)
      );
      //console.log(jsonString)
      return finalFollowings;
    } catch (error) {
      throw error;
    }
  }

  static async updateAPI(api_id: number, dataToChange: any) {
    try {
      const updated = await prismaClientSingleton.api_entities.update({
        where: {
          id: api_id,
        },
        data: dataToChange,
      });
      console.log(updated);
      return updated;
    } catch (error) {
      throw error;
    }
  }

  static async getInactiveAPIS() {
    try {
      const res = await prismaClientSingleton.api_entities.findMany({
        where: {
          status: "inactive",
        },
      });
      const finalRes = JSON.stringify(res, (key, value) =>
        typeof value == "bigint" ? value.toString() : value
      );
      return res.length ? finalRes : [];
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(api_id: number) {
    try {
      const updatedApi = await prismaClientSingleton.api_entities.update({
        where: {
          id: api_id,
        },
        data: {
          status: "active",
        },
      });
      return updatedApi;
    } catch (error) {
      throw error;
    }
  }
  static async getSettings() {
    try {
      const settings = await prismaClientSingleton.settings_entities.findFirst({
        orderBy: {
          updated_at: "desc",
        },
      });
      const jsonString = JSON.stringify(settings, (key, value) =>
        typeof value == "bigint" ? value.toString() : value
      );
      return jsonString;
    } catch (error) {
      throw error;
    }
  }
}
