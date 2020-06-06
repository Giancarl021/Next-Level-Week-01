import { Request, Response } from 'express';
import knex from '../database/connection';
import { address } from 'ip';

class ItemController {
    async index(request: Request, response: Response) {
        const items = await knex('item').select('*');

        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://${address()}:3333/uploads/${item.image}`
            };
        });
        return response.json(serializedItems);
    }
}

export default ItemController;