


//  ----------------------------------- SECURITE ----------------------------------------

// Le nom des cookies
let cookiesEnablePhoneNumberName = "Mind2Task-PhoneNumber",
cookiesEnableIPAdressName = "Mind2Task-IPAdress",
cookiesEnableEmailName = "Mind2Task-Email",
cookiesEnableWebLinkName = "Mind2Task-WebLink";




// set valeur des cookies
let isAdressIPDisplay = localStorage.getItem(cookiesEnableIPAdressName) === "true",
isPhoneNumberDisplay = localStorage.getItem(cookiesEnablePhoneNumberName) === "true",
isEmailDisplay = localStorage.getItem(cookiesEnableEmailName ) === "true",
isWebLinkDisplay = localStorage.getItem(cookiesEnableWebLinkName) === "true";








// Fonction pour changer la valeur des parametres de sécurité
function onChangeSecuritySetting(settingTarget,checkboxRef) {
    


    if (settingTarget === "email") { 
        isEmailDisplay = checkboxRef.checked;
        localStorage.setItem(cookiesEnableEmailName,isEmailDisplay);
    };
    if (settingTarget === "linkWeb") {
        isWebLinkDisplay = checkboxRef.checked;
        localStorage.setItem(cookiesEnableWebLinkName,isWebLinkDisplay);
    };
    if (settingTarget === "phoneNumber") { 
        isPhoneNumberDisplay = checkboxRef.checked;
        localStorage.setItem(cookiesEnablePhoneNumberName,isPhoneNumberDisplay);
    };
    if (settingTarget === "IPAdress") {
        isAdressIPDisplay = checkboxRef.checked;
        localStorage.setItem(cookiesEnableIPAdressName,isAdressIPDisplay);
    };
}


// ----------------------------------------  suppression de la base ------------------------

function onClickDeleteBDD() {
    // Affiche la demande de confirmation
    document.getElementById("divConfirmeBdDSuppr").style.display = "block";

};


// Valide la demande de confirmation
function onConfirmDeleteBDD() {

    onDeleteBDD();
};


// Ne confirme pas la demande de suppression
function onCancelDeleteBDD() {
    document.getElementById("divConfirmeBdDSuppr").style.display = "none";
};


// Fonction de suppression de la base
function onDeleteBDD() {
   
        let requestDelete = indexedDB.deleteDatabase(dbName);

        // User message
        eventUserMessage(arrayUserMessage.bddDeleted,"info");

        document.getElementById("tdResultDeleteBDD").innerHTML = "Base de donnée supprimée ! Veuillez relancer l'application.";
        document.getElementById("divConfirmeBdDSuppr").style.display = "none";

};

// --------------------------------   PERSONNALISATION  --------------------------------


// PRIORITE
// Le nom des cookies
let cookiesPriorityCName = "Mind2Task-priority-C",
    cookiesPriorityBName = "Mind2Task-priority-B",
    cookiesPriorityAName = "Mind2Task-priority-A";



// Set les priorité avec la valeur des cookies ou la valeur par défaut
let priorityArray = [
    {systemPriority : "C", userPriority: localStorage.getItem(cookiesPriorityCName) || "Basse"},
    {systemPriority : "B", userPriority: localStorage.getItem(cookiesPriorityBName) || "Moyenne"},
    {systemPriority : "A", userPriority: localStorage.getItem(cookiesPriorityAName) || "Haute"}
];



function onSaveCustomPriority() {
    priorityArray[0].userPriority = document.getElementById("inputCustomPriorityC").value || "Basse";
    priorityArray[1].userPriority = document.getElementById("inputCustomPriorityB").value || "Moyenne";
    priorityArray[2].userPriority = document.getElementById("inputCustomPriorityA").value || "Haute";

    localStorage.setItem(cookiesPriorityCName, priorityArray[0].userPriority);
    localStorage.setItem(cookiesPriorityAName,priorityArray[2].userPriority);
    localStorage.setItem(cookiesPriorityBName,priorityArray[1].userPriority);


    // notification
    document.getElementById("pNotifySaveChangePriority").innerHTML = "Priorités sauvegardées !";
    eventUserMessage(arrayUserMessage.savePriority,"info");

    // Re génère les options dans l'éditeur de notes
    onSetPriorityOptions();

};



// STATUT
// Le nom des cookies
let cookiesStatus0Name = "Mind2Task-Status0",
cookiesStatus1Name = "Mind2Task-Status1",
cookiesStatus2Name = "Mind2Task-Status2";

// Set les status avec la valeur des cookies ou la valeur par défaut
let statusArray = [
    {systemStatus : "Status0", userStatus : localStorage.getItem(cookiesStatus0Name) || "A faire"},
    {systemStatus : "Status1", userStatus : localStorage.getItem(cookiesStatus1Name) || "En cours"},
    {systemStatus : "Status2", userStatus : localStorage.getItem(cookiesStatus2Name) || "Terminer"}
];

function onSaveCustomStatus() {
    statusArray[0].userStatus = document.getElementById("inputCustomStatus0").value || "A faire";
    statusArray[1].userStatus = document.getElementById("inputCustomStatus1").value || "En cours";
    statusArray[2].userStatus = document.getElementById("inputCustomStatus2").value || "Terminer";

    localStorage.setItem(cookiesStatus0Name,statusArray[0].userStatus);
    localStorage.setItem(cookiesStatus1Name,statusArray[1].userStatus);
    localStorage.setItem(cookiesStatus2Name, statusArray[2].userStatus);


    // notification
    document.getElementById("pNotifySaveChangeStatus").innerHTML = "Statuts sauvegardés !";
    eventUserMessage(arrayUserMessage.saveStatus,"info");

    // Re génère les options dans l'éditeur de notes;
    onSetStatusOption();
};






// Set les éléments dans la personnalisation

function onSetPersonnalisation() {
    // Priorité
    document.getElementById("inputCustomPriorityC").value = priorityArray[0].userPriority;
    document.getElementById("inputCustomPriorityB").value = priorityArray[1].userPriority;
    document.getElementById("inputCustomPriorityA").value = priorityArray[2].userPriority;


    // Statut
    document.getElementById("inputCustomStatus0").value = statusArray[0].userStatus;
    document.getElementById("inputCustomStatus1").value = statusArray[1].userStatus;
    document.getElementById("inputCustomStatus2").value = statusArray[2].userStatus;
};






//-------------------------------------- Notification   ---------------------------


// Désactivation du menu non concerné

function onDisableSettingNotify(idArrayRef) {
    idArrayRef.forEach(e=>{
        let checkboxTarget = document.getElementById(e);
        checkboxTarget.checked = false;
        checkboxTarget.disabled = true;
    });
};

// Active les checkbox
function onEnableSettingNotify(idArrayRef) {
    idArrayRef.forEach(e=>{
        let checkboxTarget = document.getElementById(e);
        checkboxTarget.disabled = false;
    });
};





// Nom des cookies

let cookiesNotifyManualName = "Mind2TaskNotifyManualMode",//Nom du cookies pour la notification en mode manuel ou auto
cookiesNotifyManualDSTodayName ="Mind2Task-Notify-M-DS-Today",//Nom du cookies pour la notification manuel (date début) Date du jour ou durée
cookiesNotifyManualDETodayName ="Mind2Task-Notify-M-DE-Today",//Nom du cookies pour la notification manuel (date de fin) Date du jour ou durée

cookiesNotifyAutoDSTodayName ="Mind2Task-Notify-A-DS-Today",//Nom du cookies pour la notification automatique (date début) Date du jour ou durée
cookiesNotifyAutoDETodayName ="Mind2Task-Notify-A-DE-Today";//Nom du cookies pour la notification automatique (date de fin) Date du jour ou durée



// Les variables des cookies
let isNotifyManualMode,//boolean mode notification
isNotifyManualDSToday,//dateStart - date du jour ou durée
isNotifyManualDEToday,//dateEnd - date du jour ou durée
isNotifyAutoDSToday,//dateStart - date du jour ou durée
isNotifyAutoDEToday;//dateEnd - date du jour ou durée


// Récupère la valeur des cookies ou initialise si il n'y a rien
function onInitNotifyCookies() {
    isNotifyManualMode = JSON.parse(localStorage.getItem(cookiesNotifyManualName)) || true;
    isNotifyManualDSToday = JSON.parse(localStorage.getItem(cookiesNotifyManualDSTodayName)) || true;
    isNotifyManualDEToday = JSON.parse(localStorage.getItem(cookiesNotifyManualDETodayName)) || true;
    isNotifyAutoDSToday = JSON.parse(localStorage.getItem(cookiesNotifyAutoDSTodayName)) || true;
    isNotifyAutoDEToday = JSON.parse(localStorage.getItem(cookiesNotifyAutoDETodayName)) || true;
   

    // Desactive le mode qui n'est pas selectionné

    if (isNotifyManualMode === true) {
        // Desactive le mode auto au lancement
        onDisableSettingNotify(["inputCBNotifyAutoDSToday","inputCBNotifyAutoDSRange","inputCBNotifyAutoDEToday","inputCBNotifyAutoDELate"]);
    }else{
        // Desactive le mode manuel au lancement
        onDisableSettingNotify(["inputCBNotifyManualDSToday","inputCBNotifyManualDSRange","inputCBNotifyManualDEToday","inputCBNotifyManualDELate"]);
    };

};
onInitNotifyCookies();


// Référencement des checkbox
// DS = DateStart - DE = DateEnd

let inputCBNotifyModeManualRef = document.getElementById("inputCBNotifyModeManual"),
inputCBNotifyModeAutoRef = document.getElementById("inputCBNotifyModeAuto"),
inputCBNotifyManualDSTodayRef = document.getElementById("inputCBNotifyManualDSToday"),
inputCBNotifyManualDSRangeRef = document.getElementById("inputCBNotifyManualDSRange"),
inputCBNotifyManualDETodayRef = document.getElementById("inputCBNotifyManualDEToday"),
inputCBNotifyManualDELateRef = document.getElementById("inputCBNotifyManualDELate"),
inputCBNotifyAutoDSTodayRef = document.getElementById("inputCBNotifyAutoDSToday"),
inputCBNotifyAutoDSRangeRef = document.getElementById("inputCBNotifyAutoDSRange"),
inputCBNotifyAutoDETodayRef = document.getElementById("inputCBNotifyAutoDEToday"),
inputCBNotifyAutoDELateRef = document.getElementById("inputCBNotifyAutoDELate");











// Mode manuel



function onClickNotifyManualMode() {
    // regarde le boolean pour voir si changement nécessaire ou non
    if (isNotifyManualMode === false) {
        // Coche
        inputCBNotifyModeManualRef.checked = true;
        inputCBNotifyModeAutoRef.checked = false;

        // Met les paramètres enfant par défaut
        inputCBNotifyManualDSTodayRef.checked = true;
        inputCBNotifyManualDSRangeRef.checked = false;
        inputCBNotifyManualDETodayRef.checked = true;
        inputCBNotifyManualDELateRef.checked = false;


        // Active les checkbox
        onEnableSettingNotify(["inputCBNotifyManualDSToday","inputCBNotifyManualDSRange","inputCBNotifyManualDEToday","inputCBNotifyManualDELate"]);

        // Decoche les enfant du mode Auto et desactive
        onDisableSettingNotify(["inputCBNotifyAutoDSToday","inputCBNotifyAutoDSRange","inputCBNotifyAutoDEToday","inputCBNotifyAutoDELate"]);

        // Set les boolean et les cookies concernés
        isNotifyManualMode = true;
        isNotifyManualDSToday = true;
        isNotifyManualDEToday = true;

        localStorage.setItem(cookiesNotifyManualName,isNotifyManualMode);
        localStorage.setItem(cookiesNotifyManualDSTodayName,isNotifyManualDSToday);
        localStorage.setItem(cookiesNotifyManualDETodayName,isNotifyManualDEToday);



    }else{
        // le mode manuel reste coché mais aucune action
        inputCBNotifyModeManualRef.checked = true;

    };


};


// Date début - jour J / Jour J pendant
function onClickManualModeDSToday() {
    // Si déja coché ne fait rien
    if (isNotifyManualDSToday === true) {
        // ne faire rien et le bouton reste coché
        inputCBNotifyManualDSTodayRef.checked = true;

    }else{
        // Coche les bouton
        inputCBNotifyManualDSTodayRef.checked = true;
        inputCBNotifyManualDSRangeRef.checked =  false;

        // Set les boolean et les cookies associés
        isNotifyManualDSToday = true;

        localStorage.setItem(cookiesNotifyManualDSTodayName,isNotifyManualDSToday);
    };
};

function onClickManualModeDSRange() {
    // Si déja coché ne fait rien
    if (isNotifyManualDSToday === false) {
        // ne faire rien et le bouton reste coché
        inputCBNotifyManualDSRangeRef.checked = true;

    }else{
        // Coche les bouton
        inputCBNotifyManualDSTodayRef.checked = false;
        inputCBNotifyManualDSRangeRef.checked =  true;

        // Set les boolean et les cookies associés
        isNotifyManualDSToday = false;

        localStorage.setItem(cookiesNotifyManualDSTodayName,isNotifyManualDSToday);
    };
};

// Date fin - jour J / Jour J et après
function onClickManualModeDEToday() {
    // Si déja coché ne fait rien
    if (isNotifyManualDEToday === true) {
        // ne faire rien et le bouton reste coché
        inputCBNotifyManualDETodayRef.checked = true;

    }else{
        // Coche les bouton
        inputCBNotifyManualDETodayRef.checked = true;
        inputCBNotifyManualDELateRef.checked =  false;

        // Set les boolean et les cookies associés
        isNotifyManualDEToday = true;

        localStorage.setItem(cookiesNotifyManualDETodayName,isNotifyManualDEToday);

    };
};

function onClickManualModeDELate() {
    // Si déja coché ne fait rien
    if (isNotifyManualDEToday === false) {
        // ne faire rien et le bouton reste coché
        inputCBNotifyManualDELateRef.checked = true;

    }else{
        // Coche les bouton
        inputCBNotifyManualDETodayRef.checked = false;
        inputCBNotifyManualDELateRef.checked =  true;

        // Set les boolean et les cookies associés
        isNotifyManualDEToday = false;

        localStorage.setItem(cookiesNotifyManualDETodayName,isNotifyManualDEToday);
    };
};











function onClickNotifyAutoMode() {
    // regarde le boolean pour voir si changement nécessaire ou non
    if (isNotifyManualMode === true) {
        // Coche
        inputCBNotifyModeAutoRef.checked = true;
        inputCBNotifyModeManualRef.checked = false;
        

        // Met les paramètres enfant par défaut
        inputCBNotifyAutoDSTodayRef.checked = true;
        inputCBNotifyAutoDSRangeRef.checked = false;
        inputCBNotifyAutoDETodayRef.checked = true;
        inputCBNotifyAutoDELateRef.checked = false;

        // Active les checkbox
        onEnableSettingNotify(["inputCBNotifyAutoDSToday","inputCBNotifyAutoDSRange","inputCBNotifyAutoDEToday","inputCBNotifyAutoDELate"]);


        // Decoche les enfant du mode manuel et desactive
        onDisableSettingNotify(["inputCBNotifyManualDSToday","inputCBNotifyManualDSRange","inputCBNotifyManualDEToday","inputCBNotifyManualDELate"]);

        // Set les boolean et les cookies concernés
        isNotifyManualMode = false;
        isNotifyAutoDSToday = true;
        isNotifyAutoDEToday = true;

        localStorage.setItem(cookiesNotifyManualName,isNotifyManualMode);
        localStorage.setItem(cookiesNotifyAutoDSTodayName,isNotifyAutoDSToday);
        localStorage.setItem(cookiesNotifyAutoDETodayName,isNotifyAutoDEToday);


    }else{
        // le mode auto reste coché mais aucune action
        inputCBNotifyModeAutoRef.checked = true;
    };
};


// Date début - jour J / Jour J pendant
function onClickAutoModeDSToday() {
    // Si déja coché ne fait rien
    if (isNotifyAutoDSToday === true) {
        // ne faire rien et le bouton reste coché
        inputCBNotifyAutoDSTodayRef.checked = true;

    }else{
        // Coche les bouton
        inputCBNotifyAutoDSTodayRef.checked = true;
        inputCBNotifyAutoDSRangeRef.checked =  false;

        // Set les boolean et les cookies associés
        isNotifyAutoDSToday = true;

        localStorage.setItem(cookiesNotifyAutoDSTodayName,isNotifyAutoDSToday);
    };
};

function onClickAutoModeDSRange() {
    // Si déja coché ne fait rien
    if (isNotifyAutoDSToday === false) {
        // ne faire rien et le bouton reste coché
        inputCBNotifyAutoDSRangeRef.checked = true;

    }else{
        // Coche les bouton
        inputCBNotifyAutoDSTodayRef.checked = false;
        inputCBNotifyAutoDSRangeRef.checked =  true;

        // Set les boolean et les cookies associés
        isNotifyAutoDSToday = false;

        localStorage.setItem(cookiesNotifyAutoDSTodayName,isNotifyAutoDSToday);
    };
};

// Date fin - jour J / Jour J et après
function onClickAutoModeDEToday() {
    // Si déja coché ne fait rien
    if (isNotifyAutoDEToday === true) {
        // ne faire rien et le bouton reste coché
        inputCBNotifyAutoDETodayRef.checked = true;

    }else{
        // Coche les bouton
        inputCBNotifyAutoDETodayRef.checked = true;
        inputCBNotifyAutoDELateRef.checked =  false;

        // Set les boolean et les cookies associés
        isNotifyAutoDEToday = true;

        localStorage.setItem(cookiesNotifyAutoDETodayName,isNotifyAutoDEToday);
    };
};

function onClickAutoModeDELate() {
    // Si déja coché ne fait rien
    if (isNotifyAutoDEToday === false) {
        // ne faire rien et le bouton reste coché
        inputCBNotifyAutoDELateRef.checked = true;

    }else{
        // Coche les bouton
        inputCBNotifyAutoDETodayRef.checked = false;
        inputCBNotifyAutoDELateRef.checked =  true;

        // Set les boolean
        isNotifyAutoDEToday = false;

        localStorage.setItem(cookiesNotifyAutoDETodayName,isNotifyAutoDEToday);
    };
};









// Set les checkbox de notification lorsque affiche le menu paramètres

function onSetNotifySetting() {
    console.log("onSetNotifySetting");

    inputCBNotifyModeManualRef.checked = isNotifyManualMode === true;
    inputCBNotifyModeAutoRef.checked = isNotifyManualMode === false;


    // Ne traite que le menu enfant qui est actif. Les autres seront décochés
    if (isNotifyManualMode === true) {
        inputCBNotifyManualDSTodayRef.checked = isNotifyManualDSToday === true ;
        inputCBNotifyManualDSRangeRef.checked = isNotifyManualDSToday === false ;
        inputCBNotifyManualDETodayRef.checked = isNotifyManualDEToday === true ;
        inputCBNotifyManualDELateRef.checked = isNotifyManualDEToday === false ;

        // Décoche les enfants
        inputCBNotifyAutoDSTodayRef.checked = false ;
        inputCBNotifyAutoDSRangeRef.checked = false ;
        inputCBNotifyAutoDETodayRef.checked = false ;
        inputCBNotifyAutoDELateRef.checked = false ;

    }else{
        inputCBNotifyAutoDSTodayRef.checked = isNotifyAutoDSToday === true ;
        inputCBNotifyAutoDSRangeRef.checked = isNotifyAutoDSToday === false ;
        inputCBNotifyAutoDETodayRef.checked = isNotifyAutoDEToday === true ;
        inputCBNotifyAutoDELateRef.checked = isNotifyAutoDEToday === false ;


        // Décoche les enfants
        inputCBNotifyManualDSTodayRef.checked =  false ;
        inputCBNotifyManualDSRangeRef.checked = false ;
        inputCBNotifyManualDETodayRef.checked = false ;
        inputCBNotifyManualDELateRef.checked = false ;
    };
    
};







function onDisplaySetting() {
    // Set les checkbox selon les valeurs des cookies
    // PS  ne peut pas utiliser de boolean car session storage les stocke en string.
    document.getElementById("checkboxPhoneNumber").checked = isPhoneNumberDisplay;
    document.getElementById("checkboxEmail").checked = isEmailDisplay;
    document.getElementById("checkboxIP").checked = isAdressIPDisplay;
    document.getElementById("checkboxWebLink").checked = isWebLinkDisplay;

 
    // Vide les commentaires de sauvegarde etc
    document.getElementById("tdResultDeleteBDD").innerHTML = "";
    document.getElementById("pNotifySaveChangePriority").innerHTML = "";
    document.getElementById("pNotifySaveChangeStatus").innerHTML = "";

    // Set les éléments de personnalisation
    onSetPersonnalisation();

    // Set les éléments de notification
    onSetNotifySetting();

};