import { getHostApi } from './init.js';
import { login, register, getStatsUsers as statsUsers, getNav } from './users_api.js';

(() => {
    login();
    register();
    getNav();
    
    var pathName = window.location.pathname;
    //#region /
        if (pathName == "/") {
            statsUsers();
        }
    //#endregion
})();