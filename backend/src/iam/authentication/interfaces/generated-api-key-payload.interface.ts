export interface GeneratedApiKeyPayload {
    // user-friendly api key
    bufferedApiKey: string;
    // store in db
    hashedKey: string;
}
