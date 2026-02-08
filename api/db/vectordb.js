const weaviate = require('weaviate-client');
const { weaviateApiKey, weaviateUrl } = require('../src/variables.js');

let client=null;
async function vectordb() {
  try {
    console.log(weaviateApiKey,weaviateUrl)
    client = await weaviate.connectToWeaviateCloud(
      weaviateUrl,
      {
        authCredentials: new weaviate.ApiKey(weaviateApiKey),
      }
    );

    const clientReadiness = await client.isReady();
    console.log("Is Weaviate Ready?", clientReadiness);
    return client
  } catch (error) {
    console.error("Error:", error);
  }
};

function getClient() {
  if (!client) {
    throw new Error("Weaviate client is not initialized. Call db() first.");
  }
  return client;
}



module.exports={vectordb,getClient};
