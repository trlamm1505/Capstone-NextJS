import axios, { AxiosHeaders } from "axios";

const api = axios.create({
    baseURL: "https://airbnbnew.cybersoft.edu.vn/api",
});

api.interceptors.request.use((config) => {
    const tokenCybersoft = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJOb2RlanMgNTIiLCJIZXRIYW5TdHJpbmciOiIyNy8wNC8yMDI2IiwiSGV0SGFuVGltZSI6IjE3NzcyNDgwMDAwMDAiLCJuYmYiOjE3NTg5MDk2MDAsImV4cCI6MTc3NzM5OTIwMH0._b9cEhCuhW5AQ7TsywHkbc2NkdJDSmQZYCxkjTSbv3I";

    if (!config.headers) config.headers = {} as any;
    if (config.headers instanceof AxiosHeaders) {
        config.headers.set("tokenCybersoft", tokenCybersoft);
    } else {
        (config.headers as any)["tokenCybersoft"] = tokenCybersoft;
    }

    (config.headers as any)["Cache-Control"] = "no-cache";
    (config.headers as any)["Pragma"] = "no-cache";

    if ((config.method || "get").toLowerCase() === "get") {
        const currentParams = new URLSearchParams((config.params as any) || {});
        currentParams.set("_ts", String(Date.now()));
        config.params = Object.fromEntries(currentParams.entries());
    }
    return config;
});

export default api;
