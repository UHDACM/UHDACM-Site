import getCollection from "./chroma-collection";
import fs from "fs/promises"

const main = (async () => {
    const file = await fs.readFile('./policies.txt', 'utf8')
    const policies = file.split("\n").filter(Boolean)

    const policiesCollection = await getCollection('policies');

    await policiesCollection.add({
        documents: policies,
        ids: policies.map(() => crypto.randomUUID()),
        metadatas: policies.map((_, i) => ({line: i.toString()}))
    })

    console.log(await policiesCollection.peek({}))
})

main()