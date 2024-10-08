// La date du jour pour l'export
let exportDate;

// Les boolean de l'export
let isSaveTask = false,
isSaveTAG = false,
isSaveDashboard = false,
isSaveTemplate = false,
isSaveTimeline = false;





// Sauvegarde de la base de donnée


function exportData() {
    // Set la date du jour
    exportDate = onFormatDateToday();


    // Si les tâches ne sont pas cochées, passe au suivant.
    if (isSaveTask === false) {
        exportDataTAG();
        return
    };

    console.log("Demande d'export data");
    var transaction = db.transaction([taskStoreName], 'readonly');
    var store = transaction.objectStore(taskStoreName);

    var exportRequest = store.getAll();

    exportRequest.onsuccess = function() {
        var data = exportRequest.result;
        downloadJSON(data, `Mind2Task_${exportDate}_exported_Taches.json`);
    };

    exportRequest.onerror = function(error) {
        console.log('Erreur lors de l\'export des données : ', error);
    };

    transaction.oncomplete = function(){
        exportDataTAG();
    };



};



function exportDataTAG() {


    // Si les TAG ne sont pas cochées, passe au suivant.
    if (isSaveTAG === false) {
        exportDataDashboard();
        return
    };

    console.log("Demande d'export data");

    var transaction = db.transaction([tagStoreName], 'readonly');
    var store = transaction.objectStore(tagStoreName);

    var exportRequest = store.getAll();

    exportRequest.onsuccess = function() {
        var data = exportRequest.result;
        downloadJSON(data, `Mind2Task_${exportDate}_exported_TAG.json`);
    };

    exportRequest.onerror = function(error) {
        console.log('Erreur lors de l\'export des données : ', error);
    };


    transaction.oncomplete = function(){
        exportDataDashboard();
    };
        

};


function exportDataDashboard() {

    // Si le DASHBOARD n'est pas cochées, passe au suivant.
    if (isSaveDashboard === false) {
        exportDataTemplate();
        return
    };
    

    console.log("Demande d'export data");
    var transaction = db.transaction([dashBoardStoreName], 'readonly');
    var store = transaction.objectStore(dashBoardStoreName);

    var exportRequest = store.getAll();

    exportRequest.onsuccess = function() {
        var data = exportRequest.result;
        downloadJSON(data, `Mind2Task_${exportDate}_exported_Statistiques.json`);
    };

    exportRequest.onerror = function(error) {
        console.log('Erreur lors de l\'export des données : ', error);
    };

    transaction.oncomplete = function (){
        exportDataTemplate();
    };

};


function exportDataTemplate() {

    // Si le TEMPLATE n'est pas cochées, passe au suivant.
    if (isSaveTemplate === false) {
        exportDataTimeline();
        return
    };


    console.log("Demande d'export data");
    var transaction = db.transaction([templateStoreName], 'readonly');
    var store = transaction.objectStore(templateStoreName);

    var exportRequest = store.getAll();

    exportRequest.onsuccess = function() {
        var data = exportRequest.result;
        downloadJSON(data, `Mind2Task_${exportDate}_exported_Modeles.json`);
    };

    exportRequest.onerror = function(error) {
        console.log('Erreur lors de l\'export des données : ', error);
    };

    transaction.oncomplete = function (){
        exportDataTimeline();
    };

};



function exportDataTimeline() {


    // Si TIMELINE n'est pas cochées, passe au suivant.
    if (isSaveTimeline === false) {

        return
    };

    console.log("Demande d'export data");
    var transaction = db.transaction([timelineStoreName], 'readonly');
    var store = transaction.objectStore(timelineStoreName);

    var exportRequest = store.getAll();

    exportRequest.onsuccess = function() {
        var data = exportRequest.result;
        downloadJSON(data, `Mind2Task_${exportDate}_exported_Echeances.json`);
    };

    exportRequest.onerror = function(error) {
        console.log('Erreur lors de l\'export des données : ', error);
    };

};



//Fonction de téléchargement
function downloadJSON(data, filename) {
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: 'application/json' });

    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};






//  ----------------------------------------------- Import data - ------------------------------------------

 // Fonction d'importation depuis JSON
function importTask(inputRef,storeRef,pResultRef) {
    const fileInput = document.getElementById(inputRef,storeRef);
    let textResultRef = document.getElementById(pResultRef);

    if (fileInput.files.length > 0) {
        const selectedFile = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const jsonData = JSON.parse(e.target.result);

                const transaction = db.transaction([storeRef], 'readwrite');
                const objectStore = transaction.objectStore(storeRef);

                // Supprimer les anciennes données
                const clearRequest = objectStore.clear();

                clearRequest.onsuccess = function () {
                    // Ajouter les nouvelles données
                    jsonData.forEach(function (item) {
                        objectStore.add(item);
                    });

                    transaction.oncomplete = function () {
                        console.log('Imported JSON to IndexedDB successfully.');                        };
                        textResultRef.innerHTML =  "Import Réussit";
                    transaction.onerror = function (error) {
                        console.error('Error adding items to IndexedDB:', error);
                        textResultRef.innerHTML =  "Erreur transaction import";
                    };
                };
               
            } catch (error) {
                console.error('Error parsing JSON:', error);
                textResultRef.innerHTML =  "Erreur import";
            };
        };

        reader.readAsText(selectedFile);
    } else {
        console.error('No file selected.');
        textResultRef.innerHTML =  "Aucun fichier selectionné !";
    };
};