import { NextResponse } from 'next/server';
export declare function apiHandler<T>(fn: () => Promise<T>, options?: {
    useTransaction?: boolean;
}): Promise<NextResponse>;
//# sourceMappingURL=api-handler.d.ts.map