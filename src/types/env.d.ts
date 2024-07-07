declare namespace NodeJS {
    interface ProcessEnv {
        JWT_SECRET_AccessToken: string; 
        JWT_SECRET_RefreshToken: string;
    }
}