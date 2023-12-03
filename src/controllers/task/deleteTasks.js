const prisma = require("../../services/prisma");

const deleteTask = async (req,res) => {
    const { taskId, collectionName } = req.body;
    const userId = req.userId.id;

    if (!taskId || !collectionName) {
        return res.status(400).json({ message: 'Parâmetros inválidos' });
    }
    try{

        const collection = await prisma.collection.findFirst({
            where: {
                titulo:collectionName,
                userid:userId
            }
        })
        if(!collection){
            return res.status(400).json({ error: 'Essa coleção não existe ou não pertence ao usuário' });
        }
        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                collectionid: collection.id
            }
        })
        if (!task) {
            return res.status(400).json({ error: 'Essa tarefa não existe ou não pertence à coleção' });
        }
        await prisma.task.delete({
            where: {
              id: task.id,
            },
        });
        res.status(200).json({ success: true, message: 'Tarefa deletada com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
}
module.exports = deleteTask