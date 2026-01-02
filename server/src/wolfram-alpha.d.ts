declare module '@wolfram-alpha/wolfram-alpha-api' {
    interface WolframAlphaAPIInstance {
        getShort(query: string): Promise<string>;
        getFull(query: string): Promise<any>;
        getSimple(query: string): Promise<Buffer>;
        getSpoken(query: string): Promise<string>;
    }

    function WolframAlphaAPI(appId: string): WolframAlphaAPIInstance;
    export = WolframAlphaAPI;
}
