let notifyTodayArray = [],
    notifyLateArray = [];

function onUpdateNotifyDate(array) {
    // Reset les éléments
    notifyTodayArray = [];
    notifyLateArray = [];

    // Recupere la date du jours
    let currentDate = onFormatDateToday();

    // Notification du jours
    onNotifyDateToday(array,currentDate);
}


// notification du jours
function onNotifyDateToday(array,dateTarget) {
    array.forEach(e => {
        if (e.dateStart.value === dateTarget && e.dateStart.notify === true) {
            notifyTodayArray.push({tag: e.tag, title :e.title});
        }
    });

    console.log("liste des titre à notifier :");
    console.log( notifyTodayArray);




    // Notification date en retard
    onNotifyDateLate(array,dateTarget);
}



// Date en retard
function onNotifyDateLate(array,dateToday) {
    array.forEach(e => {
        if (dateToday > e.dateEnd.value && e.dateEnd.notify === true) {
            notifyLateArray.push({tag: e.tag, title :e.title , date: e.dateEnd.value});
        }
    });

    console.log("liste des titre en retard à notifier :");
    console.log( notifyLateArray);


    // Traitement de l'affichage
    onTraiteNotifyDate();
}




// Traitement des notifications
function onTraiteNotifyDate() {
    // Reference l'icone de notification
    let imgNotifyAvailableRef = document.getElementById("imgNotifyAvailable");



    // Si des notifications sont disponibles, l'icone est visible
    imgNotifyAvailableRef.style.display = (notifyTodayArray.length > 0 || notifyLateArray.length  > 0) ? "inline-block" : "none" ;

}



// Affichage des notifications
function onDisplayNotifyDate(isDisplay) {
    // Reference et reset
    let ulListNotifyTodayRef = document.getElementById("ulListNotifyToday"),
    ulListNotifyLateRef = document.getElementById("ulListNotifyLate");
    ulListNotifyTodayRef.innerHTML = "";
    ulListNotifyLateRef.innerHTML = "";


    if (isDisplay === true) {

        if (notifyTodayArray.length > 0) {
            notifyTodayArray.forEach(e=>{
                let newLi = document.createElement("li");
                newLi.innerHTML = `TAG : ${e.tag}, Titre : ${e.title}`;
                newLi.className = "notifyDate";

                ulListNotifyTodayRef.appendChild(newLi);
            })
        }else{
            ulListNotifyTodayRef.innerHTML = "Aucune notification";
        }
        

        if (notifyLateArray.length > 0) {
            notifyLateArray.forEach(e=>{
                let newLi = document.createElement("li");
                newLi.innerHTML = `TAG : ${e.tag}, Titre : ${e.title}, Date : ${e.date}`;
                newLi.className = "notifyDate";

                ulListNotifyLateRef.appendChild(newLi);
            })
        }else{
            ulListNotifyLateRef.innerHTML = "Aucune notification";
        }
        
    }else{
        ulListNotifyTodayRef.innerHTML = "";
        ulListNotifyLateRef.innerHTML = "";
    }


    document.getElementById("divNotifyAlert").style.display = isDisplay === true ? "block" : "none";

}


// Masquage des notifications