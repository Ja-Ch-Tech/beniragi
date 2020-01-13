/**
 * Permet de selectionner un message à afficher
 * @param {String} userConnected L'identifiant de l'utilisateur connecté
 * @param {String} id L'identifiant de la file de message
 * @param {String} identity Le proprio de la file en question
 */
function activeMessage(userConnected, id, identity) {
    window.localStorage.setItem("currentList", id);

    var content = `<div class="messages-headline">
                  <h4>${identity}</h4>
                  <a href="#" class="message-action"><i class="icon-feather-trash-2"></i> Supprimer la conversation</a>
                </div>
                
                <!-- Message Content Inner -->
                <div class="message-content-inner" id="messageSet">
                    <!-- Dynamic content -->
                </div>
                <div class="message-reply">
                <form id="submitMessage" style="display: flex; width: 100%;"><textarea cols="1" rows="1" style="padding-left: 7px; border: 1px solid #2c2b2b; background-color: transparent;" name="textarea" placeholder="Entrez le message texte..." data-autoresize></textarea><button class="button ripple-effect" form="submitMessage">Envoyer</button></form>
                
              </div>`;

    $("#messageSelect").html(content);
    autoResize();
    getMessagesForOffer(userConnected, id);
    sendMessage();
}

/**
 * Fonction permettant le redimensionnement automatique du textarea
 */
function autoResize() {
    jQuery.each(jQuery('textarea[data-autoresize]'), function () {
        var offset = this.offsetHeight - this.clientHeight;

        var resizeTextarea = function (el) {
            jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset);
        };
        jQuery(this).on('keyup input', function () { resizeTextarea(this); }).removeAttr('data-autoresize');
    });
}

/**
 * Permet la rcherche d'un élément dans un tableau à une propriété spécifié
 * @param {Array} tableau Le tableau dont on cherche un élément
 * @param {Number} id L'id en question
 */
function getItem(tableau, id) {
    const itemOut = tableau.find(item => item._id == id);

    return itemOut;
}

/**
 * Récupération des message d'une offre
 * @param {String} userConnected L'identifiant de l'utilisateur connecté
 * @param {String} id L'identifiant de l'offre
 */
function getMessagesForOffer(userConnected, id) {
    var conversation = JSON.parse(window.localStorage.getItem("conversation")),
        threadMessage = getItem(conversation, id);

    //Tri côté client
    threadMessage.messages[0].messages.sort((message1, message2) => {
        if (message1.send_at > message2.send_at) {
            return 1;
        }

        return -1;
    });
    threadMessage.messages[0].messages.map((message, item, tab) => {

        var content = `<div class="message-bubble ${userConnected == message.id_sender ? `me` : ``}">
                        <div class="message-bubble-inner">
                        <div class="message-avatar"><img src="/images/user-avatar-small-01.jpg" alt="" /></div>
                        <div class="message-text">
                            <p>${message.message}</p>
                        </div>
                        </div>
                        <div class="clearfix"></div>
                    </div>`;

        $("#messageSet").append(content)
    })

}

/**
 * Envoi du message dans une offre
 */
function sendMessage() {
    
    $("#submitMessage").on('submit', (e) => {
        e.preventDefault();
        var txt = e.target.elements["textarea"].value;
        
        var objet = {
                id_offer: window.localStorage.getItem("currentList"),
                txt: txt
            };

        if (NoEmpty(objet)) {
            $.ajax({
                type: 'POST',
                url: "/api/offer/message/send",
                data: objet,
                dataType: "json",
                success: function (data) {
                    if (data.getEtat) {
                        var newMessage = `<div class="message-bubble me">
                                            <div class="message-bubble-inner">
                                            <div class="message-avatar"><img src="/images/user-avatar-small-01.jpg" alt="" /></div>
                                            <div class="message-text">
                                                <p>${data.getObjet.message}</p>
                                            </div>
                                            </div>
                                            <div class="clearfix"></div>
                                        </div>`;
                        $("#messageSet").append(newMessage);
                        e.target.elements["textarea"].value = "";
                        Snackbar.show({
                            text: `Message envoyé...`,
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
                error: function (err) {
                    console.log(err);
                }
            });
        } else {
            Snackbar.show({
                text: "Le message ne doit pas être vide !",
                pos: 'top-center',
                showAction: false,
                duration: 3000,
                textColor: '#fff',
                backgroundColor: '#ad344b'
            });
        }
        
    })
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

//Définir comme lue
function setRead(e, id) {
    $.ajax({
        type: 'GET',
        url: `/api/notification/setRead/${id}`,
        dataType: "json",
        success: function (data) {
            if (data.getEtat) {
                window.location.href = '/profile/messages';
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}