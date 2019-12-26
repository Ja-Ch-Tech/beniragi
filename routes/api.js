var express = require('express');
var router = express.Router();
var axios = require("axios").default;
var API = require("../manageURL").URL().API;

var session = require("cookie-session");

var app = express();

app.use(session({
    secret: "FrdrcpeterBeniragiWebSite4586324"
}))

//Test si un objet est vide
const Empty = object => {
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

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

//Creation d'un compte
router.post('/register', (req, res) => {
    
    var data = {
        email: req.body.email,
        password: req.body.password,
        id_type: req.body.id_type
    };

    if (Empty(data)) {

        axios.post(`${API}/users/register`, data)
            .then(inscription => {

                if (inscription.data.getEtat) {

                    req.session.id_user_beni = inscription.data.getObjet._id;
                    req.session.id_type_user_beni = inscription.data.getObjet.id_type;

                    res.status(200).send(inscription.data);

                } else {

                    res.status(200).send(inscription.data);
                }
            })
            .catch(error => {
                res.send(error)
            })
    } else {
        res.send({
            getEtat: false,
            getMessage: "Certains champs obligatoires sont vides"
        })
    }
})

//Connexion d'un compte
router.post('/login', (req, res) => {

    var data = {
        email: req.body.email,
        password: req.body.password
    };

    if (Empty(data)) {

        axios.post(`${API}/users/login`, data)
            .then(user => {
                if (user.data.getEtat) {
                    req.session.id_user_beni = user.data.getObjet.id_user;
                    req.session.id_type_user_beni = user.data.getObjet.id_type;
                    req.session.type_user_beni = user.data.getObjet.typeUser;

                    res.status(200);
                    res.send(user.data);

                } else {

                    res.status(200);
                    res.send(user.data)
                }
            })
            .catch(error => {
                res.send(error)
            })
    } else {
        res.send({ getEtat: false, getMessage: "Veuillez remplir tous les champs" })
    }
})

//Recupere les types des utilisateurs
router.get('/users/getAllTypes', (req, res) => {
    axios.get(`${API}/type_users/getAll`)
        .then(response => {
            res.status(200);
            res.send(response.data)
        })
        .catch(err => {
            res.status(500);
            res.send(err);
        })
})

//Route pour la récupération de nombre de user par type
router.get('/users/numberUserByType', (req, res) => {
    axios.get(`${API}/users/numberUserByType`)
        .then(response => {
            res.status(200).send(response.data);
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

module.exports = router;
