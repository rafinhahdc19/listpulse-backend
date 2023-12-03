const prisma = require("../../services/prisma");

const getCollections = async (req, res) => {
  try {
    const userId = req.userId;

    const collectionsWithTasksCount = await prisma.collection.findMany({
      where: {
        userid: userId.id,
      },
      select: {
        id: true,
        titulo: true,
      },
    });

    const tasksCountPromises = collectionsWithTasksCount.map(async (collection) => {
      const tasksCount = await prisma.task.count({
        where: {
          collectionid: collection.id,
        },
      });
      return {
        id: collection.id,
        titulo: collection.titulo,
        tasksCount,
      };
    });

    const formattedCollections = await Promise.all(tasksCountPromises);

    return res.status(200).json({ collections: formattedCollections });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

module.exports = getCollections;
