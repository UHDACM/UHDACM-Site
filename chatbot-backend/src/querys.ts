import getCollection from "./chroma-collection";

const main = (async () => {
    const policesCollection = await getCollection('policies');
    const results = await policesCollection.query({
        queryTexts: ["what am I looking at?", "What's the most important rule?"],
        nResults: 2
    })
    console.log(results);
})

main();