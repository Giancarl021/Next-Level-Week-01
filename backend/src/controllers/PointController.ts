import { Request, Response } from 'express';
import knex from '../database/connection';
import { address } from 'ip';
class PointController {

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('point')
            .where('id', id)
            .first();

        point.image = `http://${address()}:3333/uploads/points/` + point.image;

        if (!point) {
            return response.status(400).json({
                error: 'Point not founded'
            })
        }

        const items = (await knex('item')
            .join('point_item', 'point_item.id', '=', 'item.id')
            .where('point_item.point_id', id)
            .select('item.title')).map(item => item.title);

        return response.json({
            ...point,
            items
        });
    }

    async index(request: Request, response: Response) {
        const params = ['city', 'uf', 'items'];
        const data = request.query;

        const parsed: any = {};

        for (const item of params) {
            if (data.hasOwnProperty(item)) {
                parsed[item] = String(data[item])
                    .split(',')
                    .map(i => i.trim());
                if (item === 'items') {
                    parsed[item] = parsed[item].map((i: String) => Number(i));
                }
            } else {
                parsed[item] = [];
            }
        }

        const points = await knex('point')
            .join('point_item', 'point.id', '=', 'point_item.point_id')
            .whereIn('point_item.item_id', parsed.items)
            .whereIn('city', parsed.city)
            .whereIn('uf', parsed.uf)
            .distinct()
            .select('point.*');

        const serializedPoints = points.map((point: any) => ({
            ...point,
            image: `http://${address()}:3333/uploads/points/` + point.image
        }));

        return response.json(serializedPoints);
    }

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        const trx = await knex.transaction();

        try {
            const point = {
                name,
                email,
                whatsapp,
                latitude: Number(latitude),
                longitude: Number(longitude),
                city,
                uf,
                image: request.file.filename
            };

            const [point_id] = await trx('point').insert(point);

            const pointItems = items
                .split(',')
                .map((item: string) => Number(item.trim()))
                .map((id: number) => {
                    return {
                        item_id: id,
                        point_id
                    }
                });

            await trx('point_item').insert(pointItems);

            await trx.commit();

            point.image = `http://${address()}:3333/uploads/points/` + point.image;

            return response.json({
                id: point_id,
                ...point
            });

        } catch (err) {
            await trx.rollback();
            return response.status(400).json({
                error: err
            });
        }
    }
}

export default PointController;