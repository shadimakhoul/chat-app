const functions = require("./functions")

module.exports = (io, query) => {
    //socket io middleware
    io.use(async (socket, next) => {
        let token = socket.handshake.auth.token;
        if (token){
            const { data } = await functions.getAuth(token)
            socket.username = data.data.user_name;
            socket.userId = data.data.id
            if(data.isSuccessful){
                next()
            }
        }
    })

    //real time chat
    io.on("connection", (socket) => {
        socket.join(socket.username)

        socket.on("get-chat", ({chat_id, userNumber}) => {
            socket.chat_id = chat_id
            socket.userNumber = userNumber
        })

        socket.on("seen", () => {
            query(`UPDATE chats SET seen = 0 where id = ${socket.chat_id}`, (err) => {
                if (err) {
                    console.log(err.message);
                }
            })
        });

        socket.on("message",async ({message, date, to, replyTo}) => {//get new message
            const { data } = await functions.getAuth(socket.handshake.auth.token)
            //adding userNumber at the beginning of each meassage to be able to know who is the owner of the maessage
            if (data.isSuccessful){// Check if Authenticated
                if (functions.checkString(message)){
                    let databaseMessage = socket.userNumber + message // add the owner number of the user to the message
                    let timeUtc = functions.getCurrenUtcTime(date);
                    query(`UPDATE chats SET updated_at = '${timeUtc}', seen = ${socket.userId}, last_message = '${message}' where id = ${socket.chat_id}`, (err) => {
                        if(err){
                            console.log(err.message);
                        }
                    })
                    query(`Insert Into messages (message, chat_id, reply) values(' ${databaseMessage} ', ${socket.chat_id}, ' ${replyTo} ')`, (err, res) => {
                        if(err){
                            console.log("Query err", err.message);
                        }
                        socket.broadcast.to(to).emit("new-message", {message: message, date: timeUtc, from: socket.username, userId:socket.userId, replyTo: replyTo})//send the message to receiver
                    })
                }else {
                    socket.emit("adminMessage", {message: "You can't Send this type of messages"})
                }
            }
        })

        socket.on("disconnect", (socket) => {
            console.log(socket);
        })
    })

}