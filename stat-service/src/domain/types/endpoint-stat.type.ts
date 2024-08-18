interface EndpointStat {
    name: string;
    [x: string]:
    | {
        Calls: number;
        Errors: number;
        Latency: number;
    }
    | string;
}