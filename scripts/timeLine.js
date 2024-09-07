
// Variables
let timelineColorList = [
    "#ffffff", //Couleur par défaut
    "#f1948a",//Rouge
    "#c39bd3",//Mauve
    "#85c1e9",//Bleu
    "#76d7c4",//Vert
    "#f7dc6f",//Jaune
    "#d7dbdd",//Gris
];

let defaultTimelineColor = "#ffffff", //Couleur par défaut
isNewTimeline = true,//boolean pour savoir si c'est un nouvelle échéance ou une modification
divEditionTimelineRef, 
legendEditionTimelineRef,
inputEditionTimelineTitleRef,
selectEditionTimelineMonthRef,
pTimelineExempleColorRef,
textareaEditionTimeLineRef,
btnDeleteTimelineRef,
currentTimelineInView,
divColorZoneRef;


let arrayTimeline = [];//Tableau pour stocker les timelines [title,month,color,key]

let currentTimelineColor = "#ffffff";//la couleur en cours de l'échéance dans l'éditeur d'échéance



let timelineMonthArray = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC"
];


// ---------------------------------------    FONCTIONS GENERIQUES    -------------------------






// Promesse pour récupérer toutes les timelines dans la base
function onFindTimelineInDB(){
    return new Promise((resolve, reject) => {
        console.log(" [ TIMELINE ] reset arrayTimeline");
        arrayTimeline = [];

        let transaction = db.transaction(timelineStoreName);
        let objectStoreTimeline = transaction.objectStore(timelineStoreName);
        let indexStoreTimeline = objectStoreTimeline.index("title");
        let requestTimeline = indexStoreTimeline.getAll();

        requestTimeline.onsuccess = function () {
            console.log("[ TIMELINE ] les éléments ont été récupérés dans la base");
            console.log(" [ TIMELINE ] stockage dans le tableau temporaire");
        };

        requestTimeline.onerror = function () {
            reject(new Error(" [ TIMELINE ] Erreur de requête sur la base"));
        };


        transaction.oncomplete = function (){
            let tempArrayTimeline = requestTimeline.result;


            if (tempArrayTimeline.length > 0) {
                tempArrayTimeline.forEach(e =>{
                    arrayTimeline.push({key:e.key, title: e.title, month : e.month, color : e.color});
                });
                console.log("[ TIMELINE ] Timeline existants");
                resolve(true);
            }else{
                console.log("[ TIMELINE ] Aucune timeline");
                resolve(false);
            };
        };

    });
};




// Promesse pour récupérer une timeline via sa key dans la base
function onSearchTimelineWithKey(keyRef) {
    // Reset la variable
    currentTimelineInView = undefined;

    return new Promise((resolve, reject) => { // Ajout du return
        console.log(" [ TIMELINE ] recherche de la timeline avec la key = " + keyRef);

        // recupere les éléments correspondant à la clé recherchée
        console.log("[ TIMELINE ] lecture de la Base de Données");
        let transaction = db.transaction(timelineStoreName, "readonly");
        let objectStore = transaction.objectStore(timelineStoreName);
        let request = objectStore.getAll(IDBKeyRange.only(keyRef));

        request.onsuccess = function () {
            console.log("[ TIMELINE ] la timeline a été récupéré dans la base");
        };

        request.onerror = function () {
            reject(new Error(" [ TIMELINE ] Erreur de requête sur la base"));
        };

        transaction.oncomplete = function () {
            let tempTimelineResult = request.result;

            if (tempTimelineResult.length > 0) {
                console.log("[ TIMELINE ] Timeline existante");
                // Remplit la variable avec la timeline récupérée
                currentTimelineInView = tempTimelineResult[0];
                resolve(true);
            } else {
                console.log("[ TIMELINE ] Aucune timeline");
                resolve(false);
            }
        };

        transaction.onerror = function () { // Ajout de la gestion d'erreur de transaction
            reject(new Error("[ TIMELINE ] Erreur de transaction"));
        };
    });
}





// --------------------------------     Ouverture menu timeline     ---------------------------------









function onOpenTimeline() {
    // Referencement
    onReferenceTimelineItems();


    // Lors de l'ouverture, créé les emplacements pour les timelines
    onGenerateTimelineMonth();

    // affichage
    onUpdateTimelinePage();
}



// Referencement
function onReferenceTimelineItems() {
    legendEditionTimelineRef = document.getElementById("legendCreationTimeline");
    inputEditionTimelineTitleRef = document.getElementById("timelineTitle");
    selectEditionTimelineMonthRef = document.getElementById("timelineMonth");
    pTimelineExempleColorRef = document.getElementById("pTimelineExempleColor");
    textareaEditionTimeLineRef = document.getElementById("textareaTimelineComment");
    divEditionTimelineRef = document.getElementById("divEditionTimeline");
    btnDeleteTimelineRef = document.getElementById("btnDeleteTimeline");
    divColorZoneRef = document.getElementById("divColorParentZone");


    console.log(" [ TIMELINES ] referencement des items");
}






// Generation des mois de timeline
function onGenerateTimelineMonth() {

    console.log("[ TIMELINE ] création des emplacements timelines");

    // Récupère le numéro du mois en cours afin de pouvoir le mettre dans une autre couleur
    let currentMonthNumber = new Date().getMonth();
    let indexNb = 0;


    // Reference et vide le parent avant remplissage
    let divParentRef = document.getElementById("divFullTimelineZone");
    divParentRef.innerHTML = "";

    timelineMonthArray.forEach(e=>{

        // CREATION

        // Div pour chaque mois
        let newMainMonthDiv = document.createElement("div");
        newMainMonthDiv.className = "timelineMonth";

        // div du label (avec différentation du mois en cours)
        let newMonthLabelDiv = document.createElement("div");
        newMonthLabelDiv.className = indexNb === currentMonthNumber ? "timelineMonth-label currentTimelineMonth-label" : "timelineMonth-label";
        newMonthLabelDiv.innerHTML = e;

        // div qui contient les listes des tâches du mois
        let newMonthTaskDiv = document.createElement("div");
        newMonthTaskDiv.className = "timeLineTask";

        // element qui va contenir les listes des timelines
        let newULParent = document.createElement("ul");
        newULParent.id = "timelineULParent" + e;


        // INSERTION
        newMonthTaskDiv.appendChild(newULParent);
        newMainMonthDiv.appendChild(newMonthLabelDiv);
        newMainMonthDiv.appendChild(newMonthTaskDiv);

        divParentRef.appendChild(newMainMonthDiv);



        indexNb++;
    });
};






// UPDATE TIMELINE PAGE
function onUpdateTimelinePage(){

    console.log(" [ TIMELINE ] Actualisation de la page");
    // Reset et remplit
    onResetTimelineUL();




    // recherche les timelines dans la base 
    onFindTimelineInDB()
        .then(isTimelineExist => {

            //Si des timelines exitent, lance la fonction de remplissage
            if (isTimelineExist === true){
                arrayTimeline.forEach(e =>{
                    onSetULTimelineMonth(e.month,e.color,e.title,e.key);
                });

            }else{
                // Si aucune timeline n'existe
                console.log("[ TIMELINE ] Aucune timeline");
            };

        });


};



// Reset la timeLine
function onResetTimelineUL() {
    document.getElementById("timelineULParentJAN").innerHTML = "";
    document.getElementById("timelineULParentFEB").innerHTML = "";
    document.getElementById("timelineULParentMAR").innerHTML = "";
    document.getElementById("timelineULParentAPR").innerHTML = "";
    document.getElementById("timelineULParentMAY").innerHTML = "";
    document.getElementById("timelineULParentJUN").innerHTML = "";
    document.getElementById("timelineULParentJUL").innerHTML = "";
    document.getElementById("timelineULParentAUG").innerHTML = "";
    document.getElementById("timelineULParentSEP").innerHTML = "";
    document.getElementById("timelineULParentOCT").innerHTML = "";
    document.getElementById("timelineULParentNOV").innerHTML = "";
    document.getElementById("timelineULParentDEC").innerHTML = "";
}



// Remplit par mois
function onSetULTimelineMonth(month,color,data,keyRef) {
    // Creation 
    let newBtn = document.createElement("button");
    newBtn.style = "background-color: " + color;
    newBtn.innerHTML = data;
    newBtn.onclick = function () {
        onClickModifyTimeline(keyRef);
    };
    
    
    // Filtre sur le bon parent selon le mois et Insertion dans le parent
    let monthRef = "timelineULParent" + month;

    document.getElementById(monthRef).appendChild(newBtn);

}






// ---------------------------------- CREATION /MODIFICATION TIMELINE -----------------------------------------------------








// CREATION
function onClickNewTimeline() {

    // N'affiche pas le bouton "supprimer"
    btnDeleteTimelineRef.style.display = "none";

    onEditTimeline(true,);

};






// MODIFICATION

function onClickModifyTimeline(keyRef) {

    // Affiche le bouton "supprimer"
    btnDeleteTimelineRef.style.display = "inline-block";


    // lance l'affichage
    onEditTimeline(false,keyRef);
};



// Affichage de l'éditeur de timeline
function onEditTimeline(isNew, keyRef) {

    // Set le boolean pour savoir si c'est une création ou modification
    isNewTimeline = isNew;

    // Reset les éléments
    onClearTimelineEditionItems();


    // insert les possibilité de couleur depuis un tableau
    divColorZoneRef.innerHTML = "";

    timelineColorList.forEach(e=>{
        let newBtnColor = document.createElement("button");
        newBtnColor.style.backgroundColor = e;
        newBtnColor.className = "timelineColorSelected";
        newBtnColor.onclick = function (){
            onSetColorSelectedByUser(e);
        };
    
        divColorZoneRef.appendChild(newBtnColor);
    });



    // set les éléments si c'est une modification ou une création selon
    if (isNewTimeline === true) {
        legendEditionTimelineRef.innerHTML = "Créer une échéance";
        pTimelineExempleColorRef.style.backgroundColor = currentTimelineColor;
    }else{
        legendEditionTimelineRef.innerHTML = "Modifier une échéance";
        // Recherche la timeline dans la base
        onSearchTimeTimelineBeforeSet(keyRef);
    };
    
    onChangeDisplay([], ["divEditionTimeline"], ["divMenuTimeline", "divFullTimelineZone"], []);
};


// Fonction de remplissage de la couleur selectionné par l'user
function onSetColorSelectedByUser(colorRef) {
    currentTimelineColor = colorRef;

    pTimelineExempleColorRef.style.backgroundColor = currentTimelineColor;

}




// Remplit les éléments lors d'une modification
function onSearchTimeTimelineBeforeSet(keyRef) {
    // recherche la timeline avec cette clé dans la base 
    onSearchTimelineWithKey(keyRef)
        .then(isTimelineExist => {
            // Si la timeline existe, lance l'affichage
            if (isTimelineExist === true) {
                if (currentTimelineInView) { // Vérifie que currentTimelineInView contient bien les données

                    // set les éléments trouvé et les affichent
                    onSetTimelineItems(currentTimelineInView);
                } else {
                    console.error("[ TIMELINE ] Erreur: Timeline introuvable après la récupération.");
                }
            } else {
                // Si aucune timeline n'existe
                console.log("[ TIMELINES ] Aucune timeline");
            }
        })
        .catch(error => {
            console.error("[ TIMELINE ] Erreur lors de la recherche de la timeline :", error);
        });
};



// Set les éléments de la timeline si trouvé

function onSetTimelineItems(e) {
    inputEditionTimelineTitleRef.value = e.title;
    selectEditionTimelineMonthRef.value = e.month;
    pTimelineExempleColorRef.style.backgroundColor = e.color;
    currentTimelineColor = e.color;
    textareaEditionTimeLineRef.value = e.comment;


};



// Remet les paramètres par défaut dans l'éditeur de timeline
function onClearTimelineEditionItems() {
    inputEditionTimelineTitleRef.value = "";
    selectEditionTimelineMonthRef.value = "JAN";
    pTimelineExempleColorRef.style.backgroundColor = defaultTimelineColor;
    currentTimelineColor = defaultTimelineColor;
    textareaEditionTimeLineRef.value = "";


};




// click sur le bouton valider
function onValidTimeline() {



    if (isNewTimeline === true) {
        console.log("[ TIMELINE ] Demande de création d'une timeline");
    }else{
        console.log("[ TIMELINE ] Demande de modification d'une timeline");
    };

    // Verification des erreurs
    onCheckTimelineError();

}



// vérification des erreurs
function onCheckTimelineError() {

    console.log("[ TIMELINE ] Vérification des erreurs");

    // detection des champs vides obligatoires
    let isEmptyTitleField = onCheckEmptyField(inputEditionTimelineTitleRef.value);
    if (isEmptyTitleField === true) {
        eventUserMessage(arrayUserMessage.emptyTitleField,"error");
    };

    if (isEmptyTitleField === true) {
        console.log("[ TIMELINE ] au moins une erreur détéctée. Ne valide pas la création/modification de la timeline");
    }else{
        console.log("[ TIMELINE ] Aucune erreurs");
        // Formatage avant insertion dans la base
        onFormatTimeline();
    };

    

};


// Mise au bon format
function onFormatTimeline() {
    let tempTimelineTitle = inputEditionTimelineTitleRef.value;
    // Titre 1er lettre majuscule
    let timelineTitle = onSetFirstLetterUppercase(tempTimelineTitle);





    let dataTimelineToInsert = {
        title : timelineTitle, 
        month :selectEditionTimelineMonthRef.value, 
        color : currentTimelineColor, 
        comment : textareaEditionTimeLineRef.value
    };


    // filtre si création ou modification
    if (isNewTimeline === true) {
        console.log("[ TIMELINE ] tentative d'insertion d'un nouvel élément");
        onInsertDataTimeline(dataTimelineToInsert);
    }else{
        console.log("[ TIMELINE ] tentative de modification d'un élément");
        onInsertTimelineModification(dataTimelineToInsert);
    };
    




};


// filtre si création ou modification
function onInsertDataTimeline(e) {
    let transaction = db.transaction(timelineStoreName,"readwrite");
    let store = transaction.objectStore(timelineStoreName);

    console.log("[ TIMELINE ] valeur de e : ");
    console.log(e);
    let insertRequest = store.add(e);

    insertRequest.onsuccess = function () {
        console.log("[ TIMELINE ] " + e.title + "a été ajouté à la base");
        // evenement de notification
        eventUserMessage(arrayUserMessage.timelineCreated + e.title,"info");


        // Clear l'editeur de timeline
        onClearTimelineEditionItems();
    };

    insertRequest.onerror = function(event){
        console.log("Error");
 
    };

    transaction.oncomplete = function(){
        console.log("[ TIMELINE ] transaction insertData complete");

        // Actualise la page de timelines
        console.log("[ TIMELINE ] Actualisation de la page des timelines")
        onUpdateTimelinePage();

    };

};




// Retour depuis l'édition d'une timeline
function onReturnFromTimelineEditor() {
    // Gestion affichage
    onChangeDisplay(["divEditionTimeline"],[],[],["divMenuTimeline","divFullTimelineZone"]);
}






// Insertion d'une modification de timeline
function onInsertTimelineModification(e) {
    console.log(" [ TIMELINE ] fonction d'insertion de la donnée modifié");

    let transaction = db.transaction(timelineStoreName,"readwrite");
    let store = transaction.objectStore(timelineStoreName);
    let modifyRequest = store.getAll(IDBKeyRange.only(currentTimelineInView.key));

    

    modifyRequest.onsuccess = function () {
        console.log(" [ TIMELINE ] modifyRequest = success");

        let modifiedData = modifyRequest.result[0];

        modifiedData.title = e.title;
        modifiedData.color = e.color;
        modifiedData.comment = e.comment;
        modifiedData.month = e.month;

        let insertModifiedData = store.put(modifiedData);

        insertModifiedData.onsuccess = function (){
            console.log("[ TIMELINE ] insertModifiedData = success");

        };

        insertModifiedData.onerror = function (){
            console.log("[ TIMELINE ] insertModifiedData = error",insertModifiedData.error);

        };


    };

    modifyRequest.onerror = function(){
        console.log("[ TIMELINE ] ModifyRequest = error");
    };

    transaction.oncomplete = function(){
        console.log("[ TIMELINE ] transaction complete");

        // Remet à jour la page 
        onUpdateTimelinePage();

        // Gestion affichage
        onChangeDisplay(["divEditionTimeline","divPopupDeleteTimeline"],[],[],["divFullTimelineZone","divMenuTimeline","divEditionTimeline"]);
    
    };
};








// ------------------------------ SUPPRESSION TIMELINE --------------------



function onClickDeleteTimeline() {
    console.log("[ TIMELINE ] demande de suppression de timeline");

    // Gestion affichage
    onChangeDisplay([],["divPopupDeleteTimeline"],["divEditionTimeline"],[]);
    
};



function onValidSuprTimeline() {
    // recupere les éléments correspondant à la clé recherché et la stoque dans une variable
    console.log("[ TIMELINE ] Suppression  de la timeline avec la key : " + currentTimelineInView.key);
    let transaction = db.transaction(timelineStoreName,"readwrite");//transaction en écriture
    let objectStore = transaction.objectStore(timelineStoreName);
    let request = objectStore.delete(IDBKeyRange.only(currentTimelineInView.key));
    
    
    request.onsuccess = function (){
        console.log("[ TIMELINE ] Requete de suppression réussit");
        eventUserMessage(arrayUserMessage.timelineDeleted,"info");


        // Remet à jour la page 
        onUpdateTimelinePage();

        // Gestion affichage
        onChangeDisplay(["divEditionTimeline","divPopupDeleteTimeline"],[],[],["divFullTimelineZone","divMenuTimeline","divEditionTimeline"]);
    };

    request.onerror = function (){
        console.log("[ TIMELINE ] Erreur lors de la requete de suppression");
                
    };
};


function onCancelTimelineSuppression() {
    // Gestion affichage
    onChangeDisplay(["divPopupDeleteTimeline"],[],[],["divEditionTimeline"]);
};