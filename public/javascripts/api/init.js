
const getHostApi = () => {
    //return "http://localhost:3456/";
    return "https://api-beniragi-service.herokuapp.com/";
}

const getHostWeb = () => {
    return "http://localhost:3000/"; //Local
}

//fonction de modélisation de la date
const customDate = (date) => {
    var myDate = new Date(date),
        jour = function () {

            return parseInt(myDate.getDate()) < 10 ? '0' + myDate.getDate() : myDate.getDate()
        },
        mois = function () {

            //return myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1
            var month = myDate.getMonth() + 1;

            //La date par rapport à sa nomination
            switch (month) {
                case 1:
                    return 'janvier'
                    break;
                case 2:
                    return 'février'
                    break;
                case 3:
                    return 'mars'
                    break;
                case 4:
                    return 'avril'
                    break;
                case 5:
                    return 'mai'
                    break;
                case 6:
                    return 'juin'
                    break;
                case 7:
                    return 'juillet'
                    break;
                case 8:
                    return 'août'
                    break;
                case 9:
                    return 'septembre'
                    break;
                case 10:
                    return 'octobre'
                    break;
                case 11:
                    return 'novembre'
                    break;
                case 12:
                    return 'décembre'
                    break;
                default:
                    return null
                    break;
            }
        },
        heure = function () {

            return myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours()

        },
        minute = function () {

            return myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes()

        };

    return jour() + ' ' + mois() + ' ' + myDate.getFullYear();
}

//Permet de recuperer tous les types utilisateurs
const getAllTypesUser = (callback) => {
    $.ajax({
        type: 'GET',
        url: "/api/users/getAllTypes",
        dataType: "json",
        success: function (data) {            
            if (data.getEtat) {
                callback(data.getObjet);
            }else{
                callback(null);
            }
        },
        error : function (err) {
            callback(err)
        }
    });
}

//Permet de recuperer l'id du user en session
const getUserId = (callback) => {
    $.ajax({
        type: 'GET',
        url: getHostWeb() + "api/getSessionUser",
        dataType: "json",
        success: function (data) {            
            if (data.user_id) {
                callback(true, data);
            }else{
                callback(false, null);
            }
        },
        error : function (err) {
            callback(err);
        }
    });
}

export { getHostApi, customDate, getAllTypesUser, getUserId, getHostWeb }