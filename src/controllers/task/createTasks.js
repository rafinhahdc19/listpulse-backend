const prisma = require("../../services/prisma");

const createTask = async (req, res) => {
    const { collection, name } = req.body
    const userId = req.userId.id;
    if (!collection || !name) {
        return res.status(400).json({ message: 'Parâmetros inválidos' });
    }
    try {

        const collectionDB = await prisma.collection.findFirst({
            where: {
                titulo: collection,
                userid: userId,
            }
        })
        if (!collectionDB) {
            return res.status(400).json({ error: 'Essa coleção não existe ou não pertence ao usuário' });
        }
        const userTaskWithCollectionCount = await prisma.task.count({
            where: {
                collectionid: collectionDB.id,
            },
        });

        const maxCollectionsAllowed = 25;

        if (userTaskWithCollectionCount >= maxCollectionsAllowed) {
            return res.status(400).json({ error: 'Você atingiu o limite máximo de taréfas permitidas' });
        }
        const newTask = await prisma.task.create({
            data: {
                titulo: name,
                status: 0,
                collectionid: collectionDB.id
            }
        })
        res.status(201).json({ success: true, collection: newTask });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno do server' });
    }
}
module.exports = createTask