import { getHostApi } from './init.js';
import { login, register, getStatsUsers as statsUsers } from './users_api.js';

(() => {
    login();
    register();

    var pathName = window.location.pathname;
    //#region /
        if (pathName == "/") {
            statsUsers();
        }
    //#endregion
})();