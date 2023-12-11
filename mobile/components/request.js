export const baseUrl = "https://smeatonsoftware.co.uk/api/";

export default class APIRequest {
    constructor(path, body, method) {
        this.path = path;
        this.body = body;
        this.method = method;
    }

    async execute(json = true) {
        let optn = {
            method: this.method,
            mode: "no-cors",
            body: this.body.length > 0 ? JSON.stringify(this.body) : null,
            headers: this.body.length > 0 ? {
                "Content-Type": "application/json"
            } : {}
        }
        const response = await fetch(baseUrl + this.path, optn);
        return json ? await response.json() : await response.text();
    }

    async executeWithCallback(successCallback = (data) => {
    }, errorCallback = (data) => {
    }, json = true, headers = {}) {
        let head = this.body != "" ? {
            ...headers,
            "Content-Type": "application/json"
        } : {...headers};

        let optn = {
            method: this.method,
            body: this.body != "" ? JSON.stringify(this.body) : null,
            headers: head
        }

        fetch(baseUrl + this.path, optn).then(
            async (response) => {
                const data = json ? await response.json() : await response.text();
                if (response.status == 200) {
                    successCallback(data);
                } else {
                    errorCallback(data);
                }
            }
        ).catch(
            x=>console.error(x)
        )
    }
}
