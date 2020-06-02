import server from './src/server';

const PORT: number = Number(process.env.PORT) || 3333;

server.listen(PORT);