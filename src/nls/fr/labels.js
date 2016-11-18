/*global define*/
define(function () {
    'use strict';
    return {
        //Generic
        "confirmDataRemove": "Voulez-vous supprimer toutes les données?",
        "success": "Réussite",
        "resourceNew": "Ressource Créée",
        "resourceSaved": "Ressource enregistrée",
        "resourceDeleted": "Ressource supprimée",
        "resourceLoaded": "Ressource chargée",
        "resourceCopied": "Ressource copiée",

        // Errors
        "error": "Erreur",
        "errorMetaMinimum": "Remplissez l'ensemble minimale de métadonnées dans les sections \"Identification\" et \"Contacts\"",
        "errorParsingJson": "Erreur d'analyse du fichier Json, vérifiez la structure et essayez de nouveau",

        "errorLoadinResource": "Erreur de chargement de la ressource",
        "errorSavingResource": "Erreur de sauvegarde de la ressource",

        "overwriteExistingDSD": "Cette opération écrasera le DSD sur lequel vous travaillez, voulez-vous continuer?",
        "unsavedWarning": "Certaines modifications ne sont pas enregistrées changes are not saved, voulez-vous continuer sans enregistrer?",

        "downloadDSD": "Téléchargez le DSD",
        "uploadDSD": "Uploadez le DSD",

        //Data Editor
        "invalidData": "Les données ne sont pas valides",
        "nullDSDCols": "Le DSD n'a pas de colonnes",
        "nullCsvCols": "Le CSV n'a pas de colonnes",
        "wrongColumnCount": "Le nombre des colonnes dans le CSV doit correspondre à celui du DSD",
        "wrongColumnId": "Les noms des colonnes dans le CSV doivent correspondre aux IDs dans le DSD",
        "unknownCodes": "Des codes n'ont pas été trouvés dans la codeliste",
        "DataMatchColumn": "Faites correspondre les colonnes du DSD avec celles du CSV",
        "DataDuplicateFound": "Des valeurs dupliquées ont été trouvées, voulez-vous conserver les vieilles valeurs ou les remplacer avec les nouvelles?",
        "btnDataMergeKeepNew": "Remplacer avec les nouvelles valeurs",
        "btnDataMergeKeepOld": "Conserver les vieilles valeurs",
        "btnDataMergeCancel": "Annulez",
        "DataEditorMainContainer": "Chargement en cours...",
        "DataDeleteAll": "Supprimez tous",
        "DatalblUpload": "Téléchargez",
        "DatalblSeparator": "Séparateur du CSV",
        "DatalblcsvSeparatorSemi": "Point-virgule",
        "DatalblcsvSeparatorComma": "Virgule",
        "csvLoaded": "CSV chargée",


        //DataValidator
        "unknownCode": "Code inconnu",
        "invalidYear": "Année non valide",
        "invalidMonth": "Mois non valide",
        "invalidDate": "Date non valide",
        "invalidNumber": "Nombre non valide",
        "invalidBool": "Valeur booléenne non valide",

        //Buttons
        "btnSearch": "RECHERCHER",
        "btnAdd": "AJOUTER",
        "btnMetadata": "MÉTADONNÉES",
        "btnDSD": "DSD",
        "btnData": "DONNÉES",
        "btnSaveMeta": "Enregistrer",
        "btnCopyMeta": "Copier les métadonnées",
        "btnLoadMeta": "Charger",
        "btnSaveDSD": "Enregistrer",
        "btnClose" : "Annuler",
        "btnCsvMatcherOk": "OK",
        "btnCsvMatcherCancel": "Annuler",
        "btnHome": "Accueil",
        "btnDeleteUndo": "Annuler",
        "btnDeleteConfirm": "Confirmer",
        "dataEditEnd": "Enregistrer",
        //2.0
        "btnSave" : "Enregistrer",


        //Headers
        "DManHeader": "Gestion des Données FENIX",
        "DManResHeader": "Éditer la Ressource",
        "MetaHeader": "Éditeur des Métadonnées",
        "MetaCopyHeader": "Copier les métadonnées d'une ressource",
        "DSDHeader": "Éditeur de la Définition de la Structure des Données",
        "DataHeader": "Éditeur des Données",
        "CloseHeader": "Ressource fermée",
        "DeleteHeader": "Voulez-vous supprimer la ressource?",


        //Descriptions
        "DManIntro": "La gestion des données est le processus de contrôle des informations générées lors d'un projet de recherche. Toutes les recherches nécessiteront d'un certain niveau de gestion des données, et les organismes de financement sont de plus en plus exigeant que les chercheurs planifient et exécutent des bonnes pratiques de gestion des données.",
        "CopyMetaRID": "Code d'identification de la Ressource",
        "CopyMetaVer": "Version de la Ressource (si applicable)",
        "NoTitle": "Sans Titre",

        metadataValidationWarning : "Veuillez remplir les champs obligatoires",

        //DSD
        DSD_COPY_SUCCESS : "DSD copié avec succès",
        DSD_COPY_EMPTY_RESOURCE : "Ressource ne contient pas de colonnes",

        //Metadata
        METADATA_COPY_EMPTY_RESOURCE : "Ressource introuvable",
        METADATA_COPY_SUCCESS : "Métadonnées copiées avec succès"
    }
});
