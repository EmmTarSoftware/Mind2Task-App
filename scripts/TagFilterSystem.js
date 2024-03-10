

let allTagList = [];
    genericTAG = "TOUTES LES TACHES";





let currentTagFilter = genericTAG;

// Recupère les TAG existants uniquement pour les status0 et status1 ("en cours" et "a faire" );
function onListTAG(arrayResult) {
    // Reset allTagList
    allTagList = [];

    let dataToFilter = arrayResult.filter(item=>{
        return item.status === statusArray[0].systemStatus || item.status === statusArray[1].systemStatus;
    });


    let tempTagList = [];

    dataToFilter.forEach(e => {
        
        if (!tempTagList.includes(e.tag)) {
            tempTagList.push(e.tag);
        };
        
    });



    onUpdateTagList(tempTagList,arrayResult);
};




// Met à jour mon tableau de TAG
function onUpdateTagList(tempTagList,arrayResult) {


    // Traitement des tag à ajouter
    console.log(" [TAG-FILTER] traitement des TAG à ajouter");
    tempTagList.forEach(e=>{
        if (!allTagList.includes(e)) {
            allTagList.push(e);
            console.log(" [TAG-FILTER] J'ajoute = " + e);
        }
    });

    // Traitement des tag à retirer
    console.log(" [TAG-FILTER] traitement des TAG à retirer");
    allTagList.forEach(e=>{
        if (!tempTagList.includes(e)) {
            // Recupère l'index de l'indésirable
            let indexToDelete = allTagList.indexOf(e);
            console.log(" [TAG-FILTER] index a supprimer = " + indexToDelete);
            // Retrait de l'indésirable
            allTagList.splice(indexToDelete,1);
            console.log(" [TAG-FILTER] Je retire = " + e);
        };
    });


    // Ajoute le TAG 'Toutes les taches' au début de l'array si n'existe pas
    // si generic tag existe et qu'il n'est pas en premier le retire et le met premier


    if (!allTagList.includes(genericTAG)) {
        allTagList.unshift(genericTAG);
    };

    // Fonction pour avoir un trie personnalisé et laissé "TOUTE LES TACHES" en premier
    function customSort(a, b) {

        const textePersonnalise = genericTAG;
      
        if (a === textePersonnalise) {
          return -1; // texte personnalisé en premier
        } else if (b === textePersonnalise) {
          return 1; // texte personnalisé en premier
        } else {
            //Pour le reste, comparaison normale   
          return a.localeCompare(b);
        };
    };
      
    allTagList.sort(customSort);



    // Filtre pour voir si le filtre sur le tag en cours existe toujours
    let isCurrentTagIsValid = allTagList.includes(currentTagFilter);
    console.log("[TAG-FILTER] valeur de currentTagFilter = " + currentTagFilter );

    if (isCurrentTagIsValid === true) {
        console.log(" [TAG-FILTER] le tag en cours existe toujours");
    }else{
        console.log(" [TAG-FILTER] le tag en cours n'existe plus = réinitialisation");
        currentTagFilter = genericTAG;
    };



    onSetSelectTagList(allTagList,arrayResult);
};




// Creation d'une option dans le selecteur pour chaque TAG
let selectTagFilterRef = document.getElementById("selectTagFilter");
function onSetSelectTagList(TagToAdd,arrayResult) {
    // Vide le selecteur
    selectTagFilterRef.innerHTML ="";


    // Set les nouveaux tag
    TagToAdd.forEach(e=>{
        let newOption = document.createElement("option");
        newOption.value = e;
        newOption.innerHTML = e;

        selectTagFilterRef.appendChild(newOption);
    });

    // set la valeur du tag actuel
    selectTagFilterRef.value = currentTagFilter;


    onSortItem(arrayResult);
};



// Changement du filtre via action de l'utilisateur
function onSelectorTagChange(){
    console.log("changement de selecteur pour = " + selectTagFilterRef.value);
    currentTagFilter = selectTagFilterRef.value;
    onUpdatePage(false);
};







// ------------------------------------  RECHERCHE -------------------------------------








let inputSearchTextRef = document.getElementById("inputSearchText");//Input de recherche de notes


inputSearchTextRef.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      onUpdatePage(false);
    };
});