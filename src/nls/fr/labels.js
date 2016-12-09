/*global define*/
define(function () {
    'use strict';
    return {
        //Generic
        "confirmDataRemove": "Voulez-vous supprimer toutes les données?",
        "success": "Succès",
        "resourceNew": "Ressource créée",
        "resourceSaved": "Ressource enregistrée",
        "resourceDeleted": "Ressource supprimée",
        "resourceLoaded": "Ressource chargée",
        "resourceCopied": "Ressource copiée",
		
		"alreadyLoading" : "Veuillez patienter pendant le téléchargement de la ressource...",

        // Errors
        "error": "Erreur",
        "errorMetaMinimum": "Veuillez remplir l'ensemble minimale de métadonnées dans les sections \"Identification\" et \"Contacts\"",
        "errorParsingJson": "Erreur d'analyse du fichier Json, veuillez vérifier la structure et essayer de nouveau",

        "errorLoadinResource": "Erreur de chargement de la ressource",
        "errorSavingResource": "Erreur d'enregistrement de la ressource",

        "overwriteExistingDSD": "Cette opération écrasera le DSD sur lequel vous êtes en train de travailler, voulez-vous continuer?",
        "unsavedWarning": "Certaines modifications n'ont pas été enregistrées, voulez-vous continuer sans enregistrer?",

        "downloadDSD": "Téléchargez le DSD",
        "uploadDSD": "Uploadez le DSD",

        //Data Editor
        "invalidData": "Les données ne sont pas valables",
        "nullDSDCols": "Le DSD n'a pas de colonnes",
        "nullCsvCols": "Le CSV n'a pas de colonnes",
        "wrongColumnCount": "Le décompte des colonnes dans le CSV doit correspondre à celui du DSD",
        "wrongColumnId": "Les noms des colonnes dans le CSV doivent correspondre aux IDs dans le DSD",
        "unknownCodes": "Des codes n'ont pas été trouvés dans la codeliste",
        "DataMatchColumn": "Veuillez faire correspondre les colonnes du DSD avec celles du CSV",
        "DataDuplicateFound": "Des valeurs dupliquées ont été trouvées, voulez-vous conserver les valeurs anciennes ou les remplacer par les nouvelles?",
        "btnDataMergeKeepNew": "Remplacer par les valeurs nouvelles",
        "btnDataMergeKeepOld": "Conserver les valeurs anciennes",
        "btnDataMergeCancel": "Annuler",
        "DataEditorMainContainer": "Chargement en cours...",
        "DataDeleteAll": "Supprimer tous",
        "DatalblUpload": "Télécharger le CSV",
        "DatalblSeparator": "Séparateur du CSV",
        "DatalblcsvSeparatorSemi": "Point-virgule",
        "DatalblcsvSeparatorComma": "Virgule",
        "csvLoaded": "Ficher CSV chargé",


        //DataValidator
        "unknownCode": "Code inconnu",
        "invalidYear": "Année invalide",
        "invalidMonth": "Mois invalide",
        "invalidDate": "Date invalide",
        "invalidNumber": "Nombre invalide",
        "invalidBool": "Valeur booléenne invalide",

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
        "btnClose" : "Fermer",
        "btnCsvMatcherOk": "OK",
        "btnCsvMatcherCancel": "Annuler",
        "btnHome": "Accueil",
        "btnDeleteUndo": "Annuler",
        "btnDeleteConfirm": "Confirmer",
        "dataEditEnd": "Enregistrer",
        //2.0
        "btnSave" : "Enregistrer",
        "btnUpdateResource" : "Actualiser la ressource",


        //Headers
        "DManHeader": "Gestion des Données FENIX",
        "DManResHeader": "Éditer la Ressource",
        "MetaHeader": "Éditeur des Métadonnées",
        "MetaCopyHeader": "Copier les métadonnées à partir de:",
        "MetaCopyAlt": "Copier les métadonnées",
        "DSDHeader": "Éditeur de la Définition de la Structure des Données",
        "DataHeader": "Éditeur des Données",
        "CloseHeader": "Ressource fermée",
        "DeleteHeader": "Voulez-vous supprimer la ressource?",


        //Descriptions
        "DManIntro": "La gestion des données est le processus de contrôle des informations générées lors d'un projet de recherche. Toutes les recherches nécessiteront d'un certain niveau de gestion des données, et les organismes de financement sont de plus en plus exigeant que les chercheurs planifient et exécutent des bonnes pratiques de gestion des données.",
        "CopyMetaRID": "Code d'identification de la Ressource",
        "CopyMetaVer": "Version de la Ressource (le cas échéant)",
        "NoTitle": "Sans Titre",
        "CopyDSD" : "Copier le DSD à partir de:",
        "CopyDSDAlt" : "Copier le DSD",

        metadataValidationWarning : "Veuillez remplir les champs obligatoires",

        //DSD
        DSD_COPY_SUCCESS : "DSD copié avec succès",
        DSD_COPY_EMPTY_RESOURCE : "La ressource ne contient pas de colonnes",
        DSD_MINIMUM: "Au moins une colonne est nécessaire pour enregistrer le DSD",

        //Metadata
        METADATA_COPY_EMPTY_RESOURCE : "Ressource introuvable",
        METADATA_COPY_SUCCESS : "Métadonnées copiées avec succès",

        //DATA
        CSVSEPARATOR : "Veuillez sélectionner un séparateur du CSV"
    }
});
