const prisma = require("../../services/prisma");
const updateCollection = async (req, res) => {
    const { name, newName } = req.body;
    const userId = req.userId.id; // Supondo que você tenha o ID do usuário na requisição
  
    if (!name || !newName) {
      return res.status(400).json({ message: 'Parâmetros inválidos' });
    }
  
    try {
      const existingCollection = await prisma.collection.findFirst({
        where: {
          titulo: name,
          userid: userId,
        },
      });
  
      if (!existingCollection) {
        return res.status(400).json({ error: 'Essa coleção não existe ou não pertence ao usuário' });
      }
  
      // Verificar se já existe outra coleção com o mesmo novo nome
      const existingWithNewName = await prisma.collection.findFirst({
        where: {
          titulo: newName,
          userid: userId,
          NOT: {
            id: existingCollection.id,
          },
        },
      });
  
      if (existingWithNewName) {
        return res.status(400).json({ error: 'Já existe uma coleção com o mesmo novo nome' });
      }
  
      // Atualizar o nome da coleção
      const updatedCollection = await prisma.collection.update({
        where: {
          id: existingCollection.id,
        },
        data: {
          titulo: newName,
        },
      });
  
      res.status(200).json({ success: true, updatedCollection });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
  
module.exports = updateCollection;