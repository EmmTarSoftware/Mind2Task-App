// Detection des données sensibles
let userMsgSecureOnce = false; //Variable pour ne faire déclencher la notification qu'une seule fois. elle est reset dans NoteSystem

function securitySearchforbiddenItem(e) {
    let secureText = e;

    // Expression régulière pour détecter un numéro de téléphone
    if (isPhoneNumberDisplay === false) {
        let phoneNumberRegex = /(?:(\+33|0)[1-9](?:[\s.-]?(\d{2})){4})/g;

        // Utilisation de la méthode replace pour remplacer chaque chiffre par "X"
        secureText = secureText.replace(phoneNumberRegex, (match) => {
            return match.replace(/\d/g, 'X'); // Remplacer uniquement les chiffres par 'X'
        });

        
    };
    
 
    if (isEmailDisplay === false) {
        // Expresson de detection des emails
        let emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        // Remplacement de l'adresse par "X"
        secureText = secureText.replace(emailRegex, match => 'X'.repeat(match.length));
        
    };
    

    if (!isWebLinkDisplay === false) {
        // Expresson de detection des liens web
        let urlRegex = /(https?:\/\/[^\s]+)/g;
        // Remplacement du lien par "X"
        secureText = secureText.replace(urlRegex, match => 'X'.repeat(match.length));
        

    };
    


    if (!isAdressIPDisplay === false) {
        // Expresson de detection des liens web adresses IP (IPv4 et IPv6)
        let ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b|\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g;
        // Remplacement des ip par "X"
        secureText = secureText.replace(ipRegex, match => 'X'.repeat(match.length));
        
 
    };
    

    // Comparaison pour savoir si il y a eu des modifications pour afficher un user message
    if (e != secureText && userMsgSecureOnce === false) {
        onDetectforbiddenItem();
        userMsgSecureOnce = true;
    };


    return secureText;
};

function onDetectforbiddenItem() {
    eventUserMessage(arrayUserMessage.forbiddenItem,"warning");
};