import express from 'express'
import ImageKit from 'imagekit'
import dotenv from 'dotenv';
import cors from 'cors'
import mongoose from 'mongoose';
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

dotenv.config();
const port = process.env.PORT || 3000
const app = express()

app.use(cors(
    {
        origin: process.env.CLIENT_URL,
        credentials: true,
    }
))

app.use(express.json());

const connect = async () => {
    try{
        await mongoose.connect(process.env.MONGO);
        console.log('connected to mongo');
    }
    catch(err){
        console.log(err);
    }
}



const imagekit = new ImageKit({
    urlEndpoint: process.env.VITE_IMAGE_KIT_ENDPOINT,
    publicKey: process.env.VITE_IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.VITE_IMAGE_KIT_PRIVATE_KEY 
});

app.get('/api/uplode', (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
})

// app.get('/api/tets',ClerkExpressRequireAuth(), (req, res) => {
//     const userId = req.auth.userId;
//     console.log(userId);
    
//     res.send('success')
// })







app.post('/api/chats',ClerkExpressRequireAuth(), async(req, res) => {
    const userId = req.auth.userId;
    const {text} = req.body;
  try {
    //craeate a new chats 
    const newChat = new Chat({
      userId: userId,
      history: [{role: 'user', parts: [{text}]}]
    });
    const savedChat = await newChat.save();
// user chat is exist or not

    const userChat = await UserChats.find({userId: userId});

    if(!userChat.length){
      
        const newUserChat = new UserChats({
           userId: userId,
           chats: [
            {
            _id: savedChat._id,
            title: text.substring(0,40),
            }
        ] 
        })
        await newUserChat.save();
    }else{
        // if exist 
        await UserChats.updateOne({
            userId: userId}, {
                $push: {
                    chats: {
                        _id: savedChat._id,
                        title: text.substring(0,40),
                    }
                }
            })

    }
    res.status(200).send(newChat._id);
    
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');    
  }
  
})

app.get('/api/userchats',ClerkExpressRequireAuth(), async(req, res) => {
    const userId = req.auth.userId;

    try {
        const userChats = await UserChats.find({userId});
        res.status(200).send(userChats[0].chats);

        
    } catch (error) {
        console.log(error);
    res.status(500).send('error fatching chats list');    
    }

})

app.get('/api/chats/:id',ClerkExpressRequireAuth(), async(req, res) => {
    const userId = req.auth.userId;

    try {
        const Chats = await Chat.findOne({_id: req.params.id, userId});
        res.status(200).send(Chats);

        
    } catch (error) {
        console.log(error);
    res.status(500).send('error fatching chats');    
    }

})

app.put('/api/chats/:id',ClerkExpressRequireAuth(), async(req, res) => {
    const userId = req.auth.userId;
    const {question, answer,img} = req.body;
    const newItem = [
        ...(question ?[{role: 'user', parts: [{text: question}], ...(img && {img})}]:[]),
        {role: 'model', parts: [{text: answer}]}
    ]
    try {
        const updatedChat = await Chat.updateOne({_id: req.params.id, userId}, {
            $push: {
                history: {
                    $each: newItem
                }
                
                
            }
        })


        res.status(200).send(updatedChat);

        
    } catch (error) {
        console.log(error);
    res.status(500).send('error adding conversation');    
    }

})



























app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(401).send('Unauthenticated!');
});



app.listen(port, () => {
    connect();
    console.log(`listening on port ${port}...`)
});