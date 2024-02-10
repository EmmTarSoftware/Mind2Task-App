//  ----------------------------------- SECURITE ----------------------------------------

// Le nom des cookies
let cookiesEnablePhoneNumberName = "Planning-PhoneNumber",
cookiesEnableIPAdressName = "Planning-IPAdress",
cookiesEnableEmailName = "Planning-Email",
cookiesEnableWebLinkName = "Planning-WebLink";




// set valeur des cookies
let isAdressIPDisplay = localStorage.getItem(cookiesEnableIPAdressName) === "true",
isPhoneNumberDisplay = localStorage.getItem(cookiesEnablePhoneNumberName) === "true",
isEmailDisplay = localStorage.getItem(cookiesEnableEmailName ) === "true",
isWebLinkDisplay = localStorage.getItem(cookiesEnableWebLinkName) === "true";




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

}



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

}


// Valide la demande de confirmation
function onConfirmDeleteBDD() {

    onDeleteBDD();
}


// Ne confirme pas la demande de suppression
function onCancelDeleteBDD() {
    document.getElementById("divConfirmeBdDSuppr").style.display = "none";
}


// Fonction de suppression de la base
function onDeleteBDD() {
   
        let requestDelete = indexedDB.deleteDatabase(dbName);

        document.getElementById("tdResultDeleteBDD").innerHTML = "Base de donnée supprimée ! Veuillez relancer l'application.";
        document.getElementById("divConfirmeBdDSuppr").style.display = "none";

}

// --------------------------------   PERSONNALISATION  --------------------------------


// PRIORITE
// Le nom des cookies
let cookiesPriorityCName = "Planning-priority-C",
    cookiesPriorityBName = "Planning-priority-B",
    cookiesPriorityAName = "Planning-priority-A";



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


    // Re génère les options dans l'éditeur de notes
    onSetPriorityOptions();

}



// STATUT
// Le nom des cookies
let cookiesStatus0Name = "Planning-Status0",
cookiesStatus1Name = "Planning-Status1",
cookiesStatus2Name = "Planning-Status2";

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

    // Re génère les options dans l'éditeur de notes;
    onSetStatusOption();
}






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
}



