const prisma = require("../../services/prisma");

const updateTask = async (req, res) => {
  const { taskId, collectionName, newName, newStatus } = req.body;
  const userId = req.userId.id;

  // Verifica se ambos os parâmetros ou nenhum foram fornecidos
  if ((!newName && newStatus === undefined) || (newName && newStatus !== undefined)) {
    return res.status(400).json({ message: 'Forneça apenas um dos parâmetros: newName ou newStatus' });
  }

  if (!taskId || !collectionName) {
    return res.status(400).json({ message: 'Parâmetros inválidos' });
  }

  try {
    const collection = await prisma.collection.findFirst({
      where: {
        titulo: collectionName,
        userid: userId,
      },
    });

    if (!collection) {
      return res.status(400).json({ error: 'Essa coleção não existe ou não pertence ao usuário' });
    }

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        collectionid: collection.id,
      },
    });

    if (!task) {
      return res.status(400).json({ error: 'Essa tarefa não existe ou não pertence à coleção' });
    }

    // Atualizar o nome da tarefa
    if (newName) {
      const updatedTask = await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          titulo: newName,
        },
      });

      res.status(200).json({ success: true, task: updatedTask, message: 'Nome alterado com sucesso' });
    }

    // Atualizar o status da tarefa se newStatus for 0 ou 1
    if (newStatus !== undefined && (newStatus === 0 || newStatus === 1)) {
      const updatedTask = await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          status: newStatus,
        },
      });

      res.status(200).json({ success: true, task: updatedTask, message: 'Status alterado com sucesso' });
    } else if (newStatus !== undefined) {
      return res.status(400).json({ message: 'O newStatus deve ser 0 ou 1' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = updateTask;
