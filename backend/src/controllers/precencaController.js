import PresencaModel from "../models/Presenca.js";

export const salvarPresencas = async (req, res) => {
    try {
        const presencas = req.body;

        for (const presenca of presencas) {
            const { idMembro, nomeMembro, data, presente } = presenca;

            const dataNormalizada = new Date(data);
            dataNormalizada.setHours(0, 0, 0, 0);

            const registroExistente = await PresencaModel.findOne({
                idMembro,
                'presencas.data': { $gte: dataNormalizada, $lt: new Date(dataNormalizada.getTime() + 24 * 60 * 60 * 1000) },
            });

            if (registroExistente) {
                // Atualiza a presença existente corretamente
                await PresencaModel.updateOne(
                    {
                        idMembro,
                        'presencas.data': { $gte: dataNormalizada, $lt: new Date(dataNormalizada.getTime() + 24 * 60 * 60 * 1000) },
                    },
                    { $set: { 'presencas.$.presente': presente } }
                );
            } else {
                // Adiciona um novo registro corretamente
                await PresencaModel.updateOne(
                    { idMembro },
                    {
                        $set: { nomeMembro },
                        $push: { presencas: { data: dataNormalizada, presente } },
                    },
                    { upsert: true }
                );
            }
        }

        res.status(200).json({ message: 'Presenças salvas com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao salvar presenças.' });
    }
};


export const buscarPresencasDoDia = async (req, res) => {
    try {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Normaliza a data para o início do dia

        // Busca todas as presenças registradas para o dia atual
        const presencas = await PresencaModel.find({
            'presencas.data': { $gte: hoje, $lt: new Date(hoje.getTime() + 24 * 60 * 60 * 1000) },
        });

        res.status(200).json(presencas);
    } catch (error) {
        console.error('Erro ao buscar presenças do dia:', error);
        res.status(500).json({ message: 'Erro ao buscar presenças do dia.' });
    }
};


export const buscarTodos = async (req, res) => {

    try {
        const presencas = await PresencaModel.find();
        res.status(200).json(presencas);
    } catch (error) {
        console.error('Erro ao buscar presenças:', error);
        res.status(500).json({ message: 'Erro ao buscar presenças.' });
    }
};