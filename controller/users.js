const moment = require("moment");
var functions = require("./functions")

module.exports = (app, query) => {
    app.get("/chat-app", (req, res)=>{
        return res.send("<h4>Welcome this is the live chat app feel free to destroy it </h4>")
    })
    //get chat between two users
    app.post("/chat-app/get-chat", async (req, res) => {
        try {
            const token = req.headers.authorization;
            if (token === "xxxx"){
                var [user1, user2] = [ req.body.user1, req.body.user2]
            }else{
                const { data } = await functions.getAuth(token)//authorize the user
                var [user1, user2] = [ data.data.id, req.body.user2]
            }
            if (!user1 || !user2){
                return res.status(400).json("bad request please send user1 and user2")
            }
            //get the chat info 
            query(`SELECT messages.chat_id, messages.date, messages.message, messages.reply, chats.user1, chats.user2  FROM messages INNER JOIN chats on chats.id = messages.chat_id WHERE ((chats.user1 = ${user1} AND chats.user2 = ${user2}) OR (chats.user1 = ${user2} AND chats.user2 = ${user1} ))  Order By messages.date`, async (err, result) => {
                if (err) return res.status(500).json(err.message);
                if( result.length ){//if there is a chat
                    if (user1 == result[0].user1){//if user 1 asked for the chat 
                        result[0] = { userNumber: 1, ...result[0] }
                    }else{//if user 2 asked for the chat
                        result[0] = { userNumber: 2, ...result[0] }
                    }
                    return res.json(result);
                }else{//if there is no chat yet
                    //create chat in the database
                    let created_at = moment().utc().format('YYYY-MM-DD HH:mm')
                    const chat = await query(`insert into chats (user1, user2, last_message, created_at, updated_at) Values (${user1}, ${user2}, ' Chat Created','${created_at}', '${created_at}')`)
                    const chatCreated = await query(`insert into messages (chat_id, message) Values (${chat.insertId}, " 0Chat Created")`)
                    //user1 is the one who started the chat and {userNumber: int} frontend must add it to 'socket auth handshake' and push it at the beginning of each message 
                    return res.json( [{ userNumber: 1, chat_id: chat.insertId, message: " 0Chat Just Created", date: created_at }])
                }
            })
        } catch (error) {
            return res.json(error.message)
        }
    })
    //get all chats
    app.get("/chat-app/get-chats", async (req, res)=>{
        try {
            const token = req.headers.authorization;
            const { data } = await functions.getAuth(token)//authorize the user
            if (data.isSuccessful){
                query(`Select DISTINCT users.user_name, users.id, chats.updated_at, chats.seen, chats.last_message from chats Inner Join users on chats.user1 = users.id OR chats.user2 = users.id where (chats.user1 = ${data.data.id}) OR (chats.user2 = ${data.data.id}) ORDER BY chats.updated_at DESC`, (err, result) => {
                    if(err){
                        return res.status(500).json(err.message)
                    }
                    result = Object.values(JSON.parse(JSON.stringify(result)));
                    result = result.filter( e => {return e.user_name != data.data.user_name })
                    return res.json(result)
                })
            }else{
                return res.status(401).json({result: "not authorized"})
            }
        } catch (error) {
            return res.json(error.message)
        }
    })
}