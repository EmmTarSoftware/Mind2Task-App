function onClickPrint() {
    // Récupère le titre de la note
    let printTitle = document.getElementById("noteViewTitle").innerHTML;

    // Récupère le contenu de la div
    const contentToPrint = document.getElementById('printArea').innerHTML;
    console.log(contentToPrint);

    // Creation fenetre et insertion des éléments à imprimer
    let pageToPrint = window.open('', '', 'width=600,height=600');
    pageToPrint.document.open();
    pageToPrint.document.write(`<html><head><title>${printTitle}</title>`);
    // Style
    pageToPrint.document.write('<style>');
    pageToPrint.document.write('table, th, td{width: 800px;text-align: center;}');
    pageToPrint.document.write('tr.viewNoteRowTitle p{padding-top:30px;font-size: 3ch;font-weight: bold;height:100px;}');
    pageToPrint.document.write('tr.tableViewNoteRowDetail div{text-align: left;font-size: 2.2ch;text-align: justify;height:300px;white-space: pre-line;white-space: pre-wrap;}');
    pageToPrint.document.write('tr.tableViewNoteRowStep{height: 500px;vertical-align: top;}');
    pageToPrint.document.write('tr.tableViewNoteRowStep li{text-align: left;}');
    pageToPrint.document.write('</style>');
    // Fin style
    pageToPrint.document.write('</head><body>');
    // Fin du HEAD

    pageToPrint.document.write(contentToPrint);
    pageToPrint.document.write('</body></html>');
    pageToPrint.document.close();
    pageToPrint.print();
    pageToPrint.close();
}



