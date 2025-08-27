export default function query<T = any>(queryText: string, params?: any[], retries?: number, delayMs?: number): Promise<{
    rows: T[];
}>;
//# sourceMappingURL=db.d.ts.map