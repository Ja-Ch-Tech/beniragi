const getHostApi = () => {
    //return "http://localhost:3456/";
    return "https://api-beniragi-service.herokuapp.com/";
}

const getHostWeb = () => {
    //return "http://localhost:3000/"; //Local
    return "https://beniragi-service.herokuapp.com/"; //Online
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

//Supprime un element du tableau
const removeItem = (arr, item, callback) => {
    for (var i = arr.length; i--;) {

        if (arr[i] === item) {
            arr.splice(i, 1);
            callback(arr)
        }
    }
}

//Verifie l'existence d'un element dans un tableau
function isInArray(value, array) {
    return array.indexOf(value) > -1;
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
            data: dataFavoris,
            beforeSend: function() {
                element.style.display = "none";
                element.nextElementSibling.style.display = "block";
            },
            success: function(data) {
                element.nextElementSibling.style.display = "none";
                element.style.display = "block";
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
                } else {
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
    } else {
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
    return formatDate.getDate() + " " + getMonth(formatDate.getMonth()) + " " + formatDate.getFullYear();
}

/**
 * Récupération du mois en question
 * @param {Number} month Le mois en question
 */
function getMonth(month) {
    var monthLetters = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    return monthLetters[parseInt(month)];
}

/**
 * Permet de mettre en session les cles de recherche
 * @param {Function} callback La fonction de retour
 */
const storageKeys = (id, callback) => {
    $("#" + id).on('submit', function(e) {
        e.preventDefault();

        var inputs = e.target.elements,
            sortieInput = 0;

        for (var index = 0; index < inputs.length; index++) {
            sortieInput++;
            if (/input/i.test(e.target.elements[index].localName)) {
                sessionStorage.setItem(inputs[index].name, inputs[index].value);
            }

            if (sortieInput == inputs.length) {
                callback(true);
            }
        }
    })
}

/**
 * Permet de faire la recherche
 * @param {Function} callback La fonction de retour
 */
const megaSearch = () => {
        getUserId(function(state, session) {
                    var job = sessionStorage.getItem('metier__search_item') ? sessionStorage.getItem('metier__search_item') : null,
                        town = sessionStorage.getItem('location__search_item') ? sessionStorage.getItem('location__search_item') : null,
                        objData = {
                            "job": job,
                            "town": town
                        },
                        user_id = state ? session.user_id : null;
                    //Gestion inputs
                    $("#location__search_item").val(town);
                    $("#metier__search_item").val(job);

                    $.ajax({
                                type: 'POST',
                                url: "/api/megaSearch/" + user_id,
                                dataType: "json",
                                data: objData,
                                beforeSend: function() {
                                    $("#resultat-recherche").html(`<center>
                                      <div style="margin:13% 0%;" class="lds-spinner">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                      </div>
                                    </center>
                                `);
                                },
                                success: function(data) {
                                        var content,
                                            sortieRecherche = 0;
                                        if (data.getEtat) {
                                            content = `<h3 class="page-title">Resultats trouvés (${data.getObjet.length})</h3>
                                           <div id="freelancer__list" class="freelancers-container freelancers-list-layout compact-list margin-top-35 margin-bottom-35">

                                           </div>`;
                                            $("#resultat-recherche").html(content);
                                            data.getObjet.map(element => {
                                                        console.log(element)
                                                        sortieRecherche++;
                                                        var name = () => {
                                                                if (element.identity) {
                                                                    return `${element.identity.lastName} ${element.identity.name.toUpperCase()}`
                                                                } else {
                                                                    return element.email;
                                                                }
                                                            },
                                                            favorite = () => {
                                                                if (state && session.isEmployer) {
                                                                    if (element.isThisInFavorite) {
                                                                        return `<span data-tippy-placement="bottom" title="Retirer de mes favoris" data-favoris="true" data-user="${element._id}" class="bookmark-icon bookmarked"></span>
                                                                            <div class="sbl-circ" style="right:40px;top:20px;position: absolute;display: none;"></div>`;
                                                                    } else {
                                                                        return `<span data-tippy-placement="bottom" title="Ajouter aux favoris" data-favoris="false" data-user="${element._id}" class="bookmark-icon"></span>
                                                                            <div class="sbl-circ" style="right:40px;top:20px;position: absolute;display: none;"></div>`
                                                                    }
                                                                } else {
                                                                    return ``;
                                                                }

                                                            },
                                                            contentElement = `
                                                            <!--Freelancer -->
                                                            <div class="freelancer">
                                                                <!-- Overview -->
                                                                <div class="freelancer-overview">
                                                                    <div class="freelancer-overview-inner">
                                                                        <!-- Bookmark Icon -->
                                                                        ${favorite()}
                                                                        <!-- Avatar -->
                                                                        <div class="freelancer-avatar">
                                                                            ${element.certificate && element.certificate.certified == true ? `<div class="verified-badge"></div>` : ''}
                                                                            <a href="/candidats/${element._id}/profile"><img src="/images/user-avatar-big-01.jpg" alt=""></a>
                                                                        </div>

                                                                        <!-- Name -->
                                                                        <div class="freelancer-name">
                                                                            <h4><a href="/candidats/${element._id}/profile">${name()}<img class="flag" src="/images/flags/cd.svg" alt="" title="Congo-Kinshasa" data-tippy-placement="top"></a></h4>
                                                                            <span>${element.job ? element.job.name : `---`}</span>
                                                                            <!-- Rating -->
                                                                            <div class="freelancer-rating">
                                                                                <div class="star-rating" data-rating="${element.average}"></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                                <!-- Details -->
                                                                <div class="freelancer-details">
                                                                    <div class="freelancer-details-list">
                                                                        <ul>
                                                                            <li>Localisation <strong><i class="icon-material-outline-location-on"></i> ${element.town ? element.town : `---`}</strong></li>
                                                                            <li>Taux horaire <strong>$${element.hourly ? element.hourly.rate : "0"} / hr</strong></li>
                                                                            <li>A temps <strong>${element.inTime ? element.inTime + '%' : `---`}</strong></li>
                                                                        </ul>
                                                                    </div>
                                                                    <a href="/candidats/${element._id}/profile" class="button button-sliding-icon ripple-effect">Voir le profile <i class="icon-material-outline-arrow-right-alt"></i></a>

                                                                </div>
                                                            </div>
                                                            <!-- Freelancer / End -->`;

                        $("#freelancer__list").append(contentElement);

                        if (data.getObjet.length == sortieRecherche) {

                            //Système étoile
                            starRating('.star-rating');

                            //Tooltip
                            tippy('[data-tippy-placement]', {
                                delay: 100,
                                arrow: true,
                                arrowType: 'sharp',
                                size: 'regular',
                                duration: 200,

                                // 'shift-toward', 'fade', 'scale', 'perspective'
                                animation: 'scale',

                                animateFill: true,
                                theme: 'dark',

                                // How far the tooltip is from its reference element in pixels 
                                distance: 10,

                            });

                            //Favoris
                            //Gestion favoris, ajout
                            $(".freelancer-overview .bookmark-icon").on('click', function (e) {
                                e.preventDefault();
                                var element = e.currentTarget,
                                    dataFavoris = {
                                        user_id : element.getAttribute("data-user"),
                                        state : element.getAttribute("data-favoris"),
                                        employer : session.user_id
                                    };

                                setFavoris(dataFavoris, element, function (data) {
                                    //Retire le bloc
                                    if (data) {
                                        //Tooltip
                                        tippy('[data-tippy-placement]', {
                                            delay: 100,
                                            arrow: true,
                                            arrowType: 'sharp',
                                            size: 'regular',
                                            duration: 200,

                                            // 'shift-toward', 'fade', 'scale', 'perspective'
                                            animation: 'scale',

                                            animateFill: true,
                                            theme: 'dark',

                                            // How far the tooltip is from its reference element in pixels 
                                            distance: 10,

                                        });
                                        //element.parentNode.parentNode.parentNode.remove();
                                    }
                                });
                                
                            });
                        }
                    });

                } else {
                    $("#resultat-recherche").html(`
                        <center>
                            <img width=400 src="/images/svg/undraw_empty_xct9.svg"><br/><br/><br/>
                            <h1>Aucun resultat n'est trouvé pour votre recherche</h1><br/>
                        </center>
                    `);
                }
            },
            error: function(err) {
                console.log(err)
            }
        });
    })
}

 /**
 * Permet de gerer les funfacts
 */
const funFacts = () => {
        /*jslint bitwise: true */
        function hexToRgbA(hex){
            var c;
            if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
                c= hex.substring(1).split('');
                if(c.length== 3){
                    c= [c[0], c[0], c[1], c[1], c[2], c[2]];
                }
                c= '0x'+c.join('');
                return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.07)';
            }
        }

        $(".fun-fact").each(function() {
            var factColor = $(this).attr('data-fun-fact-color');

            if(factColor !== undefined) {
                $(this).find(".fun-fact-icon").css('background-color', hexToRgbA(factColor));
                $(this).find("i").css('color', factColor);
            }
        });

    } 

export { getHostApi, customDate, getAllTypesUser, getUserId, getHostWeb, NoEmpty, getAllTowns, starRating, getAllJob, customDateForFeedBack as dateFeedBack, setFavoris, removeItem, isInArray, storageKeys,megaSearch,funFacts }