import { createClient } from 'redis';

const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));

// 클라이언트 연결함수
export async function connectRedis() {
    if (!client.isOpen) await client.connect();
}

// 클라이언트 객체를 직접 export 
export { client };