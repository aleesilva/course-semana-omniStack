const connection = require('../database/connection');
const TABLE_NAME = 'incidents';

module.exports = {
  async index(request, response) {
    const ong_id = request.headers.authorization;
    const incidents = await connection(TABLE_NAME).where('ong_id', ong_id).select("*");

    return response.json(incidents);
  }
}