const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASS_USER}$r@cluster0.ruakr2a.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      const database = client.db('userDB');
      const userCollection = database.collection('users');
      const someCollection = client.db('someDb').collection('some')
      // sob user k pawar jonno 
      app.get('/users', async(req,res) => {
        const findUder = userCollection.find();
        const result = await findUder.toArray();
        console.log('all user get', result);
        res.send(result);
      })


      app.post('/users', async(req,res) => {
        const user = req.body;
        console.log(user);
        const result = await userCollection.insertOne(user);
        res.send(result);
      })

      // update find 
    app.get('/users/:id',async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await userCollection.findOne(query);
      res.send(result);
    })
    // update set 
    app.put('/users/:id', async(req,res) => {
      const id = req.params.id;
      const user = req.body;
      console.log(id,user);
      const query = {_id: new ObjectId(id)};
      const options = {upsert:true};
      const updateUser = {
        $set:{
          name:user.name,
          email:user.email
        }
      }
      const result = await userCollection.updateOne(query,updateUser,options)
      res.send(result)
    })


      app.delete('/users/:id', async(req,res) => {
        const id = req.params.id;
        console.log('please delete from database', id);
        const query = {_id: new ObjectId(id)};
        const result = await userCollection.deleteOne(query);
        res.send(result)
      })

      // another api 

      app.post('/some', async(req,res) => {
        const some = req.body;
        console.log(some);
        const result = await someCollection.insertOne(some);
        res.send(result)
      })
      app.get('/some', async(req,res) => {
        const cursor = someCollection.find();
        const some = await cursor.toArray();
        res.send(some)
      } )

      app.patch('/some', async(req,res) => {
        const some = req.body;
        const filter = {email: some.email};
        const updatedDoc = {
          $set: {
            lastLoggedAt : some.lastLoggedAt
          }
        }
        const result = await someCollection.updateOne(filter,updatedDoc);
        res.send(result)
      })

      app.delete('/some/:id', async(req,res) => {
        const id = req.params.id;
        console.log('deleted id is: ',id);
        const query = {_id: new ObjectId(id)};
        const result = await someCollection.deleteOne(query);
        res.send(result)
      })
      

      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }
  run().catch(console.dir);
  

app.get('/', (req,res) => {
    res.send('Simple CRUD is Running')
})
app.listen(port, () => {
  console.log(`Simple CRUD is Running on Port is: ${port}`);
})