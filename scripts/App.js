// Initialisation variables
// -------------------------------------------------   GLOBAL        ------------------------------------------------




// DATE DU jour
let currentDateFR,
    currentDateFormated;


// Set tous les éléments concernant la date du jour
function onSetDateDuJour() {
    // Date au format complet
    let fullDateFormated = new Date().toLocaleDateString('fr-fr', { weekday:"long", year:"numeric", month:"short", day:"numeric"});

    console.log("fulldate : " + fullDateFormated);
    // Premiere lettre majuscule
    fullDateFormated = fullDateFormated.charAt(0).toUpperCase() + fullDateFormated.slice(1);

    document.getElementById("h1DateDuJour").innerHTML = fullDateFormated;

    // stockager de la Date du jour format FR pour plus tard
    let e = new Date();
    currentDateFR = e.toLocaleDateString("fr");
    currentDateFR = currentDateFR.replace(/\//gi,"-");

    console.log(currentDateFR);

    // Date du jour format international

    console.log(new Date());
    
};
onSetDateDuJour();







let db,
    dbName = "Planning-DataBase",
    taskStoreName = "taskList",
    tagStoreName = "TAGList",
    dashBoardStoreName = "dashboard",
    templateStoreName = "template",
    timelineStoreName = "timeline",
    currentBaseVersion = 4,
    cookiesBddVersionName = "Mind2Task-bddVersion";


// Lancement /création de la base de donnée

function onStartDataBase() {
    let openRequest = indexedDB.open(dbName,currentBaseVersion);

    // Traitement selon résultat

   
    // Mise à jour ou création requise
    openRequest.onupgradeneeded = function () {
        console.log("Initialisation de la base de donnée");

        db = openRequest.result;
        if(!db.objectStoreNames.contains(taskStoreName)){
            // si le l'object store n'existe pas
            let noteStore = db.createObjectStore(taskStoreName, {keyPath:'key', autoIncrement: true});
            console.log("Creation du magasin " + taskStoreName);

            noteStore.createIndex('title','title',{unique:true});
            noteStore.createIndex('dateStart','dateStart.value',{unique:false});
            noteStore.createIndex('dateEnd','dateEnd.value',{unique:false});
            noteStore.createIndex('status','status',{unique:false});
            noteStore.createIndex('tag','tag',{unique:false});
            noteStore.createIndex('priority','priority',{unique:false});
        };

        // Creation du store pour les TAG d'autocomplétion
        if (!db.objectStoreNames.contains(tagStoreName)) {
            let tagStore = db.createObjectStore(tagStoreName, {autoIncrement: true});
            console.log("Creation du magasin "+  tagStoreName);
        };

        // Creation du store pour le dashboard
        if (!db.objectStoreNames.contains(dashBoardStoreName)) {
            let dashboardStore = db.createObjectStore(dashBoardStoreName, {keyPath:'key',autoIncrement: true});
            console.log("Creation du magasin "+  dashBoardStoreName);

            dashboardStore.createIndex('tag','tag',{unique:false});
            dashboardStore.createIndex('duration','duration',{unique:false});
            dashboardStore.createIndex('dateStart','dateStart',{unique:false});
            dashboardStore.createIndex('dateEnd','dateEnd',{unique:false});
        };


        // Creation du store pour le template
        if (!db.objectStoreNames.contains(templateStoreName)) {
            let templateStore = db.createObjectStore(templateStoreName, {keyPath:'key',autoIncrement: true});
            console.log("Creation du magasin "+  templateStoreName);

            templateStore.createIndex('title','title',{unique:true});
        };

        // Creation du store pour la timeline
        if (!db.objectStoreNames.contains(timelineStoreName)) {
            let timelineStore = db.createObjectStore(timelineStoreName, {keyPath:'key',autoIncrement: true});
            console.log("Creation du magasin "+  timelineStoreName);

            timelineStore.createIndex('title','title',{unique:false});
            timelineStore.createIndex('month','month',{unique:false});
        };

        // Stoque le numéro de version de base de l'application
        localStorage.setItem(cookiesBddVersionName, currentBaseVersion.toString());

    };

    openRequest.onerror = function(){
        console.error("Error",openRequest.error);
    };

    openRequest.onsuccess = function(){
        db = openRequest.result
        console.log("Data Base ready");

        // Premiere actualisation de la page Accueil
        onUpdatePage(true);
        onUpdateTimelineAccueil();
    };




};



// // Formatage de la date du jour qui est en mode FR vers le mode Internationale
function onFormatDateToday() {
    let date = new Date();

    // Obtenir les composants de la date
    let jour = date.getDate();
    let mois = date.getMonth() + 1; // Les mois vont de 0 à 11, donc ajouter 1
    let annee = date.getFullYear();

    // Ajouter un zéro devant le jour et le mois si nécessaire
    jour = (jour < 10) ? '0' + jour : jour;
    mois = (mois < 10) ? '0' + mois : mois;

    // Créer la chaîne de date au format "yyyy-mm-dd"
    let dateDuJour = annee + '-' + mois + '-' + jour;

    return dateDuJour;
};



// Transforme les dates stockées du mode internationale vers le mode FR

function onFormatDateToFr(dateString) {
    // Créer un objet Date en analysant la chaîne de date
    let date = new Date(dateString);

    // Obtenir les composants de la date
    let jour = date.getDate();
    let mois = date.getMonth() + 1; // Les mois vont de 0 à 11, donc ajouter 1
    let annee = date.getFullYear();

    // Ajouter un zéro devant le jour et le mois si nécessaire
    jour = (jour < 10) ? '0' + jour : jour;
    mois = (mois < 10) ? '0' + mois : mois;

    // Créer la nouvelle chaîne de date au format "dd-mm-yyyy"
    let dateFormatee = jour + '-' + mois + '-' + annee;

    return dateFormatee;
};


// fonction de gestion de l'affichage
function onChangeDisplay(toHide,toDisplay,toDisable,toEnable) {
    // Cache les items
    toHide.forEach(id=>{
        let itemRef = document.getElementById(id);
        itemRef.style.display = "none";
    });

    // Affiche les items
    toDisplay.forEach(id=>{
        let itemRef = document.getElementById(id);
        itemRef.style.display = "block";
    });

    // Desactive les items
    toDisable.forEach(id=>{
       let itemRef = document.getElementById(id);
       itemRef.style.opacity = 0.1;
       itemRef.style.pointerEvents = "none";
    });

    // Active les items
    toEnable.forEach(id=>{
        let itemRef = document.getElementById(id);
        itemRef.style.opacity = 1;
        itemRef.style.pointerEvents = "all";
     });


};



//formatage =  tout en majuscule
function onSetToUppercase(e) {
    let upperCase = e.toUpperCase();
    return upperCase;
};

function onSetFirstLetterUppercase(e) {
    let firstLetterUpperCase = e.charAt(0).toUpperCase() + e.slice(1);
    return firstLetterUpperCase;
};


// detection des champs vides obligatoires

function onCheckEmptyField(e) {
    if (e === "") {
        console.log("Champ vide obligatoire détecté !");
    };
    return e === ""? true :false;
};

// Detection d'erreur de date

function onCheckDateError(dateDebut, dateFin) {

    // convertion des strings en objets Date;
    let tempDateDebut = new Date(dateDebut);
    let tempDateFin =new Date(dateFin);

    if (tempDateDebut > tempDateFin) {
        console.log("Dates choisies incorrecte !");
        // Notification
        eventUserMessage(arrayUserMessage.errorDate,"error");
    };
    return tempDateDebut > tempDateFin ? true :false;
};





// detection date d'étape hors créneaux

function onCheckStepDateError(stepArray, dateDebut, dateFin) {
    // Convertion des strings en objets Date
    let tempDateDebut = new Date(dateDebut),
        tempDateFin = new Date(dateFin);

    // Utilisation de `some()` pour vérifier si au moins une date est en dehors de la plage
    return stepArray.some(step => {
        let currentStepDate = new Date(step.stepDate);

        // Vérifier si la date est en dehors de l'intervalle [tempDateDebut, tempDateFin]
        return currentStepDate < tempDateDebut || currentStepDate > tempDateFin;
    });
};


// Fonction de limite des nombres dans un input

function onlimitNumberLength(input, maxLength, maxValue) {
    let value = input.value;

    // Limite la longueur du nombre
    if (value.length > maxLength) {
        value = value.slice(0, maxLength);
    };

    // Limite la valeur maximale
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue > maxValue) {
        value = maxValue.toString();
    };

    input.value = value;
};



function onRemoveSpecialCaracter(text) {
    // Tableau motifs à rempalcer
    let correctedTitle = text;

    const correctionRef = [
        [/[éèêë]/gi,"e"],
        [/[àâä]/gi,"a"],
        [/[ç]/gi,"c"],
        [/[ïî]/gi,"i"],
        [/[ùûü]/gi,"u"]
      ];
    //Correction
    for(let i = 0; i < correctionRef.length; i++){
        correctedTitle = correctedTitle.replace(correctionRef[i][0],correctionRef[i][1])
    };

    return correctedTitle;
};





// ------------------------------- NAVIGATION MENU PRINCIPAL- -------------------------------------------------


let oldMenuSelected = "Accueil";
// fonction générale du changement de menu
function onChangeMenu(menuTarget) {

    if (menuTarget != oldMenuSelected) {


        // Action sur l'ancien menu sélectionné
        switch (oldMenuSelected) {
            case "Accueil":
                onCloseMenuAccueil();
            break;
            case "Timeline":
                onCloseMenuTimeline();
                onClearTimelineMenu();
            break;
            case "Dashboard":
                onCloseMenuDashboard();
                onClearDashboard();
            break;
            case "Setting":
                onCloseMenuSetting();
            break;
            case "Info":
                onCloseMenuInfo();
                onQuitMenuInfo();
            break;     
            case "Template":
                onCloseMenuTemplate();
                onQuitMenuTemplate();
            break;      
        
            default:
                break;
        };




        // Action sur le nouveau menu sélectionné
        oldMenuSelected = menuTarget;

        switch (menuTarget) {
            case "Accueil":
                onUpdatePage(false);
                onUpdateTimelineAccueil();
                onClickMenuAccueil();
            break;
            case "Timeline": 
                onClickMenuTimeline();
                onOpenTimeline();
            break
            case "Dashboard":
                onClickMenuDashboard();
                onOpenDashboard();
            break;
            case "Setting":
                onClickMenuSetting();
                onDisplaySetting();
            break;
            case "Info":
                onClickMenuInfo();
                onOpenMenuInfo();
            break;  
            case "Template":
                onClickMenuTemplate();
                onOpenMenuTemplate();
            break;        
        
            default:
                break;
        };
    };

};



// Menu Accueil
function onClickMenuAccueil() {
    // Gestion affichage
    onChangeDisplay([],["divAccueil"],[],[]);
    // Changement image icone
    document.getElementById("imgIconMainMenuAccueil").src = "./images/IconeHomeSelected.png";
    // Changement de classe pour le texte
    document.getElementById("pTextMainMenuHome").className = "textMainMenu-Selected";
};

function onCloseMenuAccueil() {
    // Remet la page d'accueil dans son affichage initiale et la ferme
    onChangeDisplay(["divNoteEditor","divNoteView","divPopupDelete","divPopupTerminer","divQuickChangePriority","divAccueil","divChoiceTemplate"],[],[],["divNoteEditor","divNoteView","divListBtnNote","divBtnNewTask"]);
    // Changement image icone
    document.getElementById("imgIconMainMenuAccueil").src = "./images/IconeHome.png";
    // Changement de classe pour le texte
    document.getElementById("pTextMainMenuHome").className = "textMainMenu";
};


// Menu Timeline
function onClickMenuTimeline() {
    // Gestion affichage
    onChangeDisplay([],["divTimeline"],[],[]);
    // Changement image icone
    document.getElementById("imgIconMainMenuTimeline").src = "./images/IconeTimelineSelected.png";
    // Changement de classe pour le texte
    document.getElementById("pTextMainMenuTimeline").className = "textMainMenu-Selected";
};

function onCloseMenuTimeline() {
    // Gestion affichage
    onChangeDisplay(["divTimeline","divEditionTimeline","divPopupDeleteTimeline"],[],[],["divFullTimelineZone","divMenuTimeline","divEditionTimeline"]);
    // Changement image icone
    document.getElementById("imgIconMainMenuTimeline").src = "./images/IconeTimeline.png";
    // Changement de classe pour le texte
    document.getElementById("pTextMainMenuTimeline").className = "textMainMenu";
};





// Menu Dashboard
function onClickMenuDashboard() {
    // Gestion affichage
    onChangeDisplay([],["divDashboard"],[],[]);
    // Changement image icone
    document.getElementById("imgIconMainMenuDashboard").src = "./images/IconeDashboardSelected.png";
    // Changement de classe pour le texte
    document.getElementById("pTextMainMenuDashboard").className = "textMainMenu-Selected";
};

function onCloseMenuDashboard() {
    // Gestion affichage
    onChangeDisplay(["divDashboard","divPopupCloture"],[],[],["divDashboardContent"]);
    // Changement image icone
    document.getElementById("imgIconMainMenuDashboard").src = "./images/IconeDashboard.png";
    // Changement de classe pour le texte
    document.getElementById("pTextMainMenuDashboard").className = "textMainMenu";
};


// Menu Setting
function onClickMenuSetting() {
    // Gestion affichage
    onChangeDisplay([],["divSetting"],[],[]);
    // Changement image icone
    document.getElementById("imgIconMainMenuSetting").src = "./images/IconeSettingSelected.png";
    // Changement de classe pour le texte
    document.getElementById("pTextMainMenuSetting").className = "textMainMenu-Selected";
};

function onCloseMenuSetting() {
    // Gestion affichage
    onChangeDisplay(["divSetting"],[],[],[]);
    // Changement image icone
    document.getElementById("imgIconMainMenuSetting").src = "./images/IconeSetting.png";
    // Changement de classe pour le texte
    document.getElementById("pTextMainMenuSetting").className = "textMainMenu";
};



// Menu Info
function onClickMenuInfo() {
    // Gestion affichage
    onChangeDisplay([],["divInfo"],[],[]);
    // Changement image icone
    document.getElementById("imgIconMainMenuInfo").src = "./images/IconeInfoSelected.png";
    // Changement de classe pour le texte
    document.getElementById("pTextMainMenuInfo").className = "textMainMenu-Selected";
};

function onCloseMenuInfo() {
    // Gestion affichage
    onChangeDisplay(["divInfo"],[],[],[]);
    // Changement image icone
    document.getElementById("imgIconMainMenuInfo").src = "./images/IconeInfo.png";
    // Changement de classe pour le texte
    document.getElementById("pTextMainMenuInfo").className = "textMainMenu";
};


// Menu Template
function onClickMenuTemplate() {
    // Gestion affichage
    onChangeDisplay([],["divMenuTemplate"],[],[]);
    // Changement image icone
    document.getElementById("imgIconMainMenuTemplate").src = "./images/IconeMenuTemplate2Selected.png";
    // Changement de classe pour le texte
    document.getElementById("pTextMainMenuTemplate").className = "textMainMenu-Selected";
};

function onCloseMenuTemplate() {
    // Gestion affichage
    onChangeDisplay(["divMenuTemplate"],[],[],[]);
    // Changement image icone
    document.getElementById("imgIconMainMenuTemplate").src = "./images/IconeMenuTemplate2.png";
    // Changement de classe pour le texte
    document.getElementById("pTextMainMenuTemplate").className = "textMainMenu";
};





// Lancement de la database
onStartDataBase();





// ---------------------- ACCEPTATION UTILISATEUR --------------------------

// Vérifier si l'utilisateur a déjà accepté
let accepted = localStorage.getItem("Mind2Task-accepted");
if (accepted === "true") {
    document.getElementById("popupValidationUser").style.display = "none";
} else {
    document.getElementById("popupValidationUser").style.display = "flex";
};


function toggleLaunchButton(checkbox) {
let launchBtn = document.getElementById("launch-btn");
launchBtn.disabled = !checkbox.checked;
};

function launchApplication() {
let popupValidationUserRef = document.getElementById("popupValidationUser");
popupValidationUserRef.style.display = "none";
localStorage.setItem("Mind2Task-accepted", "true");
};







// ---------------------------------- PLEIN ECRAN  --------------------------------------------------

function switchFullScreen() {
    if (!document.fullscreenElement) {
      // Passage en mode plein écran
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      };
    } else {
      // Quitte ple mode plein écran
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      };
    };
  };
  



// Fonction de concordance "priorité" systeme et utilisateur
function onConvertPriority(systemValue) {
    let correspondance = priorityArray.find(e=>{
        return e.systemPriority === systemValue;
    });

    return correspondance.userPriority;
};


// Fonction de concordance "status" system et utilisateur

function onConvertStatus(systemValue) {
    let correspondance = statusArray.find(e=>{
        return e.systemStatus === systemValue;
    });

    return correspondance.userStatus;
};






