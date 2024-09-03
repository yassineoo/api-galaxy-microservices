import { prismaClientSingleton } from "../utils/prisma"

async function getAllApisByCategory({ id }: { id: number }) {
    await prismaClientSingleton.$connect()
    console.log({ prisma: prismaClientSingleton })
    const collectionName = await prismaClientSingleton.api_collection_entities.findFirst({
        where: { id },
        select: { name: true }
    }).then(r => r?.name)
    console.log({ collectionName })
    const apis = await prismaClientSingleton.api_entities.findMany({
        where: {
            api_collections_apis: {
                every: {
                    api_collection_entity_id: id
                }
            },
        },
    })
    console.log({ apis })
    const totalCount = await prismaClientSingleton.api_entities.aggregate({
        _count: {
            id: true
        },
        where: {
            api_collections_apis: {
                every: {
                    api_collection_entity_id: id
                }
            }
        }
    })
    return {
        collectionName,
        data: apis.map(a => ({
            ...a,
            id: Number(a.id),
            provider_id: Number(a.provider_id),
            category_id: Number(a.category_id)
        })),
        pages: Math.ceil(totalCount?._count?.id / 10)
    }
}

export const collectionsService = {
    getAllApisByCategory
}