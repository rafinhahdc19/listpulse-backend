const jwt = require('jsonwebtoken');
const prisma = require('../services/prisma');
const auth = async (req, res, next) => {
    const token = req.headers['authorization'];
    console.log(token)
    if (!token) {
        return res.status(401).json({ error: 'Token não encontrado. Acesso não autorizado.' });
    }
    const bearer = token.split(" ");
    const bearerToken = bearer[1]
    try{
        jwt.verify(bearerToken, process.env.SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token inválido. Acesso não autorizado.' });
            }
            req.userId = decoded.id;
        });
    }catch(err){
        return res.status(401).json({ error: 'Acesso não autorizado.' });
    }
    try{
        const userId = req.userId
        const response = await prisma.users.findUnique({
            where:{
                id:userId
            }
        })
        if(response){
            req.user = response
            next();
        }else{
            return res.status(401).json({ error: 'Token inválido. Acesso não autorizado.' });
        }
    }catch(err){
        return res.status(401).json({ error: 'Acesso não autorizado.' });
    }
};

module.exports = auth;