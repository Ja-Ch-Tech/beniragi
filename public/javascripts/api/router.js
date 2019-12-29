import { getHostApi, getUserId } from './init.js';
import { login, register, getStatsUsers as statsUsers, getNav, activeAccount, sidebar } from './users_api.js';
import { getJobs } from './jobs.js';


(() => {
    login();
    register();
    getNav();
    
    var pathName = window.location.pathname;
    //#region /
        if (pathName == "/") {
            statsUsers();
            getJobs(8);
        }
    //#endregion

    //#region/
        if (pathName.split("/")[1] == "profile") {
            sidebar()
            if (pathName.split("/")[2] == "activation") {
                console.log("mbuyu")
                getUserId(function (state, user_id) {
                    if (state) {
                        activeAccount(user_id.user_id);
                    }
                })
            }
            
        }
    //#endregion

    
})();