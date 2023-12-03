const prisma = require("../../services/prisma");
const deleteCollection = async (req, res) => {
    const { name } = req.body;
    const userId = req.userId.id;
  
    if (!name) {
      return res.status(400).json({ message: 'O nome de verificação não está presente' });
    }
  
    try {
      await prisma.$transaction(async (tx) => {
        const existingCollection = await tx.collection.findFirst({
          where: {
            titulo: name,
            userid: userId,
          },
          include: {
            tasks: true,
          },
        });
  
        if (!existingCollection) {
          return res.status(400).json({ error: 'Essa coleção não existe' });
        }
  
        await tx.task.deleteMany({
          where: {
            collectionid: existingCollection.id,
          },
        });
  
        await tx.collection.delete({
          where: {
            id: existingCollection.id,
          },
        });
  
        res.status(200).json({ success: true, message: 'Coleção e tarefas relacionadas excluídas com sucesso' });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };
  
  module.exports = deleteCollection;