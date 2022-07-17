export interface Error {
    title: string;
    instance: string;
    status: number;
}

export function processApiResponse(response: Response) {
    if (response.status < 400) {
        // Should be normal response, just pass
        return response.json();
    }

    response.json().then(json => {
        throw json as Error;
    });
}
