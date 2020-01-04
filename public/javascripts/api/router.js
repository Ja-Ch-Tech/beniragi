import { getHostApi, getUserId } from './init.js';
import { login, register, getStatsUsers as statsUsers, getNav, activeAccount, sidebar, statsInDashboard as miniStats, topFreelancer, getDropAnfooterJobs, getDropAnfooterTown } from './users_api.js';
import { getJobs } from './jobs.js';
import { graph } from './view.js';


(() => {
    login();
    register();
    getNav();
    getDropAnfooterJobs(null);
    getDropAnfooterTown();
    var pathName = window.location.pathname;
    //#region /
        if (pathName == "/") {
            statsUsers();
            getJobs(8);
            topFreelancer(15);
        }
    //#endregion

    //#region Profile
        if (pathName.split("/")[1] == "profile") {
            if (pathName.split("/")[2] == "activation") {
                getUserId(function (state, user_id) {
                    if (state) {
                        activeAccount(user_id.user_id);
                    }
                })
            }

            if (/dashboard/i.test(pathName.split("/")[pathName.split("/").length - 1])) {
                miniStats();
                graph();
            }
            
        }
    //#endregion

    
})();