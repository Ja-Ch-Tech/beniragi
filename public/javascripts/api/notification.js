import { customDate } from './init.js';
import { dropNav } from './users_api.js';

/**
 * Récupération des nouveaux messages non lus
 * @param {Number} limit Limit des messages
 */
const newMessage = (limit) => {
    $.ajax({
        type: 'GET',
        url: `/api/notification/newMessage/${limit}`,
        dataType: "json",
        success: function (data) {

            var content = `
                    <div class="header-notifications notifications" id="dropNotification">
                    </div>
                    <div  class="header-notifications message">
                        <div class="header-notifications-trigger">
                        <a id="LinkMessage" href="#"><i class="icon-feather-mail"></i>${data.getEtat ? `<span>${data.getObjet.length}</span></a>` : ""}
                        </div>

                        <!-- Dropdown -->
                        <div class="header-notifications-dropdown">

                            <div class="header-notifications-headline">
                                <h4 style="color: #333;">Messages</h4>
                                <button class="mark-as-read ripple-effect-dark" id="setReadMessage" title="Marquer tout comme lu" data-tippy-placement="left">
                                    <i class="icon-feather-check-square"></i>
                                </button>
                            </div>

                            <div class="header-notifications-content">
                                <div class="header-notifications-scroll" data-simplebar>
                                    <ul id="messagesList">
                                        <!-- Dynamic content -->
                                    </ul>
                                </div>
                            </div>

                            <a href="/profile/messages" class="header-notifications-button ripple-effect button-sliding-icon">Voir tous les messages<i class="icon-material-outline-arrow-right-alt"></i></a>
                        </div>
                    <div>`;

            $("#containerMessage").html(content);
            //New offers
            newOffer(3);

            if (data.getEtat) {

                if (data.getObjet.length > 0) {
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

                    var outMessages = 0;
                    data.getObjet.map((message, item, tab) => {

                        outMessages++;
                        var name = () => {
                            return message.identity ? message.identity.lastName + " " + message.identity.name : message.email;
                        },
                            contentMessage = `<!-- Notification -->
                                                <li class="notifications-not-read">
                                                    <a href="#" onclick="setRead($(this), '${message._id}')">
                                                        <span class="notification-avatar status-online"><img src="/images/user-avatar-small-03.jpg" alt=""></span>
                                                        <div class="notification-text">
                                                            <strong class="poppins-font">${name()}</strong>
                                                            <p style="display: block;" class="notification-msg-text">${message.message}</p>
                                                            <span style="font-size: .8em" class="color">${customDate(message.send_at)}</span>
                                                        </div>
                                                    </a>
                                                </li>`;

                        $("#messagesList").append(contentMessage);

                        if (outMessages === tab.length) {
                            dropNav("message");
                            setAllRead("message", "setReadMessage");
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
 * Récupération des nouveaux offres non lus
 * @param {Number} limit Limit des messages
 */
const newOffer = (limit) => {
    $.ajax({
        type: 'GET',
        url: `/api/notification/getOffers/${limit}`,
        dataType: "json",
        success: function (data) {
            console.log(data);

            var content = `

                        <!-- Trigger -->
                        <div class="header-notifications-trigger">
                            <a href="#"><i class="icon-feather-bell"></i>${data.getEtat ? `<span>${data.getObjet.length}</span>` : ""}</a>
                        </div>

                        <!-- Dropdown -->
                        <div class="header-notifications-dropdown">

                            <div class="header-notifications-headline">
                                <h4 style="color: #333;">Notifications</h4>
                                <button class="mark-as-read ripple-effect-dark" id="setReadOffer" title="Marquer tout comme lue" data-tippy-placement="left">
                                    <i class="icon-feather-check-square"></i>
                                </button>
                            </div>

                            <div class="header-notifications-content">
                                <div class="header-notifications-scroll" data-simplebar>
                                    <ul id="newOffer">
                                       <!-- Dynamic content -->
                                    </ul>
                                </div>
                            </div>

                        </div>`;

            $("#dropNotification").html(content);
            if (data.getEtat) {
                var outNotification = 0;

                data.getObjet.map((notification, item, tab) => {

                    outNotification++;
                    var name = () => {
                        return notification.identity ? notification.identity.lastName + " " + notification.identity.name : notification.email;
                    },
                        content = `<!-- Notification -->
                                <li class="notifications-not-read">
                                    <a href="#" onclick="setRead($(this), '${notification._id}')">
                                        <span class="notification-icon"><i class="icon-material-outline-group"></i></span>
                                        <span class="notification-text">
                                            <strong class="poppins-font">${name()}</strong> vous a fait une offre de travail.
                                            ${notification.attachment && notification.attachment.path ? `<a href="${notification.attachment.path}" download style="font-size: .7em; margin-left: 20%; width: 42%; background-color: #ad344b; color: #fff; border-radius: 2px; padding: 2px 7px; margin-bottom: 8px; margin-top: -15px; display: inline-block;"><i class="icon-material-outline-attach-file"></i>&nbsp;Télécharger pièce jointe</a>` : ``}
                                            </span>
                                            
                                            
                                    </a>
                                </li>`;

                    $("#newOffer").append(content);

                    if (outNotification === tab.length) {
                        //Dropdown
                        dropNav("notifications");

                        //Marque tous comme lu
                        setAllRead("offer", "setReadOffer");

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
                            distance: 10

                        });
                    }
                })
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

/**
 * Marquer tous comme lue
 * @param {String} type Le type de définition de lecture qu'on veut faire
 * @param {String} id l'attribut id
 */
const setAllRead = (type, id) => {
    $("#" + id).on("click", () => {
        requestForSetRead(type);
    })
}

/**
 * La requête vers le serveur pour marquer comme lu
 * @param {String} type Le de définition de lecture qu'on veut faire
 */
function requestForSetRead(type) {
    $.ajax({
        type: 'GET',
        url: `/api/notification/setAllRead/${type}`,
        dataType: "json",
        success: function (data) {

            if (data.getEtat) {
                window.location.reload();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

export { newMessage }
