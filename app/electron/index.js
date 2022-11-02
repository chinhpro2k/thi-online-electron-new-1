import { __awaiter } from "tslib";
import { initMain } from '@/core/main.init';
function startApp() {
    return __awaiter(this, void 0, void 0, function* () {
        yield initMain();
        yield import('./main');
    });
}
startApp();
