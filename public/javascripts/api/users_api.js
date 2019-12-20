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
	
}