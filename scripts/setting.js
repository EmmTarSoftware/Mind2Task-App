


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



// Nom des cookies
let cookiesNotifyManualName = "Mind2TaskNotifyManualMode";//Nom du cookies pour la notification en mode manuel ou auto


// Les variables des cookies
let isNotifyManualMode;//boolean mode notification



// Référencement des checkbox
let inputCBNotifyModeManualRef = document.getElementById("inputCBNotifyModeManual"),
inputCBNotifyModeAutoRef = document.getElementById("inputCBNotifyModeAuto");



// Récupère la valeur des cookies ou initialise si il n'y a rien
function onInitNotifyCookies() {

    // si le cookie n'existe pas, le créé et le met à "true"
    if (localStorage.getItem(cookiesNotifyManualName) === null){
        localStorage.setItem(cookiesNotifyManualName,true);
    }

    isNotifyManualMode = localStorage.getItem(cookiesNotifyManualName) === "true";

    console.log("valeur de isNotifyManualMode = " + isNotifyManualMode);

    // Desactive le mode qui n'est pas selectionné
        inputCBNotifyModeManualRef.checked = isNotifyManualMode === true ? true : false;
        inputCBNotifyModeAutoRef.checked = isNotifyManualMode === true ? false : true;

};
onInitNotifyCookies();




// Changement du mode de notification
function onChangeNotifyMode(modeTarget) {
    

    // Clique sur le mode manuel
    if (modeTarget === "manual") {
        // Si déjà en mode manuel ne fait rien
        if (isNotifyManualMode === true) {
            // le mode manuel reste coché mais aucune action
            inputCBNotifyModeManualRef.checked = true;
        }else{
            // Coche
            inputCBNotifyModeManualRef.checked = true;
            inputCBNotifyModeAutoRef.checked = false;

            // Set les boolean et les cookies concernés
            isNotifyManualMode = true;
            localStorage.setItem(cookiesNotifyManualName,isNotifyManualMode);
        }
    };

    // Clique sur le mode auto
    if (modeTarget === "auto") {
        // Si déjà en mode auto ne fait rien
        if (isNotifyManualMode === false) {
            // le mode manuel reste coché mais aucune action
            inputCBNotifyModeAutoRef.checked = true;
        }else{
            // Coche
            inputCBNotifyModeManualRef.checked = false;
            inputCBNotifyModeAutoRef.checked = true;

            // Set les boolean et les cookies concernés
            isNotifyManualMode = false;
            localStorage.setItem(cookiesNotifyManualName,isNotifyManualMode);
        }
    };


};







// Set les checkbox de notification lorsque affiche le menu paramètres

function onSetNotifySetting() {
    console.log("onSetNotifySetting");

    inputCBNotifyModeManualRef.checked = isNotifyManualMode === true;
    inputCBNotifyModeAutoRef.checked = isNotifyManualMode === false;

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

    // Set les éléments d'export de la base
    onResetExportSetting();
};



// ---------------------------- EXPORT -------------------------------------





// Referencement
let inputCBImportTaskRef = document.getElementById("inputCBImportTask"),
inputCBImportTAGRef = document.getElementById("inputCBImportTAG"),
inputCBImportDashboardRef = document.getElementById("inputCBImportDashboard"),
inputCBImportTemplateRef = document.getElementById("inputCBImportTemplate"),
inputCBImportTimelineRef = document.getElementById("inputCBImportTimeline");


// Reset les options d'export
function onResetExportSetting() {
    // Les checkbox
    inputCBImportTaskRef.checked = false;
    inputCBImportTAGRef.checked = false;
    inputCBImportDashboardRef.checked = false;
    inputCBImportTemplateRef.checked = false;
    inputCBImportTimelineRef.checked = false;

};


// Coche tous les menu pour l'export
function onCheckAllExportSetting() {
    // Les checkbox
    inputCBImportTaskRef.checked = true;
    inputCBImportTAGRef.checked = true;
    inputCBImportDashboardRef.checked = true;
    inputCBImportTemplateRef.checked = true;
    inputCBImportTimelineRef.checked = true;

};

// Vérifie les éléments cochés ou non avant l'export
// Et set les boolean selon
function onVerifyCheckedItem() {
    console.log("[ EXPORT ] Export demandé, vérification des éléments à exporter.");
    isSaveTask = inputCBImportTaskRef.checked;
    isSaveTAG = inputCBImportTAGRef.checked;
    isSaveDashboard = inputCBImportDashboardRef.checked;
    isSaveTemplate = inputCBImportTemplateRef.checked;
    isSaveTimeline = inputCBImportTimelineRef.checked;



    // Si aucun des bollean n'est à vrai (rien n'est coché), prévient l'utilisateur
    if (![isSaveTask, isSaveTAG, isSaveDashboard, isSaveTemplate, isSaveTimeline].some(Boolean)) {
        console.log("[ EXPORT ] Aucun élément coché");
        document.getElementById("pExportNoSelected").innerHTML = "Veuillez selectionner un élément !";
    } else {
        document.getElementById("pExportNoSelected").innerHTML = "";
        exportData();
    };
    
};