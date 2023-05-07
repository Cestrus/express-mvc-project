import { MongoClient, ServerApiVersion } from "mongodb";

const uri =
    "mongodb+srv://nodelearnmvc:nodelearnmvc@cluster0.4ksavyz.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

export async function mongoConnect() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const db = client.db("shop");
        console.log("[mongoConnect] Connect to `SHOP` database");
        return {
            db,
            close: () => client.close(),
        };
    } catch (err) {
        console.log(err);
        client.close();
    }
}
