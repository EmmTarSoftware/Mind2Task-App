// Initialisation variables
// -------------------------------------------------   GLOBAL        ------------------------------------------------
//  Définition des textes de notification

let arrayNotify ={
    emptyTitleField : "Le champ 'Titre' n'est pas renseignés",
    emptyStepField : "Un champ d'étape est vide",
    errorDate : "Les dates définies sont incorrectes",
    taskCreated : "Création de la tache : ",
    taskDone : "Clôture de la tâche : ",
    templateCreated : "Création du modèle : ",
    templateModified : "Modification du modèle : ",
    templateLimite : "Nombre maximal de modèle atteint !",
    stepLimite : "Nombre maximal d'étape atteint !",
    templateListEmpty :"Vous n'avez créé aucun modèle."
};
    



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
    
}
onSetDateDuJour();







let db,
    dbName = "Planning-DataBase",
    taskStoreName = "taskList",
    tagStoreName = "TAGList",
    dashBoardStoreName = "dashboard",
    templateStoreName = "template",
    version = 2;


// Lancement /création de la base de donnée

function onStartDataBase() {
    let openRequest = indexedDB.open(dbName,version);

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
            noteStore.createIndex('dateStart','dateStart',{unique:false});
            noteStore.createIndex('dateEnd','dateEnd',{unique:false});
            noteStore.createIndex('status','status',{unique:false});
            noteStore.createIndex('tag','tag',{unique:false});
            noteStore.createIndex('priority','priority',{unique:false});
        }

        // Creation du store pour les TAG d'autocomplétion
        if (!db.objectStoreNames.contains(tagStoreName)) {
            let tagStore = db.createObjectStore(tagStoreName, {autoIncrement: true});
            console.log("Creation du magasin "+  tagStoreName);
        }

        // Creation du store pour le dashboard
        if (!db.objectStoreNames.contains(dashBoardStoreName)) {
            let dashboardStore = db.createObjectStore(dashBoardStoreName, {keyPath:'key',autoIncrement: true});
            console.log("Creation du magasin "+  dashBoardStoreName);

            dashboardStore.createIndex('tag','tag',{unique:false});
            dashboardStore.createIndex('duration','duration',{unique:false});
            dashboardStore.createIndex('dateStart','dateStart',{unique:false});
            dashboardStore.createIndex('dateEnd','dateEnd',{unique:false});
        }


        // Creation du store pour le template
        if (!db.objectStoreNames.contains(templateStoreName)) {
            let templateStore = db.createObjectStore(templateStoreName, {keyPath:'key',autoIncrement: true});
            console.log("Creation du magasin "+  templateStoreName);

            templateStore.createIndex('title','title',{unique:true});
        }

    };

    openRequest.onerror = function(){
        console.error("Error",openRequest.error);
    };

    openRequest.onsuccess = function(){
        db = openRequest.result
        console.log("Data Base ready");

        // Premiere actualisation de la page
        onUpdatePage(true);
    };




}



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
}



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
}


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


}



//formatage =  tout en majuscule
function onSetToUppercase(e) {
    let upperCase = e.toUpperCase();
    return upperCase;
}

function onSetFirstLetterUppercase(e) {
    let firstLetterUpperCase = e.charAt(0).toUpperCase() + e.slice(1);
    return firstLetterUpperCase;
}


// detection des champs vides obligatoires

function onCheckEmptyField(e) {
    if (e === "") {
        console.log("Champ vide obligatoire détecté !");
    }
    return e === ""? true :false;
}

// Detection d'erreur de date

function onCheckDateError(dateDebut, dateFin) {

    // convezrtion des strings en objets Date;
    let tempDateDebut = new Date(dateDebut);
    let tempDateFin =new Date(dateFin);

    if (tempDateDebut > tempDateFin) {
        console.log("Dates choisies incorrecte !");
        // Notification
        eventNotify(arrayNotify.errorDate);
    }
    return tempDateDebut > tempDateFin ? true :false;


}


// Fonction de limite des nombres dans un input

function onlimitNumberLength(input, maxLength, maxValue) {
    let value = input.value;

    // Limite la longueur du nombre
    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
    }

    // Limite la valeur maximale
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue > maxValue) {
      value = maxValue.toString();
    }

    input.value = value;
  }



function onRemoveSpecialCaracter(text) {
    // Tableau motifs à rempalcer
    let correctedTitle = text;

    const correctionRef = [
        [/[éèêë]/gi,"e"],
        [/[àâä]/gi,"a"],
        [/[ç]/gi,"c"],
        [/[ïî]/gi,"i"],
        [/[ùûü]/gi,"u"],
        [/ /gi,"-"]
      ];
    //Correction
    for(let i = 0; i < correctionRef.length; i++){
        correctedTitle = correctedTitle.replace(correctionRef[i][0],correctionRef[i][1])
    };

    return correctedTitle;
}


//  --------------------------  Animation notification -------------------------------------
let isNotifyEnabled = false;
function eventNotify(textToDisplay) {

    if (isNotifyEnabled === false) {
        isNotifyEnabled = true;

        let pNotifyTextRef = document.getElementById("pNotifyText");
        let divNotifyRef = document.getElementById("divNotify");
        pNotifyTextRef.innerHTML =  textToDisplay + " !";
    

        // Affiche la div
        // divNotifyRef.style.visibility = "visible";
        divNotifyRef.style.display ="block";


        // Cache la div apres un delay
        setTimeout(() => {
            // divNotifyRef.style.visibility = "hidden";
            divNotifyRef.style.display = "none";
            isNotifyEnabled = false;
        }, 2000);
    }

    


}


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
            case "Dashboard":
                onCloseMenuDashboard();
            break;
            case "Setting":
                onCloseMenuSetting();
            break;
            case "Info":
                onCloseMenuInfo();
            break;     
            case "Template":
                onCloseMenuTemplate();
            break;      
        
            default:
                break;
        }




        // Action sur le nouveau menu sélectionné
        oldMenuSelected = menuTarget;

        switch (menuTarget) {
            case "Accueil":
                onUpdatePage(false);
                onClickMenuAccueil();
            break;
            case "Dashboard":
                onClickMenuDashboard();
            break;
            case "Setting":
                onClickMenuSetting();
            break;
            case "Info":
                onClickMenuInfo();
            break;  
            case "Template":
                onClickMenuTemplate();
            break;        
        
            default:
                break;
        }
    }

}



// Menu Accueil
function onClickMenuAccueil() {
    // Gestion affichage
    onChangeDisplay([],["divAccueil"],[],[]);
    // Changement image icone
    document.getElementById("imgIconMainMenuAccueil").src = "./images/IconeHomeSelected.png";
}

function onCloseMenuAccueil() {
    // Remet la page d'accueil dans son affichage initiale et la ferme
    onChangeDisplay(["divNoteEditor","divNoteView","divPopupDelete","divPopupTerminer","divQuickChangePriority","divAccueil","divChoiceTemplate"],[],[],["divNoteEditor","divNoteView","divListBtnNote","divBtnNewTask"]);
    // Changement image icone
    document.getElementById("imgIconMainMenuAccueil").src = "./images/IconeHome.png";
}



// Menu Dashboard
function onClickMenuDashboard() {

    // Gestion affichage
    onChangeDisplay([],["divDashboard"],[],[]);
    // Changement image icone
    document.getElementById("imgIconMainMenuDashboard").src = "./images/IconeDashboardSelected.png";

    onOpenDashboard();
}

function onCloseMenuDashboard() {
    // Gestion affichage
    onChangeDisplay(["divDashboard"],[],[],[]);
    // Changement image icone
    document.getElementById("imgIconMainMenuDashboard").src = "./images/IconeDashboard.png";
    onClearDashboard();
}


// Menu Setting
function onClickMenuSetting() {
    // Gestion affichage
    onChangeDisplay([],["divSetting"],[],[]);


    // Changement image icone
    document.getElementById("imgIconMainMenuSetting").src = "./images/IconeSettingSelected.png";
    onDisplaySetting();
}

function onCloseMenuSetting() {
    // Gestion affichage
    onChangeDisplay(["divSetting"],[],[],[]);
        // Changement image icone
        document.getElementById("imgIconMainMenuSetting").src = "./images/IconeSetting.png";
}



// Menu Info
function onClickMenuInfo() {

    // Gestion affichage
    onChangeDisplay([],["divInfo"],[],[]);

    // Changement image icone
    document.getElementById("imgIconMainMenuInfo").src = "./images/IconeInfoSelected.png";
    onOpenMenuInfo();
}

function onCloseMenuInfo() {
    // Gestion affichage
    onChangeDisplay(["divInfo"],[],[],[]);
    // Changement image icone
    document.getElementById("imgIconMainMenuInfo").src = "./images/IconeInfo.png";

    onQuitMenuInfo();
}


// Menu Template
function onClickMenuTemplate() {

    // Gestion affichage
    onChangeDisplay([],["divMenuTemplate"],[],[]);

    // Changement image icone
    document.getElementById("imgIconMainMenuTemplate").src = "./images/IconeMenuTemplate2Selected.png";
    onOpenMenuTemplate();
}

function onCloseMenuTemplate() {
    // Gestion affichage
    onChangeDisplay(["divMenuTemplate"],[],[],[]);
    // Changement image icone
    document.getElementById("imgIconMainMenuTemplate").src = "./images/IconeMenuTemplate2.png";

    onQuitMenuTemplate();
}


// Lancement de la database
onStartDataBase();





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
      }
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
      }
    }
  }
  



// Fonction de concordance "priorité" systeme et utilisateur
function onConvertPriority(systemValue) {
    let correspondance = priorityArray.find(e=>{
        return e.systemPriority === systemValue;
    })

    return correspondance.userPriority;
}


// Fonction de concordance "status" system et utilisateur

function onConvertStatus(systemValue) {
    let correspondance = statusArray.find(e=>{
        return e.systemStatus === systemValue;
    })

    return correspondance.userStatus;
}






