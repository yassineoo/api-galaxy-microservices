import { prismaClientSingleton } from "../utils/prisma";

export default class ApiCategoryModel {
  static async getCategories() {
    try {
      const apis = await prismaClientSingleton.category_entities.findMany({});

      return JSON.parse(
        JSON.stringify(apis, (key, value) =>
          typeof value == "bigint" ? value.toString() : value
        )
      );
    } catch (error: any) {
      //console.log(error.message)
      throw error;
    }
  }
}
