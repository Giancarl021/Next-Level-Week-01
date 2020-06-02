import { Router } from 'express';

const routes = Router();

routes.get('/users', (req, res) => {
    console.log('User listing');

    res
        .status(200)
        .json([
            'Jão',
            'Carlinhos'
        ]);
});

export default routes;