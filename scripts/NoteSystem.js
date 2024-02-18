

let noteStatus1Array= [],//les notes en cours
    notesStatus0Array =[],//les notes à faire
    currentKeyNoteInView,//la key de la note en cours de visualisation
    currentNoteInView,//le contenu de la note en cours de visualisation
    boolEditNoteCreation,//mode d'ouverture de l'editeur de note en mode création ou modification
    boolSaveAsTemplate,// Pour savoir si c'est une sauvegarde de template
    noteStatus1IndexToStart,//pour l'affichage des notes avec les boutons next et previous
    noteStatus0IndexToStart,//pour l'affichage des notes avec les boutons next et previous
    maxBtnNoteToDisplay = 6,//nbre de bouton maximum qui sont affiché dans la liste
    btnNoteStatus1PreviousRef = document.getElementById("btnNoteStatus1Previous"),//les boutons de navigation des notes
    btnNoteStatus1NextRef = document.getElementById("btnNoteStatus1Next"),//les boutons de navigation des notes
    btnNoteStatus0PreviousRef = document.getElementById("btnNoteStatus0Previous"),//les boutons de navigation des notes
    btnNoteStatus0NextRef = document.getElementById("btnNoteStatus0Next"),//les boutons de navigation des notes
    tempStepArray = [],//pour stoquer les étapes temporairement lorsqu'ils sont en mode édition
    previousStepArray = []; // pour stocker les étapes précédentes avant toute modification
    

let defaultTagValue = "divers",
    maxStep = 10,
    sortIndexationType = "priority";// Dans quel index de la base les données sont récupérées pour le trie.














// --------------------------              UPDATE  PAGE                ------------------------------------------------












function onUpdatePage(isUpdateTagListRequired) {
    console.log("update Page");
    // Clear la page
    // Reset les array
    noteStatus1Array = [];
    notesStatus0Array = [];
    noteStatus1IndexToStart = 0;
    noteStatus0IndexToStart = 0;
    allTagCompletion = [];



    // recupere les éléments dans la base et les stock dans une grosse variable temporaire
    
    let transaction = db.transaction([taskStoreName,tagStoreName]);//readonly
    let objectStoreTask = transaction.objectStore(taskStoreName);
    let indexStoreTask = objectStoreTask.index(sortIndexationType);
    let requestTask = indexStoreTask.getAll();

    requestTask.onsuccess = function (){
        console.log("Les éléments ont été récupéré dans la base");
        console.log("stockage dans le tableau temporaire");

    }
    requestTask.error = function (){
        console.log("Erreur de requete sur la base");
    }


    // les TAG COMPLETION
    let objectStoreTAG = transaction.objectStore(tagStoreName);
    let requestTag = objectStoreTAG.getAll();
    
    


    requestTag.onsuccess = function () {
        console.log("les TAG de complétion ont été récupéré dans le store");
        // actualise les TAG de complétion
        let tagCompletionResult = requestTag.result;
        allTagCompletion = tagCompletionResult.sort();
    }






    transaction.oncomplete = function (){
        let arrayResult = requestTask.result;
        

        // Traitement des notifications pour les dates
        onUpdateNotifyDate(arrayResult);

        
        // Compte les taches status0 et status1 pour le dashboard
        onCountTaskByStatus(arrayResult);


        // Filtre se mise à jour du selecteur de tag
        if (isUpdateTagListRequired === true) {
            // TEST FILTRE  PAR TAG
            onListTAG(arrayResult);
        }else{
            // fonction de répartition des taches dans le visualiseur
            onSortItem(arrayResult);
        
        }

        //Actualisation des templates dans la page d'accueil
        onUpdateTemplateToHome();
        
    }
}






// Classe les items en les mettants dans leurs catégories respectives et stock dans les variables avec uniquement key/titre/priorité/tag
function onSortItem(arrayResult) {
    let tempNoteStatus1Array =[],
    tempNoteStatus0Array =[];

    // Jonction MODE RECHERCHE ou FILTRE TAG pour l'extraction des résultats
    // Si il y a un texte = filtre TAG + text sinon TAG uniquement
    if (inputSearchTextRef.value != "") {

        let textTarget = inputSearchTextRef.value.toUpperCase();
        
        // MODE RECHERCHE dans STATUS 1
        console.log("Trie des éléments  par recherche" + statusArray[1].systemStatus);
        tempNoteStatus1Array = arrayResult.filter((item) =>{
            
            if (currentTagFilter === genericTAG) {
                return item.title.includes(textTarget) && item.status === statusArray[1].systemStatus;// Si toutes les taches (genericTAG) récupere tout
            }else{
                return item.title.includes(textTarget) && item.tag === currentTagFilter;  // Si un tag en cours, ne recupere que ceux du tag en cours
            }   

        })

        // MODE RECHERCHE dans STATUS 0
        console.log("Trie des éléments  par recherche" + statusArray[0].systemStatus);
        tempNoteStatus0Array = arrayResult.filter((item) =>{
            if (currentTagFilter === genericTAG) {
                return item.title.includes(textTarget) && item.status === statusArray[0].systemStatus;// Si toutes les taches (genericTAG) récupere tout
            }else{
                return item.title.includes(textTarget) && item.tag === currentTagFilter;  // Si un tag en cours, ne recupere que ceux du tag en cours
            }       
        })


    }else{
        // STATUS 1
        //Filtre sur les notes en cours avec le filtre du tag
        console.log("Trie des éléments " + statusArray[1].systemStatus);
        tempNoteStatus1Array = arrayResult.filter((item) =>{
            
            if (currentTagFilter === genericTAG) {
                return item.status === statusArray[1].systemStatus;// Si toutes les taches (genericTAG) récupere tout
            }else{
                return item.status === statusArray[1].systemStatus && item.tag === currentTagFilter;  // Si un tag en cours, ne recupere que ceux du tag en cours
            }   
        })

        // STATUS 0
        //Filtre sur les notes A FAIRE avec le filtre du tag
        console.log("Trie des éléments " + statusArray[0].systemStatus);
        tempNoteStatus0Array = arrayResult.filter((item) =>{

        if (currentTagFilter === genericTAG) {
            return item.status === statusArray[0].systemStatus;// Si toutes les taches (genericTAG) récupere tout
        }else{
            return item.status === statusArray[0].systemStatus && item.tag === currentTagFilter;// Si un tag en cours, ne recupere que ceux du tag en cours
            
        }
        
    })
    }
    


    // Ne recupère que les valeurs nécessaires
    tempNoteStatus1Array.forEach(e=>{
        // Calcul le nombre d'étape total et le nombre coché pour la progress bar
        let percentStepCheckedValue;

        if (e.stepArray.length === 0) {
            percentStepCheckedValue = 0;
        }else{
            let tempStepArrayChecked = 0;
            e.stepArray.forEach(e=>{
                if(e.stepChecked === true){
                    tempStepArrayChecked++;
                }
            })
            // Calcul le pourcentage de d'étape accomplit pour la tache
            percentStepCheckedValue = Math.abs((tempStepArrayChecked / e.stepArray.length) * 100);
        }

        
        noteStatus1Array.push({key:e.key,title:e.title,priority:e.priority,tag:e.tag,percentStepChecked:percentStepCheckedValue});

    })





    // Ne recupère que les valeurs nécessaires
    tempNoteStatus0Array.forEach(e=>{
        // Calcul le nombre d'étape total et le nombre coché pour la progress bar
        let percentStepCheckedValue;

        if (e.stepArray.length === 0) {
            percentStepCheckedValue = 0;
        }else{
            let tempStepArrayChecked = 0;
            e.stepArray.forEach(e=>{
                if(e.stepChecked === true){
                    tempStepArrayChecked++;
                }
            })
            // Calcul le pourcentage de d'étape accomplit pour la tache
            percentStepCheckedValue = Math.abs((tempStepArrayChecked / e.stepArray.length) * 100);
        }


        notesStatus0Array.push({key:e.key,title:e.title,priority:e.priority,tag:e.tag,percentStepChecked:percentStepCheckedValue});

    })





    // Classe par priorité d'abord puis par TAG

    // En cas de problème de performance avec trop de trie et trop de donné, je peux supprimer les 6 fonctions ci-dessous.
    // Cela n'aura aucun impact sur l'application. Le trie se fera uniquement par priorité(depuis l'indexation).
    // Ou sinon enlever juste le 3 ieme niveau et tester, puis le deuxieme

    // Tri par priorité (premier niveau)
    notesStatus0Array.sort((a, b) => {
        return a.priority.localeCompare(b.priority);    
    });

    // Tri par TAG (deuxième niveau) pour les tâches ayant la même priorité
    notesStatus0Array.sort((a, b) => {
        if (a.priority === b.priority) {
            return a.tag.localeCompare(b.tag);
        }
        return 0; // Ne change rien si les priorités sont différentes
    });

    // Tri par titre (troisième niveau) pour les tâches ayant la même priorité et le même TAG
    notesStatus0Array.sort((a, b) => {
        if (a.priority === b.priority && a.tag === b.tag) {
        return a.title.localeCompare(b.title);
        }
        return 0; // Ne change rien si les priorités ou les TAG sont différents
    });


    // Tri par priorité (premier niveau)
    noteStatus1Array.sort((a, b) => {
        return a.priority.localeCompare(b.priority);    
    });

    // Tri par TAG (deuxième niveau) pour les tâches ayant la même priorité
    noteStatus1Array.sort((a, b) => {
        if (a.priority === b.priority) {
            return a.tag.localeCompare(b.tag);
        }
        return 0; // Ne change rien si les priorités sont différentes
    });


    // Tri par titre (troisième niveau) pour les tâches ayant la même priorité et le même TAG
    noteStatus1Array.sort((a, b) => {
      if (a.priority === b.priority && a.tag === b.tag) {
        return a.title.localeCompare(b.title);
      }
      return 0; // Ne change rien si les priorités ou les TAG sont différents
    });


    // Creation des liste de notes par catégories
    onSetListNotes("divBtnNoteStatus1",noteStatus1Array,noteStatus1IndexToStart,"pTxtStatus1",statusArray[1].userStatus,statusArray[1].systemStatus);
    onSetListNotes("divBtnNoteStatus0",notesStatus0Array,noteStatus0IndexToStart,"pTxtStatus0",statusArray[0].userStatus,statusArray[0].systemStatus);
}



// Crée les boutons des notes selon la catégorie
function onSetListNotes(divNotesTarget,noteArray,indexToStart,thIDRef,currentUserStatus,currentSystemStatus) {
    // Reference pour le nombre de tache 
    let currentThRef = document.getElementById(thIDRef);

    // Vide la div de note
    onClearDIV(divNotesTarget);


    let CurrentDivNotesRef = document.getElementById(divNotesTarget);

    console.log("création des boutons de notes pour la div : " + divNotesTarget);


    // condition si il y a des notes ou non
    if (noteArray.length > 0 ) {
        let nbreIteration = 0;

        for (let i = indexToStart ; i < noteArray.length ; i++){
            let e = noteArray[i];
        

            // Ensembre d'un bouton de tache
            let newMainDiv = document.createElement("div");
            newMainDiv.className = "listBtnLine";

            // Priorité
            let newImgPriority = document.createElement("img");
            newImgPriority.className = "iconQuickChange";
            if (e.priority === priorityArray[0].systemPriority) { newImgPriority.src ="./images/IconePriorityC.png" };
            if (e.priority === priorityArray[1].systemPriority) { newImgPriority.src ="./images/IconePriorityB.png" };
            if (e.priority === priorityArray[2].systemPriority) { newImgPriority.src ="./images/IconePriorityA.png" }

            newImgPriority.onclick = function(){
                onClickQuickChangePriority(e.key,e.priority);
            }




            // Tag
            let newDivTAG = document.createElement("div");
            newDivTAG.className = "listBtnTAG";

            let newTag = document.createElement("p");
            newTag.className = "listNoteTag";
            newTag.innerHTML = ` [ ${e.tag} ] `;
            newDivTAG.appendChild(newTag);

            // Titre
            let newButtonView = document.createElement("button");
            newButtonView.className = "btnListNote";
            newButtonView.innerHTML = e.title;
            newButtonView.onclick = function(){
                // affiche la note si elle n'est pas en cours d'affichage
                if (divNoteViewRef.style.display != "block") {
                    onSearchNotesToDisplay(e.key);
                }else if(e.key != currentKeyNoteInView){
                    onSearchNotesToDisplay(e.key);
                }else{
                    console.log("Cette note est déjà en cours d'affichage !");
                }
            }

            // STATUT
            let newBtnChangeStatus = document.createElement("img");
            newBtnChangeStatus.className= "iconQuickChange";
            newBtnChangeStatus.src = currentUserStatus === statusArray[0].userStatus ? "./images/IconUp.png": "./images/IconDown.png";

            // insert la fonction de changement de statut selon le statut actuel
            if (currentSystemStatus === statusArray[0].systemStatus) {
                newBtnChangeStatus.onclick = function(){
                    onQuickChangeNoteStatus(e.key,statusArray[1].systemStatus)
                }
            }

            if (currentSystemStatus === statusArray[1].systemStatus) {
                newBtnChangeStatus.onclick = function(){
                    onQuickChangeNoteStatus(e.key,statusArray[0].systemStatus)
                }
            }
           


            // insere les td dans le tr
            newMainDiv.appendChild(newImgPriority);
            newMainDiv.appendChild(newDivTAG);
            newMainDiv.appendChild(newButtonView);
            newMainDiv.appendChild(newBtnChangeStatus);



            // progress bar
            let newDivProgressBarExt = document.createElement("div");
            newDivProgressBarExt.className = "progress-bar-container";

            let newDivProgressBarInt = document.createElement("div");
            newDivProgressBarInt.className = "progress-bar";

            newDivProgressBarInt.style.width = e.percentStepChecked + '%';

            newDivProgressBarExt.appendChild(newDivProgressBarInt);

            // fin progress bar



            CurrentDivNotesRef.appendChild(newMainDiv);
            CurrentDivNotesRef.appendChild(newDivProgressBarExt);

            nbreIteration++
            // Met fin a la generation si atteind le nbre d'iteration max d'affichage
            if ( nbreIteration === maxBtnNoteToDisplay) {
                break;
            }
            
        }

        
        // Set le nombre de tâche
        currentThRef.innerHTML = ` ${currentUserStatus}  <strong>( ${noteArray.length} )  </strong> <i>${indexToStart + 1} - ${indexToStart + nbreIteration}</i>`;     

    }else{
        console.log("Aucune note pour " + divNotesTarget);
        CurrentDivNotesRef.innerHTML = "Aucune note";
        // Set le nombre de tâche à zero
        currentThRef.innerHTML = `${currentUserStatus} ( 0 )   <i> 0 - 0 </i>`;
    }

    // Gestion de visibilité des boutons de notes
    onSetBtnNavNotesVisibility();
}



// fonction de vidage des div
function onClearDIV(divID) {
    let currentDivRef = document.getElementById(divID);
    currentDivRef.innerHTML = "";
}


// Gestion des boutons de navigation de notes
// Visibilité
function onSetBtnNavNotesVisibility() {
    
    // Bouton note A faire "suivant"
    btnNoteStatus0NextRef.style.visibility = (noteStatus0IndexToStart + maxBtnNoteToDisplay >= notesStatus0Array.length) ? "hidden" : "visible";
    
    // Bouton note A faire "précédent"
    btnNoteStatus0PreviousRef.style.visibility = noteStatus0IndexToStart === 0 ? "hidden" : "visible";

    // Bouton note En cours "suivant"
    btnNoteStatus1NextRef.style.visibility = (noteStatus1IndexToStart + maxBtnNoteToDisplay >= noteStatus1Array.length) ? "hidden" : "visible";
    
    // Bouton note En cours "précédent"
    btnNoteStatus1PreviousRef.style.visibility = noteStatus1IndexToStart === 0 ? "hidden" : "visible";

}


// Navigation dans les boutons de notes
// Notes en cours
function onClickNavNoteStatus1Previous() {
    noteStatus1IndexToStart -= maxBtnNoteToDisplay;
    onSetListNotes("divBtnNoteStatus1",noteStatus1Array,noteStatus1IndexToStart,"pTxtStatus1",statusArray[1].userStatus,statusArray[1].systemStatus);
}

function onClickNavNoteStatus1Next() {
    noteStatus1IndexToStart += maxBtnNoteToDisplay;
    onSetListNotes("divBtnNoteStatus1",noteStatus1Array,noteStatus1IndexToStart,"pTxtStatus1",statusArray[1].userStatus,statusArray[1].systemStatus);
}

// Notes à faire
function onClickNavNoteStatus0Previous() {
    noteStatus0IndexToStart -= maxBtnNoteToDisplay;
    onSetListNotes("divBtnNoteStatus0",notesStatus0Array,noteStatus0IndexToStart,"pTxtStatus0",statusArray[0].userStatus,statusArray[0].systemStatus);
}

function onClickNavNoteStatus0Next() {
    noteStatus0IndexToStart += maxBtnNoteToDisplay;
    onSetListNotes("divBtnNoteStatus0",notesStatus0Array,noteStatus0IndexToStart,"pTxtStatus0",statusArray[0].userStatus,statusArray[0].systemStatus);
}











// ------------------------    Action rapides sur la liste des notes    --------------------------------










// STATUS
function onQuickChangeNoteStatus(keyTarget, newStatusTarget) {
    console.log("Insertion rapide de données! : Changement de statut");

    let transaction = db.transaction(taskStoreName, "readwrite");
    let store = transaction.objectStore(taskStoreName);
    let modifyRequest = store.getAll(IDBKeyRange.only(keyTarget));

    modifyRequest.onsuccess = function (event) {
        let objectToUpdate = event.target.result;


        if (objectToUpdate && objectToUpdate.length > 0) {
            // je m'assure que l'objet à mettre à jour existe
            objectToUpdate = objectToUpdate[0];
            objectToUpdate.status = newStatusTarget;


            let insertQuickModifiedData = store.put(objectToUpdate);

            insertQuickModifiedData.onsuccess = function () {
                console.log("insertQuickModifiedData = success");
            }

            insertQuickModifiedData.onerror = function () {
                console.log("insertQuickModifiedData = error", insertQuickModifiedData.error);
            }
        } else {
            console.log("L'objet à mettre à jour n'a pas été trouvé.");
        }
    }

    modifyRequest.onerror = function () {
        console.log("QuickModifyRequest = error", modifyRequest.error);
    }

    transaction.oncomplete = function () {

        // Remet à jour la page et si la note déplacée est en cours d'affichage, réaffiche la note.
        onUpdatePage(false);
        if (keyTarget === currentKeyNoteInView) {
            // onChangeDisplay(["divNoteView"]); plan B si anomalie avec celui ci dessous
            onSearchNotesToDisplay(currentKeyNoteInView);
        }
        
    }

    transaction.onerror = function () {
        console.log("Transaction error", transaction.error);
    }
}



// PRIORITE


let quickPriorityKeyTarget,// variable pour stocker la key de l'item à modifier
quickCurrentPriority;// variable pour stocker la priorité actuelle de l'item à modifier
// Affiche le choix de priorité pour les actions rapides
function onClickQuickChangePriority(keyTarget,currentPriority){
    document.getElementById("divQuickChangePriority").style.display = "block";

    // Grise les div qui sont visible
    if(document.getElementById("divNoteView").style.display === "block"){
        onChangeDisplay([],[],["divListBtnNote","divBtnNewTask","divNoteView"],[]);
    }else{
        onChangeDisplay([],[],["divListBtnNote","divBtnNewTask"],[]);
    }

    
    
    quickPriorityKeyTarget = keyTarget;// stocke la key pour le changement par la suite
    quickCurrentPriority = currentPriority;
}




function onChangeQuickPriority(newPriorityTarget) {
    // Cache la div de choix de priorité
    document.getElementById("divQuickChangePriority").style.display = "none";

    if (newPriorityTarget === quickCurrentPriority) {
        console.log("La priorité est la meme que la précédente. Aucun enregistrement !");
        // Réactive les div visibles qui étaient grisées
        if(document.getElementById("divNoteView").style.display === "block"){
            onChangeDisplay([],[],[],["divListBtnNote","divBtnNewTask","divNoteView"]);
        }else{
            onChangeDisplay([],[],[],["divListBtnNote","divBtnNewTask"]);
        }
        // Quitte la fonction
        return
    }



    console.log("Insertion rapide de données! : Changement de priorité");

    let transaction = db.transaction(taskStoreName, "readwrite");
    let store = transaction.objectStore(taskStoreName);
    let modifyRequest = store.getAll(IDBKeyRange.only(quickPriorityKeyTarget));

    modifyRequest.onsuccess = function (event) {
        let objectToUpdate = event.target.result;


        if (objectToUpdate && objectToUpdate.length > 0) {
            // je m'assure que l'objet à mettre à jour existe
            objectToUpdate = objectToUpdate[0];
            objectToUpdate.priority = newPriorityTarget;


            let insertQuickModifiedData = store.put(objectToUpdate);

            insertQuickModifiedData.onsuccess = function () {
                console.log("insertQuickModifiedData = success");
            }

            insertQuickModifiedData.onerror = function () {
                console.log("insertQuickModifiedData = error", insertQuickModifiedData.error);
            }
        } else {
            console.log("L'objet à mettre à jour n'a pas été trouvé.");
        }
    }

    modifyRequest.onerror = function () {
        console.log("QuickModifyRequest = error", modifyRequest.error);
    }

    transaction.oncomplete = function () {

        // Réactive les div visibles qui étaient grisées
        if(document.getElementById("divNoteView").style.display === "block"){
            onChangeDisplay([],[],[],["divListBtnNote","divBtnNewTask","divNoteView"]);
        }else{
            onChangeDisplay([],[],[],["divListBtnNote","divBtnNewTask"]);
        }
    


        // Remet à jour la page et si la note déplacée est en cours d'affichage, réaffiche la note.
        onUpdatePage(false);
        if (quickPriorityKeyTarget === currentKeyNoteInView) {
            // onChangeDisplay(["divNoteView"]); plan B si anomalie avec celui ci dessous
            onSearchNotesToDisplay(currentKeyNoteInView);
        }
        
    }

    transaction.onerror = function () {
        console.log("Transaction error", transaction.error);
    }
}







// ----------------------------       EDITION DE  NOTES           -----------------------------------------








// Variabilisation des items

let divNoteEditorRef = document.getElementById("divNoteEditor"),
    divPopupDeleteRef = document.getElementById("divPopupDelete"),
    divPopupTerminerRef = document.getElementById("divPopupTerminer"),
    inputNoteTagRef = document.getElementById("inputNoteTag"),
    inputNoteTitleRef = document.getElementById("inputNoteTitle"),
    inputNoteDateStartRef = document.getElementById("inputNoteDateStart"),
    textareaNoteDetailRef = document.getElementById("textareaNoteDetail"),
    selectorNotePriorityRef = document.getElementById("selectorNotePriority"),
    selectorNoteStatusRef = document.getElementById("selectorNoteStatus"),
    inputNoteDateEndRef = document.getElementById("inputNoteDateEnd"),
    legendNoteEditorRef = document.getElementById("legendNoteEditor"),
    ulNoteEditorStepRef = document.getElementById("ulNoteEditorStep"),
    checkboxDateStartNotifyRef = document.getElementById("checkboxDateStartNotify"),
    checkboxDateEndNotifyRef = document.getElementById("checkboxDateEndNotify"),
    imgCheckboxDateStartNotifyRef = document.getElementById("imgCheckboxDateStartNotify"),
    imgCheckboxDateEndNotifyRef = document.getElementById("imgCheckboxDateEndNotify");


// Generation des options de l'editeur de note


function onSetPriorityOptions() {
    selectorNotePriorityRef.innerHTML = "";
    
    priorityArray.forEach(e=>{
        let newOption = document.createElement("option");
        newOption.value = e.systemPriority;
        newOption.innerHTML =e.userPriority;
        
        selectorNotePriorityRef.appendChild(newOption);
    })

}
onSetPriorityOptions();


function onSetStatusOption() {
    selectorNoteStatusRef.innerHTML = "";

    statusArray.forEach(e=>{
        let newOption = document.createElement("option");
        newOption.value = e.systemStatus;
        newOption.innerHTML =e.userStatus;
        
        selectorNoteStatusRef.appendChild(newOption);
    })    
}
onSetStatusOption();

// Création d'une note
function onCreateNote() {
    // clear l'editeur de note
    onClearNoteEditor();

    // Gestion affichage
    onChangeDisplay(["divNoteView"],["divNoteEditor"],["divListBtnNote","divBtnNewTask"],["divNoteEditor"]);

    onDisplayNoteEditor(true);
}



// Modification d'une note
function onEditNote() {
    // clear l'editeur de note
    onClearNoteEditor();

    // Gestion affichage
    onChangeDisplay(["divNoteView"],["divNoteEditor"],["divListBtnNote","divBtnNewTask"],["divNoteEditor"]);

    onDisplayNoteEditor(false);
}



function onDisplayNoteEditor(boolModeCreation){


    


    // Set le mode d'ouverture de l'editeur de note
    boolEditNoteCreation = boolModeCreation;

    if (boolEditNoteCreation === true) {
        console.log("ouverture de l'editeur en mode création");

        legendNoteEditorRef.innerHTML = "Créer une tâche";
    }else{
        console.log("ouverture de l'editeur en mode Modification");

        legendNoteEditorRef.innerHTML = "Modifier une tâche";
        // Set l'editeur de note avec les éléments de la note en cours
        onSetNoteEditor(currentNoteInView);
    }



}



// Remplit l'éditeur de note lorsqu'il est ouvert en mode "Modification"
function onSetNoteEditor(e) {
    console.log("set l'editeur pour modification");
    inputNoteTagRef.value = e.tag;
    inputNoteTitleRef.value = e.title;
    selectorNoteStatusRef.value = e.status;
    inputNoteDateStartRef.value = e.dateStart.value;
    checkboxDateStartNotifyRef.checked = e.dateStart.notify;
    inputNoteDateEndRef.value = e.dateEnd.value;
    checkboxDateEndNotifyRef.checked = e.dateEnd.notify;
    textareaNoteDetailRef.value = e.detail;
    selectorNotePriorityRef.value = e.priority;

    // Set les images de demande de notification selon l'état des checkbox
    imgCheckboxDateStartNotifyRef.src = checkboxDateStartNotifyRef.checked === true ? "./images/IconeNotifyEnabled.png" : "./images/IconeNotifyDisabled.png";
    imgCheckboxDateEndNotifyRef.src = checkboxDateEndNotifyRef.checked === true ? "./images/IconeNotifyEnabled.png" : "./images/IconeNotifyDisabled.png";


    // Sauvegarde les étapes actuelles dans previousStepArray
    previousStepArray = e.stepArray.map(step => ({...step})); // Utilise .map() pour créer une nouvelle copie de chaque objet étape

    // Transfert les étapes dans tempStepArray pour la gestion
    tempStepArray = e.stepArray.map(step => ({...step})); // Utilise .map() pour créer une nouvelle copie de chaque objet étape

    // set les étapes si il y en a

    if (tempStepArray.length >0 ) {
        onDisplayStep();
    }

}




// Vide l'editeur de note
function onClearNoteEditor() {
    console.log("Clear l'editeur de note");
    inputNoteTagRef.value = "";
    inputNoteTitleRef.value = "";
    textareaNoteDetailRef.value = "";
    inputNoteDateStartRef.value = "";
    inputNoteDateEndRef.value = "";
    selectorNoteStatusRef.value = statusArray[0].systemStatus;
    selectorNotePriorityRef.value = priorityArray[0].systemPriority;
    ulNoteEditorStepRef.innerHTML = "";
    tempStepArray = [];
    checkboxDateStartNotifyRef.checked = false;
    checkboxDateEndNotifyRef.checked = false;
    imgCheckboxDateStartNotifyRef.src = "./images/IconeNotifyDisabled.png";
    imgCheckboxDateEndNotifyRef.src = "./images/IconeNotifyDisabled.png";


};




// Fonction pour ajouter une étape, vérifie d'abord si le nombre maximal d'étapes n'est pas atteint
function onAddStep() {
    if (isMaxStepsReached()) {
        eventUserMessage(arrayUserMessage.stepLimite,"error");
        return; // Arrête la fonction si le nombre maximal d'étapes est atteint
    }

    if (areAllStepsFilled()) {
        const newStep = {
            stepName: '',
            stepHour: 0,
            stepMinutes: 0,
            stepChecked: false
        };
        tempStepArray.push(newStep);
        onDisplayStep();
    } else {
        eventUserMessage(arrayUserMessage.emptyStepField,"error");
    }
}

// Vérification des champs d'étapes remplit
function areAllStepsFilled() {
    for (let step of tempStepArray) {
        if (step.stepName.trim() === '') {
            return false;
        }
    }
    return true;
}

// Fonction pour vérifier si le nombre maximal d'étapes est atteint
function isMaxStepsReached() {
    return tempStepArray.length >= maxStep;
}


// Affiche les étapes
function onDisplayStep() {
    let stepListParentRef = document.getElementById("ulNoteEditorStep");
    stepListParentRef.innerHTML = "";

    tempStepArray.forEach((e, index) => {
        let newLi = document.createElement("li");
        newLi.className = "editorListStep";
        
        // Creation input texte
        let newInput = document.createElement("input");
        newInput.type = "text";
        newInput.value = e.stepName;
        newInput.className ="input-field-step";
        newInput.placeholder ="Nouvelle étape";
        newInput.maxLength = "80";
        newInput.addEventListener('change', (event) => {
            tempStepArray[index].stepName = event.target.value; 
        });
        // Le style si la checkbox est coché ou non lors de l'affichage des étapes
        newInput.style.textDecoration = e.stepChecked === true ? "line-through": "none";



        // Creation input Hour
        let newInputHour = document.createElement("input");
        newInputHour.type = "number";
        newInputHour.value = e.stepHour;
        newInputHour.placeholder = "h";
        newInputHour.className = "inputTime";
        newInputHour.addEventListener('change', (event) => {
            onlimitNumberLength(event.target, 3, 999);
            tempStepArray[index].stepHour = event.target.value;
        });


        // Creation input Minutes
        let newInputMinutes = document.createElement("input");
        newInputMinutes.type = "number";
        newInputMinutes.value = e.stepMinutes;
        newInputMinutes.placeholder = "m";
        newInputMinutes.className = "inputTime";
        newInputMinutes.addEventListener('change', (event) => {
            onlimitNumberLength(event.target, 2, 59);
            tempStepArray[index].stepMinutes = event.target.value;
        });


        // Creation input checkbox
        let newCheckbox = document.createElement("input");
        newCheckbox.type = "checkbox";
        newCheckbox.checked = e.stepChecked;


        // Fonction pour changer la valeur du contenu et l'état coché ou non
        newCheckbox.addEventListener('change', (event) => {
            tempStepArray[index].stepChecked = event.target.checked;
            if (event.target.checked) {
                newInput.style.textDecoration = "line-through";
            } else {
                newInput.style.textDecoration = "none";
            }
        });

        // Les texte minutes et heures de étapes
        let newTextHour = document.createElement("p");
        newTextHour.className = "editorStep";
        newTextHour.innerHTML = "h";
        let newTextMinute = document.createElement("p");
        newTextMinute.className = "editorStep";
        newTextMinute.innerHTML = "m";






        // Creation des boutons
        // Monter
        let btnStepUp = document.createElement("img");
        btnStepUp.className = "IconManageStep";
        btnStepUp.src = "./images/IconStepUp.png";
        btnStepUp.onclick = () => onMoveStep(index, 'up');


        // Descendre
        let btnStepDown = document.createElement("img");
        btnStepDown.className = "IconManageStep";
        btnStepDown.src = "./images/IconStepDown.png";
        btnStepDown.onclick = () => onMoveStep(index, 'down');


        // Supprimer
        let btnDeleteStep = document.createElement("img");
        btnDeleteStep.className = "IconManageStep";
        btnDeleteStep.src = "./images/IconeDelete3.png";
        btnDeleteStep.onclick = () => onDeleteStep(index);


        // Insertions
        newLi.appendChild(newCheckbox);
        newLi.appendChild(newInput);
        newLi.appendChild(newInputHour);
        newLi.appendChild(newTextHour);
        newLi.appendChild(newInputMinutes);
        newLi.appendChild(newTextMinute);
        newLi.appendChild(btnStepUp);
        newLi.appendChild(btnStepDown);
        newLi.appendChild(btnDeleteStep);

        stepListParentRef.appendChild(newLi);
    });
}


// Deplacement d'une étape
function onMoveStep(index, direction) {
    let newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < tempStepArray.length) {
        [tempStepArray[index], tempStepArray[newIndex]] = [tempStepArray[newIndex], tempStepArray[index]];
        onDisplayStep();
    }
}


// Suppression d'une étape
function onDeleteStep(index) {
    tempStepArray.splice(index, 1);
    onDisplayStep();
}


// Click sur le bouton de validation dans l'éditeur de note
function onClickBtnValidNoteEditor() {
    boolSaveAsTemplate = false;// pour que lors de l'enregistrement il ne l'enregistrera pas en tant que template
    
    // Recheche des erreurs dans la note avant validation
    onCheckNoteError();
}






// Detection des erreurs avant formatage

function onCheckNoteError() {
    console.log("Detection des erreurs")

    // detection des champs vides obligatoires
    let isEmptyTitleField = onCheckEmptyField(inputNoteTitleRef.value);
    if (isEmptyTitleField === true) {
        eventUserMessage(arrayUserMessage.emptyTitleField,"error");
    }
    


    // detection des champs vide pour les étapes
    let isStepFieldFilled = areAllStepsFilled();
    if (isStepFieldFilled === false) {
        eventUserMessage(arrayUserMessage.emptyStepField,"error");
    }



    // Detection de mauvaise date
    let isErrorDate = onCheckDateError(inputNoteDateStartRef.value,inputNoteDateEndRef.value);

    if (isEmptyTitleField === true || isErrorDate === true || isStepFieldFilled === false) {
        console.log("au moins une erreur détéctée. Ne valide pas la création/modification de la note");
    }else{
        onFormatNote();
    }
}





// Formatage de la note
function onFormatNote(){
    console.log("Formatage de la nouvelle note");
    // ------ Les dates ------
    let tempDateCreated = onFormatDateToday();
    let tempDateToday = onFormatDateToday();
    let tempDateStart = inputNoteDateStartRef.value;
    let tempDateEnd = inputNoteDateEndRef.value;


    // date début et fin vide : les deux égales date du jour.
    if (tempDateStart === "" && tempDateEnd ==="") {
        tempDateStart = tempDateToday;
        tempDateEnd = tempDateToday;
        console.log("Aucune date de définit : set les deux à date du jour");
    }

    // date début remplit et fin vide : date fin égale date début
    if (tempDateStart !== "" && tempDateEnd ==="") {
        tempDateEnd = tempDateStart;
        console.log("Uniquement date de début remplit : date de fin = date début");
    }


    // date début vide et fin remplit : date début = date fin
    if (tempDateStart === "" && tempDateEnd !=="") {
        tempDateStart = tempDateEnd;
        console.log("Uniquement date de fin remplit :  date début = date fin");
    }







    // ------ ETAPES ------
    let formatedEditorStepArray = [];
    let secureEditorStepArray = [];


    if (tempStepArray.length > 0) {
        // Premiere lettre en majuscule pour les étapes
        tempStepArray.forEach(i=> formatedEditorStepArray.push({stepName:onSetFirstLetterUppercase(i.stepName),stepChecked:i.stepChecked,stepHour:i.stepHour,stepMinutes:i.stepMinutes}));

    }else{console.log("Aucune étape à traiter")};






    // ------ TAG --------
    // traitement champ TAG VIDE et majuscule
    let tempTag = inputNoteTagRef.value ==="" || inputNoteTagRef.value === undefined ? defaultTagValue : inputNoteTagRef.value;
    tempTag = onSetToUppercase(tempTag);



    

    //------ Titre ------
    let tempTitle = onRemoveSpecialCaracter(inputNoteTitleRef.value);//suppression accent
    let upperCaseTitle = onSetToUppercase(tempTitle);//passage en majuscule


    //  -------------   SECURITY  ----------
    userMsgSecureOnce = false;// voir dans Notify (initialise)
    let secureTag = securitySearchForbidenItem(tempTag);
    let secureDetail = securitySearchForbidenItem(textareaNoteDetailRef.value);
    let secureTitle = securitySearchForbidenItem(upperCaseTitle);
    userMsgSecureOnce = false;// voir dans Notify (reset pour la prochaine fois)


    if (formatedEditorStepArray.length > 0) {
        formatedEditorStepArray.forEach(i=> secureEditorStepArray.push({stepName:securitySearchForbidenItem(i.stepName),stepChecked:i.stepChecked,stepHour:i.stepHour,stepMinutes:i.stepMinutes}));
    }

    // Notification des dates
    let isDateStartNotify = checkboxDateStartNotifyRef.checked;
    isDateEndNotify = checkboxDateEndNotifyRef.checked;

    
    // Mise en format variable

    let noteToInsert = {
        tag : secureTag,
        title : secureTitle,
        dateCreated : tempDateCreated,
        dateLastModification : tempDateToday,
        dateStart : {value : tempDateStart, notify : isDateStartNotify},
        dateEnd :  {value : tempDateEnd, notify : isDateEndNotify},
        status : selectorNoteStatusRef.value,
        stepArray : secureEditorStepArray,
        detail : secureDetail,
        priority : selectorNotePriorityRef.value,
    }



    // Sortie de fonction : Détection de note "terminer", de "création" ou de "modification" ou template.

    //  Detection template
    if (boolSaveAsTemplate === true) {
        onInsertTemplate(noteToInsert);

    }else if (selectorNoteStatusRef.value === statusArray[2].systemStatus) {
            // DETECTION d'une note "TERMINER"
        console.log("Note 'Terminer' detecté");
        eventNoteTerminer(noteToInsert,currentKeyNoteInView,false);

    }else if(boolEditNoteCreation === true) {
        // Filtre selon création ou modification des données
        console.log("mode création de note");
        console.log(noteToInsert);
        // Insertion des datas dans la base
        onInsertData(noteToInsert);

    }else{
        onInsertModification(noteToInsert);
        console.log("mode modification de note");
    }



}

// Fonction pour récupérer les valeurs des inputs d'un LI par son ID
function onSearchChildStep(idRef) {
    let liElement = document.getElementById(idRef);

    // Déclaration variables pour stocker les valeurs
    let stepNameValue, checkboxValue, stepHourValue, stepMinutesValue;

 
    // Sélectionne tous les inputs dans la liste
    let childInputs = liElement.querySelectorAll("input");
      
    // Récupérer les valeurs des inputs
    childInputs.forEach(input=> {
        switch(input.name) {
          case 'stepName':
            stepNameValue = input.value;
            break;
          case 'stepHour':
            stepHourValue = input.value;
            break;
          case 'stepMinutes':
            stepMinutesValue = input.value;
            break;
          default:
            // Traitez les autres champs au besoin
            break;
        }

        // Pour le cas particulier du checkbox
        if (input.type === 'checkbox') {
          checkboxValue = input.checked;
        }
    });


    

    return {stepName:stepNameValue,stepChecked:checkboxValue,stepHour:parseInt(stepHourValue),stepMinutes:parseInt(stepMinutesValue)};
  }





// Insertion d'un nouvelle note
function onInsertData(e) {
    let transaction = db.transaction(taskStoreName,"readwrite");
    let store = transaction.objectStore(taskStoreName);

    let insertRequest = store.add(e);

    insertRequest.onsuccess = function () {
        console.log(e.title + "a été ajouté à la base");
        // evenement de notification
        eventUserMessage(arrayUserMessage.taskCreated + e.title,"info");


        // Clear l'editeur de note
        onClearNoteEditor();
    }

    insertRequest.onerror = function(event){
        console.log("Error");
        let errorMsg = event.target.error.toString();
        
        // User message pour titre en doublon
        if (errorMsg.includes("title")) {
            eventUserMessage(arrayUserMessage.errorDoubleTitle,"error");
        }
    }

    transaction.oncomplete = function(){
        console.log("transaction insertData complete");

        onCheckTagExist(e.tag);

    }

}


// Insertion d'une modification de note
function onInsertModification(e) {
    console.log("fonction d'insertion de la donnée modifié");

    let transaction = db.transaction(taskStoreName,"readwrite");
    let store = transaction.objectStore(taskStoreName);
    let modifyRequest = store.getAll(IDBKeyRange.only(currentKeyNoteInView));

    

    modifyRequest.onsuccess = function () {
        console.log("modifyRequest = success");

        let modifiedData = modifyRequest.result[0];

        modifiedData.tag = e.tag;
        modifiedData.dateLastModification = e.dateLastModification;
        modifiedData.dateStart = e.dateStart;
        modifiedData.dateEnd = e.dateEnd;
        modifiedData.detail = e.detail;
        modifiedData.priority = e.priority;
        modifiedData.status = e.status;
        modifiedData.stepArray = e.stepArray;
        modifiedData.title = e.title;

        let insertModifiedData = store.put(modifiedData);

        insertModifiedData.onsuccess = function (){
            console.log("insertModifiedData = success");

        }

        insertModifiedData.onerror = function (){
            console.log("insertModifiedData = error",insertModifiedData.error);

            
        }


    }

    modifyRequest.onerror = function(){
        console.log("ModifyRequest = error");
    }

    transaction.oncomplete = function(){
        console.log("transaction complete");

        // Vérification si nouveau tag de completion
        onCheckTagExist(e.tag);

        // Affiche a nouveau la note qui a été modifié
        console.log("affiche à nouveau la note modifié");
        onSearchNotesToDisplay(currentKeyNoteInView);
        
        // reactive la div principale Cache la div edition
        // Gestion affichage
        onChangeDisplay(["divNoteEditor"],[],[],["divListBtnNote","divBtnNewTask","divNoteView"]);


    }
}


// Annuler une édition de note
function onClickBtnAnnulNoteEditor() {
    // Restaure les étapes précédentes
    tempStepArray = previousStepArray.slice(); // Utilise .slice() pour créer une copie de previousStepArray
    onDisplayStep(); // Met à jour l'affichage des étapes
    onClearNoteEditor(); // Vide l'éditeur de note

    // Si ça vient d'une modification réaffiche le visualiseur de note sinon non.
    if (boolEditNoteCreation === true) {
        // Gestion affichage 
        onChangeDisplay(["divNoteEditor"],[],[],["divListBtnNote","divBtnNewTask"]);
    }else{
        // Gestion affichage 
        onChangeDisplay(["divNoteEditor"],["divNoteView"],[],["divListBtnNote","divBtnNewTask","divNoteView"]);
    }
}




// ------------------------------------------ Afficher notes ---------------------------------









function onSearchNotesToDisplay(keyRef) {
    console.log("Affichage de la note avec la key :  " + keyRef);
    // set la variable qui stocke la key de la note en cours de visualisation

    currentKeyNoteInView = keyRef;

    // recupere les éléments correspondant à la clé recherché et la stoque dans une variable
    console.log("lecture de la Base de Données");
    let transaction = db.transaction(taskStoreName);//readonly
    let objectStore = transaction.objectStore(taskStoreName);
    let request = objectStore.getAll(IDBKeyRange.only(keyRef));
    
    
    request.onsuccess = function (){
        console.log("Requete de recherche réussit");
        console.log(request.result);

        // Affiche la note voulue
        let tempResult = request.result;
        console.log(tempResult[0]);
        onDisplayNote(tempResult[0]);
        // Set le contenu de la note en cours de visualisation dans une variable
        currentNoteInView = tempResult[0];
    };

    request.onerror = function (){
        console.log("Erreur lors de la recherche");
    };

}


// Variabilisation pour l'affichage d'une note

let noteViewTagRef = document.getElementById("noteViewTag"),
    noteViewTitleRef = document.getElementById("noteViewTitle"),
    noteViewPriorityRef = document.getElementById("noteViewPriority"),
    hnoteViewStatusRef = document.getElementById("hnoteViewStatus"),
    divNoteViewDetailRef = document.getElementById("divNoteViewDetail"),
    noteViewDateInfoRef = document.getElementById("noteViewDateInfo"),
    noteViewDateCreatedRef = document.getElementById("noteViewDateCreated"),
    divNoteViewRef = document.getElementById("divNoteView"),
    ulNoteViewStepRef = document.getElementById("ulNoteViewStep");


function onDisplayNote(e) {

    // Vide les élements prédédents
    onClearNoteView();

    // Set les nouveaux élements
    noteViewTagRef.innerHTML = `[ <i> ${e.tag} </i> ]`;
    noteViewTitleRef.innerHTML = e.title;
    noteViewPriorityRef.innerHTML = onConvertPriority(e.priority);
    hnoteViewStatusRef.innerHTML = onConvertStatus(e.status);
    divNoteViewDetailRef.innerHTML = e.detail;

    // Les dates sont affiché en format francais
    let dateCreatedFR = onFormatDateToFr(e.dateCreated);
    let dateStartFR = onFormatDateToFr(e.dateStart.value);
    let dateEndFR = onFormatDateToFr(e.dateEnd.value);
    let dateLastModificationFR = onFormatDateToFr(e.dateLastModification);


    let notificationDateStart = e.dateStart.notify === true ? "&#x1F514;" : ""; // Symbole de la cloche
    notificationDateEnd = e.dateEnd.notify === true ? "&#x1F514;" : ""; // Symbole de la cloche

    noteViewDateInfoRef.innerHTML = `<b>Début : </b> ${dateStartFR} ${notificationDateStart} - - - <b>Fin : </b> ${dateEndFR} ${notificationDateEnd}`;
    noteViewDateCreatedRef.innerHTML = "<b>Note créée le : </b>" + dateCreatedFR + " - - - <b>Modifié le : </b> " + dateLastModificationFR;






    // génération des étapes en visualisation

    // Resultat à atteindre
    // <li>
    //     <label id="labelNoteViewStep6">Etape 6</label>
    //     <input type="checkbox" name="" id="" checked="true" disabled></input>
    // </li>

  

    e.stepArray.forEach(i=>
            {
                // Creation des éléments
                let newLi = document.createElement("li");

                if (i.stepChecked === true) {
                    // Texte rayé
                    newLi.innerHTML = "<del>" + i.stepName + "</del>";
                }else{    
                    newLi.innerHTML = i.stepName;
                }
                
                // Insertion 
                ulNoteViewStepRef.appendChild(newLi);
            }
    )




    // Rend la visionneuse de note visible
    onChangeDisplay([],["divNoteView"],[],["divNoteView"]);

}


// Clear le visualiseur de note
function onClearNoteView() {
    noteViewTagRef.innerHTML = "";
    noteViewTitleRef.innerHTML = "";
    noteViewPriorityRef.innerHTML = "";
    hnoteViewStatusRef.innerHTML = "";
    divNoteViewDetailRef.innerHTML = "";
    ulNoteViewStepRef.innerHTML = "";
    noteViewDateInfoRef.innerHTML = "";
    noteViewDateCreatedRef.innerHTML = "";
}




// --------------------------------------------- SUPPRESSION D'UNE NOTE --------------------------------
















// popup de confirmation
function onClickBtnDeleteNote() {


    // Gestion affichage
    onChangeDisplay([],["divPopupDelete"],["divNoteView","divListBtnNote","divBtnNewTask"],[]);

}

function onValidSuppression(){
    // supprime la note active les pages et cache le popup
    onDeleteNote(currentKeyNoteInView);

    // Gestion affichage
    onChangeDisplay(["divNoteView","divPopupDelete"],[],[],["divListBtnNote","divBtnNewTask"]);

}

function onCancelSuppression() {
 
    // Gestion affichage
    onChangeDisplay(["divPopupDelete"],[],[],["divNoteView","divListBtnNote","divBtnNewTask"]);
}



function onDeleteNote(keyTarget) {
    // recupere les éléments correspondant à la clé recherché et la stoque dans une variable
    console.log("Suppression de la note avec la key : " + keyTarget);
    let transaction = db.transaction(taskStoreName,"readwrite");//transaction en écriture
    let objectStore = transaction.objectStore(taskStoreName);
    let request = objectStore.delete(IDBKeyRange.only(keyTarget));
    
    
    request.onsuccess = function (){
        console.log("Requete de suppression réussit");
        
        onUpdatePage(true);
    };

    request.onerror = function (){
        console.log("Erreur lors de la requete de suppression");
                
    };

    // Clear le visualiseur de note
    onClearNoteView();

    // Cache la visionneuse de note
    divNoteViewRef.style.display = "none";
}





// changement icone activation ou desactivation de notification dans l'éditeur de note

function onChangeNotifyStatus(self,id) {
    let imgRef = document.getElementById(id);

    imgRef.src = self.checked === true ? "./images/IconeNotifyEnabled.png" : "./images/IconeNotifyDisabled.png";
}







// ------------------------------ TERMINER UNE NOTE -  -------------------------------












// Lancement d'une note terminer depuis la detection lorsque l'utilisateur le selectionne dans l'éditeur de note
function eventNoteTerminer(dataToSave,keyToDelete) {
    // Reset les éléments
    document.getElementById("taskDurationHours").value = 0;
    document.getElementById("TaskDurationMinutes").value = 0;

    // Proposition heure
    let pStepTotalTimeInfoRef = document.getElementById("pStepTotalTimeInfo");
        pStepTotalTimeInfoRef.innerHTML = "";

    // Calcul la durée total des étapes pour proposition d'heure et l'affiche pour info
    if (dataToSave.stepArray.length > 0){
        let totalStepMinutes = onCalculTotalStepDuration(dataToSave.stepArray);
        
        pStepTotalTimeInfoRef.innerHTML = ("La durée totale des étapes est de :" + totalStepMinutes.heures + " heures et " + totalStepMinutes.minutes + " minutes");
    }
    

    // Affiche les dates de début et fin en proposition
    let inputConfirmDateStartRef = document.getElementById("inputConfirmDateStart"),
    inputConfirmDateEndRef = document.getElementById("inputConfirmDateEnd");

    inputConfirmDateStartRef.value = dataToSave.dateStart;
    inputConfirmDateEndRef.value = dataToSave.dateEnd;

    // Gestion affichage
    onChangeDisplay([],["divPopupTerminer"],["divNoteEditor"],[]);

    


    // insert la fonction pour la sauvegarde du dashboard et la suppression dans le bouton

    btnValidTerminerRef = document.getElementById("btnValidTerminer");
    btnValidTerminerRef.onclick = function (){
        onTermineNote(dataToSave,keyToDelete,false);
    }
    btnCancelTerminerRef = document.getElementById("btnCancelTerminer");
    btnCancelTerminerRef.onclick = function (){
        onCancelPopupTerminer(false);
    }


}


// Lancement d'une note terminer depuis l'action Rapide
function quickEventNoteTerminer() {
    // Reset les éléments
    document.getElementById("taskDurationHours").value = 0;
    document.getElementById("TaskDurationMinutes").value = 0;



    // Proposition heure
    let pStepTotalTimeInfoRef = document.getElementById("pStepTotalTimeInfo");
        pStepTotalTimeInfoRef.innerHTML = "";

    // Calcul la durée total des étapes pour proposition d'heure et l'affiche pour info
    if (currentNoteInView.stepArray.length > 0){
        let totalStepMinutes = onCalculTotalStepDuration(currentNoteInView.stepArray);
        
        pStepTotalTimeInfoRef.innerHTML = ("La durée totale des étapes est de :" + totalStepMinutes.heures + " heures et " + totalStepMinutes.minutes + " minutes");
    }
    

    // Affiche les dates de début et fin en proposition
    let inputConfirmDateStartRef = document.getElementById("inputConfirmDateStart"),
    inputConfirmDateEndRef = document.getElementById("inputConfirmDateEnd");

    inputConfirmDateStartRef.value = currentNoteInView.dateStart;
    inputConfirmDateEndRef.value = currentNoteInView.dateEnd;

    // Gestion affichage
    onChangeDisplay([],["divPopupTerminer"],["divNoteView","divListBtnNote","divBtnNewTask"],[]);

    // insert la fonction pour la sauvegarde du dashboard et la suppression dans le bouton
    btnValidTerminerRef = document.getElementById("btnValidTerminer");
    btnValidTerminerRef.onclick = function (){
        onTermineNote(currentNoteInView,currentKeyNoteInView,true);
    }
    btnCancelTerminerRef = document.getElementById("btnCancelTerminer");
    btnCancelTerminerRef.onclick = function (){
        onCancelPopupTerminer(true);
    }

}


// Annulation du popup "Terminer"
function onCancelPopupTerminer(isQuickAction) {
    // Gestion affichage
    if(isQuickAction === true){
        onChangeDisplay(["divPopupTerminer"],[],[],["divNoteView","divListBtnNote","divBtnNewTask"]);
    }else{
        onChangeDisplay(["divPopupTerminer"],[],[],["divNoteEditor"]);
    }
    
}




function onTermineNote(data,key,isQuickAction) {


    // Controle des dates pour la cloture
    let finalDateStart = document.getElementById("inputConfirmDateStart").value,
    finalDateEnd = document.getElementById("inputConfirmDateEnd").value;

    let isErrorDate = onCheckDateError(finalDateStart,finalDateEnd);

    if (isErrorDate === true) {
        // Stop l'enregistrement si erreur de date
        return
    }

    // Sauvegarde des infos dans le store dashboard

    console.log("Confirmation de note terminer")
    // Recupere la durée de la tache


    let taskDuration = onConvertDurationToMinutes(document.getElementById("taskDurationHours").value,document.getElementById("TaskDurationMinutes").value);


    // set les éléments qui seront sauvegardés dans un objet.
    let dataToSave = {
        tag : data.tag,
        title : data.title,
        dateStart : finalDateStart,
        dateEnd : finalDateEnd,
        duration : taskDuration,

    }
    console.log(dataToSave);


    // sauvegarde dans le store dashboard
    onInsertDataDashboard(dataToSave,key);


    // Gestion affichage*

    if (isQuickAction === true) {
        onChangeDisplay(["divPopupTerminer","divNoteView"],[],[],["divListBtnNote","divBtnNewTask"]);
    }else{
        onChangeDisplay(["divPopupTerminer","divNoteEditor"],[],[],["divListBtnNote","divBtnNewTask"]);
    }
    

}



// fonction de convertion des heures/minutes en total minutes
function  onConvertDurationToMinutes(inputHourValue,inputMinuteValue) {
    // Récupérer les valeurs heure/minutes des tâches
    const taskDurationHours = parseInt(inputHourValue) || 0;
    const TaskDurationMinutes = parseInt(inputMinuteValue) || 0;

    // Convertir en Minutes
    let totalDurationMinutes;
    totalDurationMinutes = taskDurationHours * 60 + TaskDurationMinutes;

    return totalDurationMinutes;
       
}




// Fonction d'addition des minutes
function onCalculTotalStepDuration(stepDuration) {
    let totalMinutes = 0;

    stepDuration.forEach(e=>{
        let tempMinutes = onConvertDurationToMinutes(e.stepHour,e.stepMinutes);
        totalMinutes += tempMinutes;
    });

    // converti le total des minutes en format heures
    let fullStepHour = onConvertMinutesToHour(totalMinutes);
    return fullStepHour;
}


// Fonction de convertion d'un nombre de minutes en heures completes
function onConvertMinutesToHour(totalMinutes) {
    var heures = Math.floor(totalMinutes / 60);
    var minutes = totalMinutes % 60;
    return { heures: heures, minutes: minutes };
}






// Insertion des data dans le store dashboard

function onInsertDataDashboard(data,keyToDelete) {
    let transaction = db.transaction(dashBoardStoreName,"readwrite");
    let store = transaction.objectStore(dashBoardStoreName);

    let insertRequest = store.add(data);

    insertRequest.onsuccess = function () {
        console.log(data.title + "a été ajouté à la base");
        // evenement de notification
        eventUserMessage(arrayUserMessage.taskDone + data.title,"info");


        // // Clear l'editeur de note
        // onClearNoteEditor();
    }

    insertRequest.onerror = function(){
        console.log("Error", insertRequest.error);
        alert(insertRequest.error);
    }

    transaction.oncomplete = function(){
        console.log("transaction insertData complete");

        console.log("Lancement de la suppression de la note");
        onDeleteNote(keyToDelete);

    }

}