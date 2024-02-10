
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
    }

    requestDashboard.error = function (){
        console.log("Erreur de requête sur la base");
    }

    transaction.oncomplete = function (){
        let arrayResult = requestDashboard.result;

        // Lorsque j'ai récupéré les données dans la base
        // Je l'insère en input de la fonction ci-dessous
        countTasksByMonth(arrayResult);
        
        // en meme temps SET les éléments divers du dashboard
        onSetDiversDashboardItem(arrayResult.length);
    }
}







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
        }
    });

    // Trouve le mois avec le plus de tâches (mois de référence pour les 100%)
    const maxTasksMonth = Object.keys(dataByMonth).reduce((a, b) => dataByMonth[a].tasks > dataByMonth[b].tasks ? a : b);

    // Trouve le mois avec le plus d'heures (mois de référence pour les 100%)
    const maxHoursMonth = Object.keys(dataByMonth).reduce((a, b) => dataByMonth[a].totalDuration > dataByMonth[b].totalDuration ? a : b);

    console.log("valeur de dataByMonth");
    console.log(dataByMonth);

    // Génération du résultat
    // Utilise le mois de référence ayant le max de tache ou d'heure pour calculer le pourcentage
    onGenerateStatisticResult(dataByMonth[maxTasksMonth].tasks, dataByMonth[maxHoursMonth].totalDuration,dataByMonth);

}





function onCalculDashboardPercent(referenceValue, currentItemValue) {
    return (currentItemValue / referenceValue) * 100;
}





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
        newDivPBTaskCount.className = "dashboard-progress-count";
        newDivPBTaskCount.id = `${month}-Taskcount`;
        newDivPBTaskCount.innerHTML = taskCount === highTasksNumberValue ? `<strong>${taskCount} tâches </strong>` : `${taskCount} tâches`;


        // Convertion des minutes en format heure/minutes pour un meilleur affichage
        let friendlyDurationDisplay = onConvertMinutesToHour(hourCount);

        // Nbre hours
        let newDivPBHourCount = document.createElement("div");
        newDivPBHourCount.className = "dashboard-progress-count";
        newDivPBHourCount.id = `${month}-Hourcount`;
        newDivPBHourCount.innerHTML = hourCount === highTaskHourValue ? `<strong>${friendlyDurationDisplay.heures}h${friendlyDurationDisplay.minutes}</strong>` : `${friendlyDurationDisplay.heures}h${friendlyDurationDisplay.minutes}`;

        // Mois
        let newDivPBTaskMonth = document.createElement("div");
        newDivPBTaskMonth.className = "progress-label";
        if (hourCount === highTaskHourValue || taskCount === highTasksNumberValue) {
            newDivPBTaskMonth.innerHTML = `<strong>${monthDisplay}</strong>`;
        } else {
            newDivPBTaskMonth.innerHTML = monthDisplay;
        }

        // Les insertions:
        newDivColumn.appendChild(newDivPBZone);
        newDivColumn.appendChild(newDivPBTaskMonth);
        newDivColumn.appendChild(newDivPBTaskCount);
        newDivColumn.appendChild(newDivPBHourCount);

        document.getElementById("divStatisticContainer").appendChild(newDivColumn);
    }
}



// set les éléments du dashboard

function onSetDiversDashboardItem(taskStatus2Length) {
    let pdashboardStatus0Ref = document.getElementById("pDashboardStatus0"),
    pdashboardStatus1Ref = document.getElementById("pDashboardStatus1"),
    pdashboardStatus2Ref = document.getElementById("pDashboardStatus2");


    pdashboardStatus0Ref.innerHTML = `Tâche ${statusArray[0].userStatus} : ${notesStatus0Array.length}`;
    pdashboardStatus1Ref.innerHTML = `Tâche ${statusArray[1].userStatus} : ${noteStatus1Array.length}`;
    pdashboardStatus2Ref.innerHTML = `Tâche ${statusArray[2].userStatus} : ${taskStatus2Length}`;

}


// Reset dashboard

function onClearDashboard() {
    console.log("vide le dashboard");

    document.getElementById("pDashboardStatus0").innerHTML = "";
    document.getElementById("pDashboardStatus1").innerHTML = "";
    document.getElementById("pDashboardStatus2").innerHTML = "";

    document.getElementById("divStatisticContainer").innerHTML = "";
}