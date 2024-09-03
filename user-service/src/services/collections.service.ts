import { prismaClientSingleton } from "../utils/prisma"

async function getAllApisByCategory({ id, page }: { id: number, page: number }) {
    const categoryName = await prismaClientSingleton.api_collection_entities.findFirst({
        where: { id },
        select: { name: true }
    }).then(r => r?.name)
    console.log({ categoryName })
    const apis = await prismaClientSingleton.api_entities.findMany({
        where: {
            api_collections_apis: {
                "some": {
                    "api_collection_entity_id": id
                }
            },
        },
        take: 10,
        skip: (page - 1) * 10
    })
    console.log({ apis })
    const totalCount = await prismaClientSingleton.api_entities.aggregate({
        _count: {
            "id": true
        },
        where: {
            api_collections_apis: {
                "some": {
                    api_collection_entity_id: id
                }
            }
        }
    })
    console.log({ totalCount })
    return {
        categoryName,
        data: apis,
        pages: Math.ceil(totalCount?._count?.id / 10)
    }
}

export const collectionsService = {
    getAllApisByCategory
}