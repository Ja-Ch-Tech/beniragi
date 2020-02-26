import { getUserId, customDate } from './init.js';

//Recupération de la liste
const getMessagesList = () => {
    $.ajax({
        type: 'GET',
        url: "/api/offer/getMessages",
        dataType: "json",
        success: function (data) {
            if (data.getEtat) {
                if (data.getObjet.length > 0) {

                    //Tri côté client
                    data.getObjet.sort((contact1, contact2) => {
                        if (contact1.messages[0].messages[contact1.messages[0].messages.length - 1].send_at > contact2.messages[0].messages[contact2.messages[0].messages.length - 1].send_at) {
                            return -1;
                        }

                        return 1;
                    });

                    // On sauvegarde en local storage
                    window.localStorage.setItem("conversation", JSON.stringify(data.getObjet));

                    var outList = 0;

                    data.getObjet.map((contact, item, tab) => {

                        console.log(contact);
                        getOtherEntrant(contact.entrants, (info, userConnected, other) => {
                            outList++;

                            var infoHeader = () => {
                                return info.identity ? info.identity.lastName + " " + info.identity.name : info.email
                            },
                                content = `<!-- class="active-message"-->
                                            <li onclick="activeMessage('${userConnected}','${contact._id}', '${infoHeader()}', '${contact.flag[0].flag}', '${info.avatar && info.avatar.path ? info.avatar.path : `/images/svg/avatar-default.svg`}', '${other.avatar && other.avatar.path ? other.avatar.path : `/images/svg/avatar-default.svg`}')">
                                            <a href="#">
                                                <div class="message-avatar"><i class="status-icon status-online"></i><img src="${info.avatar && info.avatar.path ? info.avatar.path : `/images/svg/avatar-default.svg`}" alt="" /></div>

                                                <div class="message-by">
                                                <div class="message-by-headline">
                                                    <h5 class="poppins-font">${info.identity ? `${info.identity.lastName} ${info.identity.name}` : `${info.email}`}</h5>
                                                    <span style="font-size: .6em">${customDate(contact.messages[0].messages[contact.messages[0].messages.length - 1].send_at)}</span>
                                                </div>
                                                <p>${contact.messages[0].messages[contact.messages[0].messages.length - 1].message}</p>
                                                </div>
                                            </a>
                                            </li>`;

                            $("#listMessages").append(content);

                            if (outList == tab.length) {
                                //search();
                            }
                        })
                    })
                }
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

//Récupération de l'autre participant
const getOtherEntrant = (entrant, callback) => {
    getUserId((isGet, user) => {
        if (isGet) {
            if (user.user_id == entrant.employer.id_viewer) {
                callback(entrant.freelancer, user.user_id, entrant.employer)
            } else {
                callback(entrant.employer, user.user_id, entrant.freelancer)
            }
        }
    })
}

export { getMessagesList as messageList }