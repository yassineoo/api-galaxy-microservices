import { prismaClientSingleton } from "../utils/prisma"

async function getAllApisByCategory({ id }: { id: number }) {
    await prismaClientSingleton.$connect().then(console.log)
    // await prismaClientSingleton.api_collections_apis.create({
    //     data:
    //     {
    //         "api_collection_entity_id": 2,
    //         "api_entity_id": 2
    //     }
    // })
    // const updatess = await prismaClientSingleton.api_collections_apis.create({
    //     data:
    //     {
    //         "api_collection_entity_id": 2,
    //         "api_entity_id": 19
    //     }
    // })
    // const updatesss = await prismaClientSingleton.api_collections_apis.create({
    //     data:
    //     {
    //         "api_collection_entity_id": 2,
    //         "api_entity_id": 10
    //     }
    // })
    const collection = await prismaClientSingleton.api_collection_entities.findUnique({
        where: { id },
        include: {
            "api_collections_apis": {
                "include": {
                    "api_entities": true
                }
            }
        }
    })
    console.log({ collection })


    // console.log({ updates })
    const apis = collection?.api_collections_apis.map(r => ({
        ...r.api_entities,
        id: Number(r.api_entities.id),
        category_id: Number(r.api_entities.category_id),
        provider_id: Number(r.api_entities.provider_id),
        stripe_product_id: String(r.api_entities.stripe_product_id)
    }))
    return {
        collectionName: collection?.name,
        data: apis,
        pages: Math.ceil((apis?.length || 0) / 10)

    }
}

export const collectionsService = {
    getAllApisByCategory
}