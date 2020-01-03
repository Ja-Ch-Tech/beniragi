import { getAllTypesUser, getUserId, NoEmpty, getHostApi } from './init.js';
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
                                    <input onkeyup="$(this).val().length > 3 ? $('#registerInfosBtn').slideDown() : ''" name="nom" onkeyup="" type="text" class="with-border" placeholder="Inserez votre nom" value="${details.getObjet.identity.name ? details.getObjet.identity.name : ""}">
                                </div>
                            </div>

                            <div class="col-xl-4">
                                <div class="submit-field">
                                    <h5>Postnom <span class="color_red">(*)</span></h5>
                                    <input onkeyup="$(this).val().length > 3 ? $('#registerInfosBtn').slideDown() : ''" name="postnom" type="text" class="with-border" placeholder="Inserez votre postnom" value="${details.getObjet.identity.postName ? details.getObjet.identity.postName : ""}">
                                </div>
                            </div>
                            <div class="col-xl-4">
                                <div class="submit-field">
                                    <h5>Prénom <span class="color_red">(*)</span></h5>
                                    <input onkeyup="$(this).val().length > 3 ? $('#registerInfosBtn').slideDown() : ''" name="prenom" type="text" class="with-border" placeholder="Inserez votre prenom" value="${details.getObjet.identity.lastName ? details.getObjet.identity.lastName : ""}">
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
                                    <input onkeyup="$(this).val().length > 3 ? $('#registerInfosBtn').slideDown() : ''" name="numero" type="text" class="with-border" placeholder="Inserez votre numéro de téléphone" value="${details.getObjet.identity.phoneNumber ? details.getObjet.identity.phoneNumber : ""}">
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
                        <input type="text" class="keyword-input with-border" placeholder="Ajouter une specialite" value =""/>
                        <button class="keyword-input-button ripple-effect"><i class="icon-material-outline-add"></i></button>
                      </div>
                      <div class="keywords-list">
                        <span class="keyword"><span class="keyword-remove"></span><span class="keyword-text">Angular</span></span>
                        <span class="keyword"><span class="keyword-remove"></span><span class="keyword-text">Vue JS</span></span>
                        <span class="keyword"><span class="keyword-remove"></span><span class="keyword-text">iOS</span></span>
                        <span class="keyword"><span class="keyword-remove"></span><span class="keyword-text">Android</span></span>
                        <span class="keyword"><span class="keyword-remove"></span><span class="keyword-text">Laravel</span></span>
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
                    <select class="selectpicker with-border" data-size="7" title="Select Job Type" data-live-search="true">
                      <option value="" selected>Selectionnez une votre ville actuelle</option>
                      <option value="US">United States</option>
                      <option value="UY">Kinshasa</option>
                      <option value="UZ">Kolwezi</option>
                      <option value="YE">Lubumbashi</option>
                    </select>
                  </div>
                </div>

                <div class="col-md-6">
                    <div class="submit-field">
                        <h5>Ajouter vos fichiers </h5>
                        
                        <!-- Attachments -->
                        <div class="attachments-container margin-top-0 margin-bottom-0">
                        <div class="attachment-box ripple-effect">
                            <span>Cover Letter</span>
                            <i>PDF</i>
                            <button class="remove-attachment" data-tippy-placement="top" title="Remove"></button>
                        </div>
                        <div class="attachment-box ripple-effect">
                            <span>Contract</span>
                            <i>DOCX</i>
                            <button class="remove-attachment" data-tippy-placement="top" title="Remove"></button>
                        </div>
                        </div>
                        <div class="clearfix"></div>
                        
                        <!-- Upload Button -->
                        <div class="uploadButton margin-top-0">
                        <input class="uploadButton-input" type="file" accept="image/*, application/pdf" id="upload" multiple/>
                        <label class="uploadButton-button ripple-effect" for="upload">Selectionnez</label>
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
}

/**
 * Effectue la soumission des inputs select (Mise a jour d'un job, d'une ville)
 */
const submitSelect = (user) => {
    $('select').on('change', function (e) {
        var select = e.currentTarget,
            value = select.options[select.selectedIndex].value;
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
        verrou = false,
        ulDrop;
    btn.on('click', function (e) {
        e.preventDefault();
        
        if (!verrou) {
            btn = btn[0];
            btnId = btn.getAttribute("data-id");
            select = btn.nextSibling.nextSibling;
            dropdown = btn.nextSibling;
            ulDrop = dropdown.getElementsByTagName("ul")[0];
            
            //Si on clique sur le button 
            if (btnId == "inputJob") {
                $.ajax({
                    type: 'GET',
                    url: `/api/jobs/gets/`+ null,
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
    
                                //Remplissage du dropdown
                                li = document.createElement('li');
                                li.setAttribute("data-original-index", sortieJob + 1);
                                li.innerHTML = `<a tabindex="0" class data-tokens="null" role="option" aria-disabled="false" aria-selected="false">
                                    <span class="text">${job.name}</span>
                                    <span class="glyphicon glyphicon-ok check-mark"></span>
                                </a>`;
    
                                ulDrop.appendChild(li);
    
                                if (sortieJob == data.getObjet.length) {
                                    verrou = true;
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
                        window.location.href = "/";
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

export { login, register, getStatsUsers, getNav, activeAccount, statsInDashboard }
