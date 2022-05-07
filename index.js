const express = require('express')
const cors = require('cors')
const app = express()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//user :dbuser1
//passs :cX1tMoPpKq0czA7i

//mongodb 


const uri = "mongodb+srv://dbuser1:cX1tMoPpKq0czA7i@cluster0.om8d3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

  try {
    await client.connect();
    const ItemsCollection = client.db('SportsGear').collection('Items');

    app.get('/items', async (req, res) => {
      const query = {};
      const cursor = ItemsCollection.find(query);
      const Items = await cursor.toArray();
      res.send(Items);
    });

    app.get('/items/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const Items = await ItemsCollection.findOne(query);
      res.send(Items);
    });

    app.post('/addItems', async (req, res) => {
      const newItems = req.body;
      const result = await ItemsCollection.insertOne(newItems);
      res.send(result);
    });

    // app.put('/quantityUpdate',async(req,res)=>{
    //   const id = req?.body?.id;
    //   const dec= req?.body?.dec;
    //   const filter = {_id:ObjectId(id)}
    //      // this option instructs the method to create a document if no documents match the filter
    //   const options = { upsert: true };
    //   const updateDoc = {
    //       $set: {
    //         _const: updateDoc = { $inc: { quantity: -1 } },
    //         get const() {
    //           return this._const;
    //         },
    //         set const(value) {
    //           this._const = value;
    //         },
    //       },
    //     };
    //   const result = await products.updateOne(filter, updateDoc, options);
    //   return res.send(result);

    app.put('/items/:id', async (req, res) => {
      const result = await ItemsCollection.updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: {
            quantity: req.body.updatedQuantity,
          },
        },
        {
          upsert: true,
        }
      )
      res.send(result)
    })

    app.delete('/items/:id', async (req, res) => {
      const result = await ItemsCollection.deleteOne(
        { _id: ObjectId(req.params.id) },
      );
      res.send(result);
    });

    app.get('/items', verifyJWT, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const email = req.query.email;
      if (email === decodedEmail) {
        const query = { email: email };
        const cursor = ItemsCollection.find(query);
        const Items = await cursor.toArray();
        res.send(Items);
      }
      else {
        res.status(403).send({ message: 'forbidden access' })
      }
    })

  }
  finally {

  }
}
run().catch(console.dir)
app.get('/', (req, res) => {
  res.send('Hello World!cccc')
})

app.listen(port, () => {
  console.log('port', port)
})

