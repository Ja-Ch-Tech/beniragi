import { getAllTypesUser, getUserId, getHostWeb } from './init.js';

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
		var navContent;
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
                                <!-- User Menu / End -->`;
                    $("#navMenu").prepend(navContent);

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
                   
                }else{
                    navContent = `<!-- Lien vers l'activation d'un compte -->
                    <div class="header-widget hide-on-mobile">
                        <a href="/profile/activation" class="log-in-button"><i class="icon-line-awesome-unlock-alt"></i> <span>Activer votre compte</span></a>
                    </div>`;
                    $("#navMenu").prepend(navContent);
                }
			});
		}else{

			navContent = `<!-- USER NON CONNECTER -->
                <div class="header-widget">
                    <a href="#sign-in-dialog" class="popup-with-zoom-anim log-in-button"><i class="icon-feather-log-in"></i> <span>Connexion / Inscription</span></a>
                </div>`;
			$("#navMenu").prepend(navContent);

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
 * Cette fonction permet de faire le toggle des dropdown
 */
 const toggleDropdown = (content, link) => {
    $("#" + link).on('click', function (e) {
        e.preventDefault();

        $("#" + content)[0].classList.toggle('active');
       
    });
 }
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
const sidebar = () => {
    getUserId(function (state, user) {
        if (state) {
            
        }
    })
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

export { login, register, getStatsUsers, getNav, activeAccount, sidebar, statsInDashboard }
