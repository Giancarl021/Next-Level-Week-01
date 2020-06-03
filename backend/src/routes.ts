import { Router } from 'express';

import PointController from './controllers/PointController';
import ItemController from './controllers/ItemController';

import PointValidator from './validators/PointValidator';

const pointController = new PointController();
const itemController = new ItemController();
const pointValidator = new PointValidator();

const routes = Router();

routes.get('/items', itemController.index);

routes.get('/points', pointValidator.index(), pointController.index);
routes.post('/points', pointValidator.create(), pointController.create);
routes.get('/points/:id', pointValidator.show(), pointController.show);
export default routes;