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
        id_type: req.body.id_type,
        id_town : req.body.location__register
    };

    if (Empty(data)) {
        data["id_job"] = req.body.job__register;
        axios.post(`${API}/users/register`, data)
            .then(inscription => {

                if (inscription.data.getEtat) {

                    req.session.id_user_beni = inscription.data.getObjet._id;
                    req.session.id_type_user_beni = inscription.data.getObjet.id_type;
                    req.session.isEmployer = inscription.data.getObjet.isEmployer;

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
                    req.session.isEmployer = user.data.getObjet.isEmployer;

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

//Met a jour les informations d'un user
router.post('/users/setIdentity', (req, res) => {

    var data = {
        nom: req.body.nom,
        postnom: req.body.postnom,
        prenom: req.body.prenom,
        numero: req.body.numero,
        id_user: req.session.id_user_beni
    },
        dataDescription = {
            id_user: req.session.id_user_beni,
            bio: req.body.bio
        };

    if (Empty(data)) {

        axios.post(`${API}/users/setIdentity`, data)
            .then(user => {
                if (user.data.getEtat) {

                    //Si la description est aussi remplit
                    if (Empty(dataDescription)) {
                        //Deuxieme requete pour mettre a jour la description
                        axios.post(`${API}/users/setBio`, dataDescription)
                            .then(response => {
                                if (response.data.getEtat) {
                                    res.status(200).send(response.data);
                                } else {
                                    res.status(200).send(response.data)
                                }
                            })
                            .catch(error => {
                                res.send(error)
                            })
                    } else {
                        res.status(200).send(user.data);
                    }


                } else {
                    res.status(200).send(user.data)
                }
            })
            .catch(error => {
                res.send(error)
            })
    } else {
        res.send({ getEtat: false, getMessage: "Veuillez renseignez tous les champs importants" })
    }
});

//Met a jour le salaire horaire du user
router.post('/users/setHourly', (req, res) => {
    var data = {
        "rate": req.body.montant,
        "id_user": req.session.id_user_beni
    };
    axios.post(`${API}/users/setHourly`, data)
        .then(response => {
            res.status(200).send(response.data)
        })
        .catch(err => {
            res.status(500).send(err)
        })
});

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

//Récupération des métiers
router.get('/jobs/gets/:limit', (req, res) => {
    axios.get(`${API}/jobs/get/${parseInt(req.params.limit)}`)
        .then(response => {
            res.status(200).send(response.data)
        })
        .catch(err => {
            res.status(500).send(err);
        })
})
//Permet de recuperer l'identifiant d'un user
router.get('/getSessionUser', (req, res) => {
    let id = req.session.id_user_beni ? req.session.id_user_beni : null,
        isEmployer = req.session.isEmployer ? true : false;
    obj = {
        "user_id": id,
        "isEmployer": isEmployer
    };

    res.status(200);
    res.send(obj)
});

//Route pour la recuperation des informations d'un user
router.get('/getUserInfos/:user_id', (req, res) => {
    var id = req.session.id_user_beni ? req.session.id_user_beni : null;

    axios.get(`${API}/users/details/${req.params.user_id}/${id}`)
        .then(response => {
            res.status(200).send(response.data);
        })
        .catch(err => {
            res.status(500).send(err);
        })
});

//Route pour l'activation d'un compte utilisateur
router.post('/profile/activation', (req, res) => {

    var data = {
        id_user: req.body.user_id,
        code: req.body.code
    };

    if (Empty(data)) {

        axios.post(`${API}/code/activation`, data)
            .then(user => {
                if (user.data.getEtat) {
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
});

//Route pour specification du metier d'un user
router.post('/users/setJob', (req, res) => {

    var data = {
        id_user: req.body.id_user,
        id_job: req.body.id_job
    };

    if (Empty(data)) {

        axios.post(`${API}/users/setJob`, data)
            .then(job => {
                if (job.data.getEtat) {
                    res.status(200);
                    res.send(job.data);

                } else {

                    res.status(200);
                    res.send(job.data)
                }
            })
            .catch(error => {
                res.send(error)
            })
    } else {
        res.send({ getEtat: false, getMessage: "Certaines informations sont maquantes" })
    }
});


//Route pour specification ou la mise a jour d'une ville
router.post('/users/setTown', (req, res) => {

    var data = {
        id_user: req.body.id_user,
        id_town: req.body.id_town
    };

    if (Empty(data)) {

        axios.post(`${API}/users/setTown`, data)
            .then(town => {
                if (town.data.getEtat) {
                    res.status(200);
                    res.send(town.data);

                } else {

                    res.status(200);
                    res.send(town.data)
                }
            })
            .catch(error => {
                res.send(error)
            })
    } else {
        res.send({ getEtat: false, getMessage: "Certaines informations sont maquantes" })
    }
});

//Route pour l'ajout des skills
router.post('/setSkills', (req, res) => {

    var data = {
        id_user: req.body.id_user,
        skills: req.body.skills
    };

    axios.post(`${API}/users/setSkills`, data)
        .then(response => {
            res.status(200).send(response.data)
        })
        .catch(err => {
            res.status(500).send(err)
        })
});

//Route faisant l'autocompletion des skills
router.post('/searchSkills', (req, res) => {

    var data = {
        id_freelancer: req.body.id_freelancer,
        name: req.body.name
    };

    axios.post(`${API}/skills/autoComplete`, data)
        .then(response => {
            res.status(200).send(response.data)
        })
        .catch(err => {
            res.status(500).send(err)
        })
});

//Route faisant la mise a jour de favoris
router.post('/setFavoris', (req, res) => {

    var data = {
        id_freelancer: req.body.user_id,
        id_employer: req.body.employer
    };

    axios.post(`${API}/favoris/set`, data)
        .then(response => {
            res.status(200).send(response.data)
        })
        .catch(err => {
            res.status(500).send(err)
        })
});

//Route pour la récupération des stats
router.get('/users/stats', (req, res) => {
    axios.get(`${API}/users/stats/${req.session.id_user_beni}`)
        .then(response => {
            res.status(200).send(response.data)
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

//Récupération des données du graphe
router.get('/view/getGraphForSixMonth', (req, res) => {
    axios.get(`${API}/view/graphVisit/${req.session.id_user_beni}`)
        .then(response => {
            var formatData = response.data;

            if (formatData.getObjet.length > 0) {
                var responseOut = {
                    month: [],
                    visit: []
                },
                    outGraph = 0;

                formatData.getObjet.map((data, index, tab) => {
                    responseOut.month.push(data.month);
                    responseOut.visit.push(data.nbreVisite);

                    outGraph++;

                    if (outGraph == tab.length) {
                        var formatOut = {
                            getEtat: true,
                            getObjet: responseOut
                        };

                        res.status(200).send(formatOut);
                    }
                })
            } else {
                res.status(202).send({ getEtat: false })
            }

        })
        .catch(err => {
            res.status(500).send(err)
        })
})

//Récupération des détails d'un users
router.get('/users/details/:id', (req, res) => {
    axios.get(`${API}/users/details/${req.params.id}/${req.session.id_user_beni}`)
        .then(response => {
            res.status(200).send(response.data)
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

//Récupération des tops  freelancers
router.get('/users/top/:limit', (req, res) => {
    axios.get(`${API}/users/topFreelance/${req.session.id_user_beni ? req.session.id_user_beni : null}/${req.params.limit}`)
        .then(response => {
            res.status(200).send(response.data)
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

//Recuperation des villes
router.get('/getAllTowns', (req, res) => {
    axios.get(`${API}/town/gets`)
        .then(response => {
            res.status(200).send(response.data);
        })
        .catch(err => {
            res.status(500).send(err);
        })
})

//Passation de l'offre
router.post('/offer/make', (req, res) => {
    var setData = {
        "id_employer": req.session.id_user_beni && req.session.id_type_user_beni ? req.session.id_user_beni : "",
        "id_freelancer": req.body.id_freelancer ? req.body.id_freelancer : "",
        "message": req.body.message ? req.body.message : ""
    };

    if (Empty(setData)) {
        axios.post(`${API}/offer/make`, setData)
            .then(response => {
                if (req.body.attach) {
                    var attach = {
                        id_docs: req.body.attach
                    }
                    axios.post(`${API}/offer/attachment/${response.data.getObjet._id}`, attach)
                        .then(responseAttach => {
                            res.status(200).send(responseAttach.data)
                        })
                        .catch(err => {
                            res.status(202).send(response.data)
                        })
                } else {
                    res.status(200).send(response.data);
                }
            })
            .catch(err => {
                res.status(500).send(err)
            })
    } else {
        res.status(202).send({ getEtat: false, getMessage: "Données maquantes..." })
    }

})

//Récupération de la liste des messages
router.get('/offer/getMessages', (req, res) => {
    axios.get(`${API}/offer/getMessages/${req.session.id_user_beni}`)
        .then(response => {
            res.status(200).send(response.data);
        })
        .catch(err => {
            res.status(500).send(err)
        })

})

//Recuperation des favoris d'un employeur
router.get('/getFavorites/:id_employer', (req, res) => {
    axios.get(`${API}/users/getFavorites/${req.params.id_employer}`)
        .then(response => {
            res.status(200).send(response.data);
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

//Envoi du message
router.post('/offer/message/send', (req, res) => {
    var obj = {
        id_offer: req.body.id_offer,
        id_sender: req.session.id_user_beni ? req.session.id_user_beni : null,
        message: req.body.txt
    };

    if (Empty(obj)) {
        axios.post(`${API}/offer/message/send`, obj)
            .then(response => {
                var formatData = {
                    id_sender: obj.id_sender,
                    message: obj.message,
                    send_at: new Date().toDateString()
                };

                res.status(200).send({ getEtat: response.data.getEtat, getMessage: response.data.getMessage, getObjet: formatData });

            })
            .catch(err => {
                res.status(500).send(err)
            })
    } else {
        res.status(202).send({ getEtat: false, getMessage: "Des données manques !" })
    }
})

//Route pour la récupération des nouveaux messages
router.get('/notification/newMessage/:limit', (req, res) => {

    if (req.session.id_user_beni && (req.session.id_user_beni != null || req.session.id_user_beni != "null")) {
        axios.get(`${API}/notification/getNewMessageNotRead/${req.session.id_user_beni}/${parseInt(req.params.limit)}`)
            .then(response => {
                res.status(200).send(response.data)
            })
            .catch(err => {
                res.status(500).send(err)
            })
    } else {
        res.status(202).send({ getEtat: false, getMessage: "Vous n'êtes pas connecté" })
    }
})

//Route permettant de marquer une notification comme lu
router.get('/notification/setRead/:id', (req, res) => {
    axios.get(`${API}/notification/setAlreadyRead/${req.params.id}`)
        .then(response => {
            res.status(200).send(response.data)
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

//Recupere les freelancer contacter par un employeur
router.get('/getFreelancersForOffer/:id_employer', (req, res) => {
    axios.get(`${API}/offer/getFreelancersForOffer/${req.params.id_employer}`)
        .then(response => {
            res.status(200).send(response.data);
        })
        .catch(err => {
            res.status(500).send(err);
        })
})

//Soumission d'un feedback
router.post('/setReview', (req, res) => {
    var data = {
        id_employer: req.body.id_employeur,
        id_freelancer: req.body.id_freelancer,
        note: parseInt(req.body.rating),
        inTime: req.body.intime == "oui" ? true : false,
        message: req.body.commentaiire
    };
    axios.post(`${API}/evaluation`, data)
        .then(response => {
            res.status(200).send(response.data)
        })
        .catch(err => {
            res.status(500).send(err)
        })
});

//Recupere les feedbacks
router.get('/getFeedBacks/:id_freelancer', (req, res) => {
    axios.get(`${API}/evaluation/getFeedBacks/${req.params.id_freelancer}`)
        .then(response => {
            res.status(200).send(response.data);
        })
        .catch(err => {
            res.status(500).send(err);
        })
})

//Récupère les offres
router.get('/notification/getOffers/:limit', (req, res) => {
    if (req.session.id_user_beni && (req.session.id_user_beni != null || req.session.id_user_beni != "null")) {

        axios.get(`${API}/notification/getAll/${req.session.id_user_beni}/${parseInt(req.params.limit)}`)
            .then(response => {
                res.status(200).send(response.data)
            })
            .catch(err => {
                res.status(500).send(err)
            })
    } else {
        res.status(202).send({ getEtat: false, getMessage: "Vous n'êtes pas connecté" })
    }
})

//Route permettant de tout marquer comme lu
router.get('/notification/setAllRead/:type', (req, res) => {
    axios.get(`${API}/notification/setAllAlreadyRead/${req.session.id_user_beni}/${req.params.type}`)
        .then(response => {
            res.status(200).send(response.data)
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

//Route permattant le blocage ou le relancement de l'offre
router.post('/offer/toggle/:id_offer', (req, res) => {
    axios.post(`${API}/offer/toggle/${req.params.id_offer}/${req.session.id_user_beni}`)
        .then(response => {
            res.status(200).send(response.data)
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

//Passage de visible à invisible et vice-versa
router.post('/users/toggleVisibility', (req, res) => {
    axios.post(`${API}/users/toggleVisibility/${req.session.id_user_beni}`)
        .then(response => {
            res.status(200).send(response.data)
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

//Recherche
router.post('/megaSearch/:id_viewer', (req, res) => {
    var data = {
        "job": req.body.job,
        "town": req.body.town
    };
    axios.post(`${API}/users/smartSearch/${req.params.id_viewer}`, data)
        .then(response => {
            res.status(200).send(response.data)
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

//Envoi du mail pour la recuperation du mot de passe
router.post('/password/sendMail', (req, res) => {
    var data = {
        "email": req.body.email
    };
    axios.post(`${API}/users/forgotPassword`, data)
        .then(response => {
            res.status(200).send(response.data)
        })
        .catch(err => {
            res.status(500).send(err)
        })
});

//Modification du mot de passe
router.post('/password/change', (req, res) => {
    var data = {
        "token": req.body.token,
        "newPassword": req.body.password
    };
    axios.post(`${API}/users/resetPassword`, data)
        .then(user => {
            req.session.id_user_beni = user.data.getObjet.id_user;
            req.session.id_type_user_beni = user.data.getObjet.id_type;
            req.session.isEmployer = user.data.getObjet.isEmployer;

            res.status(200).send(user.data)
        })
        .catch(err => {
            res.status(500).send(err)
        })
});

//Récupéreration des comptes sponsorisé
router.get('/vip/:limit', (req, res) => {
    axios.get(`${API}/vip/${req.params.limit}`)
        .then(response => {
            res.status(200).send(response.data)
        })
        .catch(err => {
            res.status(500).send(err)
        })
});

//Route permettant de d'envoyer la demande de VIP
router.post('/vip/become', (req, res) => {
    var data = {
        "id_freelancer": req.session.id_user_beni
    };

    axios.post(`${API}/vip/become`, data)
        .then(response => {
            res.status(200).send(response.data)
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

//Définition de l'avatar d'un user
router.post('/users/setAvatar', (req, res) => {

    var data = {
        "id_media": req.body.id_media,
        "id_user": req.session.id_user_beni
    };

    if (Empty(data)) {
        axios.post(`${API}/users/setAvatar`, data)
            .then(response => {
                res.status(200).send(response.data)
            })
            .catch(err => {
                res.status(500).send(err)
            })
    } else {
        res.status(202).send({ getEtat: false, getMessage: "Données manquants !" })
    }
})

//Route pour la suppression du compte d'un utilisateur, cette route à nom bizarre c'est fait exprès pour qu'aucun utilisateur n'y tombe au hasard
router.get("/users/kjfgkegzjlm", (req, res) => {
    axios.delete(`${API}/users/delete/${req.session.id_user_beni}`)
        .then(response => {
            res.status(200).send(response.data);
        })
        .catch(err => {
            res.status(500).send(err);
        })
})

module.exports = router;