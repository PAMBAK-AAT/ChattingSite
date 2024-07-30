const express = require("express");
const { Server } = require('socket.io');
const getUserdetail = require("../helper/getUserDetailfromToken");
const http = require('http');
const UserModel = require("../models/userModel");
const mongoose = require("mongoose");

const app = express();
const getConversation = require('../helper/getConversation');
const { ConversationModel, MessageModel } = require('../models/conversationModel');

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL, 
        credentials: true
    }
});

const onlineUser = new Set();

io.on('connection', async (socket) => {
    console.log("connect user", socket.id);

    const token = socket.handshake.auth.token;
    if (!token) {
        console.log("No token provided");
        socket.disconnect();
        return;
    }

    const user = await getUserdetail(token);
    if (!user || !user._id) {
        console.log("User not found or invalid user ID");
        socket.disconnect();
        return;
    }

    socket.join(user._id.toString());
    onlineUser.add(user._id.toString());

    io.emit('onlineUser', Array.from(onlineUser));

    socket.on('message-page', async (userId) => {
        console.log('userId', userId);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            socket.emit('error', { message: 'Invalid user ID' });
            return;
        }

        const userDetails = await UserModel.findById(userId).select("-password");

        if (!userDetails) {
            socket.emit('error', { message: 'User not found' });
            return;
        }

        const payload = {
            _id: userDetails._id,
            name: userDetails.name,
            email: userDetails.email,
            profile_pic: userDetails.profile_pic,
            online: onlineUser.has(userId)
        };
        socket.emit('message-user', payload);

        const getConversationMessage = await ConversationModel.findOne({
            "$or": [
                { sender: user._id, receiver: userId },
                { sender: userId, receiver: user._id }
            ]
        }).populate("messages").sort({ updatedAt: -1 });

        if (getConversationMessage && getConversationMessage.messages) {
            socket.emit('message', getConversationMessage.messages);
        } else {
            socket.emit('message', []);
        }
    });

    socket.on('new message', async (data) => {
        console.log('New message received:', data);

        if (!data.sender || !data.receiver) {
            console.error('Sender or receiver missing in data:', data);
            socket.emit('error', { message: 'Sender or receiver missing' });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(data.sender) || !mongoose.Types.ObjectId.isValid(data.receiver)) {
            socket.emit('error', { message: 'Invalid sender or receiver ID' });
            return;
        }

        let conversation = await ConversationModel.findOne({
            "$or": [
                { sender: data.sender, receiver: data.receiver },
                { sender: data.receiver, receiver: data.sender }
            ]
        });

        if (!conversation) {
            const createConversation = new ConversationModel({
                sender: data.sender,
                receiver: data.receiver
            });
            conversation = await createConversation.save();
        }

        const message = new MessageModel({
            text: data.text,
            imageUrl: data.imageUrl,
            videoUrl: data.videoUrl,
            msgByUserId: data.msgByUserId
        });

        const saveMessage = await message.save();

        await ConversationModel.updateOne({ _id: conversation._id }, {
            "$push": { messages: saveMessage._id }
        });

        const getConversationMessage = await ConversationModel.findOne({
            "$or": [
                { sender: data.sender, receiver: data.receiver },
                { sender: data.receiver, receiver: data.sender }
            ]
        }).populate("messages").sort({ updatedAt: -1 });

        io.to(data.sender).emit('message', getConversationMessage?.messages || []);
        io.to(data.receiver).emit('message', getConversationMessage?.messages || []);

        const conversationSender = await getConversation(data.sender);
        const conversationReceiver = await getConversation(data.receiver);

        io.to(data.sender).emit('conversation', conversationSender);
        io.to(data.receiver).emit('conversation', conversationReceiver);
    });

    socket.on('sidebar', async (currentUserId) => {
        console.log("current user", currentUserId);

        if (!mongoose.Types.ObjectId.isValid(currentUserId)) {
            socket.emit('error', { message: 'Invalid user ID' });
            return;
        }

        const conversation = await getConversation(currentUserId);

        socket.emit('conversation', conversation);
    });

    socket.on('seen', async (msgByUserId) => {
        if (!mongoose.Types.ObjectId.isValid(msgByUserId)) {
            socket.emit('error', { message: 'Invalid user ID' });
            return;
        }

        let conversation = await ConversationModel.findOne({
            "$or": [
                { sender: user._id, receiver: msgByUserId },
                { sender: msgByUserId, receiver: user._id }
            ]
        });

        const conversationMessageId = conversation?.messages || [];

        await MessageModel.updateMany(
            { _id: { "$in": conversationMessageId }, msgByUserId: msgByUserId },
            { "$set": { seen: true } }
        );

        const conversationSender = await getConversation(user._id.toString());
        const conversationReceiver = await getConversation(msgByUserId);

        io.to(user._id.toString()).emit('conversation', conversationSender);
        io.to(msgByUserId).emit('conversation', conversationReceiver);
    });

    socket.on('disconnect', () => {
        onlineUser.delete(user._id.toString());
        console.log('disconnect user', socket.id);
    });
});

module.exports = {
    app,
    server
};
























// const express = require("express");
// const { Server } = require('socket.io'); // socket.io is a library that enables real-time, bidirectional communication between the server and clients like as a web browser.
// const getUserdetail = require("../helper/getUserDetailfromToken");

// const http  = require('http');// http is Node.js’s built-in module for creating HTTP servers.
// const UserModel = require("../models/userModel");
// const mongoose = require("mongoose"); // Add mongoose for ObjectId validation

// const app = express();
// const getConversation = require('../helper/getConversation')



// const { ConversationModel, MessageModel } = require('../models/conversationModel')
// // Socket connection
// const server = http.createServer(app) // The HTTP server will handle incoming requests.

// // io is an instance of Socket.IO that will use the HTTP server.
// const io = new Server(server, {
//     cors: {
//         origin: process.env.FRONTEND_URL, 
//         credentials: true
//     }
// })

// // Create a Set to keep track of online users
// const onlineUser = new Set();

// //  Socket running at http://localhost:8080/
// // Handle socket connections
// io.on('connection', async (socket) => {
//     console.log("connect user", socket.id);

//     const token = socket.handshake.auth.token;
//     if (!token) {
//         console.log("No token provided");
//         socket.disconnect();
//         return;
//     }

//     // CURRENT user details
//     const user = await getUserdetail(token);
//     if (!user || !user._id) {
//         console.log("User not found or invalid user ID");
//         socket.disconnect();
//         return;
//     }

//     // create a room
//     socket.join(user._id.toString());
//     onlineUser.add(user._id.toString());

//     io.emit('onlineUser', Array.from(onlineUser));
//     // console.log('user' , user);

//     socket.on('message-page', async (userId) => {
//         console.log('userId', userId);

//         // Validate userId before querying
//         if (!mongoose.Types.ObjectId.isValid(userId)) {
//             socket.emit('error', { message: 'Invalid user ID' });
//             return;
//         }

//         const userDetails = await UserModel.findById(userId?.toString()).select("-password");

//         if (!userDetails) {
//             socket.emit('error', { message: 'User not found' });
//             return;
//         }

//         const payload = {
//             _id: userDetails?._id,
//             name: userDetails?.name,
//             email: userDetails?.email,
//             profile_pic: userDetails?.profile_pic,
//             online: onlineUser.has(userId)
//         }
//         socket.emit('message-user', payload);

//         // get previous message
//         const getConversationMessage = await ConversationModel.findOne({
//             "$or": [
//                 { sender: user?._id, receiver: userId },
//                 { sender: userId, receiver: user?._id }
//             ]
//         }).populate("messages").sort({ updatedAt: -1 }); // By this we get more recent message on top...

//         if (getConversationMessage && getConversationMessage.messages) {
//             socket.emit('message', getConversationMessage.messages);
//         } else {
//             socket.emit('message', []);
//         }
//     })


//     // new message 

// socket.on('new message', async (data) => {
//     console.log('New message received:', data);

//     if (!data.sender || !data.receiver) {
//         console.error('Sender or receiver missing in data:', data);
//         return;
//     }

//     let conversation = await ConversationModel.findOne({
//         "$or": [
//             { sender: data?.sender, receiver: data?.receiver },
//             { sender: data?.receiver, receiver: data?.sender }
//         ]
//     });

//     if (!conversation) {
//         const createConversation = new ConversationModel({
//             sender: data?.sender,
//             receiver: data?.receiver
//         });
//         conversation = await createConversation.save();
//     }

//     const message = new MessageModel({
//         text: data.text,
//         imageUrl: data.imageUrl,
//         videoUrl: data.videoUrl,
//         msgByUserId: data.msgByUserId
//     });

//     const saveMessage = await message.save();

//     await ConversationModel.updateOne({ _id: conversation?._id }, {
//         "$push": { messages: saveMessage?._id }
//     });

//     const getConversationMessage = await ConversationModel.findOne({
//         "$or": [
//             { sender: data?.sender, receiver: data?.receiver },
//             { sender: data?.receiver, receiver: data?.sender }
//         ]
//     }).populate("messages").sort({ updatedAt: -1 });


//     io.to(data?.sender).emit('message', getConversationMessage?.messages || []);
//     io.to(data?.receiver).emit('message', getConversationMessage?.messages || []);

//     // send conversation on sidebar
//     const conversationSender = await getConversation(data?.sender);
//     const conversationReceiver = await getConversation(data?.receiver);

//     io.to(data?.sender).emit('conversation',conversationSender );
//     io.to(data?.receiver).emit('conversation', conversationReceiver);
    
// });


//     // sidebar

//     socket.on('sidebar', async (currentUserId) => {
//         console.log("current user" , currentUserId);

//         const conversation = await getConversation(currentUserId);

//         socket.emit('conversation', conversation);
//     });

//     // To update unseen messages
//     socket.on('seen' , async (msgByUserId) => {

//         let conversation = await ConversationModel.findOne({
//             "$or" : [
//                 { sender : user?._id , receiver : msgByUserId},
//                 { sender : msgByUserId , receiver : user?._id}
//             ]
//         })

//         const conversationMessageId = conversation?.messages || []

//         const updateMessages = await MessageModel.updateMany(
//             { _id : { "$in" : conversationMessageId} , msgByUserId : msgByUserId},
//             { "$set" : {seen : true}}
//         )

//         // send conversation on sidebar
//         const conversationSender = await getConversation(user?._id?.toString());
//         const conversationReceiver = await getConversation(msgByUserId);

//         io.to(user?._id?.toString()).emit('conversation',conversationSender );
//         io.to(msgByUserId).emit('conversation', conversationReceiver);
//     })

//     // disconnect
//     socket.on('disconnect', () => {
//         onlineUser.delete(user?._id?.toString());
//         console.log('disconnect user', socket.id);
//     })
// })

// module.exports = {
//     app,
//     server
// }






