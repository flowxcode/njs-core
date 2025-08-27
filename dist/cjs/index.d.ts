import query from './db';
import apiHandler from './api-handler';
declare const _default: {
    STATUS: {
        OK: number;
        ERROR: number;
        CONFLICT: number;
        NOT_FOUND: number;
        BAD_REQUEST: number;
        UNAUTHORIZED: number;
    };
    query: typeof query;
    logger: import("winston").Logger;
    apiHandler: typeof apiHandler;
};
export default _default;
//# sourceMappingURL=index.d.ts.map