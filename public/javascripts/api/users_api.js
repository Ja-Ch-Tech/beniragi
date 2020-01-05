import { getAllTypesUser, getUserId, NoEmpty, getHostApi, getAllTowns, starRating, getAllJob, dateFeedBack } from './init.js';
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
                            backgroundColor: '#f00'
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
        success: function (data) {  
            callback(data);
        },
        error : function (err) {
            callback(err);
        }
    });
}

//Pour la définition de la visibility
function toggleVisibility() {
    if ($('.status-switch label.user-invisible').hasClass('current-status')) {
        $('.status-indicator').addClass('right');
    }

    $('.status-switch label.user-invisible').on('click', function () {
        $('.status-indicator').addClass('right');
        $('.status-switch label').removeClass('current-status');
        $('.user-invisible').addClass('current-status');
    });

    $('.status-switch label.user-online').on('click', function () {
        $('.status-indicator').removeClass('right');
        $('.status-switch label').removeClass('current-status');
        $('.user-online').addClass('current-status');
    });
}

/**
 * Module permettant de rendre dynamique le menu
 */
const getNav = () => {

	getUserId(function (state, user) {
        var navContent,
        pathName = window.location.pathname;
		if (state) {
			//Recuperation des informations du user
			getUserInfos(user.user_id, function (infos) {
                if (infos.getObjet.flag) {
                    navContent = `<!--  User Notifications -->
                                <div class="header-widget hide-on-mobile">
                                   
                                    <!-- Messages -->
                                    <div id="containerMessage" class="header-notifications">
                                        <div class="header-notifications-trigger">
                                            <a id="LinkMessage" href="#"><i class="icon-feather-mail"></i><span>3</span></a>
                                        </div>

                                        <!-- Dropdown -->
                                        <div class="header-notifications-dropdown">

                                            <div class="header-notifications-headline">
                                                <h4>Messages</h4>
                                                <button class="mark-as-read ripple-effect-dark" title="Mark all as read" data-tippy-placement="left">
                                                    <i class="icon-feather-check-square"></i>
                                                </button>
                                            </div>

                                            <div class="header-notifications-content">
                                                <div class="header-notifications-scroll" data-simplebar>
                                                    <ul>
                                                        <!-- Notification -->
                                                        <li class="notifications-not-read">
                                                            <a href="dashboard-messages.html">
                                                                <span class="notification-avatar status-online"><img src="/images/user-avatar-small-03.jpg" alt=""></span>
                                                                <div class="notification-text">
                                                                    <strong>David Peterson</strong>
                                                                    <p class="notification-msg-text">Thanks for reaching out. I'm quite busy right now on many...</p>
                                                                    <span class="color">4 hours ago</span>
                                                                </div>
                                                            </a>
                                                        </li>

                                                        <!-- Notification -->
                                                        <li class="notifications-not-read">
                                                            <a href="dashboard-messages.html">
                                                                <span class="notification-avatar status-offline"><img src="/images/user-avatar-small-02.jpg" alt=""></span>
                                                                <div class="notification-text">
                                                                    <strong>Sindy Forest</strong>
                                                                    <p class="notification-msg-text">Hi Tom! Hate to break it to you, but I'm actually on vacation until...</p>
                                                                    <span class="color">Yesterday</span>
                                                                </div>
                                                            </a>
                                                        </li>

                                                        <!-- Notification -->
                                                        <li class="notifications-not-read">
                                                            <a href="dashboard-messages.html">
                                                                <span class="notification-avatar status-online"><img src="/images/user-avatar-placeholder.png" alt=""></span>
                                                                <div class="notification-text">
                                                                    <strong>Marcin Kowalski</strong>
                                                                    <p class="notification-msg-text">I received payment. Thanks for cooperation!</p>
                                                                    <span class="color">Yesterday</span>
                                                                </div>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <a href="dashboard-messages.html" class="header-notifications-button ripple-effect button-sliding-icon">View All Messages<i class="icon-material-outline-arrow-right-alt"></i></a>
                                        </div>
                                    </div>

                                </div>
                                <!--  User Notifications / End -->

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
                                                    <label class="user-online ${infos.getObjet.visibility ? `current-status`: `` }">Disponible</label>
                                                    <label class="user-invisible ${!infos.getObjet.visibility ? `current-status` : `` }">Non-disponible</label>
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

                    /*--------------------------------------------------*/
                    /*  Notification Dropdowns
                    /*--------------------------------------------------*/
                    $(".header-notifications").each(function() {
                        var userMenu = $(this);
                        var userMenuTrigger = $(this).find('.header-notifications-trigger a');

                        $(userMenuTrigger).on('click', function(event) {
                            event.preventDefault();

                            if ( $(this).closest(".header-notifications").is(".active") ) {
                                close_user_dropdown();
                            } else {
                                close_user_dropdown();
                                userMenu.addClass('active');
                            }
                        });
                    });

                    // Closing function
                    function close_user_dropdown() {
                        $('.header-notifications').removeClass("active");
                    }

                    // Closes notification dropdown on click outside the conatainer
                    var mouse_is_inside = false;

                    $( ".header-notifications" ).on( "mouseenter", function() {
                    mouse_is_inside=true;
                    });
                    $( ".header-notifications" ).on( "mouseleave", function() {
                    mouse_is_inside=false;
                    });

                    $("body").mouseup(function(){
                        if(! mouse_is_inside) close_user_dropdown();
                    });

                    // Close with ESC
                    $(document).keyup(function(e) { 
                        if (e.keyCode == 27) {
                            close_user_dropdown();
                        }
                    });
                    toggleVisibility();
                    //Remplissage des informations sur le user dans les details
                    if (/profile/i.test(pathName.split("/")[1]) && /parametres/i.test(pathName.split("/")[2])) {
                        userParameters(user, infos);
                    }
                }else{
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
		}else{

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


/**
 * Module permettant pre remplire les informations du user dans la page parametres
 */
const userParameters = (user, details) => {
    console.log(details)
    var content = `<!-- Dashboard Box -->
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
                                    <textarea cols="30" placeholder="Une petite presentation de ce vous etes" rows="5" class="with-border"></textarea>
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
            <li>
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
                        <button id="setSkillsBtn" class="keyword-input-button ripple-effect"><i class="icon-material-outline-add"></i></button>
                      </div>
                      <div class="keywords-list" id="listSkills">
                        <span class="keyword"><span class="keyword-text">Angular</span></span>
                        <span class="keyword"><span class="keyword-text">Vue JS</span></span>
                        <span class="keyword"><span class="keyword-text">iOS</span></span>
                        <span class="keyword"><span class="keyword-text">Android</span></span>
                        <span class="keyword"><span class="keyword-text">Laravel</span></span>
                      </div>
                      <div class="clearfix"></div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
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
    
   
    updateAccount();

    $('select').selectpicker();
    boostrapSelect();
    submitSelect(user);
    submitSkills(user, details.getObjet.jobs.id_job);
}

/**
 * Effectue la soumission des skills
 */
const submitSkills = (user, id_job) => {
    var btn = $("#setSkillsBtn"),
        input = $("#setSkillsInput"),
        listSkills = $("#listSkills"),
        skills = [];
    
    btn.on('click', function (e) {
        e.preventDefault();
        if (input.val().trim("") != "") {

            //AJoute l'item dans le tab skills
            skills.push({
                name : input.val()
            });
            
            //Ajoute le skills dans le HTML
            listSkills.append(`<span class="keyword"><span class="keyword-remove"></span><span class="keyword-text">${input.val()}</span></span>`);

            console.log(skills);

            $.ajax({
                type: 'POST',
                url: `${getHostApi()}users/setSkills`,
                dataType: "json",
                data: {
                    id_user : user.user_id,
                    skills : ["Mbuyu", "Kasongo"]
                },
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }else{
            Snackbar.show({
                text: "Veuillez renseigner votre specialite, SVP!",
                pos: 'bottom-right',
                showAction: true,
                actionText: "Fermer",
                duration: 5000,
                textColor: '#fff',
                backgroundColor: '#ad344b'
            });
        }
    })
};
/**
 * Effectue la soumission des inputs select (Mise a jour d'un job, d'une ville)
 */
const submitSelect = (user) => {
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
                        id_job : value,
                        id_user : user.user_id
                    },
                    beforeSend : function () {
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
                    error : function (err) {
                        callback(err)
                    }
                });
            }else if (select.id == "inputTown") {
                $.ajax({
                    type: 'POST',
                    url: "/api/users/setTown",
                    dataType: "json",
                    data: {
                        id_town : value,
                        id_user : user.user_id
                    },
                    beforeSend : function () {
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
                    error : function (err) {
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
                    url: `/api/jobs/gets/`+ null,
                    dataType: "json",
                    success: function (data) {
                        var option,
                            li,
                            sortieJob = 0;
                        if (data.getEtat) {
                            console.log(data);
                            data.getObjet.map(job => {
                                sortieJob++;
    
                                //Remplissage des options
                                option = document.createElement('option');
                                option.value = job._id;
                                option.innerHTML = job.name;
                                select.appendChild(option);
    
                                //Remplissage du dropdown
                                li = document.createElement('li');
                                li.setAttribute("data-original-index", sortieJob + 1);
                                li.innerHTML = `<a tabindex="0" class data-tokens="null" role="option" aria-disabled="false" aria-selected="false">
                                    <span class="text">${job.name}</span>
                                    <span class="glyphicon glyphicon-ok check-mark"></span>
                                </a>`;
    
                                ulDrop.appendChild(li);
    
                                if (sortieJob == data.getObjet.length) {
                                    verrouJob = true;
                                    $(".dropdown-toggle").next().next().selectpicker();
                                }
                            });
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            }
            
        }else if (btnId == "inputTown") {
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
    
                                //Remplissage du dropdown
                                li = document.createElement('li');
                                li.setAttribute("data-original-index", sortieTown + 1);
                                li.innerHTML = `<a tabindex="0" class data-tokens="null" role="option" aria-disabled="false" aria-selected="false">
                                    <span class="text">${town.name}</span>
                                    <span class="glyphicon glyphicon-ok check-mark"></span>
                                </a>`;
    
                                ulDrop.appendChild(li);
    
                                if (sortieTown == data.getObjet.length) {
                                    verrouTown = true;
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

        for (let index = 0; index < inputs.length; index++) {
            if (/input/i.test(e.target.elements[index].localName)) {
                if (inputs[index].type != "email") {
                    objData[inputs[index].name] = inputs[index].value;
                }
            }
        }
        console.log(objData)
        if (NoEmpty(objData)) {
            $.ajax({
                type: 'POST',
                url: "/api/users/setIdentity",
                dataType: "json",
                data: objData,
                beforeSend : function () {
                    $("#registerInfosBtn").html(`<center><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></center>`);
                },
                success: function (data) {            
                    $("#registerInfosBtn").html(`<center>
                        <button type="submit" form="updateInfosForm" class="button ripple-effect big margin-top-30 float-right"><i class="icon-line-awesome-save"></i> Enregistrer</ button>
                    </center>`);
                    if (data.getEtat) {
                        Snackbar.show({
                            text: "Votre compte a ete mis a jour avec success",
                            pos: 'bottom-right',
                            showAction: true,
                            actionText: "Fermer",
                            duration: 5000,
                            textColor: '#fff',
                            backgroundColor: '#3696f5'
                        });
                    } else {
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
                error : function (err) {
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
    fileInput.on('change', function(){
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
                err : function (err) {
                    console.log(err)
                }
            });
        }
    });
    
    $(".upload-button").on('click', function() {
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
        }else{
            code = parseInt(input.value);

            $.ajax({
                type: 'POST',
                url: "/api/profile/activation",
                dataType: "json",
                data: {
                    user_id : user_id,
                    code : code
                },
                beforeSend : function () {
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
                error : function (err) {
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
                    <li class="${active("/profile/messages")}"><a href="/profile/messages"><i class="icon-material-outline-question-answer"></i> Messages <span class="nav-tag">2</span></a></li>`;
    if (user.isEmployer) {
        content += `<li class="${active("/profile/favoris")}"><a href="/profile/favoris"><i class="icon-material-outline-favorite"></i> Favoris</a></li>
        <li class="${active("/profile/contacts")}"><a href="/profile/contacts"><i class="icon-feather-users"></i> Contacts</a></li>
        `;
    } else {
        content += `<li class="${active("/profile/contacts")}"><a href="/profile/feedback"><i class="icon-material-outline-feedback"></i> Feedback (normal) <span class="nav-tag">12</span></a></li>`;
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
                                        <h4>4</h4>
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
                                if (freelancer.isThisInFavorite) {
                                    return `<span class="bookmark-icon" style="color: gold"></span>`;
                                }else{
                                    return `<span class="bookmark-icon"></span>`
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
											<li>A temps <strong style="color: #fff;">95%</strong></li>
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
                                distance: 10,

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
                        }
                            
                    })
                }
            }
        },
        error: function (err) {
            console.log(err);
        }
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

                    console.log(data.getObjet);

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
                            if (freelancer.isThisInFavorite) {
                                
                                return `<span class="bookmark-icon" style="color: gold;"></span>
                                        <span class="bookmark-text">Retirer des favoris</span>
								        <span class="bookmarked-text">Ajouter aux favoris</span>`;
                            } else {
                                return `<span class="bookmark-icon"></span>
                                        <span class="bookmark-text">Ajouter aux favoris</span>
                                        <span class="bookmarked-text">Retirer des favoris</span>
                                        `;
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
                                                            <h3>${name()} <span>${skills()}</span></h3>
                                                            <ul>
                                                                <li>
                                                                    <div class="star-rating" data-rating="${freelancer.average}"></div>
                                                                </li>
                                                                <li><div class="verified-badge-with-title">Verified</div></li>
                                                                <li>
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
                        var head = `<h3>Competences</h3>
                                    <div class="task-tags" id="skillDetails">
                                    </div>`;

                        $("#skillsDetails").html(head);

                        freelancer.skills.map((skill, item, tab) => {
                            var content = `<a href="https://www.google.com/search?q=talent+${skill}" target="_blank" style="margin-left: 4px"><span>${skill}</span></a>`;

                            $("#skillDetails").append(content);
                        })
                    }

                    var favoris = `${favorite()}`;

                    $("#detailsHeader").html(firstSection);
                    $("#bioDetails").html(biographie);
                    $("#hourlyDetails").html(hourly);
                    $("#makeOffer").html(offer);
                    $("#favoriteDetails").html(favoris);
                    starRating(".star-rating");

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
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    })
    
}

export { login, register, getStatsUsers, getNav, activeAccount, statsInDashboard, topFreelancer, getDropAnfooterJobs, getDropAnfooterTown, sidebar, detailsUser }
