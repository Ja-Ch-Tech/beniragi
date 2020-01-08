const getHostApi = () => {
    return "http://localhost:3456/";
    //return "https://api-beniragi-service.herokuapp.com/";
}

const getHostWeb = () => {
    return "http://localhost:3000/"; //Local
}

//fonction de modélisation de la date
const customDate = (date) => {
    var myDate = new Date(date),
        jour = function() {

            return parseInt(myDate.getDate()) < 10 ? '0' + myDate.getDate() : myDate.getDate()
        },
        mois = function() {

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
        heure = function() {

            return myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours()

        },
        minute = function() {

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
        success: function(data) {
            if (data.getEtat) {
                callback(data.getObjet);
            } else {
                callback(null);
            }
        },
        error: function(err) {
            callback(err)
        }
    });
}

//Recupere toutes les villes
const getAllTowns = (callback) => {
    $.ajax({
        type: 'GET',
        url: "/api/getAllTowns",
        dataType: "json",
        success: function(data) {
            if (data.getEtat) {
                callback(data);
            } else {
                callback(data);
            }
        },
        error: function(err) {
            callback(err);
        }
    });
};

//Recupere les metiers
const getAllJob = (limit, callback) => {
    $.ajax({
        type: 'GET',
        url: `/api/jobs/gets/${limit}`,
        dataType: "json",
        success: function(data) {
            callback(data);
        },
        error: function(err) {
            callback(err);
        }
    });
};

//Permet de recuperer l'id du user en session
const getUserId = (callback) => {
    $.ajax({
        type: 'GET',
        url: "/api/getSessionUser",
        dataType: "json",
        success: function(data) {
            if (data.user_id) {
                callback(true, data);
            } else {
                callback(false, null);
            }
        },
        error: function(err) {
            callback(err);
        }
    });
}

//Verifie si les champs sont vides
const NoEmpty = object => {
    let flag = false;

    for (const value in object) {
        if (object[value] != "" && object.hasOwnProperty(value)) {
            flag = true;
        } else {
            flag = false;
            break;
        }
    }

    return flag;
}

/**
 * Mise en favoris d'un freelancer
 */
const setFavoris = (dataFavoris, element, callback) => {
    if (NoEmpty(dataFavoris)) {
        $.ajax({
            type: 'POST',
            url: "/api/setFavoris",
            dataType: "json",
            data : dataFavoris,
            success: function(data) {
                if (data.getMessage) {

                    if (element.getAttribute("data-favoris") == "true") {
                        element.classList.remove("bookmarked");
                        element.setAttribute("data-favoris", "false");
                        element.setAttribute("title", "Ajouter aux favoris");
                    } else {
                        element.classList.add("bookmarked");
                        element.setAttribute("data-favoris", "true");
                        element.setAttribute("title", "Retirer de mes favoris");
                    }

                    Snackbar.show({
                        text: data.getMessage,
                        pos: 'top-center',
                        showAction: false,
                        duration: 3000,
                        textColor: '#fff',
                        backgroundColor: '#ad344b'
                    });
                    callback(true);
                }else{
                    Snackbar.show({
                        text: data.getMessage,
                        pos: 'top-center',
                        showAction: false,
                        duration: 3000,
                        textColor: '#fff',
                        backgroundColor: '#ad344b'
                    });
                    callback(false);
                }
            },
            error: function(err) {
                Snackbar.show({
                    text: "Une erreur est survenue, verifiez votre connexion internet",
                    pos: 'top-center',
                    showAction: false,
                    duration: 3000,
                    textColor: '#fff',
                    backgroundColor: '#ad344b'
                });
            }
        });
    }else{
        Snackbar.show({
            text: "Cette operation n'a pas reussie car certaines informations manque",
            pos: 'top-center',
            showAction: false,
            duration: 3000,
            textColor: '#fff',
            backgroundColor: '#ad344b'
        });
    }
}

//Start evaluation
const starRating = (ratingElem) => {

    $(ratingElem).each(function() {

        var dataRating = $(this).attr('data-rating');

        // Rating Stars Output
        function starsOutput(nothingStar, firstStar, secondStar, thirdStar, fourthStar, fifthStar) {
            return ('' +
                '<span class="' + nothingStar + '"></span>' +
                '<span class="' + firstStar + '"></span>' +
                '<span class="' + secondStar + '"></span>' +
                '<span class="' + thirdStar + '"></span>' +
                '<span class="' + fourthStar + '"></span>' +
                '<span class="' + fifthStar + '"></span>');
        }

        var fiveStars = starsOutput('star', 'star', 'star', 'star', 'star');

        var fourHalfStars = starsOutput('star', 'star', 'star', 'star', 'star half');
        var fourStars = starsOutput('star', 'star', 'star', 'star', 'star empty');

        var threeHalfStars = starsOutput('star', 'star', 'star', 'star half', 'star empty');
        var threeStars = starsOutput('star', 'star', 'star', 'star empty', 'star empty');

        var twoHalfStars = starsOutput('star', 'star', 'star half', 'star empty', 'star empty');
        var twoStars = starsOutput('star', 'star', 'star empty', 'star empty', 'star empty');

        var oneHalfStar = starsOutput('star', 'star half', 'star empty', 'star empty', 'star empty');
        var oneStar = starsOutput('star', 'star empty', 'star empty', 'star empty', 'star empty');

        var zeroHalfStar = starsOutput('star half', 'star empty', 'star empty', 'star empty', 'star empty');
        var zeroStar = starsOutput('star empty', 'star empty', 'star empty', 'star empty', 'star empty');

        // Rules
        if (dataRating >= 4.75) {
            $(this).append(fiveStars);
        } else if (dataRating >= 4.25) {
            $(this).append(fourHalfStars);
        } else if (dataRating >= 3.75) {
            $(this).append(fourStars);
        } else if (dataRating >= 3.25) {
            $(this).append(threeHalfStars);
        } else if (dataRating >= 2.75) {
            $(this).append(threeStars);
        } else if (dataRating >= 2.25) {
            $(this).append(twoHalfStars);
        } else if (dataRating >= 1.75) {
            $(this).append(twoStars);
        } else if (dataRating >= 1.25) {
            $(this).append(oneHalfStar);
        } else if (dataRating >= 1) {
            $(this).append(oneStar);
        } else if (dataRating >= 0.5) {
            $(this).append(zeroHalfStar);
        } else if (dataRating < 0.5) {
            $(this).append(zeroStar);
        }

    });

}

const customDateForFeedBack = (date) => {
    var formatDate = new Date(date);
    return getMonth(formatDate.getMonth()) + " " + formatDate.getFullYear();
}

/**
 * Récupération du mois en question
 * @param {Number} month Le mois en question
 */
function getMonth(month) {
    var monthLetters = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    return monthLetters[parseInt(month) - 1];
}

export { getHostApi, customDate, getAllTypesUser, getUserId, getHostWeb, NoEmpty, getAllTowns, starRating, getAllJob, customDateForFeedBack as dateFeedBack, setFavoris }