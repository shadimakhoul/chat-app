module.exports = (app, query) => {
    // app.get("/chat-app/admin/get-chats", (req, res) => {
    //     query("SELECT ch.id, ch.user1, ch.user2, us.user_name, sev.user_name from chats ch INNER join users us on ch.user1 = us.id INNER JOIN ( SELECT users.user_name, chats.user1, chats.user2, chats.id FROM chats INNER JOIN users on chats.user2 = users.id) sev on sev.id = ch.id", (err, result) => {
    //         if (err){
    //             return res.status(500).json(err.message)
    //         }
    //         return res.json(result)
    //     })
    // })
}