const prisma = require("../../services/prisma");

const getTasks = async (req, res) => {
  const { name, page } = req.body;
  const userId = req.userId.id;

  if (!name || !page || isNaN(parseInt(page))) {
    return res.status(400).json({ message: 'Parâmetros inválidos' });
  }

  const itemsPerPage = 25;
  const offset = (parseInt(page) - 1) * itemsPerPage;

  try {
    const collection = await prisma.collection.findFirst({
      where: {
        titulo: name,
        userid: userId,
      },
      include: {
        tasks: {
          take: itemsPerPage,
          skip: offset,
        },
      },
    });

    if (!collection) {
      return res.status(400).json({ error: 'Essa coleção não existe ou não pertence ao usuário' });
    }

    const tasks = collection.tasks;

    return res.status(200).json({ tasks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = getTasks;
