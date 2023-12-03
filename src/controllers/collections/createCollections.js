const prisma = require("../../services/prisma");

const createCollection = async (req, res) => {
  const { name } = req.body;
  const userId = req.userId.id;

  try {
    // Verificar o número total de coleções do usuário
    const userCollectionsCount = await prisma.collection.count({
      where: {
        userid: userId,
      },
    });

    // Definir o número máximo de coleções permitido
    const maxCollectionsAllowed = 25;

    if (userCollectionsCount >= maxCollectionsAllowed) {
      return res.status(400).json({ error: 'Você atingiu o limite máximo de coleções permitidas' });
    }

    const existingCollection = await prisma.collection.findFirst({
      where: {
        titulo: name,
        userid: userId,
      },
    });

    if (existingCollection) {
      return res.status(400).json({ error: 'Você já tem uma coleção com o mesmo nome' });
    }

    const newCollection = await prisma.collection.create({
      data: {
        titulo: name,
        userid: userId,
      },
    });

    res.status(201).json({ success: true, collection: newCollection });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = createCollection;
