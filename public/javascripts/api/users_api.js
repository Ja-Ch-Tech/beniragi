import { getAllTypesUser, getUserId, NoEmpty, getHostApi, getAllTowns, starRating, getAllJob, dateFeedBack, setFavoris, removeItem, isInArray} from './init.js';
import { newMessage } from './notification.js';

//Permet de connecter un utilisateur
const login = () => {
    $("#login-form").on('submit', function(e) {
        e.preventDefault();
        var inputs = e.target.elements,
            objData = {};

        for (let index = 0; index < inputs.length; index++) {
            var name = e.target.elements[index].name;
            objData[name] = e.target.elements[index].value;
        }

        $.ajax({
            url: '/api/login',
            type: 'POST',
            dataType: "json",
            data: objData,
            beforeSend: function() {
                $("#login-button").text("Verification ...");
            },
            success: function(infos) {
                console.log(infos);
                $("#login-button").html(`Se connecter <i class="icon-material-outline-arrow-right-alt"></i>`);
                if (infos.getEtat) {

                    if (infos.getObjet.flag) {
                        window.location.reload();
                    } else {
                        Snackbar.show({
                            text: "Ce compte n'est pas activé !",
                            pos: 'bottom-center',
                            showAction: true,
                            actionText: "Fermer",
                            duration: 3000,
                            textColor: '#fff',
                            backgroundColor: '#ad344b'
                        });

                        //Redirection dans la page d'activation
                        setTimeout(() => {
                            window.location.href = '/profile/activation';
                        }, 3100);
                    }

                } else {
                    $("#errorLogin")[0].style.display = 'block';
                    $("#errorLogin")[0].style.opacity = '1';
                    $("#errorLogin p")[0].innerHTML = infos.getMessage;
                }
            },
            error: function(err) {
                console.log(err);
            }
        })

    });
}

//Permet d'enregistrer un utilisateur
const register = () => {
    //Dynamisation des types users
    getAllTypesUser(function(types) {
        if (types) {
            var sortieType = 0;
            types.map(type => {
                sortieType++;
                var typeChecked = function() {
                        if (sortieType == 1) {
                            return 'checked = "checked"';
                        } else {
                            return '';
                        }
                    },
                    type = `<div>
						<input type="radio" name="id_type" id="${type.intitule}-radio" class="account-type-radio" ${typeChecked()} value="${type._id}" />
						<label for="${type.intitule}-radio" class="ripple-effect-dark">${type.intitule}</label>
					</div>`;

                $("#accountTypes").append(type);
            });

        }
    })

    //Lors de la soumission du bouton inscription
    $("#register-account-form").on('submit', e => {
        e.preventDefault();
        var inputs = e.target.elements,
            objData = {},
            err = [];

        for (let index = 0; index < inputs.length; index++) {
            var name = e.target.elements[index].name;
            if (/input/i.test(e.target.elements[index].localName)) {
                if (e.target.elements[index].type == "radio") {
                    if (e.target.elements[index].checked) {
                        objData[name] = e.target.elements[index].value;
                    }
                } else {
                    objData[name] = e.target.elements[index].value;
                }

            }

        }

        $.ajax({
            url: '/api/register',
            type: 'POST',
            dataType: "json",
            data: objData,
            beforeSend: function() {
                $("#register-button").html("Veuillez patienter ...");
            },
            success: function(data) {
                console.log(data)
                $("#register-button").html(`Terminer <i class="icon-material-outline-arrow-right-alt"></i>`);
                if (data.getEtat) {
                    window.location.href = '/profile/activation';
                } else {
                    $("#errorRegister")[0].style.display = 'block';
                    $("#errorRegister")[0].style.opacity = '1';
                    $("#errorRegister p")[0].innerHTML = data.getMessage;
                }
            },
            error: function(err) {
                console.log(err);
            }
        })

    })
}

/**
 * Module pour la récupération de nombre d'utilisateur par type
 */
const getStatsUsers = () => {
    $.ajax({
        type: 'GET',
        url: "/api/users/numberUserByType",
        dataType: "json",
        success: function(data) {
            if (data.getEtat) {
                data.getObjet.map(value => {
                    var content = `<li>
										<strong class="counter">${value.count}</strong>
										<span>${value.typeUser}</span>
									</li>`;

                    $("#statsUser").append(content);
                })
            }
        },
        error: function(err) {
            console.log(err)
        }
    });
}

/**
 * Module permettant de recuperer les details d'un user
 */
const getUserInfos = (user_id, callback) => {
    $.ajax({
        type: 'GET',
        url: "/api/getUserInfos/" + user_id,
        dataType: "json",
        success: function(data) {
            callback(data);
        },
        error: function(err) {
            callback(err);
        }
    });
}

//Pour la définition de la visibility
function toggleVisibility() {
    if ($('.status-switch label.user-invisible').hasClass('current-status')) {
        $('.status-indicator').addClass('right');
    }

    $('.status-switch label.user-invisible').on('click', function() {
        $('.status-indicator').addClass('right');
        $('.status-switch label').removeClass('current-status');
        $('.user-invisible').addClass('current-status');
    });

    $('.status-switch label.user-online').on('click', function() {
        $('.status-indicator').removeClass('right');
        $('.status-switch label').removeClass('current-status');
        $('.user-online').addClass('current-status');
    });
}

/**
 * Module permettant de rendre dynamique le menu
 */
const getNav = () => {

        getUserId(function(state, user) {
                    var navContent,
                        pathName = window.location.pathname;
                    if (state) {
                        //Recuperation des informations du user
                        getUserInfos(user.user_id, function(infos) {
                                    if (infos.getObjet.flag) {
                                        navContent = `
                                
                                <!--  User Notifications -->
                                <div class="header-widget hide-on-mobile" id="containerMessage">
                                   <!-- Dynamic content -->
                                </div>
                                
                                <!-- User Menu -->
                                <div class="header-widget">

                                <!-- Messages -->
                                <div id="ContentUserDropdown" class="header-notifications user-menu">
                                    <div class="header-notifications-trigger">
                                        <a id="linkUser" href="#"><div class="user-avatar status-online"><img src="/images/user-avatar-small-01.jpg" alt=""></div></a>
                                    </div>

                                    <!-- Dropdown -->
                                    <div class="header-notifications-dropdown">

                                        <!-- User Status -->
                                        <div class="user-status">

                                            <!-- User Name / Avatar -->
                                            <div class="user-details">
                                                <div class="user-avatar status-online"><img src="/images/user-avatar-small-01.jpg" alt=""></div>
                                                <div class="user-name">
                                                    ${infos.getObjet.email} <span>${infos.getObjet.typeUser}</span>
                                                </div>
                                            </div>
                                            
                                            <!-- User Status Switcher -->
                                            <div class="status-switch" id="snackbar-user-status">
                                                <label class="user-online ${infos.getObjet.visibility ? `current-status` : ``}">Disponible</label>
                                                <label class="user-invisible ${!infos.getObjet.visibility ? `current-status` : ``}">Non-disponible</label>
                                                <span class="status-indicator" aria-hidden="true"></span>
                                            </div>  
                                    </div>
                                    
                                    <ul class="user-menu-small-nav">
                                        <li><a href="/profile/dashboard"><i class="icon-material-outline-dashboard"></i> Dashboard</a></li>
                                        <li><a href="/profile/parametres"><i class="icon-material-outline-settings"></i> Settings</a></li>
                                        <li><a href="/logout"><i class="icon-material-outline-power-settings-new"></i> Logout</a></li>
                                    </ul>

                                    </div>
                                </div>

                            </div>
                            <!-- User Menu / End -->
                            <span class="mmenu-trigger">
                                <button class="hamburger hamburger--collapse" type="button">
                                    <span class="hamburger-box">
                                        <span class="hamburger-inner"></span>
                                    </span>
                                </button>
                            </span>`;
                    $("#navMenu").html(navContent);

                    dropNav("user-menu");
                    toggleVisibility();
                    newMessage(3);

                    //Remplissage des informations sur le user dans les details
                    if (/profile/i.test(pathName.split("/")[1]) && /parametres/i.test(pathName.split("/")[2])) {
                        userParameters(user, infos);
                    }
                    //Execution de la fonction renvoyant les favoris
                    if (/profile/i.test(pathName.split("/")[1]) && /favoris/i.test(pathName.split("/")[2])) {
                        getFavourites(state, user);
                    }

                    //Execution de la fonction renvoyant les contacts
                    if (/profile/i.test(pathName.split("/")[1]) && /contacts/i.test(pathName.split("/")[2])) {
                        getFreelancersForOffer(state, user);
                    }

                    //Execution de la fonction renvoyant les feedbacks
                    if (/profile/i.test(pathName.split("/")[1]) && /feedback/i.test(pathName.split("/")[2])) {
                        getReview(state, user);
                    }
        
        
                } else {
                    navContent = `<!-- Lien vers l'activation d'un compte -->
                    <div class="header-widget hide-on-mobile">
                        <a href="/profile/activation" class="log-in-button"><i class="icon-line-awesome-unlock-alt"></i> <span>Activer votre compte</span></a>
                    </div>`;
                    $("#navMenu").html(navContent);
                }
            });


            //Dynamisation de la sidebar
            if (/profile/i.test(pathName.split("/")[1])) {
                sidebar(user);
            }
        } else {

            navContent = `<!-- USER NON CONNECTER -->
                <div class="header-widget">
                    <a href="#sign-in-dialog" class="popup-with-zoom-anim log-in-button"><i class="icon-feather-log-in"></i> <span>Connexion / Inscription</span></a>
                </div>`;
            $("#navMenu").html(navContent);

            //chargement du popup de connexion et inscription
            $('.popup-with-zoom-anim').magnificPopup({
                type: 'inline',

                fixedContentPos: false,
                fixedBgPos: true,

                overflowY: 'auto',

                closeBtnInside: true,
                preloader: false,

                midClick: true,
                removalDelay: 300,
                mainClass: 'my-mfp-zoom-in'
            });
        }
    });
}

const dropNav = (dif) => {
    /*--------------------------------------------------*/
    /*  Notification Dropdowns
    /*--------------------------------------------------*/
    $(`.header-notifications.${dif}`).each(function () {
        var userMenu = $(this);        
        var userMenuTrigger = $(this).find('.header-notifications-trigger a');

        $(userMenuTrigger).on('click', function (event) {
            event.preventDefault();

            if ($(this).closest(`.header-notifications.${dif}`).is(".active")) {
                close_user_dropdown();
            } else {
                close_user_dropdown();
                userMenu.addClass('active');
            }
        });
    });

    // Closing function
    function close_user_dropdown() {
        $(`.header-notifications.${dif}`).removeClass("active");
    }

    // Closes notification dropdown on click outside the conatainer
    var mouse_is_inside = false;

    $(`.header-notifications.${dif}`).on("mouseenter", function () {
        mouse_is_inside = true;
    });
    $(`.header-notifications.${dif}`).on("mouseleave", function () {
        mouse_is_inside = false;
    });

    $("body").mouseup(function () {
        if (!mouse_is_inside) close_user_dropdown();
    });

    // Close with ESC
    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            close_user_dropdown();
        }
    });
}

/**
 * Module permettant pre remplire les informations du user dans la page parametres
 */

const userParameters = (user, details) => {
    localStorage.setItem("verrou",details.getObjet.jobs ? true : false);
    var jobAndSkillsInput = () => {
        if (user.isEmployer) {
            return ``;
        }else{
            return `<li>
            <div class="row">
                <div class="col-md-4">
                    <div class="submit-field">
                    <h5>Metier</h5>
                    <select id="inputJob" class="selectpicker with-border" data-size="7" title="Selectionnez un metier" data-live-search="true">
                        <option  value="">Selectionnez un metier</option>
                    </select>
                    <div id="jobLoader"></div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="submit-field">
                    <h5>Vos specialites <i class="help-icon" data-tippy-placement="right" title="Ajouter au maximum 10 compétences"></i></h5>
        
                    
                    <div class="keywords-container">
                        <div class="keyword-input-container">
                            <input id="setSkillsInput" type="text" class="keyword-input with-border" placeholder="Ajouter une specialite"/>
                            <button id="btnAddSkills" style="display:none" data-tippy-placement="top" title="Valider la mise a jour de vos specialités" id="setSkillsBtn" class="keyword-input-button ripple-effect"><i class="icon-material-outline-check-circle"></i></button>
                            
                            <div id="autocomplete-container" class="autocomplete-container">
                                
                            </div>
                        </div>
                        <div class="keywords-list" id="listSkills">
                            
                        </div>
                        <div class="clearfix"></div>
                    </div>
                    </div>
                </div>
            </div>
        </li>`;
        }
    },
    skills = () => {
        if (details.getObjet.skills) {
            if (details.getObjet.skills.length > 0) {
                for (var i = 0; i < details.getObjet.skills.length; i++) {
                    var skill = `<span data-index="${i}" class="keyword"><span class="keyword-remove skills"></span><span class="keyword-text">${details.getObjet.skills[i]}</span></span>`;
                    $("#listSkills").append(skill);
                }
                
            }
        }else{
            return ``;
        }
    },
    bio = () => {
        if (details.getObjet.bio) {
            if (details.getObjet.bio.bio != null) {
                return details.getObjet.bio.bio;
            }else{
                return ``;
            }
        }else{
            return ``;
        }
    },
    content = `<!-- Dashboard Box -->
    <div class="col-xl-12">
      <div class="dashboard-box margin-top-0">

        <!-- Headline -->
        <div class="headline">
          <h3><i class="icon-material-outline-account-circle"></i> Mon compte</h3>
        </div>

        <div class="content with-padding padding-bottom-0">
            
            <div class="row">
                
                <div class="col-auto">
                    <div class="avatar-wrapper" data-tippy-placement="bottom" title="Modifier la photo de profile">
                        <img class="profile-pic" src="" alt="image de profile" />
                        <div class="upload-button"></div>
                        <input class="file-upload" type="file" accept="image/*"/>
                    </div>
                </div>

                <div class="col">
                    <form id="updateInfosForm" autocomplete="off" method="post" action="#">
                        <div class="row">

                            <div class="col-xl-4">
                                <div class="submit-field">
                                    <h5>Nom <span class="color_red">(*)</span></h5>
                                    <input onkeyup="$(this).val().length > 3 ? $('#registerInfosBtn').slideDown() : ''" name="nom" onkeyup="" type="text" class="with-border" placeholder="Inserez votre nom" value="${details.getObjet.identity ? details.getObjet.identity.name : ""}">
                                </div>
                            </div>

                            <div class="col-xl-4">
                                <div class="submit-field">
                                    <h5>Postnom <span class="color_red">(*)</span></h5>
                                    <input onkeyup="$(this).val().length > 3 ? $('#registerInfosBtn').slideDown() : ''" name="postnom" type="text" class="with-border" placeholder="Inserez votre postnom" value="${details.getObjet.identity ? details.getObjet.identity.postName : ""}">
                                </div>
                            </div>
                            <div class="col-xl-4">
                                <div class="submit-field">
                                    <h5>Prénom <span class="color_red">(*)</span></h5>
                                    <input onkeyup="$(this).val().length > 3 ? $('#registerInfosBtn').slideDown() : ''" name="prenom" type="text" class="with-border" placeholder="Inserez votre prenom" value="${details.getObjet.identity ? details.getObjet.identity.lastName : ""}">
                                </div>
                            </div>

                            <div class="col-xl-4">
                                <!-- Account Type -->
                                <div class="submit-field">
                                    <h5>Type de compte</h5>
                                    <div class="account-type">
                                    <div>
                                        <label style="padding: 10px;" for="freelancer-radio" class="ripple-effect-dark"><i class="icon-material-outline-business-center"></i> ${details.getObjet.typeUser}</label>
                                    </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xl-4">
                                <div class="submit-field">
                                    <h5>Email <span class="color_red">(*)</span></h5>
                                    <input disabled type="email" placeholder="Inserez votre adresse email" class="with-border" value="${details.getObjet.email ? details.getObjet.email : ""}">
                                </div>
                            </div>

                            <div class="col-xl-4">
                                <div class="submit-field">
                                    <h5>Numéro de téléphone <span class="color_red">(*)</span></h5>
                                    <input onkeyup="$(this).val().length > 3 ? $('#registerInfosBtn').slideDown() : ''" name="numero" type="text" class="with-border" placeholder="Inserez votre numéro de téléphone" value="${details.getObjet.identity ? details.getObjet.identity.phoneNumber : ""}">
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="submit-field">
                                    <h5>Votre biographie</h5>
                                    <textarea name="bio" id="bio" onkeyup="$(this).val().length > 3 ? $('#registerInfosBtn').slideDown() : ''" cols="30" resize="none" placeholder="Une petite presentation de ce vous etes" rows="5" class="with-border">${bio()}</textarea>
                                </div>
                          </div>
                        </div>
                    </form>
                </div>
            </div>
            
            <div class="row">
                <!-- Button -->
                <div id="registerInfosBtn" style="display:none;" class="col-xl-12">
                    <center>
                        <button type="submit" form="updateInfosForm" class="button ripple-effect big margin-top-30 float-right"><i class="icon-line-awesome-save"></i> Enregistrer</ button>
                    </center>
                </div>
            </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Box -->
    <div class="col-xl-12">
      <div class="dashboard-box">

        <!-- Headline -->
        <div class="headline">
          <h3><i class="icon-material-outline-face"></i>Mon profile </h3> 
        </div>

        <div class="content">
          <ul class="fields-ul">
            ${jobAndSkillsInput()}
            <li>
              <div class="row">
                <div class="col-md-6">
                  <div class="submit-field">
                    <h5>Ville de residence</h5>
                    <select id="inputTown" class="selectpicker with-border" data-size="7" title="Select Job Type" data-live-search="true">
                      <option value="" selected>${details.getObjet.town ? details.getObjet.town : "Selectionnez une votre ville actuelle"}</option>
                    </select>
                    <div id="townLoader"></div>
                  </div>
                </div>

                <div class="col-md-6">
                    <div class="submit-field">
                        <h5>Ajouter une piece jointe </h5>
                        
                       
                        <div class="clearfix"></div>
                        
                        <!-- Upload Button -->
                        <div class="uploadButton margin-top-0">
                        <input class="uploadButton-input" type="file" accept="image/*, application/pdf" id="upload" multiple/>
                        <label class="uploadButton-button ripple-effect" for="upload">Selectionnez un fichier</label>
                        <span class="uploadButton-file-name">Taille maximum: 10 MB</span>
                        </div>

                    </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Dashboard Box -->
    <div class="col-md-12">
      <div id="test1" class="dashboard-box">

        <!-- Headline -->
        <div class="headline">
          <h3><i class="icon-material-outline-lock"></i> Mot de passe et securité</h3>
        </div>

        <div class="content with-padding">
          <div class="row">
            <div class="col-md-4">
              <div class="submit-field">
                <h5>Mot de passe actuel</h5>
                <input type="password" class="with-border">
              </div>
            </div>

            <div class="col-md-4">
              <div class="submit-field">
                <h5>Nouveau mot de passe</h5>
                <input type="password" class="with-border">
              </div>
            </div>

            <div class="col-md-4">
              <div class="submit-field">
                <h5>Retapez le nouveau mot de passe</h5>
                <input type="password" class="with-border">
              </div>
            </div>
          </div>
          <div class="row">
              <!-- Button -->
              <div class="col-md-12">
                  <center>
                    <a href="#" class="button ripple-effect big margin-top-30 float-right"><i class="icon-line-awesome-save"></i> Enregistrer</a>
                  </center>
              </div>
            </div>
        </div>
      </div>
    </div>`;
    $("#parametersContent").html(content);

    avatarSwitcher();
    tippy('[data-tippy-placement]', {
        delay: 100,
        arrow: true,
        arrowType: 'sharp',
        size: 'regular',
        duration: 200,

        // 'shift-toward', 'fade', 'scale', 'perspective'
        animation: 'shift-away',

        animateFill: true,
        theme: 'dark',

        // How far the tooltip is from its reference element in pixels 
        distance: 10,

    });

    skills();
    updateAccount();

    $('select').selectpicker();
    boostrapSelect();
    submitSelect(user, function (state) {
        if (state) {localStorage.setItem("verrou",true)} else {localStorage.setItem("verrou",false)}
    });

    //Si on veut supprimer un element des skills
    $(".keyword .skills").on('click', function (e) {
        e.preventDefault();
        var item = e.currentTarget.parentNode.getElementsByClassName('keyword-text')[0].innerHTML;
        item = String(item);
        removeItem(details.getObjet.skills, item, function (array) {
            details.getObjet.skills = array;
            console.log(array)
        });
        e.currentTarget.parentNode.remove();
        $("#btnAddSkills").fadeIn();
    })
    submitSkills(user, details.getObjet.jobs ? details.getObjet.jobs.id_job : null, details);

}

/**
 * Effectue la soumission des skills
 */
const submitSkills = (user, id_job, details) => {
    var btn = $("#setSkillsBtn"),
        input = $("#setSkillsInput"),
        listSkills = $("#listSkills"),
        autocomplete = $("#autocomplete-container"),
        skills = details.getObjet.skills ? details.getObjet.skills : new Array();
    

    input.on('keyup', function (e) {
        e.preventDefault();
        if (input.val().trim().length > 2 && input.val().trim() != "") {
            if (localStorage.getItem("verrou") == "true") {
                $.ajax({
                    type: 'POST',
                    url: `/api/searchSkills`,
                    dataType: "json",
                    data: {
                        id_freelancer : user.user_id,
                        name : input.val()
                    },
                    success: function (data) {
                        if (data.getEtat) {
                            autocomplete.html(``);
                            autocomplete.fadeIn();
                            data.getObjet.map(response => {
                                if (!isInArray(response.name, skills)) {
                                    autocomplete.append(`<div><span>${response.name}</span></div>`);
                                }
                            })
                        } else {
                            if (input.val().trim() != null && input.val().trim() != "") {
                               autocomplete.html(`<div>Ajouter "<span>${input.val()}</span>" comme specialité</div>`);
                               autocomplete.fadeIn(); 
                            }
                            
                        }

                        
                        //Lorsqu'on clique sur une div
                        $("#autocomplete-container div").on('click', function (e) {
                            e.preventDefault();
                            
                            var skillValue = e.currentTarget.getElementsByTagName('span')[0].innerHTML;
                            //AJoute l'item dans le tab skills
                            if (!isInArray(skillValue, skills)) {
                                skills.push(skillValue);
                                //Ajoute le skills dans le HTML
                                listSkills.append(`<span class="keyword"><span class="keyword-remove skills"></span><span class="keyword-text">${skillValue}</span></span>`);
                            
                                autocomplete.html(``);
                                autocomplete.fadeOut();
                                input.val(``);
                                $("#btnAddSkills").fadeIn();
                            }else{
                                Snackbar.show({
                                    text: "Vous ne pouvez pas ajouter une meme specialité plusieurs fois",
                                    pos: 'bottom-right',
                                    showAction: true,
                                    actionText: "Fermer",
                                    duration: 5000,
                                    textColor: '#fff',
                                    backgroundColor: '#ad344b'
                                });
                            }

                            //Si on veut supprimer un element des skills
                            $(".keyword .skills").on('click', function (e) {
                                e.preventDefault();
                                var item = e.currentTarget.parentNode.getElementsByClassName('keyword-text')[0].innerHTML;
                                item = String(item);
                                removeItem(skills, item, function (array) {
                                    skills = array;
                                });
                                e.currentTarget.parentNode.remove();

                            })
                        });

                        
                    },
                    error: function (err) {
                        Snackbar.show({
                            text: "Une erreur est survenue lors du chargement des specialités",
                            pos: 'bottom-center',
                            showAction: true,
                            actionText: "Fermer",
                            duration: 5000,
                            textColor: '#fff',
                            backgroundColor: '#3696f5'
                        });
                    }
                });
            } else {
                Snackbar.show({
                    text: "Specifiez d'abord un metier avant d'effectuer cette action",
                    pos: 'bottom-right',
                    showAction: true,
                    actionText: "Fermer",
                    duration: 5000,
                    textColor: '#fff',
                    backgroundColor: '#ad344b'
                });
            }
        }else{
            autocomplete.html(``);
            autocomplete.fadeOut();
        }
        
    });

    //Lorsqu'on clique sur le bouton permettant de valider l'envoi des skills
    $("#btnAddSkills").on('click', function (e) {
        e.preventDefault();
        console.log(skills);
        if (skills.length > 0) {
            //Transformations de skills
            skills = JSON.stringify(skills);
            $.ajax({
                type: 'POST',
                url: `/api/setSkills`,
                dataType: "json",
                data: {
                    id_user : user.user_id,
                    skills : skills
                },
                success: function (data) {
                    if (data.getEtat) {
                        Snackbar.show({
                            text: "Vos specialités ont étés mis a jour avec success",
                            pos: 'bottom-right',
                            showAction: true,
                            actionText: "Fermer",
                            duration: 5000,
                            textColor: '#fff',
                            backgroundColor: '#3696f5'
                        });
                    }else{
                        Snackbar.show({
                            text: data.getMessage,
                            pos: 'bottom-right',
                            showAction: true,
                            actionText: "Fermer",
                            duration: 5000,
                            textColor: '#fff',
                            backgroundColor: '#ad344b'
                        });
                    }
                },
                error: function (err) {
                    Snackbar.show({
                        text: "La specification de specialités n'a pas reussi, verifiez votre connexion internet",
                        pos: 'bottom-center',
                        showAction: true,
                        actionText: "Fermer",
                        duration: 5000,
                        textColor: '#fff',
                        backgroundColor: '#ad344b'
                    });
                }
            });
        }else{
            Snackbar.show({
                text: "La liste de vos specialités ne peut etre vide",
                pos: 'bottom-right',
                showAction: true,
                actionText: "Fermer",
                duration: 5000,
                textColor: '#fff',
                backgroundColor: '#ad344b'
            });
        }
    });
};
/**
 * Effectue la soumission des inputs select (Mise a jour d'un job, d'une ville)
 */
const submitSelect = (user,callback) => {
    $('select').on('change', function (e) {
        var select = e.currentTarget,
            value = select.options[select.selectedIndex].value;
        console.log(value)
        if (value != "") {
            //Pour l'input select dedie a la specification d'un metier 
            if (select.id == "inputJob") {

                $.ajax({
                    type: 'POST',
                    url: "/api/users/setJob",
                    dataType: "json",
                    data: {
                        id_job: value,
                        id_user: user.user_id
                    },
                    beforeSend: function () {
                        $('#jobLoader').html(`<center><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></center>`);
                    },
                    success: function (data) {
                        $('#jobLoader').html(``);

                        if (data.getEtat) {
                            Snackbar.show({
                                text: "Votre metier a ete mis a jour avec success",
                                pos: 'bottom-center',
                                showAction: true,
                                actionText: "Fermer",
                                duration: 5000,
                                textColor: '#fff',
                                backgroundColor: '#3696f5'
                            });
                            callback(true);
                        } else {
                            Snackbar.show({
                                text: data.getMessage,
                                pos: 'bottom-center',
                                showAction: true,
                                actionText: "Fermer",
                                duration: 5000,
                                textColor: '#fff',
                                backgroundColor: '#ad344b'
                            });
                            callback(false)
                        }
                        console.log(data);
                    },
                    error: function (err) {
                        callback(err)
                    }
                });
            } else if (select.id == "inputTown") {
                $.ajax({
                    type: 'POST',
                    url: "/api/users/setTown",
                    dataType: "json",
                    data: {
                        id_town: value,
                        id_user: user.user_id
                    },
                    beforeSend: function () {
                        $('#townLoader').html(`<center><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></center>`);
                    },
                    success: function (data) {
                        $('#townLoader').html(``);

                        if (data.getEtat) {
                            Snackbar.show({
                                text: "Votre ville actuelle a ete mis a jour avec success",
                                pos: 'bottom-center',
                                showAction: true,
                                actionText: "Fermer",
                                duration: 5000,
                                textColor: '#fff',
                                backgroundColor: '#3696f5'
                            });
                        } else {
                            Snackbar.show({
                                text: data.getMessage,
                                pos: 'bottom-center',
                                showAction: true,
                                actionText: "Fermer",
                                duration: 5000,
                                textColor: '#fff',
                                backgroundColor: '#ad344b'
                            });
                        }
                        console.log(data);
                    },
                    error: function (err) {
                        callback(err)
                    }
                });
            }

        }
    });
};
/**
 * Pre remplit les inputs bootstrapp select
 */
const boostrapSelect = () => {
    var btn = $(".dropdown-toggle"),
        select,
        dropdown,
        btnId,
        verrouJob = false,
        verrouTown = false,
        ulDrop;
    btn.on('click', function (e) {
        e.preventDefault();
        btn = e.currentTarget;
        btnId = btn.getAttribute("data-id");
        select = btn.nextSibling.nextSibling;
        dropdown = btn.nextSibling;
        ulDrop = dropdown.getElementsByTagName("ul")[0];

        //Si on clique sur le button 
        if (btnId == "inputJob") {
            if (!verrouJob) {
                $.ajax({
                    type: 'GET',
                    url: `/api/jobs/gets/` + null,
                    dataType: "json",
                    success: function (data) {
                        var option,
                            li,
                            sortieJob = 0;
                        if (data.getEtat) {
                            data.getObjet.map(job => {
                                sortieJob++;

                                //Remplissage des options
                                option = document.createElement('option');
                                option.value = job._id;
                                option.innerHTML = job.name;
                                select.appendChild(option);
                                if (sortieJob == data.getObjet.length) {
                                    verrouJob = true;
                                    $("#inputJob").selectpicker('refresh');
                                }
                            });
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            }

        } else if (btnId == "inputTown") {
            if (!verrouTown) {
                getAllTowns(function (data) {
                    var option,
                        li,
                        sortieTown = 0;
                    if (data.getEtat) {
                        data.getObjet.map(town => {
                            sortieTown++;

                            //Remplissage des options
                            option = document.createElement('option');
                            option.value = town._id;
                            option.innerHTML = town.name;
                            select.appendChild(option);

                            if (sortieTown == data.getObjet.length) {
                                verrouTown = true;
                                $("#inputTown").selectpicker('refresh');
                            }
                        });
                    }
                })
            }
        }

    })
};
/**
 * Met a jour les informations du user
 */
const updateAccount = () => {
    $("#updateInfosForm").on('submit', function (e) {
        e.preventDefault();
        var inputs = e.target.elements,
            objData = {};
        console.log(inputs);
        for (let index = 0; index < inputs.length; index++) {
            if (/input/i.test(e.target.elements[index].localName)) {
                if (inputs[index].type != "email") {
                    objData[inputs[index].name] = inputs[index].value;
                }
            }
        }
        if (NoEmpty(objData)) {
            if ($("#bio").val().trim() != "") {
                objData[$("#bio")[0].name] = $("#bio").val();
            }
            $.ajax({
                type: 'POST',
                url: "/api/users/setIdentity",
                dataType: "json",
                data: objData,
                beforeSend: function () {
                    $("#registerInfosBtn").html(`<center><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></center>`);
                },
                success: function (data) {
                    $("#registerInfosBtn").html(`<center>
                        <button type="submit" form="updateInfosForm" class="button ripple-effect big margin-top-30 float-right"><i class="icon-line-awesome-save"></i> Enregistrer</ button>
                    </center>`);
                    if (data.getEtat) {
                        Snackbar.show({
                            text: "Votre compte a ete mis a jour avec success",
                            pos: 'top-center',
                            showAction: true,
                            actionText: "Fermer",
                            duration: 5000,
                            textColor: '#fff',
                            backgroundColor: '#3696f5'
                        });
                    } else {
                        Snackbar.show({
                            text: data.getMessage,
                            pos: 'top-center',
                            showAction: true,
                            actionText: "Fermer",
                            duration: 5000,
                            textColor: '#fff',
                            backgroundColor: '#ad344b'
                        });
                    }
                },
                error: function (err) {
                    console.log(err)
                }
            });
        } else {
            Snackbar.show({
                text: "Veuillez renseigner tous les champs important",
                pos: 'bottom-right',
                showAction: true,
                actionText: "Fermer",
                duration: 5000,
                textColor: '#fff',
                backgroundColor: '#ad344b'
            });
        }
    });
};

/**
 * Met a jour l'avatar d'un user
 */
const avatarSwitcher = () => {
    var fileInput = $(".file-upload"),
        file,
        formData = new FormData(),
        sortie = false,
        type,
        avalaibleTypes = [
            "image/jpeg",
            "image/png",
            "image/bmp",
            "image/tiff",
            "image/gif",
            "image/x-icon"
        ];
    fileInput.on('change', function () {
        type = fileInput[0].files[0].type;
        if (fileInput[0].files.length > 0) {
            if (avalaibleTypes.indexOf(type) != -1) {
                file = fileInput[0].files[0];
                sortie = true;
            } else {
                sortie = false;
                Snackbar.show({
                    text: "L'extension du fichier n'est pas valide",
                    pos: 'bottom-center',
                    showAction: true,
                    actionText: "Fermer",
                    duration: 5000,
                    textColor: '#fff',
                    backgroundColor: '#ad344b'
                });
            }

        }

        if (sortie) {
            console.log(file);
            formData.append('file-s3', file, file.name);
            formData.append('for', 'avatar');
            $.ajax({
                url: getHostApi() + "file-upload",
                type: 'POST',
                data: formData,
                processData: false, // tell jQuery not to process the data
                contentType: false, // tell jQuery not to set contentType
                beforeSend: function () {

                },
                complete: function () {
                },
                success: function (data) {
                    console.log(data);
                },
                err: function (err) {
                    console.log(err)
                }
            });
        }
    });

    $(".upload-button").on('click', function () {
        $(".file-upload").click();
    });
};

/**
 * Module permettant d'activer un compte utilisateur
 */
const activeAccount = (user_id) => {
    $("#activate-form").on('submit', e => {
        e.preventDefault();
        var input = e.target.elements[0],
            code;

        if (input.value.trim(" ") == "") {
            Snackbar.show({
                text: "Inserez un code d'activation !",
                pos: 'bottom-center',
                showAction: true,
                actionText: "Fermer",
                duration: 10000,
                textColor: '#fff',
                backgroundColor: '#ad344b'
            });
        } else {
            code = parseInt(input.value);

            $.ajax({
                type: 'POST',
                url: "/api/profile/activation",
                dataType: "json",
                data: {
                    user_id: user_id,
                    code: code
                },
                beforeSend: function () {
                    $("#loadercode").html(`<center>
					<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
					</center>`);
                },
                success: function (data) {
                    $("#loadercode").html(``);
                    if (data.getEtat) {
                        Snackbar.show({
                            text: "Votre compte a été activé !",
                            pos: 'bottom-center',
                            showAction: true,
                            actionText: "Fermer",
                            duration: 10000,
                            textColor: '#fff',
                            backgroundColor: '#3696f5'
                        });
                        window.location.href = "/profile/parametres";
                    } else {
                        Snackbar.show({
                            text: "Code d'activation incorrect, réessayez !",
                            pos: 'bottom-center',
                            showAction: true,
                            actionText: "Fermer",
                            duration: 10000,
                            textColor: '#fff',
                            backgroundColor: '#ad344b'
                        });
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    });
}

/**
* Module permettant de dynamiser la sidebar du profile
*/
const sidebar = (user) => {
    var content,
        active = (url) => {

            if (url == window.location.pathname) {
                return 'active';
            } else {
                return '';
            }
        };
    content = `<ul data-submenu-title="COMMENCEZ">
                    <li class="${active("/profile/dashboard")}"><a href="/profile/dashboard"><i class="icon-material-outline-dashboard"></i> Dashboard</a></li>
                    <li class="${active("/profile/messages")}"><a href="/profile/messages"><i class="icon-material-outline-question-answer"></i> Messages</a></li>`;
    if (user.isEmployer) {
        content += `<li class="${active("/profile/favoris")}"><a href="/profile/favoris"><i class="icon-material-outline-favorite"></i> Favoris</a></li>
        <li class="${active("/profile/contacts")}"><a href="/profile/contacts"><i class="icon-feather-users"></i> Contacts</a></li>
        `;
    } else {
        content += `<li class="${active("/profile/feedback")}"><a href="/profile/feedback"><i class="icon-material-outline-feedback"></i> Feedback</a></li>`;
    }

    content += `</ul><ul data-submenu-title="COMPTE">
                    <li class="${active("/profile/parametres")}"><a href="/profile/parametres"><i class="icon-material-outline-settings"></i> Parametres</a></li>
                    <li><a href="/logout"><i class="icon-material-outline-power-settings-new"></i> Deconnexion</a></li>
                </ul>`;
    $("#sidebarContent").html(content);
}

/**
 * Module permettant de dynamiser les stats qui sont dans le dashboard du client
 */
const statsInDashboard = () => {
    getUserId((isGet, user) => {
        $.ajax({
            type: 'GET',
            url: "/api/users/stats",
            dataType: "json",
            success: function (data) {
                if (!user.isEmployer) {
                    var content = `<div class="fun-fact" data-fun-fact-color="#36bd78">
                                <div class="fun-fact-text">
                                    <span>Note moyenne</span>
                                    <h4>${data.getObjet.average}</h4>
                                </div>
                                <div class="fun-fact-icon"><i class="icon-material-outline-gavel"></i></div>
                            </div>
                            <div class="fun-fact" data-fun-fact-color="#b81b7f">
                                <div class="fun-fact-text">
                                    <span>Nombre visite profile</span>
                                    <h4>${data.getObjet.nbreView}</h4>
                                </div>
                                <div class="fun-fact-icon"><i class="icon-feather-eye"></i></div>
                            </div>
                            <div class="fun-fact" data-fun-fact-color="#efa80f">
                                <div class="fun-fact-text">
                                    <span>Feedback</span>
                                    <h4>${data.getObjet.nbreFeedBack}</h4>
                                </div>
                                <div class="fun-fact-icon"><i class="icon-material-outline-feedback"></i></div>
                            </div>`;

                    $("#miniStats").html(content);
                } else {
                    var content = `<div class="fun-fact" data-fun-fact-color="#36bd78">
                                        <div class="fun-fact-text">
                                        <span>Offres</span>
                                        <h4>${data.getObjet.nbreOffer}</h4>
                                        </div>
                                        <div class="fun-fact-icon"><i class="icon-material-outline-local-offer"></i></div>
                                    </div>
                                    <div class="fun-fact" data-fun-fact-color="#b81b7f">
                                        <div class="fun-fact-text">
                                        <span>Favoris</span>
                                        <h4>${data.getObjet.nbreFavoris}</h4>
                                        </div>
                                        <div class="fun-fact-icon"><i class="icon-material-outline-favorite"></i></div>
                                    </div>
                                    <div class="fun-fact" data-fun-fact-color="#efa80f">
                                        <div class="fun-fact-text">
                                        <span>Feedback</span>
                                        <h4>${data.getObjet.nbreFeedBack}</h4>
                                        </div>
                                        <div class="fun-fact-icon"><i class="icon-material-outline-feedback"></i></div>
                                    </div>`;
                    $("#miniStats").html(content)
                }

            },
            error: function (err) {
                console.log(err)
            }
        });
    })

}

/**
 * Récupération des tops freelancers
 * @param {Number} limit Nombre de freelancer qu'on veut get
 */
const topFreelancer = (limit) => {
    getUserId(function (state, session) {

        $.ajax({
            type: 'GET',
            url: `/api/users/top/${limit}`,
            dataType: "json",
            success: function (data) {
                if (data.getEtat) {
                    const contentHead = `<div class="col-xl-12">
                                            <div class="section-headline margin-top-0 margin-bottom-25">
                                                <h3>Top Freelancer</h3>
                                                <a href="/candidats/liste" class="headline-link color_blue">Voir tous nos candidats</a>
                                            </div>
                                        </div>
                                        <div class="col-xl-12">
                                            <div class="default-slick-carousel freelancers-container freelancers-grid-layout" id="freelancerInTop">
                                            </div>
                                        </di>`;
                    $("#topFreelancer").html(contentHead);

                    if (data.getObjet.length > 0) {

                        var outFreelancer = 0;

                    data.getObjet.map((freelancer, item, tab) => {
                        console.log(freelancer);
                        var name = () => {
                            if (freelancer.identity) {
                                return `${freelancer.identity.lastName} ${freelancer.identity.name.toUpperCase()}`
                            } else {
                                return freelancer.email;
                            }
                        },
                            favorite = () => {
                                if (state && session.isEmployer) {
                                    if (freelancer.isThisInFavorite) {
                                        return `<span data-tippy-placement="top" title="Retirer de mes favoris" data-favoris="true" data-user="${freelancer._id}" class="bookmark-icon favoris bookmarked"></span>
                                            <div class="sbl-circ loader-favoris"></div>
                                        `;
                                    } else {
                                        return `<span data-tippy-placement="top" title="Ajouter aux favoris" data-favoris="false" data-user="${freelancer._id}" class="bookmark-icon favoris"></span>
                                            <div class="sbl-circ loader-favoris"></div>
                                        `
                                    }
                                } else {
                                    return ``;
                                }

                            },
                            skills = () => {
                                if (freelancer.skills && freelancer.skills.length > 0) {
                                    return `<span>${freelancer.skills[0]} ${freelancer.skills.length > 1 ? ` + ${freelancer.skills[1]}` : ""}</span>`;
                                } else {
                                    return freelancer.email;
                                }
                            },
                            content = `<!--Freelancer -->
							<div style="background-color: #2c2b2b" class="freelancer">

								<!-- Overview -->
								<div class="freelancer-overview">
									<div class="freelancer-overview-inner">
										
										<!-- Bookmark Icon -->
										${favorite()}
										
										<!-- Avatar -->
										<div class="freelancer-avatar">
											<div class="verified-badge"></div>
											<a href="/candidats/${freelancer._id}/profile"><img src="images/user-avatar-big-01.jpg" alt=""></a>
										</div>

										<!-- Name -->
										<div class="freelancer-name">
											<h4><a style="color: #fff;" href="/candidats/${freelancer._id}/profile">${name()}<br/><img class="flag" src="/images/flags/cd.svg" alt="" title="Congo-Kinshasa" data-tippy-placement="top"></a></h4>
											${skills()}
										</div>

										<!-- Rating -->
										<div class="freelancer-rating">
											<div class="star-rating" data-rating="${freelancer.average}"></div>
										</div>
									</div>
								</div>
								
								<!-- Details -->
								<div style="background-color: #2c2b2b;" class="freelancer-details">
									<div class="freelancer-details-list">
										<ul>
											<li>Localisation <strong style="color: #fff;"> ${freelancer.town ? `<i class="icon-material-outline-location-on"></i> ${freelancer.town}` : `---`}</strong></li>
											<li>Taux <strong style="color: #fff;">$${freelancer.hourly ? freelancer.hourly.rate : "0"} / hr</strong></li>
											<li>A temps <strong style="color: #fff;">${freelancer.inTime}%</strong></li>
										</ul>
									</div>
									<a href="/candidats/${freelancer._id}/profile" class="button button-sliding-icon ripple-effect">Voir le profile <i class="icon-material-outline-arrow-right-alt"></i></a>
								</div>
							</div>
                            <!-- Freelancer / End -->`;

                        outFreelancer++;

                        $("#freelancerInTop").append(content);

                        if (outFreelancer == tab.length) {

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
                                distance: 10

                            });

                            //Caroussel
                            $('.default-slick-carousel').slick({
                                infinite: false,
                                slidesToShow: 3,
                                slidesToScroll: 1,
                                dots: false,
                                arrows: true,
                                adaptiveHeight: true,
                                responsive: [
                                    {
                                        breakpoint: 1292,
                                        settings: {
                                            dots: true,
                                            arrows: false
                                        }
                                    },
                                    {
                                        breakpoint: 993,
                                        settings: {
                                            slidesToShow: 2,
                                            slidesToScroll: 2,
                                            dots: true,
                                            arrows: false
                                        }
                                    },
                                    {
                                        breakpoint: 769,
                                        settings: {
                                            slidesToShow: 1,
                                            slidesToScroll: 1,
                                            dots: true,
                                            arrows: false
                                        }
                                    }
                                ]
                            });

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
                                    if (data) {
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
                                    }
                                });
                                
                            })

                            }

                        })
                    }
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    });

    
}


/**
 * Dynamisation des metiers dans le dropdown et footer
 */
const getDropAnfooterJobs = (limit) => {
    getAllJob(limit, function (data) {
        if (data.getEtat) {
            data.getObjet.map(element => {
                var contentDrop = `<li><a href="/candidats/liste">${element.name}</a></li>`,
                    contentFooter = `<li><a href="/candidats/liste"><span>${element.name}</span></a></li>`;
                $("#dropJob").append(contentDrop);
                $("#footerJobs").append(contentFooter);
            });
        }
    });
}

/**
 * Dynamisation des villes dans le dropdown et footer
 */
const getDropAnfooterTown = () => {
    getAllTowns(function (data) {
        if (data.getEtat) {
            data.getObjet.map(element => {
                var contentDrop = `<li><a href="/candidats/liste">${element.name}</a></li>`,
                    contentFooter = `<li><a href="/candidats/liste"><span>${element.name}</span></a></li>`;
                $("#dropTown").append(contentDrop);
                $("#footerTown").append(contentFooter);
            });
        }
    })
}

/**
 * Dynamisation des détails des utilisateurs
 * @param {String} id L'identifinat de l'utilisateur qu'on veut voir les détails
 */
const detailsUser = (id) => {
    getUserId((isGet, user) => {
        $.ajax({
            type: 'GET',
            url: `/api/users/details/${id}`,
            dataType: "json",
            success: function (data) {
                if (data.getEtat) {

                    var freelancer = data.getObjet,
                        name = () => {
                            if (freelancer.identity) {
                                return `${freelancer.identity.lastName} ${freelancer.identity.name.toUpperCase()}`
                            } else {
                                return freelancer.email;
                            }
                        },
                        skills = () => {
                            if (freelancer.skills && freelancer.skills.length > 0) {
                                return `<span>${freelancer.skills[0]} ${freelancer.skills.length > 1 ? ` + ${freelancer.skills[1]}` : ""}</span>`;
                            } else {
                                return `<span>---</span>`;
                            }
                        },
                        bio = () => {
                            if (freelancer.bio) {
                                return `<h3 class="margin-bottom-25">A propos de moi</h3>
                                    <p>${freelancer.bio.bio}</p>`
                            } else {
                                return `<h3 class="margin-bottom-25">A propos de moi</h3>
                                    <p style="color: #ccc">Je n'ai encore rien écrit sur moi, j'y travail dessus...</p>`
                            }
                        },
                        toggleBtnOffer = () => {
                            if (isGet && user.isEmployer) {
                                return `<a href="#small-dialog" class="apply-now-button popup-with-zoom-anim margin-bottom-50"> <i
									class="icon-feather-message-square"></i> Faire une offre</a>`;
                            } else {
                                return ""
                            }
                        },
                        favorite = () => {
                            if (isGet && user.isEmployer) {
                                $("#favoriteDetails")[0].style.display = "block";
                                if (freelancer.isThisInFavorite) {
                                    $("#favoriteDetails")[0].classList.add("bookmarked");
                                    $("#favoriteDetails")[0].setAttribute("data-favoris", "true");
                                    $("#favoriteDetails")[0].setAttribute("data-user", id);
                                    return `<span class="bookmark-icon"></span>
                                            <span class="bookmarked-text">Retirer des favoris</span>
                                            <span class="bookmark-text">Ajouter aux favoris</span>
                                            `;
                                } else {
                                    $("#favoriteDetails")[0].classList.remove("bookmarked");
                                    $("#favoriteDetails")[0].setAttribute("data-favoris", "false");
                                    $("#favoriteDetails")[0].setAttribute("data-user", id);
                                    return `<span class="bookmark-icon"></span>
                                            <span class="bookmark-text">Retirer des favoris</span>
                                            <span class="bookmarked-text">Ajouter aux favoris</span>
                                            `;
                                }
                            }else{
                                return ``;
                            }
                            
                        },
                        firstSection = `<div class="container">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="single-page-header-inner">
                                                    <div class="left-side">
                                                        <div class="header-image freelancer-avatar"><img src="/images/user-avatar-big-02.jpg" alt="">
                                                        </div>
                                                        <div class="header-details">
                                                            <h3>${name()} </h3><span style="font-size: 1em; font-weight: 100; color: #ccc; display: block;">${freelancer.job && freelancer.job.icon ? `<i class="${freelancer.job.icon}" style="font-size: 1.6em"></i>&nbsp;` : ""}${freelancer.job ? freelancer.job.name : "---"}</span>
                                                            <ul>
                                                                <li>
                                                                    <div class="star-rating" data-rating="${freelancer.average}"></div>
                                                                </li>
                                                                <li><div class="verified-badge-with-title">Certifié</div></li>
                                                                <li style="text-transform: capitalize">
                                                                    ${freelancer.town ? `${freelancer.town}&nbsp;&nbsp;<img class="flag" src="/images/flags/cd.svg" alt="" title="Congo-Kinshasa" data-tippy-placement="top">` : ""}
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`,
                        biographie = `${bio()}`;

                        console.log(freelancer);
                        
                    if (freelancer.feedBacks && freelancer.feedBacks.length > 0) {
                        freelancer.feedBacks.map((feedBack, item, tab) => {
                            var content = `<li>
								<div class="boxed-list-item">
									<!-- Content -->
									<div class="item-content">
										<!--<h4>Web, Database and API Developer</h4>-->
										<div class="item-details margin-top-10">
											<div class="star-rating" data-rating="${feedBack.evaluation.note}"></div>
											<div class="detail-item"><i class="icon-material-outline-date-range"></i> ${dateFeedBack(feedBack.evaluation.created_at)}</div>
										</div>
										<div class="item-description">
											<p>${feedBack.evaluation.message}</p>
										</div>
										<a class="button gray pull-right ripple-effect margin-top-5 margin-bottom-10"><i
												class="icon-feather-user"></i>
											${feedBack.identity_employeur.email}
										</a>
									</div>
								</div>
                            </li>`;

                            $("#feedbackDetails").append(content);
                        })
                    }

                    var hourly = `${freelancer.hourly ? `<div class="overview-item"><strong>$${freelancer.hourly.rate}</strong><span>Taux horaire</span></div>` : ""}`,
                        offer = `${toggleBtnOffer()}`;

                    if (freelancer.skills && freelancer.skills.length > 0) {
                        var head = `<h3>Compétences</h3>
                                    <div class="task-tags" id="skillDetails">
                                    </div>`;

                        $("#skillsDetails").html(head);

                        freelancer.skills.map((skill, item, tab) => {
                            var content = `<a href="https://www.google.com/search?q=Compétence+en+${skill.toLowerCase()}" target="_blank" style="margin-left: 4px"><span>${skill}</span></a>`;

                            $("#skillDetails").append(content);
                        })
                    }

                    var judgement = () => {
                            if (freelancer.inTime == 100) {
                                return "Super-Flash au boulot !"
                            }else if (freelancer.inTime >= 75) {
                                return "Flash au boulot !"
                            }else if (freelancer.inTime > 50) {
                                return "Rapide au boulot !"
                            }else if (freelancer.inTime == 50) {
                                return "Vitesse normale"
                            }else if (freelancer.inTime >= 40) {
                                return "Assez rapide, mais plus lent !"
                            }else if (freelancer.inTime >= 20) {
                                return "Lent !"
                            }else if (freelancer.inTime > 0) {
                                return "Trop lent, trop lent..."
                            }else if (freelancer.inTime == 0) {
                                return "Pas encore côté"
                            }
                        },
                        indicatorsTime = `<div class="indicator">
                                            <strong>${freelancer.inTime}%</strong>
                                            <div class="indicator-bar" data-indicator-percentage="${freelancer.inTime}"><span></span></div>
                                            <span>${judgement()}</span>
                                        </div>`;
                    var favoris = `${favorite()}`,
                        inputIdentity = () => {
                            if (freelancer.identity) {
                                return `<div class="input-with-icon-left">
                                            <i class="icon-material-outline-account-circle"></i>
                                            <input style="background-color:#fff;border-color:#ccc;" disabled="disabled" type="text"
                                                class="input-text with-border text-capitalize" name="name" id="name" placeholder="Votre nom"
                                                value="${freelancer.identity.lastName + " " + freelancer.identity.name}" />
                                        </div>`;
                            } else {
                                return "";
                            }
                        },
                        contentPopup = `<!-- Tab -->
					<div class="popup-tab-content" id="tab">
		
						<!-- Welcome Text -->
						<div class="welcome-text">
							<h3>Discuter sur votre projet avec ${freelancer.identity ? freelancer.identity.lastName : freelancer.email}</h3>
						</div>
		
						<!-- Form -->
						<form method="post" id="submitOffer">
		
							${inputIdentity()}
		
							<div class="input-with-icon-left">
								<i class="icon-material-baseline-mail-outline"></i>
								<input style="background-color:#fff;border-color:#ccc;" disabled="disabled" type="text"
									class="input-text with-border" name="emailaddress" id="emailaddress"
									value="${freelancer.email}" placeholder="Votre adresse email" />
							</div>
		
							<textarea style="background-color:#fff;border-color:#ccc;" name="textarea" cols="10"
								placeholder="Votre message" class="with-border" id="messageOffer"></textarea>
		
							<div class="uploadButton margin-top-25">
								<input class="uploadButton-input" type="file" accept="image/*, application/pdf" id="uploadAttachmentOffer"/>
								<label class="uploadButton-button ripple-effect" for="uploadAttachmentOffer" id="attachOffer">Attacher un fichier</label>
								<span class="uploadButton-file-name">Extensions valide: zip, pdf, png, jpg <br> Max. taille
									fichier: 5 MB.</span>
                            </div>
                            
						<button class="button margin-top-35 full-width button-sliding-icon ripple-effect" type="submit" form="submitOffer">Envoyer le message <i class="icon-material-outline-arrow-right-alt" ></i></button>
                        </form>
                        
					</div>
		
					</div>`;

                    $("#popupOffer").html(contentPopup);
                    $("#detailsHeader").html(firstSection);
                    $("#bioDetails").html(biographie);
                    $("#hourlyDetails").html(hourly);
                    $("#makeOffer").html(offer);
                    $("#favoriteDetails").html(favoris);
                    $("#indicatorsTime").html(indicatorsTime);

                    starRating(".star-rating");
                    submitOffer(id, freelancer.identity ? freelancer.identity.lastName.toUpperCase() : freelancer.email);
                    setAttachment();
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

                    //chargement du popup de connexion et inscription
                    $('.popup-with-zoom-anim').magnificPopup({
                        type: 'inline',

                        fixedContentPos: false,
                        fixedBgPos: true,

                        overflowY: 'auto',

                        closeBtnInside: true,
                        preloader: false,

                        midClick: true,
                        removalDelay: 300,
                        mainClass: 'my-mfp-zoom-in'
                    });

                    $('.indicator-bar').each(function () {
                        var indicatorLenght = $(this).attr('data-indicator-percentage');
                        $(this).find("span").css({
                            width: indicatorLenght + "%"
                        });
                    });
                    //on click du bouton favoris
                    $("#favoriteDetails").on('click', function (e) {
                        var element = e.currentTarget,
                            dataFavoris = {
                                user_id : element.getAttribute("data-user"),
                                state : element.getAttribute("data-favoris"),
                                employer : user.user_id
                            };
                        setFavoris(dataFavoris, element, function (data) {
                            return true;
                        });
                        
                    })
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    })

}

/**
 * Pour la soumission de l'offre
 * @param {String} id_freelancer l'id du freelancer
 */
const submitOffer = (id_freelancer, screenUser) => {
    $("#submitOffer").on("submit", (e) => {
        e.preventDefault();

        var txt = e.target.elements["textarea"].value;

        if (txt && txt.trim(" ")) {
            var attach = window.localStorage.getItem("images") ? window.localStorage.getItem("images") : null;
            $.ajax({
                type: 'POST',
                url: "/api/offer/make",
                data: {
                    id_freelancer: id_freelancer,
                    message: txt,
                    attach: attach
                },
                dataType: "json",
                success: function (data) {
                    if (data.getEtat) {
                        Snackbar.show({
                            text: `L'offre a été soumis à ${screenUser}...`,
                            pos: 'top-center',
                            showAction: false,
                            duration: 3000,
                            textColor: '#fff',
                            backgroundColor: '#3696f5'
                        });

                        setTimeout(() => {
                            window.location.reload();
                        }, 3003);
                    } else {
                        Snackbar.show({
                            text: data.getMessage,
                            pos: 'top-center',
                            showAction: false,
                            duration: 3000,
                            textColor: '#fff',
                            backgroundColor: '#ad344b'
                        });
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        } else {
            Snackbar.show({
                text: "L'offre necessite un message !",
                pos: 'top-center',
                showAction: false,
                duration: 3000,
                textColor: '#fff',
                backgroundColor: '#ad344b'
            });
        }

    })
}

/**
 * Upload des images
 */
const setAttachment = () => {

    //On recupère cette balise
    var input = document.getElementById("uploadAttachmentOffer");

    //On lui attache un listen à son événement "onchange"
    //Afin d'écouter un eventuel changement de valeur qui interviendrai
    //si l'utilisateur valider la selection du fichier
    input.addEventListener('change', function () {

        //LES VARIABLES
        var formData = new FormData(), //L'objet formDATA qui sera soumit comme data dans AJAX
            file, //Le fichier
            reader, //Le lecteur de fichier qui servira à donner l'apperçu du fichier uploadé
            sortie = false; //L'objet de sortie


        //On vérifie si l'input file contient au moins un fichier
        if (input.files.length > 0) {

            file = input.files[0]; //On recupère le fichier contenu dans l'objet 'files' de l'input
            sortie = true; //On passe à true la condition de vérification
        }

        //Puis on ajoute le fichier à l'objet formData
        //Ce dernier aura comme key "files" et comme value "le fichier"
        formData.append('file-s3', file, file.name);

        //On vérifie la sortie
        if (true) {

            $.ajax({
                url: `${getHostApi()}file-upload`,
                type: 'POST',
                data: formData,
                processData: false, // tell jQuery not to process the data
                contentType: false, // tell jQuery not to set contentType
                beforeSend: function () {
                    //$("#progressImage").fadeIn();
                },
                complete: function () {
                },
                success: function (data) {

                    if (data.getEtat) {

                        var images = data.getObjet._id;

                        localStorage.setItem("id_images", images);
                        $("#attachOffer").html("1 Fichier attaché");

                    } else {
                        Snackbar.show({
                            text: "Upload was not finished !",
                            pos: 'top-center',
                            showAction: true,
                            actionText: "Reéssayer",
                            duration: 3000,
                            textColor: '#fff',
                            backgroundColor: '#ad344b'
                        });
                    }


                },
                /*xhr: function () {

                    //$(".progress").show();
                    var progressBar = document.getElementById("progressImage");
                    // create an XMLHttpRequest
                    var xhr = new XMLHttpRequest();

                    // listen to the 'progress' event
                    xhr.upload.addEventListener('progress', function (evt) {

                        if (evt.lengthComputable) {
                            // calculate the percentage of upload completed
                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);

                            console.log(percentComplete);

                            progressBar.getElementsByClassName('progress-bar')[0].style.width = percentComplete + '%';
                            progressBar.getElementsByClassName('progress-bar')[0].innerHTML = percentComplete + '%';

                        }

                    }, false);

                    xhr.upload.addEventListener("loadend", (evt) => {
                        setTimeout(() => {
                            progressBar.setAttribute("style", `width: 0%`)
                            progressBar.style.display = 'none';
                        }, 500);
                    })

                    return xhr;
                }*/
            });


        }

        input.value = "";
    })



}
/**
 * Recuperation de favoris d'un employeur
 */
const getFavourites = (state, session) => {

    if (state && session.isEmployer) {
        $.ajax({
            type: 'GET',
            url: "/api/getFavorites/" + session.user_id,
            dataType: "json",
            success: function(data) {
                if (data.getEtat) {
                    const contentHead = `<div id="freelancerList" class="freelancers-container freelancers-grid-layout margin-top-35">
                                        </di>`;
                    $("#freelancerInfavoris").html(contentHead);

                    if (data.getObjet.length > 0) {

                        var outFreelancer = 0;

                        data.getObjet.map((freelancer, item, tab) => {
                            //console.log(freelancer);

                            var name = () => {
                                if (freelancer.identity) {
                                    return `${freelancer.identity.lastName} ${freelancer.identity.name.toUpperCase()}`
                                } else {
                                    return freelancer.email;
                                }
                            },
                                favorite = () => {
                                    if (state && session.isEmployer) {
                                        if (freelancer.isThisInFavorite) {
                                            return `<span data-tippy-placement="bottom" title="Retirer de mes favoris" data-favoris="true" data-user="${freelancer._id}" class="bookmark-icon bookmarked"></span>`;
                                        } else {
                                            return `<span data-favoris="false" data-user="${freelancer._id}" class="bookmark-icon"></span>`
                                        }
                                    }else{
                                        return ``;
                                    }
                                    
                                },
                                skills = () => {
                                    if (freelancer.skills && freelancer.skills.length > 0) {
                                        return `<span>${freelancer.skills[0]} ${freelancer.skills.length > 1 ? ` + ${freelancer.skills[1]}` : ""}</span>`;
                                    } else {
                                        return `<span>---</span>`;
                                    }
                                },
                                content = `<!--Freelancer -->
                                <div style="background-color: #333" class="freelancer">

                                    <!-- Overview -->
                                    <div class="freelancer-overview">
                                        <div class="freelancer-overview-inner">
                                            
                                            <!-- Bookmark Icon -->
                                            ${favorite()}
                                            
                                            <!-- Avatar -->
                                            <div class="freelancer-avatar">
                                                <div class="verified-badge"></div>
                                                <a href="/candidats/${freelancer._id}/profile"><img src="/images/user-avatar-big-01.jpg" alt=""></a>
                                            </div>

                                            <!-- Name -->
                                            <div class="freelancer-name">
                                                <h4><a style="color: #fff;" href="/candidats/${freelancer._id}/profile">${name()}<br/><img class="flag" src="/images/flags/cd.svg" alt="" title="Congo-Kinshasa" data-tippy-placement="top"></a></h4>
                                                ${skills()}
                                            </div>

                                            <!-- Rating -->
                                            <div class="freelancer-rating">
                                                <div class="star-rating" data-rating="${freelancer.average}"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Details -->
                                    <div style="background-color: #333;" class="freelancer-details">
                                        <center>
                                            <div class="freelancer-details-list">
                                                <center>
                                                    <ul>
                                                        <li>Localisation <strong style="color: #fff;"> ${freelancer.town ? `<i class="icon-material-outline-location-on"></i> ${freelancer.town}` : `---`}</strong></li>
                                                        <li>Taux <strong style="color: #fff;">$${freelancer.hourly ? freelancer.hourly.rate : "0"} / hr</strong></li>
                                                        <li>A temps <strong style="color: #fff;">95%</strong></li>
                                                    </ul>
                                                </center>
                                            </div>
                                            <a href="/candidats/${freelancer._id}/profile" class="button button-sliding-icon ripple-effect">Voir le profile <i class="icon-material-outline-arrow-right-alt"></i></a>
                                        </center>
                                    </div>
                                </div>
                                <!-- Freelancer / End -->`;

                            outFreelancer++;

                            $("#freelancerList").append(content);

                            if (outFreelancer == tab.length) {

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
                                    
                                })

                            }

                        })
                    }
                }else{
                    $("#freelancerInfavoris").html(`
                        <div class="row">
                            <div class="col-md-12">
                                <center>
                                    <div style="margin:2% 0%;"><span style="font-size:150px;" class="icon-line-awesome-star-o"></span><br/><br/><br/>
                                        <p style="font-size:25px;">La liste de vos favoris est vide</p>
                                        <p style="font-size:18px;">Ajouter des profiles dans votre liste de favoris de sauvergader certains profiles interessant pour un contact ulterieur</p>
                                        <a href="/candidats/liste" class="button button-sliding-icon ripple-effect">Trouvez de profiles interessant ICI! 
                                            <i class="icon-material-outline-arrow-right-alt"></i></a>
                                    </div>

                                </center>
                            </div>
                            
                        </div>
                    `);
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    } else {}
    
}

/**
 * Recuperation de freelancer a qui on a envoyer aux offres
 */
const getFreelancersForOffer = (state, session) => {
    if (state && session.isEmployer) {
        $.ajax({
            type: 'GET',
            url: "/api/getFreelancersForOffer/" + session.user_id,
            dataType: "json",
            success: function(data) {
                console.log(data)
                if (data.getEtat) {
                    const contentHead = `<div id="freelancerList" class="freelancers-container freelancers-grid-layout margin-top-35">
                                        </di>`;
                    $("#freelancerInoffer").html(contentHead);

                    if (data.getObjet.length > 0) {

                        var outFreelancer = 0;

                        data.getObjet.map((freelancer, item, tab) => {
                            //console.log(freelancer);

                            var name = () => {
                                if (freelancer.infos.identity) {
                                    return `${freelancer.infos.identity.lastName} ${freelancer.infos.identity.name.toUpperCase()}`
                                } else {
                                    return freelancer.infos.email;
                                }
                            },
                                favorite = () => {
                                    if (state && session.isEmployer) {
                                        if (freelancer.infos.isThisInFavorite) {
                                            return `<span data-tippy-placement="bottom" title="Retirer de mes favoris" data-favoris="true" data-user="${freelancer.infos._id}" class="bookmark-icon bookmarked"></span>`;
                                        } else {
                                            return `<span data-tippy-placement="bottom" title="Ajouter aux favoris" data-favoris="false" data-user="${freelancer.infos._id}" class="bookmark-icon"></span>`
                                        }
                                    }else{
                                        return ``;
                                    }
                                    
                                },
                                skills = () => {
                                    if (freelancer.infos.skills && freelancer.infos.skills.length > 0) {
                                        return `<span>${freelancer.infos.skills[0]} ${freelancer.infos.skills.length > 1 ? ` + ${freelancer.infos.skills[1]}` : ""}</span>`;
                                    } else {
                                        return `<span>---</span>`;
                                    }
                                },
                                content = `<!--Freelancer -->
                                <div style="background-color: #333" class="freelancer">

                                    <!-- Overview -->
                                    <div class="freelancer-overview">
                                        <div class="freelancer-overview-inner">
                                            
                                            <!-- Bookmark Icon -->
                                            ${favorite()}
                                            
                                            <!-- Avatar -->
                                            <div class="freelancer-avatar">
                                                <div class="verified-badge"></div>
                                                <a href="/candidats/${freelancer.infos._id}/profile"><img src="/images/user-avatar-big-01.jpg" alt=""></a>
                                            </div>

                                            <!-- Name -->
                                            <div class="freelancer-name">
                                                <h4><a style="color: #fff;" href="/candidats/${freelancer.infos._id}/profile">${name()}<br/><img class="flag" src="/images/flags/cd.svg" alt="" title="Congo-Kinshasa" data-tippy-placement="top"></a></h4>
                                                ${skills()}
                                            </div>

                                            <!-- Rating -->
                                            <div class="freelancer-rating">
                                                <div class="star-rating" data-rating="${freelancer.infos.average}"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Details -->
                                    <div style="background-color: #333;" class="freelancer-details">
                                        <center>
                                            <div class="freelancer-details-list">
                                                <center>
                                                    <ul>
                                                        <li>Localisation <strong style="color: #fff;"> ${freelancer.infos.town ? `<i class="icon-material-outline-location-on"></i> ${freelancer.infos.town}` : `---`}</strong></li>
                                                        <li>Taux <strong style="color: #fff;">$${freelancer.infos.hourly ? freelancer.infos.hourly.rate : "0"} / hr</strong></li>
                                                        <li>A temps <strong style="color: #fff;">95%</strong></li>
                                                        <li>Nb. offres <strong style="color: #fff;">${freelancer.nbreOffer ? `${freelancer.nbreOffer}` : `---`}</strong></li>
                                                    </ul>
                                                </center>
                                            </div>
                                            <a data-user="${freelancer.infos._id}" data-name="${name()}" href="#small-dialog-2" class="popup-with-zoom-anim button button-sliding-icon ripple-effect leave-review-btn">Laissez votre appreciation 
                                            <i class="icon-material-outline-arrow-right-alt"></i></a>
                                        </center>
                                    </div>
                                </div>
                                <!-- Freelancer / End -->`;

                            outFreelancer++;

                            $("#freelancerList").append(content);

                            if (outFreelancer == tab.length) {

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
                                
                                //chargement du popup de connexion et inscription
                                $('.popup-with-zoom-anim').magnificPopup({
                                    type: 'inline',

                                    fixedContentPos: false,
                                    fixedBgPos: true,

                                    overflowY: 'auto',

                                    closeBtnInside: true,
                                    preloader: false,

                                    midClick: true,
                                    removalDelay: 300,
                                    mainClass: 'my-mfp-zoom-in'
                                });

                                $(".leave-review-btn").on('click', function (e) {
                                    var name = e.currentTarget.getAttribute("data-name"),
                                        id_user = e.currentTarget.getAttribute("data-user");
                                    $("#nameFreelancer").html(`Noté <a id="${id_user}" href="#">${name}</a> par rapport à sa facon de travailler`)
                                });

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

                                //send feedback
                                sendReview(session);

                            }

                        })
                    }
                }else{
                    $("#freelancerInfavoris").html(`
                        <div class="row">
                            <div class="col-md-12">
                                <div style="margin:13% 0%;"><span style="font-size:150px;" class="icon-material-outline-assignment"></span><br/><br/><br/>
                                    <p style="font-size:25px;">La liste de vos contacts est vide</p>
                                    <p>Ici nous listons tous les profiles à qui vous avez envoyer une offre, cela pour vous de rester en contact à n'importe quel moment</p>
                                    <a href="/candidats/liste" class="button button-sliding-icon ripple-effect">Trouvez de profiles interessant ICI! 
                                            <i class="icon-material-outline-arrow-right-alt"></i></a>
                                </div>
                            </div>
                            
                        </div>
                    `);
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    }
}

/**
 * Met a jour un feedback
 */
const sendReview = (session) => {
    $("#leave-review-form").on('submit', function (e) {
        e.preventDefault();
        var inputs = e.target.elements,
            objData = {};
        for (let index = 0; index < inputs.length; index++) {
            var name = e.target.elements[index].name;
            if (/input/i.test(e.target.elements[index].localName)) {
                if (e.target.elements[index].type == "radio") {
                    if (e.target.elements[index].checked) {
                        objData[name] = e.target.elements[index].value;
                    }
                } else {
                    objData[name] = e.target.elements[index].value;
                }
            }
            if (/textarea/i.test(e.target.elements[index].localName)) {
                objData[name] = e.target.elements[index].value;
            }
        }
        objData["id_freelancer"] = $("#nameFreelancer a")[0].id;
        objData["id_employeur"] = session.user_id;
        if (NoEmpty(objData)) {
            $.ajax({
                type: 'POST',
                url: "/api/setReview",
                dataType: "json",
                data : objData,
                beforeSend : function () {
                    $("#btn-leave-review").html("Envoi en cours...");
                },
                success: function(data) {
                    $("#btn-leave-review").html(`Valider <i class="icon-material-outline-arrow-right-alt"></i>`);
                    if (data.getEtat) {
                        Snackbar.show({
                            text: "Votre appreciation est envoye avec success",
                            pos: 'top-center',
                            showAction: false,
                            duration: 3000,
                            textColor: '#fff',
                            backgroundColor: '#3696f5'
                        });
                    } else {
                        Snackbar.show({
                            text: data.getMessage,
                            pos: 'top-center',
                            showAction: false,
                            duration: 3000,
                            textColor: '#fff',
                            backgroundColor: '#ad344b'
                        });
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
                text: "Veuillez renseigner tous les champs",
                pos: 'top-center',
                showAction: true,
                actionText: "Fermer",
                duration: 5000,
                textColor: '#fff',
                backgroundColor: '#ad344b'
            });
        }
    })
}

const getReview = (state, user) => {
    if (state) {
        $.ajax({
            type: 'GET',
            url: "/api/getFeedBacks/" + user.user_id,
            dataType: "json",
            success: function(data) {
                if (data.getEtat) {
                    if (data.getObjet.feedBacks.length > 0) {
                        $("#listReview").html(``);
                        var outfeedback=0;
                        data.getObjet.feedBacks.map(review => {

                            outfeedback++;
                            var name = () => {
                                if (review.identity_employeur.identity) {
                                    return `${review.identity_employeur.identity.lastName} ${review.identity_employeur.identity.name.toUpperCase()}`
                                } else {
                                    return review.identity_employeur.email;
                                }
                            },
                            contentFeedback = `<li>
                                <div class="boxed-list-item">
                                    <!-- Content -->
                                    <div class="item-content">
                                        <div class="item-details margin-top-10">
                                        <div class="star-rating" data-rating="${review.evaluation.note}"></div>
                                        <div class="detail-item"><i class="icon-material-outline-date-range"></i>${dateFeedBack(review.evaluation.created_at)}</div>
                                        </div>
                                        <div class="item-description">
                                        <p>${review.evaluation.message}</p>
                                        </div>
                                    </div>
                                    </div>
                                    <a class="button gray pull-right ripple-effect margin-top-5 margin-bottom-10"><i class="icon-feather-user"></i>
                                    ${name()}
                                    </a>
                                </li>`;
                            $("#listReview").append(contentFeedback);

                            if (outfeedback == data.getObjet.feedBacks.length) {
                                starRating('.star-rating');
                            }
                        });
                    }else{
                        $("#listReview").html(`
                            <div class="col-md-12">
                                <center>
                                    <div style="margin:7% 0%;"><span style="font-size:150px;" class="icon-line-awesome-comments-o"></span><br/><br/><br/>
                                        <p style="font-size:25px;">Aucun feedback n'est emit sur vous </p>
                                        <p>Ici nous listons tout ce que les gens qui vous ont contacter pense de vous, par rapport a votre facon de travailler</p><br/>
                                    </div>
                                </center>
                            </div>
                        `);
                    }
                } else {
                    $("#listReview").html(`
                        <div class="col-md-12">
                            <center>
                                <div style="margin:7% 0%;"><span style="font-size:150px;" class="icon-line-awesome-comments-o"></span><br/><br/><br/>
                                    <p style="font-size:25px;">Aucun feedback n'est emit sur vous </p>
                                    <p>Ici nous listons tout ce que les gens qui vous ont contacter pense de vous, par rapport a votre facon de travailler</p><br/>
                                </div>
                            </center>
                        </div>
                    `);
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    }
}

export { login, register, getStatsUsers, getNav, activeAccount, statsInDashboard, topFreelancer, getDropAnfooterJobs, getDropAnfooterTown, sidebar, detailsUser, dropNav }