declare namespace NodeJS {
    interface ProcessEnv {
        PORT: number;
        POSTGRE_DB_USER: string; 
        POSTGRE_DB_HOST: string; 
        POSTGRE_DB_DATABASE: string; 
        POSTGRE_DB_PASSWORD: string; 
        POSTGRE_DB_PORT: number;
        Mailjet_API_Keys: string; 
        Mailjet_Secret_Keys: string; 
        JWT_SECRET_AccessToken: string; 
        JWT_SECRET_RefreshToken: string;
    }
}