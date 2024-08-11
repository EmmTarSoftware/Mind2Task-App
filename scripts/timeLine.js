
// Variables
let timelineData = [
    {title:"Title JAN 1",month:"JAN",color:"orange", comment : "blablablablabla JAN 1"},
    {title:"Title JAN 2",month:"JAN",color:"grey", comment : "blablablablabla JAN 2"},
    {title:"Title FEB",month:"FEB",color:"yellow", comment : "blablablablabla Title FEB"},
    {title:"Title MAR",month:"MAR",color:"yellow", comment : "blablablablabla Title MAR"},
    {title:"Title APR",month:"APR",color:"orange", comment : "blablablablabla Title APR"},
    {title:"FEB MINARM BNR (Phase 1)",month:"MAY",color:"#32cd1d", comment : "blablablablabla FEB MINARM B"},
    {title:"Title JUN",month:"JUN",color:"green", comment : "blablablablabla Title JUN"},
    {title:"Title JUL ",month:"JUL",color:"brown", comment : "blablablablabla Title JUL"},
    {title:"Title AUG 1",month:"AUG",color:"orange", comment : "blablablablabla Title AUG 1"},
    {title:"Title AUG 2",month:"AUG",color:"orange", comment : "blablablablabla Title AUG 2"},
    {title:"Title SEP",month:"SEP",color:"blue", comment : "blablablablabla Title SEP"},
    {title:"Title OCT",month:"OCT",color:"orange", comment : "blablablablabla Title OCT"},
    {title:"Title NOV 1",month:"NOV",color:"orange", comment : "blablablablabla Title NOV 1"},
    {title:"Title NOV 2",month:"NOV",color:"red", comment : "blablablablabla Title NOV 2"},
    {title:"Title DEC 1",month:"DEC",color:"orange", comment : "blablablablabla Title DEC 1"},
    {title:"Title DEC 2",month:"DEC",color:"blue", comment : "blablablablabla Title DEC 2"}

];

let defaultTimelineColor = "#ffffff", //Couleur par défaut
divEditionTimelineRef, 
legendEditionTimelineRef,
inputEditionTimelineTitleRef,
selectEditionTimelineMonthRef,
inputEditionTimelineColorRef,
textareaEditionTimeLineRef;








// --------------------------------     Ouverture menu timeline     ---------------------------------



function onOpenTimelineMenu() {
    // Referencement
    onReferenceTimelineItems();

    // affichage
    onUpdateTimeLinePage()
}



// Referencement
function onReferenceTimelineItems() {
    legendEditionTimelineRef = document.getElementById("legendCreationNote");
    inputEditionTimelineTitleRef = document.getElementById("timelineTitle");
    selectEditionTimelineMonthRef = document.getElementById("timelineMonth");
    inputEditionTimelineColorRef = document.getElementById("inputColorTimeline");
    textareaEditionTimeLineRef = document.getElementById("textareaTimelineComment");
    divEditionTimelineRef = document.getElementById("divEditionTimeline");

    console.log(" [ TIMELINES ] referencement des items");
}








// UPDATE TIMELINE PAGE
function onUpdateTimeLinePage(){
    // Reset et remplit
    onResetTimelineUL();


    // Prend le tableau et remplit les mois
    timelineData.forEach(e=>{
        onSetULTimelineMonth(e.month,e.color,e.title);
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
function onSetULTimelineMonth(month,color,data) {
    // Creation 
    let newBtn = document.createElement("button");
    newBtn.className = color;
    newBtn.style = "background-color: " + color;
    newBtn.innerHTML = data;
    
    
    // Filtre sur le bon parent selon le mois et Insertion dans le parent
    let monthRef = "timelineULParent" + month;

    document.getElementById(monthRef).appendChild(newBtn);

}






// ---------------------------------- CREATION /MODIFICATION TIMELINE -----------------------------------------------------



// Affichage du menu
function onEditTimeline(isNew, idTarget) {
    
    // Reset les éléments
    onClearTimelineEditionItems();

    // Affiche la legende selon
    legendEditionTimelineRef.innerHTML = isNew === true ? "Créer une échéance" : "Modifier une échéance";

    if (isNew === true) {
        
    }


}




// Remet les paramètres par défaut dans l'éditeur de timeline
function onClearTimelineEditionItems() {
    inputEditionTimelineTitleRef.value = "";
    selectEditionTimelineMonthRef.value = "JAN";
    inputEditionTimelineColorRef.value = defaultTimelineColor;
    textareaEditionTimeLineRef.value = "";

}




// Validation création

function onCheckErrorTimelineBeforeValidation() {
    
}