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
    errorDoubleTitle: "Ce titre existe déjà dans la base de données.",
    dasboardEmpty:"Aucune donnée à exporter !",
    taskDeleted:"Note supprimée !",
    templateDeleted:"Modèle supprimé !",
    templateRenamed:"Modèle renommé !",
    timelineCreated : "Echéance créé : ",
    timelineDeleted : "Timeline supprimée !",
    errorStepDate: "Au moins une date d'étape hors créneaux de la tâche !"
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
    };




    
    // Verifie la div disponible et lui donne la requette
    // Pour activer la double notification il faut retirer les commentaires ci-dessous.
    if (isNotifyAFree === true) {
        isNotifyAFree = false;
        ondisplayUserMsgA(textToDisplay,imageSrc);
    // }else if (isNotifyBFree === true) {
    //     isNotifyBFree = false;
    //     ondisplayUserMsgB(textToDisplay,imageSrc);
    }else{
        console.log("[ USER-MESSAGE ] aucune div disponible mise en liste d'attente");
        userMsgCueArray.push({text: textToDisplay,img : imageSrc});
    };
    

};


// Div usermessage A
function ondisplayUserMsgA(textToDisplay,img) {
    console.log("[ USER-MESSAGE ] Traitement par div A");

    let imgUserMsgRef = document.getElementById("imgUserMsgA");
    imgUserMsgRef.src = img;

    // Set le texte du message
    let pUserMessageTextRef = document.getElementById("pUserMessageTextA");
    let divUserMessageRef = document.getElementById("divUserMessageA");
    console.log("[ USER-MESSAGE ] textToDisplayA = " + textToDisplay);

    pUserMessageTextRef.innerHTML =  textToDisplay;
    

    // Affiche la div
    divUserMessageRef.classList.add('show');


    // Cache la div apres un delay
    setTimeout(() => {

        // Fin de l'animation
        divUserMessageRef.classList.remove('show');

       // Verifie si encore des elements en liste d'attente

       if (userMsgCueArray.length > 0) {
        let msgExtraction = onExtractUserMessage();
        ondisplayUserMsgA(msgExtraction.text,msgExtraction.img);
        }else{
            // Si plus d'élément met fin 
            isNotifyAFree = true;
        };

    }, 2000);

};

// Div usermessage B
function ondisplayUserMsgB(textToDisplay,img) {
    console.log("[ USER-MESSAGE ] Traitement par div B");

    let imgUserMsgRef = document.getElementById("imgUserMsgB");
    imgUserMsgRef.src = img;

    // Set le texte du message
    let pUserMessageTextRef = document.getElementById("pUserMessageTextB");
    let divUserMessageRef = document.getElementById("divUserMessageB");
    console.log("[ USER-MESSAGE ] textToDisplayB = " + textToDisplay);

    pUserMessageTextRef.innerHTML =  textToDisplay;
    

    // Affiche la div
    divUserMessageRef.classList.add('show');


    // action lorsque fin de traitement
    setTimeout(() => {
        // Fin de l'animation
        divUserMessageRef.classList.remove('show');

        // Verifie si encore des elements en liste d'attente

        if (userMsgCueArray.length > 0) {
            let msgExtraction = onExtractUserMessage();
            ondisplayUserMsgB(msgExtraction.text,msgExtraction.img);
        }else{
            // Si plus d'élément met fin 
            isNotifyBFree = true;
        };

        
    }, 2000);

};

// Fonction pour récupérer un item dans la liste d'attente


function onExtractUserMessage() {
    // Recupere le message
    let msgExtracted = userMsgCueArray[0];

    // Retire le message de la liste
    userMsgCueArray.splice(0,1);

    return msgExtracted;

};














// -------------------------------- NOTIFICATION et ALERTE sur les DATES -----------------------------







let notifyTodayArray = [],
    notifyLateArray = [],
    notifyStepTodayArray = [],
    notifyStepLateArray = [];

function onUpdateNotifyDate(array) {
    // Reset les éléments
    notifyTodayArray = [];
    notifyLateArray = [];
    notifyStepTodayArray = [];
    notifyStepLateArray = [];

    // Recupere la date du jours
    let currentDate = onFormatDateToday();

    // Notification du jours
    onNotifyDateToday(array,currentDate);
};


// notification taches du jours
function onNotifyDateToday(array,dateTarget) {
    console.log("[ NOTIFICATION ] traitement des notifications du jours");
    // En mode manuel, ne notifie que ce qui a été demandé
    if (isNotifyManualMode === true) {
        console.log("[ NOTIFICATION ] Mode Manuel");
        array.forEach(e => {
            if (e.dateStart.value === dateTarget && e.dateStart.notify === true) {
                notifyTodayArray.push({tag: e.tag, title :e.title});
            };
        });
    }else{
        // En mode auto, notifie tout
        console.log("[ NOTIFICATION ] Mode Auto");
        array.forEach(e => {
            if (e.dateStart.value === dateTarget) {
                notifyTodayArray.push({tag: e.tag, title :e.title});
            };
        });

    };

    console.log("[ NOTIFICATION ] Nbre notification aujourd'hui : " + notifyTodayArray.length);

    // Notification date en retard
    onNotifyDateLate(array,dateTarget);
};



// Notification taches en retards
function onNotifyDateLate(array,dateToday) {
    console.log("[ NOTIFICATION ] traitement des notifications en retard");
    // En mode manuel, ne notifie que ce qui a été demandé
    if (isNotifyManualMode === true) {
        console.log("[ NOTIFICATION ] Mode Manuel");
        array.forEach(e => {
            if (dateToday > e.dateEnd.value && e.dateEnd.notify === true) {
                notifyLateArray.push({tag: e.tag, title :e.title , date: onFormatDateToFr(e.dateEnd.value)});
            };
        });
    }else{
        // En mode auto, notifie tout
        console.log("[ NOTIFICATION ] Mode Auto");
        array.forEach(e => {
            if (dateToday > e.dateEnd.value) {
                notifyLateArray.push({tag: e.tag, title :e.title , date: onFormatDateToFr(e.dateEnd.value)});
            };
        });
    };

    console.log("[ NOTIFICATION ] Nbre notification tâche en retard : " + notifyLateArray.length);

    // Traitement des étapes du jour
    onTraiteStepNotifyToday(array,dateToday);
};




// Notification des étapes du jours
function onTraiteStepNotifyToday(array,dateToday) {
    console.log("[ NOTIFICATION ] traitement des notifications pour étapes du jour.");

    array.forEach(task => {

        // Est ce que j'ai une étape ?
        if (task.stepArray.length > 0) {
            // Stoque toutes les étapes qui remplissent les conditions
            console.log("[ NOTIFICATION ] Recherche de notification d'étape");
            task.stepArray.forEach(step=>{onSearchStepDateNotify(task.tag,task.title,step,dateToday)});
        }else{
            // pas d'étape, aucune traitement
        };
    });


    console.log("[ NOTIFICATION ] Nbre notification d'étapes du jours : " + notifyStepTodayArray.length);

    // Traitement des étapes en retards
    onTraiteStepNotifyLate(array,dateToday);
};



// Notification des étapes en retards
function onTraiteStepNotifyLate(array,dateToday) {
    console.log("[ NOTIFICATION ] traitement des notifications pour étapes en retard.");

    array.forEach(task => {

        // Est ce que j'ai une étape ?
        if (task.stepArray.length > 0) {
            // Stoque toutes les étapes qui remplissent les conditions
            console.log("[ NOTIFICATION ] Recherche de notification d'étape");
            task.stepArray.forEach(step=>{onSearchStepLateNotify(task.tag,task.title,step,dateToday)});
        }else{
            // pas d'étape, aucun traitement
        };
    });


    console.log("[ NOTIFICATION ] Nbre notification d'étapes en retard : " + notifyStepLateArray.length);


    // Traitement de l'affichage
    onTraiteNotifyDate();
};







// Fcontion pour aller fouiller dans chaque étape et remonter les éléments nécessaires pour la date du jours.
function onSearchStepDateNotify(tagRef,titleRef,step,dateRef) {
     // En mode manuel, ne notifie que ce qui a été demandé

     if (isNotifyManualMode === true) {
        
        if (step.stepDate === dateRef && step.stepDateNotify === true && !step.stepChecked) {
            notifyStepTodayArray.push({tag: tagRef, titleTask : titleRef, stepName : step.stepName});
        };
    }else{
        // En mode auto, notifie tout
        if (step.stepDate === dateRef && !step.stepChecked) {
            notifyStepTodayArray.push({tag: tagRef, titleTask : titleRef, stepName : step.stepName});
        };

    };
};


// Fcontion pour aller fouiller dans chaque étape et remonter les éléments nécessaires pour les dates en retards.
function onSearchStepLateNotify(tagRef,titleRef,step,dateRef) {
    // En mode manuel, ne notifie que ce qui a été demandé

    if (isNotifyManualMode === true) {
       
       if (dateRef > step.stepDate && step.stepDateNotify === true && !step.stepChecked) {
           notifyStepLateArray.push({tag: tagRef, titleTask : titleRef, stepName : step.stepName, date : onFormatDateToFr(step.stepDate)});
       };
   }else{
       // En mode auto, notifie tout
       if (dateRef > step.stepDate && !step.stepChecked) {
           notifyStepLateArray.push({tag: tagRef, titleTask : titleRef, stepName : step.stepName, date : onFormatDateToFr(step.stepDate)});
       };

   };
};








// Traitement des notifications
function onTraiteNotifyDate() {
    console.log("[ NOTIFICATION ] Traitement affichage");

    // Reference l'icone de notification
    let imgNotifyAvailableRef = document.getElementById("imgNotifyAvailable");



    // Si des notifications sont disponibles, l'icone est visible
    imgNotifyAvailableRef.style.display = (notifyTodayArray.length > 0 || notifyLateArray.length  > 0 || notifyStepTodayArray.length > 0) ? "inline-block" : "none" ;

};



// Affichage des notifications
function onDisplayNotifyDate(isDisplay) {

    // Information du mode de notification
    document.getElementById("pAccueilNotifyMode").innerHTML = isNotifyManualMode === true ?"Mode manuel" : "Mode automatique";


    // Reference et reset
    let ulListNotifyTodayRef = document.getElementById("ulListNotifyToday"),
    ulListStepNotifyTodayRef = document.getElementById("ulListStepNotifyToday"),
    ulListNotifyLateRef = document.getElementById("ulListNotifyLate"),
    ulListStepNotifyLateRef = document.getElementById("ulListStepNotifyLate");

    ulListNotifyTodayRef.innerHTML = "";
    ulListStepNotifyTodayRef.innerHTML = "";
    ulListNotifyLateRef.innerHTML = "";
    ulListStepNotifyLateRef.innerHTML = "";
    



    if (isDisplay === true) {

        // les tâches du jours
        if (notifyTodayArray.length > 0) {
            notifyTodayArray.forEach(e=>{
                let newLi = document.createElement("li");
                newLi.innerHTML = `<i>${e.tag}</i> : <B> ${e.title} </B>`;
                newLi.className = "notifyDate";

                ulListNotifyTodayRef.appendChild(newLi);
            })
        }else{
            ulListNotifyTodayRef.innerHTML = "Aucune notification";
        };
        
        // les étapes du jours
        if (notifyStepTodayArray.length > 0) {
            notifyStepTodayArray.forEach(e=>{
                let newLi = document.createElement("li");
                newLi.innerHTML = `<i>${e.tag} - ${e.titleTask} </i> : <B> ${e.stepName}</B>`;
                newLi.className = "notifyDate";

                ulListStepNotifyTodayRef.appendChild(newLi);
            })
        }else{
            ulListStepNotifyTodayRef.innerHTML = "Aucune notification";
        };




        // Les tâches en retards
        if (notifyLateArray.length > 0) {
            notifyLateArray.forEach(e=>{
                let newLi = document.createElement("li");
                newLi.innerHTML = ` <i>${e.tag}</i> : <B> ${e.title} </B> => ${e.date}`;
                newLi.className = "notifyDate";

                ulListNotifyLateRef.appendChild(newLi);
            })
        }else{
            ulListNotifyLateRef.innerHTML = "Aucune notification";
        };

        // les étapes en retards
        if (notifyStepLateArray.length > 0) {
            notifyStepLateArray.forEach(e=>{
                let newLi = document.createElement("li");
                newLi.innerHTML = `<i>${e.tag} - ${e.titleTask} </i> : <B> ${e.stepName} </B> => ${e.date}`;
                newLi.className = "notifyDate";

                ulListStepNotifyLateRef.appendChild(newLi);
            })
        }else{
            ulListStepNotifyLateRef.innerHTML = "Aucune notification";
        };


        
    }else{
        ulListNotifyTodayRef.innerHTML = "";
        ulListStepNotifyTodayRef.innerHTML = "";
        ulListNotifyLateRef.innerHTML = "";
        ulListStepNotifyLateRef.innerHTML = "";
    };


    document.getElementById("divNotifyAlert").style.display = isDisplay === true ? "block" : "none";

};


// Masquage des notifications