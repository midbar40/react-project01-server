import express, { Router, Request, Response } from "express";
import crypto from 'crypto';

const users: ClientMap = {}; // 클라이언트 객체를 저장할 객체

export interface ClientMap {
    [key: string]: express.Response; // key는 string, value는 express.Response인 객체
}

export const setServerSentEvent = (res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream'); // 서버가 클라이언트에게 보내는 컨텐츠 타입, text/event-stream은 서버-클라이언트 간의 단방향 통신을 위한 타입
    res.setHeader('Cache-Control', 'no-cache'); // 클라이언트가 캐싱하지 않도록 설정, 항상 서버로부터 데이터를 받아옴
    res.setHeader('Connection', 'keep-alive'); // 서버와 클라이언트의 연결 유지, 클라이언트가 연결을 끊을 때까지 계속 연결 유지

    const clientId = crypto.randomBytes(16).toString('hex');
    users[clientId] = res; // users 객체의 key로 클라이언트 아이디, value로 res 객체 저장
    return clientId;
}

export const sendEventToClients = (message: string) => {
    Object.values(users).forEach(client => { // users 객체의 value들을 순회하며, 클라이언트에게 이벤트 전송
        client.write(`data: ${JSON.stringify({ message })}\n\n`); // \n\n은 이벤트의 끝을 의미
    });
}

export const handleClientDisconnect = (clientId: string) => {
    delete users[clientId]; // 클라이언트 연결 종료 시 users 객체에서 해당 클라이언트 삭제
}