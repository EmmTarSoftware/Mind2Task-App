// --------------------------------            USER MESSAGES               -----------------------------





//  Définition des textes de message utilisateur

let arrayUserMessage = {
    emptyTitleField: "Le champ 'Titre' n'est pas renseigné.",
    emptyStepField: "Un champ d'étape est vide.",
    errorDate: "Les dates définies sont incorrectes.",
    taskCreated: "Tâche créée : ",
    taskDone: "Tâche clôturée : ",
    templateCreated: "Modèle créé : ",
    templateModified: "Modèle modifié : ",
    templateLimit: "Nombre maximal de modèles atteint !",
    stepLimit: "Nombre maximal d'étapes atteint !",
    templateListEmpty: "Vous n'avez créé aucun modèle.",
    savePriority: "Priorité sauvegardée.",
    saveStatus: "Statut sauvegardé.",
    bddDeleted: "La base de données a été supprimée.",
    forbiddenItem: "Des données sensibles ont été effacées.",
    errorDoubleTitle: "Ce titre existe déjà dans la base de données."
};

    

//  --------------------------  Animation user message -------------------------------------
let isNotifyAFree = true,
isNotifyBFree = true,
userMsgCueArray = [];

// Balancer de userMessage
function eventUserMessage(textToDisplay,type) {
    console.log("[ USER-MESSAGE ] requette recu");
    

    

    // Set l'image selon le type d'user message
    let imageSrc = "";
    switch (type) {
        case "info":
            imageSrc = "./images/IconeUserInfo.png";
            break;
        case "warning":
            imageSrc = "./images/IconeUserWarning.png";
            break;
        case "error":
            imageSrc = "./images/IconeUserError.png";
            break;
        default:
            console.log("Type d'image non configurer pour eventUserMessage");
            break;
    }




    
    // Verifie la div disponible et lui donne la requette
    // Pour activer la double notification il faut retirer les commentaires ci-dessous.
    if (isNotifyAFree === true) {
        isNotifyAFree = false;
        ondisplayUserMsgA(textToDisplay,imageSrc);
    // }else if (isNotifyBFree === true) {
    //     isNotifyBFree = false;
    //     ondisplayUserMsgB(textToDisplay,imageSrc);
    }else{
        console.log("userMessage mais aucune div de stockage en liste d'attente");
        userMsgCueArray.push({text: textToDisplay,img : imageSrc});
    }
    

}


// Div usermessage A
function ondisplayUserMsgA(textToDisplay,img) {
    console.log("[ USER-MESSAGE ] Traitement par div A");

    let imgUserMsgRef = document.getElementById("imgUserMsgA");
    imgUserMsgRef.src = img;

    // Set le texte du message
    let pUserMessageTextRef = document.getElementById("pUserMessageTextA");
    let divUserMessageRef = document.getElementById("divUserMessageA");
    pUserMessageTextRef.innerHTML =  textToDisplay;
    

    // Affiche la div
    divUserMessageRef.style.display ="block";


    // Cache la div apres un delay
    setTimeout(() => {
       // Verifie si encore des elements en liste d'attente

       if (userMsgCueArray.length > 0) {
        let msgExtraction = onExtractUserMessage();
        ondisplayUserMsgA(msgExtraction.text,msgExtraction.img);
    }else{
        // Si plus d'élément met fin 
        divUserMessageRef.style.display = "none";
        isNotifyAFree = true;
    }

    }, 2000);

}

// Div usermessage B
function ondisplayUserMsgB(textToDisplay,img) {
    console.log("[ USER-MESSAGE ] Traitement par div B");

    let imgUserMsgRef = document.getElementById("imgUserMsgB");
    imgUserMsgRef.src = img;

    // Set le texte du message
    let pUserMessageTextRef = document.getElementById("pUserMessageTextB");
    let divUserMessageRef = document.getElementById("divUserMessageB");
    pUserMessageTextRef.innerHTML =  textToDisplay + " !";
    

    // Affiche la div
    divUserMessageRef.style.display ="block";


    // action lorsque fin de traitement
    setTimeout(() => {
        // Verifie si encore des elements en liste d'attente

        if (userMsgCueArray.length > 0) {
            let msgExtraction = onExtractUserMessage();
            ondisplayUserMsgB(msgExtraction.text,msgExtraction.img);
        }else{
            // Si plus d'élément met fin 
            divUserMessageRef.style.display = "none";
            isNotifyBFree = true;
        }

        
    }, 2000);

}

// Fonction pour récupérer un item dans la liste d'attente


function onExtractUserMessage() {
    // Recupere le message
    let msgExtracted = userMsgCueArray[0];

    // Retire le message de la liste
    userMsgCueArray.splice(0,1);

    return msgExtracted

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