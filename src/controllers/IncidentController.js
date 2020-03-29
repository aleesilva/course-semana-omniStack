const connection = require('../database/connection');
const TABLE_NAME = 'incidents';
module.exports = {

    async index(request, response) {
        const { page = 1 } = request.query;

        const [count] = await connection(TABLE_NAME).count();

        const incidents = await connection(TABLE_NAME)
            .join('ongs', 'ongs.id', '=', `${TABLE_NAME}.ong_id`)
            .limit(5)
            .offset((page - 1) * 5)
            .select([`${TABLE_NAME}.*`,
                'ongs.name',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf'
            ]);

        response.header('X-Total-Count', count['count(*)']);
        return response.json(incidents);
    },


    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection(TABLE_NAME).insert({
            title,
            description,
            value,
            ong_id
        });

        return response.json({ id });
    },

    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;
        const incident = await connection(TABLE_NAME)
            .where('id', id)
            .select('ong_id')
            .first();

        if (incident.ong_id !== ong_id) {
            return response.status(401).json({ erro: "Operacao nao autorizada" });
        }

        await connection(TABLE_NAME).where('id', id).delete();

        return response.status(204).send();
    }
};