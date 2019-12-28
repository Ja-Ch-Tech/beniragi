$(document).ready(function () {
    initUsers();
});

function initUsers() {
	login();
	register();

}

//Permet de connecter un utilisateur
function login() {
	$("#login-form").on('submit', function (e) {
		e.preventDefault();
		var inputs = e.target.elements,
			objData = {};

		for (let index = 0; index < inputs.length; index++) {
            var name = e.target.elements[index].name;
            	objData[name] = e.target.elements[index].value;
        }

    	$.ajax({
	        url : 'api/login',
	        type : 'POST',
	        dataType: "json",
        	data: objData,
        	beforeSend : function () {
        		$("#login-button").text("Verification ...");
        	},
	        success : function (infos) {
	        	console.log(infos);
	        	$("#login-button").text("Se connecter");
	        	if (infos.getEtat) {
	        		window.location.href = '/';
	        	}else{
	        		$("#errorLogin")[0].style.display = 'block';
	        		$("#errorLogin")[0].style.opacity = '1';
	        		$("#errorLogin p")[0].innerHTML = infos.getMessage;
	        	}
	        },
	        error : function (err) {
	        	console.log(err);
	        }
	    })

	});
}

//Permet d'enregistrer un utilisateur
function register() {
	//Dynamisation des types users
	getAllTypesUser(function (types) {
		if (types) {
			var sortieType = 0;
			types.map(type => {
				sortieType++;
				var typeChecked = function () {
					if (sortieType == 1) {
						return 'checked = "checked"';
					}else{
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
            	}else{
            		objData[name] = e.target.elements[index].value;
            	}
            	
            }
            	
        }
		
		$.ajax({
	        url : 'api/register',
	        type : 'POST',
	        dataType: "json",
        	data: objData,
        	beforeSend : function () {
        		$("#register-button").html("Enregistrement ...");
        	},
	        success : function (user) {
				console.log(user);
				$("#register-button").html(`Terminer <i class="icon-material-outline-arrow-right-alt"></i>`);
				if (user.getEtat) {
					window.location.href = '/';
				} else {
					$("#errorRegister")[0].style.display = 'block';
	        		$("#errorRegister")[0].style.opacity = '1';
	        		$("#errorRegister p")[0].innerHTML = user.getMessage;
				}
	        },
	        error : function (err) {
	        	console.log(err);
	        }
	    })

	})
}