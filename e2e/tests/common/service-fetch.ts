interface RestApiOptions {
    token?: string;
    body?: any;
}

interface RestApiRes {
    status: number;
    body: any;
}

export class ServiceFetch {
    constructor(
        private readonly url: string
    ) {}

    async get(path: string, options?: RestApiOptions): Promise<RestApiRes> {
        const fetchResponse = await fetch(`${this.url}${path}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(options?.token ? { "Authorization": `Bearer ${options.token}` } : {})
            },
            body: options?.body ? JSON.stringify(options.body) : undefined
        });

        const text = await fetchResponse.text(); 
        const body = text ? JSON.parse(text) : undefined;
        
        return {
            body,
            status: fetchResponse.status
        };
    }

    async post(path: string, options?: RestApiOptions): Promise<RestApiRes> {
        const fetchResponse = await fetch(`${this.url}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(options?.token ? { "Authorization": `Bearer ${options.token}` } : {})
            },
            body: options?.body ? JSON.stringify(options.body) : undefined  
        });

        const text = await fetchResponse.text(); 
        const body = text ? JSON.parse(text) : undefined;
        
        return {
            body,
            status: fetchResponse.status
        };
    }

    async put(path: string, options?: RestApiOptions): Promise<RestApiRes> {
        const fetchResponse = await fetch(`${this.url}${path}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(options?.token ? { "Authorization": `Bearer ${options.token}` } : {})
            },
            body: options?.body ? JSON.stringify(options.body) : undefined  
        });

        const text = await fetchResponse.text(); 
        const body = text ? JSON.parse(text) : undefined;
        
        return {
            body,
            status: fetchResponse.status
        };
    }

    async delete(path: string, options?: RestApiOptions): Promise<RestApiRes> {
        const fetchResponse = await fetch(`${this.url}${path}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(options?.token ? { "Authorization": `Bearer ${options.token}` } : {})
            },
            body: options?.body ? JSON.stringify(options.body) : undefined  
        });

        const text = await fetchResponse.text(); 
        const body = text ? JSON.parse(text) : undefined;

        return {
            body,
            status: fetchResponse.status
        };
    }
}