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

            if (data.getEtat) {

                if (data.getObjet.length > 0) {
                    var content = `<div  class="header-notifications message">
                                        <div class="header-notifications-trigger">
                                            <a id="LinkMessage" href="#"><i class="icon-feather-mail"></i><span>${data.getObjet.length}</span></a>
                                        </div>

                                        <!-- Dropdown -->
                                        <div class="header-notifications-dropdown">

                                            <div class="header-notifications-headline">
                                                <h4>Messages</h4>
                                                <button class="mark-as-read ripple-effect-dark" title="Marquer tout comme lu" data-tippy-placement="left">
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
                                                            <strong>${name()}</strong>
                                                            <p style="display: block;" class="notification-msg-text">${message.message}</p>
                                                            <span style="font-size: .8em" class="color">${customDate(message.send_at)}</span>
                                                        </div>
                                                    </a>
                                                </li>`;

                        $("#messagesList").append(contentMessage);

                        if (outMessages === tab.length) {
                            dropNav("message");
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

export { newMessage }