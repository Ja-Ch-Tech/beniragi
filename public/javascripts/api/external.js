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
                <textarea cols="1" rows="1" style="padding-left: 7px; border: 1px solid #aaa; background-color: transparent;"placeholder="Entrez le message texte..." data-autoresize></textarea>
                <button class="button ripple-effect">Envoyer</button>
              </div>`;

    $("#messageSelect").html(content);
    autoResize();
    getMessagesForOffer(userConnected, id);
}

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
            return -1;
        }

        return 1;
    });
    threadMessage.messages[0].messages.map((message, item, tab) => {
       
        var content = `<div class="message-bubble ${userConnected == message.id_user ? `me` : ``}">
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