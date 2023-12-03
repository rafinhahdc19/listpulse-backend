const express = require('express')
const routes = express.Router()
const auth = require("./middleware/auth") //verifica usuario sem consultar no banco de dados
const getuser = require("./middleware/getuser")
//controllers auth
const loginController = require('./controllers/auth/logincontroller')
const registerController = require('./controllers/auth/registercontroller')
const authVerifyController = require("./controllers/auth/authVerifyController")
//controllers tasks
const getTasks = require("./controllers/task/getTasks")
const createTask = require("./controllers/task/createTasks")
const deleteTask = require("./controllers/task/deleteTasks")
const updateTask = require("./controllers/task/updateTasks")
//controllers collections
const getCollections = require("./controllers/collections/getCollections")
const createCollection = require('./controllers/collections/createCollections')
const deleteCollection = require('./controllers/collections/deleteCollections')
const updateCollection = require('./controllers/collections/updatecollections')

//auth
routes.post("/auth/register", registerController)
routes.post("/auth/login", loginController)
routes.get("/getuser", getuser, async (req,res) => {
    try{
        const user = req.user;
        const { username, email, status } = user;
        
        return res.status(200).json({ username, email, status });
    }catch(err){
        return res.status(401).json({ error: 'Token inválido. Acesso não autorizado.' });
    }
    

})
routes.post("/auth/emailverify/verify", authVerifyController)

//tasks
routes.post("/tasks", auth, getTasks)
routes.post("/tasks/create", auth, createTask)
routes.delete("/tasks/delete", auth, deleteTask)
routes.patch("/tasks/update", auth, updateTask)
//collections
routes.get("/collections", auth, getCollections)
routes.post("/collections/create", auth, createCollection)
routes.delete("/collections/delete", auth, deleteCollection)
routes.patch("/collections/update", auth, updateCollection)

module.exports = routes;