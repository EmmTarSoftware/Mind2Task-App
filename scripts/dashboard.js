// Ouverture de dashboard
function onOpenDashboard() {
    console.log("Génération du dashboard");

    // recupere les éléments dans la base et les stock dans une grosse variable temporaire
    
    let transaction = db.transaction([dashBoardStoreName]);//readonly
    let objectStoreTask = transaction.objectStore(dashBoardStoreName);
    let indexStoreDashboard = objectStoreTask.index("tag");
    let requestDashboard = indexStoreDashboard.getAll();

    requestDashboard.onsuccess = function (){
        console.log("Les éléments ont été récupérés dans le dashboard");
        console.log("stockage dans le tableau temporaire");
    };

    requestDashboard.error = function (){
        console.log("Erreur de requête sur la base");
    };

    transaction.oncomplete = function (){
        let arrayResult = requestDashboard.result;

        // Lorsque j'ai récupéré les données dans la base
        // Je l'insère en input de la fonction ci-dessous
        countTasksByMonth(arrayResult);
        
        // en meme temps SET les éléments divers du dashboard
        onSetDiversDashboardItem(arrayResult.length);


        // En meme temps calcul la tache la plus longue
        onSetMaxTaskDuration(arrayResult);
    };
};







// Fonction qui calcule le nombre de tâche et l'heure totale par mois
function countTasksByMonth(tasks) {
    // Initialise le tableau de mois
    const monthNames = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];

    // Initialise le tableau de résultat si ce n'est pas déjà fait
    let  dataByMonth = {
            september: { display:"Sept.", tasks: 0, totalDuration: 0 },
            october: { display:"Oct.", tasks: 0, totalDuration: 0 },
            november: { display:"Nov.", tasks: 0, totalDuration: 0 },
            december: { display:"Dec.", tasks: 0, totalDuration: 0 },
            january: { display:"Jan.", tasks: 0, totalDuration: 0 },
            february: { display:"Fev.", tasks: 0, totalDuration: 0 },
            march: { display:"Mar.", tasks: 0, totalDuration: 0 },
            april: { display:"Avril", tasks: 0, totalDuration: 0 },
            may: { display:"Mai", tasks: 0, totalDuration: 0 },
            june: { display:"Juin", tasks: 0, totalDuration: 0 },
            july: { display:"Juil.", tasks: 0, totalDuration: 0 },
            august: { display:"Aout", tasks: 0, totalDuration: 0 }
        };

    // Traitement (classe le nombre de tâche et d'heures par mois)
    tasks.forEach(task => {
        let dateObject = new Date(task.dateEnd);
        let month = dateObject.getMonth() + 1; // Les mois dans JavaScript sont de 0 à 11
        let monthName = monthNames[month - 1]; // Ajuster pour l'index 0

        let duration = task.duration || 0;

        if (!dataByMonth[monthName]) {
            dataByMonth[monthName] = { tasks: 1, totalDuration: duration };
        } else {
            dataByMonth[monthName].tasks++;
            dataByMonth[monthName].totalDuration += duration;
        };
    });

    // Trouve le mois avec le plus de tâches (mois de référence pour les 100%)
    const maxTasksMonth = Object.keys(dataByMonth).reduce((a, b) => dataByMonth[a].tasks > dataByMonth[b].tasks ? a : b);

    // Trouve le mois avec le plus d'heures (mois de référence pour les 100%)
    const maxHoursMonth = Object.keys(dataByMonth).reduce((a, b) => dataByMonth[a].totalDuration > dataByMonth[b].totalDuration ? a : b);


    // Génération du résultat
    // Utilise le mois de référence ayant le max de tache ou d'heure pour calculer le pourcentage
    onGenerateStatisticResult(dataByMonth[maxTasksMonth].tasks, dataByMonth[maxHoursMonth].totalDuration,dataByMonth);

};





function onCalculDashboardPercent(referenceValue, currentItemValue) {
    return (currentItemValue / referenceValue) * 100;
};





// Génération du tableau de statistiques
function onGenerateStatisticResult(highTasksNumberValue, highTaskHourValue,dataByMonth) {
    // Vide la div avant remplissage
    document.getElementById("divStatisticContainer").innerHTML = "";


    for (const month in dataByMonth) {
        let taskCount = dataByMonth[month].tasks,
            hourCount = dataByMonth[month].totalDuration,
            monthDisplay = dataByMonth[month].display;

        // La colonne
        let newDivColumn = document.createElement("div");
        newDivColumn.className = "month-column";

        // la zone des progress bars
        let newDivPBZone = document.createElement("div");
        newDivPBZone.className = "Dashboard-Progress-bars";

        // progress bar Nbre tâche
        let newDivPBTaskNumberEXT = document.createElement("div");
        newDivPBTaskNumberEXT.className = "Dashboard-Progress-bar";
        newDivPBTaskNumberEXT.id = `${month}-TaskCountProgress`;

        let newDivPBTaskNumberINT = document.createElement("div");
        newDivPBTaskNumberINT.className = "dashboard-TaskCount-Progress-fill";
        newDivPBTaskNumberINT.style.height = onCalculDashboardPercent(highTasksNumberValue, taskCount) + '%';

        newDivPBTaskNumberEXT.appendChild(newDivPBTaskNumberINT);

        // progress bar Nbre d'heure
        let newDivPBTaskHourEXT = document.createElement("div");
        newDivPBTaskHourEXT.className = "Dashboard-Progress-bar";
        newDivPBTaskHourEXT.id = `${month}-HourCountProgress`;

        let newDivPBTaskHourINT = document.createElement("div");
        newDivPBTaskHourINT.className = "dashboard-TaskDuration-Progress-fill";
        newDivPBTaskHourINT.style.height = onCalculDashboardPercent(highTaskHourValue, hourCount) + '%';

        newDivPBTaskHourEXT.appendChild(newDivPBTaskHourINT);

        // insertion dans la zone progress bar
        newDivPBZone.appendChild(newDivPBTaskNumberEXT);
        newDivPBZone.appendChild(newDivPBTaskHourEXT);

        // Les textes
        // Les mois avec les valeurs plafond et les taches ou heure avec les valeurs plafonds sont en gras

        // Nbre tâches
        let newDivPBTaskCount = document.createElement("div");
        newDivPBTaskCount.className = taskCount === highTasksNumberValue ? "dashboard-progress-count-high" : "dashboard-progress-count";
        newDivPBTaskCount.id = `${month}-Taskcount`;
        newDivPBTaskCount.innerHTML = `${taskCount} tâches`;


        // Convertion des minutes en format heure/minutes pour un meilleur affichage
        let friendlyDurationDisplay = onConvertMinutesToHour(hourCount);
        // Gestion des doubles digits
        if (friendlyDurationDisplay.minutes < 10) {
            friendlyDurationDisplay.minutes = "0" + friendlyDurationDisplay.minutes;
        }


        // Nbre hours
        let newDivPBHourCount = document.createElement("div");
        newDivPBHourCount.className = hourCount === highTaskHourValue ? "dashboard-progress-hour-high" : "dashboard-progress-count";
        newDivPBHourCount.id = `${month}-Hourcount`;
        newDivPBHourCount.innerHTML = `${friendlyDurationDisplay.heures}h${friendlyDurationDisplay.minutes}`;

        // Mois
        let newDivPBTaskMonth = document.createElement("div");
        newDivPBTaskMonth.className = "progress-label";
        if (hourCount === highTaskHourValue || taskCount === highTasksNumberValue) {
            newDivPBTaskMonth.innerHTML = `<strong>${monthDisplay}</strong>`;
        } else {
            newDivPBTaskMonth.innerHTML = monthDisplay;
        };

        // Les insertions:
        newDivColumn.appendChild(newDivPBZone);
        newDivColumn.appendChild(newDivPBTaskMonth);
        newDivColumn.appendChild(newDivPBTaskCount);
        newDivColumn.appendChild(newDivPBHourCount);

        document.getElementById("divStatisticContainer").appendChild(newDivColumn);
    };
};



// set les éléments du dashboard

function onSetDiversDashboardItem(taskStatus2Length) {
    let pdashboardStatus0Ref = document.getElementById("pDashboardStatus0"),
    pdashboardStatus1Ref = document.getElementById("pDashboardStatus1"),
    pdashboardStatus2Ref = document.getElementById("pDashboardStatus2");


    pdashboardStatus0Ref.innerHTML = `Tâches <strong>'${statusArray[0].userStatus}' : </strong> ${nbreTaskStatus0}`;
    pdashboardStatus1Ref.innerHTML = `Tâches <strong>'${statusArray[1].userStatus}' : </strong>${nbreTaskStatus1}`;
    pdashboardStatus2Ref.innerHTML = `Tâches <strong>'${statusArray[2].userStatus}' : </strong>${taskStatus2Length}`;


};


// Fonction pour la tâche la plus longue

function onSetMaxTaskDuration(dashboardArray) {
    // Étape 1 : Trouver la durée maximale
    let maxDuration = Math.max(...dashboardArray.map(item => item.duration));

    // Étape 2 : Filtrer les éléments avec la durée maximale
    let elementsMaxDuration = dashboardArray.filter(item => item.duration === maxDuration);

    
    // Set la durée maximale
    let durationToHour = onConvertMinutesToHour(maxDuration);

    // Converti format minute en texte
    let textMinutes = onConvertMinutesToText(durationToHour.minutes);

    document.getElementById("pDashboardMaxDuration").innerHTML = `<strong> Tâche(s) ayant la plus longue durée  (${durationToHour.heures}.${textMinutes} heures) : </strong>`;

    // remplit la liste :
    let ulDashboardMaxDuration = document.getElementById("ulDashboardMaxTaskList");
    ulDashboardMaxDuration.innerHTML = "";

    if (elementsMaxDuration.length > 0) {
        elementsMaxDuration.forEach(e=>{
            let newLi = document.createElement("li");
    
            newLi.innerHTML = `${e.title} `;
    
            ulDashboardMaxDuration.appendChild(newLi);
        });
    }else{
        ulDashboardMaxDuration.innerHTML = "Aucun élément à afficher.";
    };
    
    

    // Lance les TOP3
    topTagsByDuration(dashboardArray);
    topTagsByTaskCount(dashboardArray);

};

// TOP 3

// CATEGORIE par durée
function topTagsByDuration(dashboardData) {
    // Reference le parent pour le résultat
    let olTop3TAGDuration = document.getElementById("olTop3TAGDuration");

    let tagDurationMap = {};
    
    // Agréger les durées par tag
    dashboardData.forEach(task => {
        if (!tagDurationMap[task.tag]) {
            tagDurationMap[task.tag] = 0;
        };
        tagDurationMap[task.tag] += task.duration;
    });

    // Trier les tags par durée décroissante
    let sortedTags = Object.keys(tagDurationMap).sort((a, b) => tagDurationMap[b] - tagDurationMap[a]);

    // Récupérer les 3 premiers tags avec leur durée
    let topTags = sortedTags.slice(0, 3).map(tag => ({ tag: tag, duration: tagDurationMap[tag] }));

    // Set le resultat dans le html
    topTags.forEach(e=>{

        // Converti la duré
        let convertedDuration = onConvertMinutesToHour(e.duration);

        // Converti format minute en texte
        let textMinutes = onConvertMinutesToText(convertedDuration.minutes);

        let newLi = document.createElement("li");

        newLi.innerHTML = `<strong> ${e.tag} : </strong> ${convertedDuration.heures}.${textMinutes} heures.`;

        olTop3TAGDuration.appendChild(newLi);
    });

};

// Convertion de l'affichage des minutes en texte user avec zero devant si besoin
function onConvertMinutesToText(e) {
    return e>=10 ? e : '0' + e;
};



// CATEGORIE par Nbre de tâches
function topTagsByTaskCount(dashboardData) {

    // Reference le parent pour le résultat
    let olTop3TAGNbre = document.getElementById("olTop3TAGNbre");

    let tagTaskCountMap = {};

    // Compter le nombre de tâches par tag
    dashboardData.forEach(task => {
        if (!tagTaskCountMap[task.tag]) {
            tagTaskCountMap[task.tag] = 0;
        }
        tagTaskCountMap[task.tag]++;
    });

    // Trier les tags par nombre de tâches décroissant
    let sortedTags = Object.keys(tagTaskCountMap).sort((a, b) => tagTaskCountMap[b] - tagTaskCountMap[a]);

    // Récupérer les 3 premiers tags avec leur nombre de tâches
    let topTags = sortedTags.slice(0, 3).map(tag => ({ tag: tag, taskCount: tagTaskCountMap[tag] }));


    // Set le resultat dans le html
    topTags.forEach(e=>{

        let newLi = document.createElement("li");

        newLi.innerHTML = `<strong> ${e.tag} : </strong>${e.taskCount} tâches.`;

        olTop3TAGNbre.appendChild(newLi);
    });

    
};




// Compte les tâches par status

let nbreTaskStatus0 = 0,
nbreTaskStatus1 = 0;


function onCountTaskByStatus(array) {
    nbreTaskStatus0 = onCountTask(array,statusArray[0].systemStatus);
    nbreTaskStatus1 = onCountTask(array,statusArray[1].systemStatus);
};


// Compteur de taches
function onCountTask(array, statusTarget) {
    let compteur = 0;

    array.forEach(e => {
        if (e.status === statusTarget) {
            compteur++;
        }
    });

    return compteur;
};








// Reset dashboard

function onClearDashboard() {
    console.log("vide le dashboard");

    document.getElementById("pDashboardStatus0").innerHTML = "";
    document.getElementById("pDashboardStatus1").innerHTML = "";
    document.getElementById("pDashboardStatus2").innerHTML = "";

    document.getElementById("divStatisticContainer").innerHTML = "";
    document.getElementById("ulDashboardMaxTaskList").innerHTML = "";
    document.getElementById("pDashboardMaxDuration").innerHTML = "";
    document.getElementById("olTop3TAGDuration").innerHTML = "";
    document.getElementById("olTop3TAGNbre").innerHTML = "";
};






// --------------------------------------------- Cloture de session ------------------------------------------------




// Demande de cloture
function onClickClotureSession() {
    // Affiche popup et grise le reste
    onChangeDisplay([],["divPopupCloture"],["divDashboardContent"],[]);

};





// Annulation de la cloture
function onCancelClotureSession() {
    // Affiche popup et grise le reste
    onChangeDisplay(["divPopupCloture"],[],[],["divDashboardContent"]);
};




// Validation de la cloture
function onValidClotureSession() {
    // recupere les éléments dans la base et les stock dans une grosse variable temporaire
    
    let transaction = db.transaction([dashBoardStoreName]);//readonly
    let objectStoreTask = transaction.objectStore(dashBoardStoreName);
    let indexStoreDashboard = objectStoreTask.index("tag");
    let requestDashboard = indexStoreDashboard.getAll();

    requestDashboard.onsuccess = function (){
        console.log("Les éléments ont été récupérés dans le dashboard");
        console.log("stockage dans le tableau temporaire");
    };

    requestDashboard.error = function (){
        console.log("Erreur de requête sur la base");
    };

    transaction.oncomplete = function (){
        let arrayResult = requestDashboard.result;


        // filtre si il y a des données ou non
        if (arrayResult.length > 0) {
            // Recupere les session de dates
            let sessionDates =  onFindSessionDate(arrayResult);
            // export le dashboard
            exportDashboardSession(sessionDates);
        }else{
            eventUserMessage(arrayUserMessage.dasboardEmpty,"error");
        };

        
    };
};


function onFindSessionDate(dashboardArray) {
        // Convertir les dates de chaînes de caractères en objets Date
        dashboardArray.forEach(objet => {
            objet.dateStart = new Date(objet.dateStart);
        });
    
        // Récupérer la date la plus ancienne
        let olderDate = dashboardArray.reduce((minDate, objet) => {
            if (objet.dateStart < minDate) {
                return objet.dateStart;
            } else {
                return minDate;
            }
        }, dashboardArray[0].dateStart);
    
        // Récupérer la date la plus récente
        let lastDate = dashboardArray.reduce((maxDate, objet) => {
            if (objet.dateStart > maxDate) {
                return objet.dateStart;
            } else {
                return maxDate;
            }
        }, dashboardArray[0].dateStart);
    
        // Formatage des dates en format dd-mm-yyyy
        function formatDateSessionFR(date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
        
    
        return {
            olderDate: formatDateSessionFR(olderDate),
            lastDate: formatDateSessionFR(lastDate)
        };
};
    


// export de la session 
function exportDashboardSession(sessionDates) {
    console.log("Demande d'export data");
    var transaction = db.transaction([dashBoardStoreName], 'readonly');
    var store = transaction.objectStore(dashBoardStoreName);

    var exportRequest = store.getAll();

    exportRequest.onsuccess = function() {
        var data = exportRequest.result;
        downloadJSON(data, `Mind2Task_Session_du_${sessionDates.olderDate}_au_${sessionDates.lastDate}.json`);
        eventUserMessage("La session a été exportée !","info");
        // Vide le dashboard
        onClearDashboardStore();
    };

    exportRequest.onerror = function(error) {
        console.log('Erreur lors de l\'export des données : ', error);
    };

    transaction.oncomplete = function (){
        

    };

};




// Vide la base de donnée du dashboard

function onClearDashboardStore() {
    let transaction = db.transaction([dashBoardStoreName],'readwrite');
    let objectStore = transaction.objectStore(dashBoardStoreName);

    objectStore.clear();


    transaction.oncomplete = function (){
        console.log("Le dashboard a été vidé avec succès.");
        eventUserMessage("Le dashboard a été réinitialisé avec succès.","info");

        // Reset l'affichage
        // Affiche popup et grise le reste
        onChangeDisplay(["divPopupCloture"],[],[],["divDashboardContent"]);

        // Regénère le dashboard
        onOpenDashboard();
    };

    // Gérer les erreurs éventuelles
    transaction.onerror = function(event) {
        console.error("Erreur lors de la tentative de vidage du store :", event.target.error);
    };
};