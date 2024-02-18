let arrayTemplate = [],
    maxTemplate = 10;


// Promese pour récupérer les templates dans la base
function onFindTemplateInDB() {
    return new Promise((resolve, reject) => {
        console.log("[ TEMPLATE ] reset arrayTemplate");
        arrayTemplate = [];

        let transaction = db.transaction(templateStoreName);
        let objectStoreTask = transaction.objectStore(templateStoreName);
        let indexStoreTask = objectStoreTask.index("title");
        let requestTask = indexStoreTask.getAll();

        requestTask.onsuccess = function () {
            console.log("[ TEMPLATE ] les éléments ont été récupérés dans la base");
            console.log(" [ TEMPLATE ] stockage dans le tableau temporaire");
        }

        requestTask.onerror = function () {
            reject(new Error("Erreur de requête sur la base"));
        }

        transaction.oncomplete = function () {
            let tempArrayTemplate = requestTask.result;

            if (tempArrayTemplate.length > 0) {
                tempArrayTemplate.forEach(e => {
                    arrayTemplate.push({ key: e.key, title: e.title });
                });
                console.log("[ TEMPLATE ] templates existants");
                resolve(true);
            } else {
                console.log("[ TEMPLATE ] Aucun template");
                resolve(false);
            }
        }
    });
}








// ------------------------------------------- DANS LE MENU ACCUEIL --------------------------------








// Traitement des templates lors de l'actualisation de la page principale
function onUpdateTemplateToHome() {
    onFindTemplateInDB()
        .then(isTemplateExist => {
            document.getElementById("btnNewFromTemplete").style.display = isTemplateExist ? "inline-block" : "none";


        })
        .catch(error => {
            console.error("Une erreur s'est produite : ", error);
        });
}






// Clique sur le bouton de "nouveau depuis template"
function onClickSelectTemplate() {


        // Gestion affichage
        onChangeDisplay(["divNoteView"],["divChoiceTemplate"],["divListBtnNote","divBtnNewTask"],[]);
        
        // Remplissage des options du selecteur de template

        let selectorTemplateRef = document.getElementById("selectTemplate");
        selectorTemplateRef.innerHTML = "";

        // Creation et insertion des options de template
        console.log("[ TEMPLATE ] génération de la liste des templates");
        console.log(arrayTemplate);

        arrayTemplate.forEach(e=>{
            let newOption = document.createElement("option");
            newOption.value = e.key;
            newOption.innerHTML = e.title;

            selectorTemplateRef.appendChild(newOption);
        })
   
    
}


function onReturnFromChoiceTemplate() {
    // Gestion affichage
    onChangeDisplay(["divChoiceTemplate"],[],[],["divListBtnNote","divBtnNewTask"]);
    

}





// Choix du template
function onChooseTemplate() {
    // Recupére la clé du template selectioné
    console.log("[ TEMPLATE ] clé sélectionné : " + document.getElementById("selectTemplate").value)

    let templateKeyValue = parseInt(document.getElementById("selectTemplate").value);

    // Génération du template
    onDisplayNoteEditorFromTemplate(templateKeyValue);

    onChangeDisplay(["divChoiceTemplate"],[],[],[]);
}




// Génération du template
function onDisplayNoteEditorFromTemplate(keyRef){

    // clear l'editeur de note
    onClearNoteEditor();

    // Gestion affichage
    onChangeDisplay(["divNoteView"],["divNoteEditor"],["divListBtnNote","divBtnNewTask"],["divNoteEditor"]);


    
    // Set le mode d'ouverture de l'editeur de note
    boolEditNoteCreation = true;

    legendNoteEditorRef.innerHTML = "Créer depuis un template";



    // ICI, récupérer les données du template dans la base
    // Puis l'inserer dans onSetNoteEditor
    // recupere les éléments correspondant à la clé recherché et la stoque dans une variable
    console.log("lecture de la Base de Données");
    let transaction = db.transaction(templateStoreName);//readonly
    let objectStore = transaction.objectStore(templateStoreName);
    let request = objectStore.getAll(IDBKeyRange.only(keyRef));
    
    
    request.onsuccess = function (){
        console.log("Requete de recherche de template réussit");
        console.log(request.result);

       
        let tempResult = request.result;
        console.log(tempResult[0]);
        // Set l'editeur de note avec les éléments du template
        onSetNoteEditor(tempResult[0]);
    };

    request.onerror = function (){
        console.log("Erreur lors de la recherche");
    };


}



// sauvegarde en tant que template

function onClickSaveAsTemplate() {
    if (!(arrayTemplate.length >= maxTemplate)) {
        boolSaveAsTemplate = true;
        // Recheche des erreurs dans la note avant validation
        onCheckNoteError();//dans NoteSystem.js
    }else{
        eventUserMessage(`${arrayUserMessage.templateLimite} (${maxTemplate})`);
    }   
}




// filtre pour savoir si c'est un template à créé ou à modifier
function onInsertTemplate(e) {
    let templateType = onFindTemplateTitle(e.title);

    if (templateType.modified === true) {
        onInsertModifiedTemplate(e,templateType.key);
    }else{
        onInsertNewTemplate(e);
    }

}

// fonction de recherche de titre dans le tableau de template
function onFindTemplateTitle(titleTarget) {

     for (let i = 0; i < arrayTemplate.length; i++) {
        if (arrayTemplate[i].title === titleTarget) {
            return { modified: true, key: arrayTemplate[i].key };
        }
    }
    return { modified: false, key: null };
}






// Insertion d'un nouveau template
function onInsertNewTemplate(e) {
    let transaction = db.transaction(templateStoreName,"readwrite");
    let store = transaction.objectStore(templateStoreName);

    // Retrait des date de début et de fin dans le template
    // Insert le mot "TEMPLATE " dans le titre
    e.dateEnd = "";
    e.dateStart = "";
    e.title = "[ TEMPLATE ] " + e.title;

    
    let insertRequest = store.add(e);

    insertRequest.onsuccess = function () {
        console.log(e.title + "a été ajouté à la au template");
        // evenement de notification
        eventUserMessage(arrayUserMessage.templateCreated + e.title);


        // Clear l'editeur de note
        onClearNoteEditor();
    }

    insertRequest.onerror = function(){
        console.log("Error", insertRequest.error);
        alert(insertRequest.error);
    }

    transaction.oncomplete = function(){
        console.log("transaction insert Template complete");
        // reactive la div principale Cache la div edition
        // Gestion affichage
        onChangeDisplay(["divNoteEditor"],[],[],["divListBtnNote","divBtnNewTask","divNoteView"]);
        onUpdatePage(false);

    }
}



// Insertion d'un template modifié
function onInsertModifiedTemplate(e,keyTarget) {
    console.log("[ TEMPLATE ] fonction d'insertion de la donnée modifié");

    let transaction = db.transaction(templateStoreName,"readwrite");
    let store = transaction.objectStore(templateStoreName);
    let modifyRequest = store.getAll(IDBKeyRange.only(keyTarget));

    

    modifyRequest.onsuccess = function () {
        console.log("[ TEMPLATE ] modifyRequest = success");

        let modifiedData = modifyRequest.result[0];

        modifiedData.tag = e.tag;
        modifiedData.dateLastModification = e.dateLastModification;
        modifiedData.dateStart = "";
        modifiedData.dateEnd = "";
        modifiedData.detail = e.detail;
        modifiedData.priority = e.priority;
        modifiedData.status = e.status;
        modifiedData.stepArray = e.stepArray;
        modifiedData.title = e.title;

        let insertModifiedData = store.put(modifiedData);

        insertModifiedData.onsuccess = function (){
            console.log("[ TEMPLATE ] insertModifiedTemplate = success");

            console.log("[ TEMPLATE ] " + e.title + "a été Modifié.");
            // evenement de notification
            eventUserMessage(arrayUserMessage.templateModified + e.title);


            // Clear l'editeur de note
            onClearNoteEditor();

        }

        insertModifiedData.onerror = function (){
            console.log("insertModifiedData = error",insertModifiedData.error);

            
        }


    }

    modifyRequest.onerror = function(){
        console.log("[ TEMPLATE ] ModifyRequest = error");
    }

    transaction.oncomplete = function(){
        console.log("[ TEMPLATE ] transaction insert Template complete");
        // reactive la div principale Cache la div edition
        // Gestion affichage
        onChangeDisplay(["divNoteEditor"],[],[],["divListBtnNote","divBtnNewTask","divNoteView"]);
        onUpdatePage(false);

    }
}


// -------------------------------------------  GESTIONNAIRE DE TEMPLATE -------------------------------------------







// Actualisation des template dans la page de gestion des template
function onUpdateTemplateFromManager() {
    // Gestion de l'affichage
    onChangeDisplay(["divRenameTemplate","divPopupDeleteTemplate"],["divGestionTemplateList"],[],["divGestionTemplateList","divPopupDeleteTemplate","divRenameTemplate"]);

    // Reset la liste
    document.getElementById("divGestionTemplateList").innerHTML ="";


    // Recherche les templates dans la base et affiche en conséquence
    onFindTemplateInDB()
        .then(isTemplateExist => {

            // Si des template existent, lance la fonction de remplissage de la liste
            if (isTemplateExist === true) {
                onSetTemplateManagerList();
            }else{
                // Si aucun template
                document.getElementById("divGestionTemplateList").innerHTML = arrayUserMessage.templateListEmpty;
            }

        })
        .catch(error => {
            console.error("Une erreur s'est produite : ", error);
        });
}






// Fonction de génération de la liste des templates dans le gestionnaire de template
function onSetTemplateManagerList() {
    console.log("[ TEMPLATE ] Remplissage de la liste");
    arrayTemplate.forEach(e=>{

        // Container
        let newMainDiv = document.createElement("div");
        newMainDiv.className = "listBtnTemplateLine";

        // Titre
        let newpTitle = document.createElement("p");
        newpTitle.innerHTML = e.title;
        newpTitle.className = "gestionTemplateTitle";

        // Renommer
        let newBtnRename = document.createElement("img");
        newBtnRename.className= "iconQuickChange";
        newBtnRename.src ="./images/IconeRename.png";
        newBtnRename.onclick = function (){
            onDisplayRenameTemplate(e.title,e.key);
        }

        // Supprimer
        let newBtnDelete = document.createElement("img");
        newBtnDelete.className = "iconQuickChange";
        newBtnDelete.src ="./images/IconeDelete3.png";
        newBtnDelete.onclick = function (){
            onClickDeleteTemplate(e.title,e.key);
        }


        // Insertion

        newMainDiv.appendChild(newpTitle);
        newMainDiv.appendChild(newBtnRename);
        newMainDiv.appendChild(newBtnDelete);

        document.getElementById("divGestionTemplateList").appendChild(newMainDiv);

    })
}



// ------------------------ renommage  --------------------


function onDisplayRenameTemplate(templateTitle,templateKey) {
    // Affiche la div
    onChangeDisplay([],["divRenameTemplate"],["divGestionTemplateList"],[]);


    // Remplit déjà le titre actuel
    document.getElementById("inputRenameTemplateTitle").value = templateTitle;



    // Set la fonction dans le bouton de validation du renommage
    document.getElementById("btnValidRenameTemplate").onclick = function (){
        onValidRenameTemplate(templateKey);
    }

}



// Validation du renommage du template
function onValidRenameTemplate(templateKeyRef) {
    console.log("[ TEMPLATE ] renommage de la key : " + templateKeyRef);
    
    
    console.log("[ TEMPLATE ]Lancement de l'enregistrement changement de nom");

    let transaction = db.transaction(templateStoreName, "readwrite");
    let store = transaction.objectStore(templateStoreName);
    let modifyRequest = store.getAll(IDBKeyRange.only(templateKeyRef));

    modifyRequest.onsuccess = function (event) {
        let templateTitleToUpdate = event.target.result;


        if (templateTitleToUpdate && templateTitleToUpdate.length > 0) {
            // je m'assure que l'objet à mettre à jour existe
            templateTitleToUpdate = templateTitleToUpdate[0];
            templateTitleToUpdate.title = document.getElementById("inputRenameTemplateTitle").value;


            let insertQuickModifiedData = store.put(templateTitleToUpdate);

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

        // Remet à jour la page 
        onUpdateTemplateFromManager();

    }

    transaction.onerror = function () {
        console.log("Transaction error", transaction.error);
    }


}

// Annule le renommage
function onCancelTemplateRename(){
    // Cache le popup de renommage
    onChangeDisplay(["divRenameTemplate"],[],[],["divGestionTemplateList"]);
}


//-------------------------- suppression -----------------------

function onClickDeleteTemplate(templateToDeleteTitle,templateKeyToDelete) {

    // Affiche la div
    onChangeDisplay([],["divPopupDeleteTemplate"],["divGestionTemplateList"],[]);

    // Set le texte du template a supprimer

    document.getElementById("pTemplateToDeleteTitle").innerHTML = templateToDeleteTitle;


    // Set la key du template ciblé dans la fonction
    document.getElementById("btnValidTemplateSuppression").onclick = function () {
        onValidSuprTemplate(templateKeyToDelete);
    }

}



function onValidSuprTemplate(templateKeyToDelete) {
    // recupere les éléments correspondant à la clé recherché et la stoque dans une variable
    console.log("[ TEMPLATE ] Suppression  du template avec la key : " + templateKeyToDelete);
    let transaction = db.transaction(templateStoreName,"readwrite");//transaction en écriture
    let objectStore = transaction.objectStore(templateStoreName);
    let request = objectStore.delete(IDBKeyRange.only(templateKeyToDelete));
    
    
    request.onsuccess = function (){
        console.log("Requete de suppression réussit");
        
        // Remet à jour la page 
        onUpdateTemplateFromManager()
    };

    request.onerror = function (){
        console.log("Erreur lors de la requete de suppression");
                
    };

}


function onCancelTemplateSuppresion() {
        // Cache le popup de confirmation
        onChangeDisplay(["divPopupDeleteTemplate"],[],[],["divGestionTemplateList"]);
}









// Ouverture et fermeture du menu template depuis le menu principal
function onOpenMenuTemplate() {
    onUpdateTemplateFromManager()
}

function onQuitMenuTemplate() {
    document.getElementById("divGestionTemplateList").innerHTML ="";
}




