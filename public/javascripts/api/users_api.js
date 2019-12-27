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
            url: getHostWeb() + 'api/login',
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
                    window.location.href = '/';
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
            url: getHostWeb() + 'api/register',
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
        url: getHostWeb() + "api/users/numberUserByType",
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
        url: getHostWeb() + "api/getUserInfos/" + user_id,
        dataType: "json",
        success: function (data) {  
            callback(data);
        },
        error : function (err) {
            callback(err);
        }
    });
}
/**
 * Module permettant de rendre dynamique le menu
 */
const getNav = () => {

	getUserId(function (state, user) {
        console.log(state);
		var navContent;
		if (state) {
			//Recuperation des informations du user
			getUserInfos(user.user_id, function (infos) {
                console.log("infos");
                if (infos.getEtat) {

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
			//$("#navMenu").prepend(navContent);
		}
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
                url: getHostWeb() + "api/profile/activation",
                dataType: "json",
                data: {
                    user_id : user_id,
                    code : code
                },
                success: function (data) {            
                    console.log(data);
                },
                error : function (err) {
                    console.log(err);
                }
            });
        }
    });
 }


export { login, register, getStatsUsers, getNav, activeAccount }