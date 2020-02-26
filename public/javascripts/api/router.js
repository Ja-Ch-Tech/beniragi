import { getHostApi, getUserId, storageKeys, megaSearch } from './init.js';
import { login, register, getStatsUsers as statsUsers, getNav, activeAccount, sidebar, statsInDashboard as miniStats, topFreelancer, getDropAnfooterJobs, getDropAnfooterTown, detailsUser, recouveryAccount, changePassword } from './users_api.js';
import { getJobs } from './jobs.js';
import { graph } from './view.js';
import { messageList } from './offer.js';
import { getVIPFreelancers as VIP, boost } from './vip.js';


(() => {
    login();
    register();
    getNav();
    getDropAnfooterJobs(7);
    getDropAnfooterTown();
    var pathName = window.location.pathname;
    //#region /
    if (pathName == "/") {
        statsUsers();
        getJobs(8);
        topFreelancer(15);
        VIP(20);
        storageKeys("mega-search-home", (response) => {
            window.location.href = "candidats/liste";
        });
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

        if (/messages/i.test(pathName.split("/")[pathName.split("/").length - 1])) {
            messageList();
        }

        if (/boost/i.test(pathName.split("/")[pathName.split("/").length - 1])) {
            boost();
        }

    }
    //#endregion

    //#region Candidats
    if (/candidats|candidat/i.test(pathName.split("/")[1])) {
        if (/profile/i.test(pathName.split("/")[pathName.split("/").length - 1])) {
            detailsUser(pathName.split("/")[pathName.split("/").length - 2]);
        }

        if (/liste/i.test(pathName.split("/")[pathName.split("/").length - 1])) {
            //Relance quand on tombe sur cette page
            megaSearch();

            //Lorsqu'on soummet le formulaire de la page recherche
            storageKeys("form-candidat-list", (response) => {
                megaSearch();
            });
        }
    }
    //#endregion

    //#region Recuperation mot de passe
    if (/recuperation/i.test(pathName.split("/")[1])) {
        if (/mdp/i.test(pathName.split("/")[2])) {
            recouveryAccount();
        }
    }

    if (/activation/i.test(pathName.split("/")[1])) {
        changePassword();
    }
    //#endregion

})();