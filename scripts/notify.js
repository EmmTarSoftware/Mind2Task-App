// --------------------------------            USER MESSAGES               -----------------------------





//  Définition des textes de message utilisateur

let arrayUserMessage ={
    emptyTitleField : "Le champ 'Titre' n'est pas renseignés",
    emptyStepField : "Un champ d'étape est vide",
    errorDate : "Les dates définies sont incorrectes",
    taskCreated : "Création de la tache : ",
    taskDone : "Clôture de la tâche : ",
    templateCreated : "Création du modèle : ",
    templateModified : "Modification du modèle : ",
    templateLimite : "Nombre maximal de modèle atteint !",
    stepLimite : "Nombre maximal d'étape atteint !",
    templateListEmpty :"Vous n'avez créé aucun modèle.",
    savePriority : "Priorité sauvegardée",
    saveStatus : "Statut sauvegardé",
    bddDeleted : "La base a été supprimée",
    forbidenItem : "Des données sensibles ont été effacées",
    errorDoubleTitle : "Ce titre existe déjà dans la base"
};
    

//  --------------------------  Animation user message -------------------------------------
let isNotifyAEnabled = false,
isNotifyBEnabled = false;


// Balancer de userMessage
function eventUserMessage(textToDisplay,type) {
    // Verifie la div disponible et lui donne la requette
    console.log("[ USER-MESSAGE ] requette recu");

    if (isNotifyAEnabled === false) {
        isNotifyAEnabled = true;
        ondisplayUserMsgA(textToDisplay,type);
    }else if (isNotifyBEnabled === false) {
        isNotifyBEnabled = true;
        ondisplayUserMsgB(textToDisplay,type);
    }else{
        console.log("userMessage mais aucune div de disponible");
    }
    

}


// Div usermessage A
function ondisplayUserMsgA(textToDisplay,type) {
    console.log("[ USER-MESSAGE ] Traitement par div A");
        let imgUserMsgRef = document.getElementById("imgUserMsgA");

        // Set l'image selon le type d'user message
        switch (type) {
            case "info":
                imgUserMsgRef.src = "./images/IconeUserInfo.png";
                break;
            case "warning":
                imgUserMsgRef.src = "./images/IconeUserWarning.png";
                break;
            case "error":
                imgUserMsgRef.src = "./images/IconeUserError.png";
                break;
            default:
                console.log("Type non configurer pour eventUserMessage");
                break;
        }


        // Set le texte du message
        let pUserMessageTextRef = document.getElementById("pUserMessageTextA");
        let divUserMessageRef = document.getElementById("divUserMessageA");
        pUserMessageTextRef.innerHTML =  textToDisplay + " !";
    

        // Affiche la div
        divUserMessageRef.style.display ="block";


        // Cache la div apres un delay
        setTimeout(() => {
            divUserMessageRef.style.display = "none";
            isNotifyAEnabled = false;
        }, 2000);

}

// Div usermessage B
function ondisplayUserMsgB(textToDisplay,type) {

    console.log("[ USER-MESSAGE ] Traitement par div B");

        let imgUserMsgRef = document.getElementById("imgUserMsgB");

        // Set l'image selon le type d'user message
        switch (type) {
            case "info":
                imgUserMsgRef.src = "./images/IconeUserInfo.png";
                break;
            case "warning":
                imgUserMsgRef.src = "./images/IconeUserWarning.png";
                break;
            case "error":
                imgUserMsgRef.src = "./images/IconeUserError.png";
                break;
            default:
                console.log("Type non configurer pour eventUserMessage");
                break;
        }


        // Set le texte du message
        let pUserMessageTextRef = document.getElementById("pUserMessageTextB");
        let divUserMessageRef = document.getElementById("divUserMessageB");
        pUserMessageTextRef.innerHTML =  textToDisplay + " !";
    

        // Affiche la div
        divUserMessageRef.style.display ="block";


        // Cache la div apres un delay
        setTimeout(() => {
            divUserMessageRef.style.display = "none";
            isNotifyBEnabled = false;
        }, 2000);

}




// -------------------------------- NOTIFICATION et ALERTE sur les DATES -----------------------------







let notifyTodayArray = [],
    notifyLateArray = [];

function onUpdateNotifyDate(array) {
    // Reset les éléments
    notifyTodayArray = [];
    notifyLateArray = [];

    // Recupere la date du jours
    let currentDate = onFormatDateToday();

    // Notification du jours
    onNotifyDateToday(array,currentDate);
}


// notification du jours
function onNotifyDateToday(array,dateTarget) {
    array.forEach(e => {
        if (e.dateStart.value === dateTarget && e.dateStart.notify === true) {
            notifyTodayArray.push({tag: e.tag, title :e.title});
        }
    });

    console.log("liste des titre à notifier :");
    console.log( notifyTodayArray);




    // Notification date en retard
    onNotifyDateLate(array,dateTarget);
}



// Date en retard
function onNotifyDateLate(array,dateToday) {
    array.forEach(e => {
        if (dateToday > e.dateEnd.value && e.dateEnd.notify === true) {
            notifyLateArray.push({tag: e.tag, title :e.title , date: e.dateEnd.value});
        }
    });

    console.log("liste des titre en retard à notifier :");
    console.log( notifyLateArray);


    // Traitement de l'affichage
    onTraiteNotifyDate();
}




// Traitement des notifications
function onTraiteNotifyDate() {
    // Reference l'icone de notification
    let imgNotifyAvailableRef = document.getElementById("imgNotifyAvailable");



    // Si des notifications sont disponibles, l'icone est visible
    imgNotifyAvailableRef.style.display = (notifyTodayArray.length > 0 || notifyLateArray.length  > 0) ? "inline-block" : "none" ;

}



// Affichage des notifications
function onDisplayNotifyDate(isDisplay) {
    // Reference et reset
    let ulListNotifyTodayRef = document.getElementById("ulListNotifyToday"),
    ulListNotifyLateRef = document.getElementById("ulListNotifyLate");
    ulListNotifyTodayRef.innerHTML = "";
    ulListNotifyLateRef.innerHTML = "";


    if (isDisplay === true) {

        if (notifyTodayArray.length > 0) {
            notifyTodayArray.forEach(e=>{
                let newLi = document.createElement("li");
                newLi.innerHTML = `<i>${e.tag}</i> : ${e.title}`;
                newLi.className = "notifyDate";

                ulListNotifyTodayRef.appendChild(newLi);
            })
        }else{
            ulListNotifyTodayRef.innerHTML = "Aucune notification";
        }
        

        if (notifyLateArray.length > 0) {
            notifyLateArray.forEach(e=>{
                let newLi = document.createElement("li");
                newLi.innerHTML = ` <i>${e.tag}</i> : ${e.title} => ${e.date}`;
                newLi.className = "notifyDate";

                ulListNotifyLateRef.appendChild(newLi);
            })
        }else{
            ulListNotifyLateRef.innerHTML = "Aucune notification";
        }
        
    }else{
        ulListNotifyTodayRef.innerHTML = "";
        ulListNotifyLateRef.innerHTML = "";
    }


    document.getElementById("divNotifyAlert").style.display = isDisplay === true ? "block" : "none";

}


// Masquage des notifications