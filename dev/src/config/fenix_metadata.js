define(
    function () {

        var IANA = {uid: 'IANAcharacterSet'},
            Role = [
                {"value": "owner", "label": "Propriétaire"},
                {"value": "distributor", "label": "Distributeur"},
                {"value": "producer", "label": "Producteur"},
                {"value": "other", "label": "Autre"}
            ],
            GAUL = {uid: 'GAUL0', version: "2014"},
            Languages = {uid: 'ISO639-2', version: "1998"},
            PeriodOfReference = {uid: 'FAO_Period', version: "1.0"},
            TypeOfCollection = {uid: 'FAOSTAT_Collection', version: "1.0"},
            OriginOfCollectedData = {uid: 'FAOSTAT_OriginData', version: "1.0"},
            DataAdjustment = {uid: 'CL_ADJUSTMENT', version: "1.1"},
            StatusConfidenciality = {uid: 'CL_CONF_STATUS', version: "1.0"},
            AreaOfReference = {uid: 'GAUL_ReferenceArea', version: "1.0"},
            DisseminationPeriodicy = {uid: 'FAO_Period', version: "1.0"},
            PeriodicityDataCollection = {uid: 'FAO_Period', version: "1.0"},
            UpdatePeriodicity = {uid: 'FAO_Period', version: "1.0"},
            CoverageSectorDetails = {uid: 'CSTAT_Core'},
            CoverageSector = {uid: 'CSTAT_Core'}; // CSTAT_Core

        /*
         {
         "eng": "English",
         "fre": "French",
         "por": "Portuguese",
         "spa": "Spanish",
         "ara": "Arabic"
         }
         */

        return {

            "template": {
                "title": "Identification",
                "description": "Métadonnées de Base"
            },

            "selectors": {
                "title": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [
                            {
                                "value": "title",
                                "label": "Titre"
                            }
                        ]
                    },
                    "template": {
                        "title": "Titre",
                        "description": "Etiquette textuelle utilisée comme titre de la ressource.",

                    },
                    "format": {
                        "output": "label"
                    },
                    "constraints": {"presence": true}

                },

                "creationDate": {
                    "selector": {
                        "id": "time"
                    },
                    "template": {
                        "title": "Date de Création",
                        "description": "Date de création de la ressource.",

                    },
                    "format": {
                        "output": "date"
                    },
                    "constraints": {"presence": true}
                },
                "characterSet": {

                    "cl": IANA,

                    "selector": {
                        "id": "dropdown",
                        "default": ['106']
                    },

                    "template": {
                        "title": "Jeu de caractères",
                        "description": "Nom complet de la norme de codage de caractères utilisée par la ressource.",

                    },
                    "format": {
                        "output": "codes"
                    },

                    "constraints": {"presence": true}
                },
                "language": {
                    "cl": Languages,
                    "selector": {
                        "id": "dropdown",
                        "default": ['fre']
                    },
                    "template": {
                        "title": "Langue(s)",
                        "description": "Langue utilisée par la ressource pour les informations textuelles.",

                    },
                    "format": {
                        "output": "codes"
                    }
                },
                "languageDetails": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [
                            {
                                "value": "languageDetails",
                                "label": "Détails sur la langue"
                            }
                        ]
                    },
                    "template": {
                        "title": "Détails sur la langue",
                        "description": "Commentaires et détails supplémentaires sur la langue utilisés pour les informations textuelles de la ressource. Ce champ est addressé à mettre en évidence des incohérences particulières dans la langue (ou langues) utilisée(s) dans la ressource, le cas échéant. Par exemple pour avertir que la ressource n'est pas complètement homogène dans la langue utilisée pour les informations textuelles. Sinon, il peut être laissé vide.",

                    },
                    "format": {
                        "output": "string"
                    }
                },
                "metadataStandardVersion": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "default": "1.0",
                        "source": [
                            {
                                "value": "metadataStandardVersion",
                                "label": "Version des normes des métadonnées"
                            }
                        ]
                    },
                    "template": {
                        "title": "Version des normes des métadonnées",
                        "description": "Version des spécifications standards de métadonnées utilisée.",

                    },
                    "format": {
                        "output": "string"
                    }
                },
                "metadataLanguage": {
                    "cl": Languages,
                    "selector": {
                        "id": "dropdown",
                        "default": ['fre']
                    },
                    "template": {
                        "title": "Langue des métadonnées",
                        "description": "Langue(s) utilisée(s) pour les métadonnées",

                    },
                    "format": {
                        "output": "codes"
                    }
                },
                "noDataValue": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [
                            {
                                "value": "noDataValue",
                                "label": "Valeur assignée Value assigned au manque de donnée"
                            }
                        ]
                    },
                    "template": {
                        "title": "Valeur assignée Value assigned au manque de donnée",
                        "description": " Valeur assignée aux cellules pour représenter l'absence de données. Les valeurs manquantes sont généralement mises en évidence par des étiquettes appropriées (tels que \'NA\', \'000\')",

                    },
                    "format": {
                        "output": "string"
                    }
                },

                "contacts": {

                    classNames: "well",

                    template: {
                        title: "Contacts",
                        "label": "Informations de contact"
                    },

                    "incremental": true,

                    "selectors": {
                        "organization": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [{"value": "organization", "label": "Organization"}]
                            },
                            "template": {
                                "title": "Organisation",
                                "description": "Nom de l'organisation responsable.",

                            },
                            "format": {
                                "output": "label"
                            }
                        },
                        "organizationUnit": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [
                                    {
                                        "value": "organizationUnit",
                                        "label": "Unité/branche dans l'organisation"
                                    }
                                ]
                            },
                            "template": {
                                "title": "Unité/branche dans l'organisation",
                                "description": "Subdivision addressable dans l'organisation.",

                            },
                            "format": {
                                "output": "label"
                            }

                        },
                        "position": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [{"value": "organizationUnit", "label": "Position"}]

                            },
                            "template": {
                                "title": "Position",
                                "description": "Rôle ou position de la personne responsable"

                            },
                            "format": {
                                "output": "label"
                            }

                        },
                        "specify": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [{"value": "specify", "label": "Specifiez"}]

                            },
                            "template": {
                                "title": "Specifiez",
                                "description": "Elément de métadonnées textuel qui permet de préciser le rôle de la partie responsable. Ce champ est conditionnel à l'élément",

                            },
                            "format": {
                                "output": "label"
                            }

                        },
                        "pointOfContact": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [{"value": "pointOfContact", "label": "Point de contact"}]

                            },
                            "template": {
                                "title": "Point de contact",
                                "description": "Nom, prénom, titre de la personne responsable séparés par un délimiteur. Il contient des informations sur la partie qui peut être contactée pour acquérir des connaissancer sur la ressource.",

                            },
                            "format": {
                                "output": "string"
                            }

                        },

                        "role": {
                            "selector": {
                                "id": "dropdown",
                                source: Role
                            },
                            "template": {
                                "title": "Rôle",
                                "description": "Fonctionne accomplie par la partie responsable concernant la ressource.",

                            },
                            "format": {
                                "output": "label"
                            }

                        },

                        "phone": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [{"value": "phone", "label": "Numéro de téléphone"}]
                            },
                            "template": {
                                "title": "Numéro de téléphone",
                                "description": "Numéro de téléphone auquel l'organisation ou un individu peuvent être contactés.",

                            },
                            "format": {
                                "output": "template",
                                "path": "contactInfo.phone"
                            }
                        },
                        "address": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [{"value": "address", "label": "Addresse"}]
                            },
                            "template": {
                                "title": "Addresse",
                                "description": "Addresse physique à laquelle l'organisation ou l'individu peuvent être contactés.",

                            },
                            "format": {
                                "output": "template",
                                "path": "contactInfo.address"
                            }
                        },
                        "emailAddress": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [{"value": "emailAddress", "label": "Addresse élctronique"}]
                            },
                            "template": {
                                "title": "Addresse élctronique",
                                "description": "Addresse élctronique à laquelle l'organisation ou l'individu peuvent être contactés.",
                            },
                            "format": {
                                "output": "template",
                                "path": "contactInfo.emailAddress"
                            }
                        },
                        "hoursOfService": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [{"value": "hoursOfService", "label": "Heures de service"}]
                            },
                            "template": {
                                "title": "Heures de service",
                                "description": "Période (y compris le fuseau horaire) dans laquelle les personnes peuvent contacter l'organisation ou l'individu.",
                            },
                            "format": {
                                "output": "template",
                                "path": "contactInfo.hoursOfService"
                            }
                        },
                        "contactInstruction": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [{"value": "contactInstruction", "label": "Instruction"}]
                            },
                            "template": {
                                "title": "Instruction",
                                "description": "Instructions supplémentaires sur comment ou quand contacter l'organisation ou l'individu.",

                            },
                            "format": {
                                "output": "template",
                                "path": "contactInfo.contactInstruction"
                            }
                        }
                    },

                    format: {
                        output: "array<contact>"
                    }

                }
            },

            "sections": {

                "meContent": {
                    "title": "Contenu",
                    "description": "Cette section comprend un résumé du contenu de la ressource et la description de la couverture géographique, temporelle et sectorielle.",
                    "selectors": {
                        "keywords": {
                            "selector": {
                                "id": "input",
                                type: "text"
                            },
                            "template": {
                                "title": "Mots-clés",
                                "description": "Mot(s), mot(s) formalisé(s) ou phrase(s) fréquemment utilisés pour décrire la ressource.",
                            },
                            "format": {
                                "output": "array"
                            }

                        },
                        "description": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [
                                    {
                                        "value": "description",
                                        "label": "Abstract"
                                    }
                                ]
                            },
                            "template": {
                                "title": "Abstract",
                                "description": "Aperçu des caractéristiques principales de la ressource et résumé des informations contenues dans la ressource, de manière facilement compréhensible, pour les utilisateurs techniques et non techniques.",
                            },
                            "format": {
                                "output": "label"
                            }

                        },
                        "statisticalConceptsDefinitions": {
                            "selector": {
                                "id": "textarea",
                                "source": [
                                    {
                                        "value": "statisticalConceptsDefinitions",
                                        "label": "Concepts / définitions statistiques"
                                    }
                                ]
                            },
                            "template": {
                                "title": "Concepts / définitions statistiques",
                                "description": "Définitions des concepts statistiques (c'est-à-dire le domaine statistique) et des principales variables fournies. Les types de variables considérés (par exemple des chiffres brutes, des taux de croissance annuels, des indices, des données de stock,...) doivent être définis et décrits conformément aux normes, aux directives ou aux bonnes pratiques statistiques internationalement acceptées.",

                            },
                            "format": {
                                "output": "label"
                            }

                        }
                    },
                    "sections": {
                        "seReferencePopulation": {
                            "title": "Population de référence",
                            "selectors": {
                                "statisticalPopulation": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "statisticalPopulation",
                                                "label": "Population statistique"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Population statistique",
                                        "description": "Population statistique cible (une ou plusieurs) à laquelle la ressource se réfère.",

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                },
                                "statisticalUnit": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "statisticalUnit",
                                                "label": "Unité statistique"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Unité statistique",
                                        "description": "Unité la plus simple pour laquelle des informations sont demandées et pour laquelle des statistiques sont compilées.",

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                },
                                "referencePeriod": {
                                    "cl": PeriodOfReference,
                                    "selector": {
                                        "id": "dropdown"
                                    },
                                    "template": {
                                        "title": "Période de référence",
                                        "description": "Périodes spécifiques (par exemple un jour, une semaine, un mois, une année fiscale, une année civile ou plusieurs années civiles) auxquelles les variables statistiques se réfèrent.",

                                    },
                                    "format": {
                                        "output": "codes"
                                    }
                                },
                                "referenceArea": {
                                    "cl": AreaOfReference,
                                    "selector": {
                                        "id": "dropdown"
                                    },
                                    "template": {
                                        "title": "Zone de référence",
                                        "description": "Type d'unités géographiques la ressource représente ou auquel elle se réfère. Notez que la résolution spatiale doit se référer à l'unité de cartographie minimale dont les limites sont officiellement reconnues, indipendentement du processus de mesure du phénomène considéré. Des exemplent sont les suivantes: pays, niveau administratif 2, etc.",
                                    },
                                    "format": {
                                        "output": "codes"
                                    }
                                }
                            },
                            "validator": {
                                "valReferencePopulation": true
                            }
                        },
                        "seCoverage": {
                            "title": "Couverture",
                            "selectors": {
                                "coverageSectors": {
                                    "cl": CoverageSector,
                                    "selector": {
                                        "id": "dropdown"
                                    },
                                    "template": {
                                        "title": "Secteur",
                                        "description": "Secteur(s) auxquels la ressource se réfèrent, comme specifié dans la codeliste sélectionnée. Le mot \u0027Secteur\u0027 indique le domaine thématique auquel la ressource se réfère. Ces secteurs peuvent être des secteurs institutionnels, économiques, etc (par exemple le secteur des services publics, l'agriculture, les secteurs forestières, les entreprises locales, etc).",
                                    },
                                    "format": {
                                        "output": "codes"
                                    }
                                },
                                "coverageSectorsDetails": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [{
                                            "value": "coverageSectorsDetails",
                                            "label": "Secteur(s) principal(aux)"
                                        }]
                                    },
                                    "template": {
                                        "title": "Secteur(s) principal(aux)",
                                        "description": "Elément textuel qui délimite les résultats en ce qui concerne les principaux secteurs couverts.",

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                },
                                "coverageGeographic": {
                                    "cl": GAUL,
                                    "selector": {
                                        "id": "dropdown"
                                    },
                                    "template": {
                                        "title": "Etendue géographique",
                                        "description": "Couverture géographique représentée par la ressource. Il est fortement recommandé de faire référence à des macro-zones officiellement reconnues ou facilement identifiables (par exemple l'Afrique subsaharienne, l'Amérique du Nord, les pays membres de l'OECD).",

                                    },
                                    "format": {
                                        "output": "codes"
                                    }
                                },
                                "coverageTime": {
                                    "selector": {
                                        "id": "range",
                                        "format": "DD/MM/YYYY",
                                        "config": {
                                            type: "double"
                                        }
                                    },
                                    "template": {
                                        "title": "Période de couverture",
                                        "description": "Informations sur la période pour laquelle les données sont disponibles. Il demande de rapporter la fenêtre de temps de référence (en rapportant la date de début et la date de fin) même si il présent quelques manques.",

                                    },
                                    "format": {
                                        "output": "period"
                                    }
                                }
                            }
                        }
                    }
                },
                "meInstitutionalMandate": {
                    "title": "Mandat institutionnel",
                    "selectors": {
                        "legalActsAgreements": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [
                                    {
                                        "value": "legalActsAgreements",
                                        "label": "Actes/Accords juridiques"
                                    }
                                ]
                            },
                            "template": {
                                "title": "Actes/Accords juridiques",
                                "description": "Références (citations ou liens de site web) aux actes juridiques ou aux accords formels ou informels qui assignent la responsabilité ainsi que l'autorité à une agence pour la collecte, le traitement et la diffusion de la ressource.",

                            },
                            "format": {
                                "output": "label"
                            }
                        },
                        "institutionalMandateDataSharing": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [
                                    {
                                        "value": "institutionalMandateDataSharing",
                                        "label": "Dispositions pour le partage des données"
                                    }
                                ]
                            },
                            "template": {
                                "label": "Dispositions pour le partage des données",
                                "description": "Références (citations ou liens de site web) aux dispositions ou aux procédures pour le partage et la coordination des données.",

                            },
                            "format": {
                                "output": "label"
                            }
                        }
                    }
                },
                "meStatisticalProcessing": {
                    "title": "Traitement statistique",
                    "sections": {
                        "seDataSource": {
                            "title": "Source de données",
                            "template": {
                                "title": "Source de données",
                                "description": "Processus utilisé pour collecter les données. Il comprend une description détaillée de la collecte de données primaires (par exemple, type de collecte, méthode de collecte des données des répondants, procédures d'échantillonnage ...) et la collecte de données secondaires (informations sur les données déjà recueillies par une autre agence ou institution).",
                            },
                            "sections": {
                                "sePrimaryDataCollection": {
                                    "title": "Collecte de données primaires",
                                    "selectors": {
                                        "typeOfCollection": {
                                            "cl": TypeOfCollection,
                                            "selector": {
                                                "id": "dropdown"
                                            },
                                            "template": {
                                                "title": "Type de collecte",
                                                "description": "Elément codifié qui spécifie le type de méthode pour la collecte de données (par exemple recensement, échantillonnage aléatoire, etc.).",

                                            },
                                            "format": {
                                                "output": "codes"
                                            }
                                        },
                                        "samplingProcedure": {
                                            "selector": {
                                                "id": "input",
                                                "type": "text",
                                                "source": [
                                                    {
                                                        "value": "samplingProcedure",
                                                        "label": "Procédure d'échantillonnage"
                                                    }
                                                ]
                                            },
                                            "template": {
                                                "title": "Procédure d'échantillonnage",
                                                "description": "Le type de plan d'échantillonnage utilisé pour sélectionner les répondants à l'enquête pour représenter la population. Il peut se référer aux informations sur le plan d'échantillonnage, la taille de l'échantillon, le cadre d'échantillonnage, la mise à jour de l'échantillon, etc.",

                                            },
                                            "format": {
                                                "output": "label"
                                            }
                                        },
                                        "dataCollection": {
                                            "selector": {
                                                "id": "input",
                                                "type": "text",
                                                "source": [
                                                    {
                                                        "value": "dataCollection",
                                                        "label": "Collecte de données"
                                                    }
                                                ]
                                            },
                                            "template": {
                                                "title": "Collecte de données",
                                                "description": "Méthodes utilisés pour recueillir les données des répondants (par exemple, enquête postale, CAPI, enquête en ligne, entrevues face-à-face, etc.) et description des méthodes de collecte des données. Cet élément de métadonnées inclut également des informations plus précises sur le type de questionnaire (structuré, non structuré, etc.) et, si nécessaire, des aspects notables du processus de collecte des données.",

                                            },
                                            "format": {
                                                "output": "label"
                                            }
                                        },
                                        "collectionPeriodicity": {
                                            "cl": PeriodicityDataCollection,
                                            "selector": {
                                                "id": "dropdown"
                                            },
                                            "template": {
                                                "title": "Périodicité de la collecte de données",
                                                "description": "Fréquence avec laquelle les données sont collectées à partir des sources.",

                                            },
                                            "format": {
                                                "output": "codes"
                                            }
                                        },
                                        "organization": {
                                            "selector": {
                                                "id": "input",
                                                "type": "text",
                                                "source": [
                                                    {
                                                        "value": "organization",
                                                        "label": "Organisation"
                                                    }
                                                ]
                                            },
                                            "template": {
                                                "title": "Organisation",
                                                "description": "L'organisation est obligatoire lorsque «Autres Organisations Internationales» a été choisie dans 'originOfCollectedData' *** Si l'élément origine des données collectées a généralement été spécifié comme étant d'autres organisations internationales, cet élément demande de rapporter la source exacte de la ressource.",

                                            },
                                            "format": {
                                                "output": "string"
                                            }
                                        },
                                    }
                                },
                                "seSecondaryDataCollection": {
                                    "title": "Collecte de données secondaires",
                                    "description": "Cette section est remplie lorsque l'agence qui compile et publie les données ne coïncide pas avec l'entité (sujet, agence ou institution) qui a mené la procédure de collecte des données. Elle fournit des informations sur la source qui a déjà collecté les données.",
                                    "selectors": {
                                        "originOfCollectedData": {
                                            "cl": OriginOfCollectedData,
                                            "selector": {
                                                "id": "dropdown"
                                            },
                                            "template": {
                                                "title": "Origine des données collectées",
                                                "description": "Elément codifié qui permet de spécifier, de manière standard, l'origine de la ressource.",

                                            },
                                            "format": {
                                                "output": "codes"
                                            }
                                        },
                                        "rawDataDescription": {
                                            "selector": {
                                                "id": "input",
                                                "type": "text",
                                                "source": [
                                                    {
                                                        "value": "rawDataDescription",
                                                        "label": "Description des données brutes"
                                                    }
                                                ]
                                            },
                                            "template": {
                                                "title": "Description des données brutes",
                                                "description": "Caractéristiques et composantes des données statistiques brutes utilisées pour la compilationdes agrégats statistiques. Il indique si la base de données est basée sur une enquête ou sur une source des données administrative. Si les registres administratifs sont utilisés, la description des registres doit être donnée (source, année, objectif principal, lacunes potentielles...).",

                                            },
                                            "format": {
                                                "output": "label"
                                            }
                                        },
                                        "organization": {
                                            "selector": {
                                                "id": "input",
                                                "type": "text",
                                                "source": [
                                                    {
                                                        "value": "organization",
                                                        "label": "Organisation"
                                                    }
                                                ]
                                            },
                                            "template": {
                                                "title": "Organisation",
                                                "description": "Si l'élément origine des données collectées a généralement été spécifié comme étant d'autres organisations internationales, cet élément demande de rapporter la source exacte de la ressource.",

                                            },
                                            "format": {
                                                "output": "label"
                                            }
                                        },
                                        "dataCollection": {
                                            "selector": {
                                                "id": "input",
                                                "type": "text",
                                                "source": [
                                                    {
                                                        "value": "dataCollection",
                                                        "label": "Collecte de données"
                                                    }
                                                ]
                                            },
                                            "template": {
                                                "title": "Collecte de données",
                                                "description": "Détails de la collecte des données.",

                                            },
                                            "format": {
                                                "output": "label"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "seDataCompilation": {
                            "title": "Compilation des données",
                            "description": "Cette section décrit les actions statistiques principales exploitées sur les données (par exemple l'édition des données, l'imputation, la pondération, l'ajustement pour la non-réponse, le modèle utilisé, etc).",
                            "selectors": {
                                "missingData": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "missingData",
                                                "label": "Données manquantes"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Données manquantes",
                                        "description": "Il décrit les circonstances dans lesquelles les données manquantes sont estimées ou imputées et quand les cellules sont laissées vides. Il décrit également les méthodologies utilisées pour estimer/imputer les valeurs manquantes.",

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                },
                                "weights": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "weights",
                                                "label": "Poids"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Poids",
                                        "description": "Description du système de poids (le cas échéant) utilisé afin de produire des résultats statistiques précis. Ce champ rapporte les critères d'utilisation des poids dans l'analyse de la collecte, les formules et les coefficients développés et la façon dans laquelle ils sont appliqués aux données.",

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                },
                                "aggregationProcessing": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "aggregationProcessing",
                                                "label": "Processus d'agrégation"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Processus d'agrégation",
                                        "description": "Informations sur la méthodologie utilisée pour les données agrégées.",

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                },
                                "aggregationFormula": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "aggregationFormula",
                                                "label": "Formule d'agrégation"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Formule d'agrégation",
                                        "description": "Formule utilisée pour agréger les données.",

                                    },
                                    "format": {
                                        "output": "string"
                                    }
                                },
                                "dataAdjustment": {
                                    "cl": DataAdjustment,
                                    "selector": {
                                        "id": "dropdown"
                                    },
                                    "template": {
                                        "title": "Process d'ajustement",
                                        "description": "Type d'ajustement utilisé représenté par un code.",

                                    },
                                    "format": {
                                        "output": "codes"
                                    }
                                },
                                "dataAdjustmentDetails": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "dataAdjustmentDetailss",
                                                "label": "Détails sur le processus d'ajustement"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Détails sur le processus d'ajustement",
                                        "description": "Ensemble de procédures utilisées pour modifier des données statistiques pour leur permettre d'être conformes aux normes nationales ou internationales (telles que les méthodes d'ajustement saisonnier, la décomposition des séries temporelles, ou autres méthodes similaires).",

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                },
                                "indexType": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "indexType",
                                                "label": "Type d'indice"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Type d'indice",
                                        "description": "Type d'indice utilisé dans le processus de production statistique.",

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                },
                                "basePeriod": {
                                    "selector": {
                                        "id": "time"
                                    },
                                    "template": {
                                        "title": "Période de référence",
                                        "description": "Période de temps utilisée comme base d'un indice ou à laquella une série temporelle se réfère (par exemple, année de référence 2000 pour des données annuelles).",

                                    },
                                    "format": {
                                        "output": "date"
                                    }
                                }
                            }
                        },
                        "seDataValidation": {
                            "title": "Validation des données",
                            "selectors": {
                                "dataValidationIntermediate": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "dataValidationIntermediate",
                                                "label": "Validation intermédiaire des données"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Validation intermédiaire des données",
                                        "description": "Evaluation de la qualité et de l'exactitude des calculs intermédiaires conduisants à des produits statistiques.",

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                },
                                "dataValidationOutput": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "dataValidationOutput",
                                                "label": "Validation des données - sortie"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Validation des données - sortie",
                                        "description": "Evaluation des écarts et/ou des inexactitudes observés dans les produits statistiques.",

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                },
                                "dataValidationSource": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "dataValidationSource",
                                                "label": "Validation des données - source"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Validation des données - source",
                                        "description": "Evaluation des écarts et/ou des imprécisions inhérents à la source des données.",

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                }
                            }
                        }
                    }
                },
                "meDataQuality": {
                    "title": "Qualité des données",
                    "description": "Cette section fournit une description et une évaluation de la qualité des données. Elle permet de décrire le processus d'assurance de la qualité des données, y compris les normes de validation des données, de complétude et d'exactitude. En outre, une évaluation de la comparabilité et de la cohérence interne de la ressource est considerée comme une dimensione qualitative.",
                    "selectors": {
                        "qualityManagement": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [
                                    {
                                        "value": "qualityManagement",
                                        "label": "Gestion de la qualité"
                                    }
                                ]
                            },
                            "template": {
                                "title": "Gestion de la qualité",
                                "description": "Structure, responsabilités et procédures établies pour garantir la qualité des données.",

                            },
                            "format": {
                                "output": "label"
                            }
                        },
                        "qualityAssessment": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [
                                    {
                                        "value": "qualityAssessment",
                                        "label": "Evaluation de la qualité des données"
                                    }
                                ]
                            },
                            "template": {
                                "title": "Evaluation de la qualité des données",
                                "description": "Evaluation qualitative globale de la qualité des produits statistiques.",

                            },
                            "format": {
                                "output": "label"
                            }
                        },
                        "qualityAssurance": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [
                                    {
                                        "value": "qualityAssurance",
                                        "label": "Assurance de la qualité"
                                    }
                                ]
                            },
                            "template": {
                                "title": "Assurance de la qualité",
                                "description": "Description du processus qui assure que les processus de production des données sont conformes aux normes de qualité statistique.",

                            },
                            "format": {
                                "output": "label"
                            }
                        }
                    },
                    "sections": {
                        "seAccuracy": {
                            "title": "Exactitude",
                            "description": "Proximité entre les calculs ou les estimations et les valeurs exactes que les statistiques visaient à mesurer. L'exactitude peut contenir des mesures des résultats numériques des méthodes d'évaluation de l'exactitude des données ou des indicateurs d'évaluation qualitative. Il peut également être décrit en terms des principales sources d'erreur qui provoquent potentiellement des inexactitudes (par exemple échantillonnage, non-réponse, réponse).",
                            "selectors": {
                                "accuracyNonSampling": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "accuracyNonSampling",
                                                "label": "Exactitude - Erreurs non dues à l'échantillonnage"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Exactitude - Erreurs non dues à l'échantillonnage",
                                        "description": "Erreurs dans les estimations d'échantillons qui ne peuvent pas être attribuées à des fluctuations d'échantillonnage. (par exemple des défauts dans le cadre d'échantillonnage, démarcation défectueuse des unités d'échantillonnage, des défauts dans la sélection des unités d'échantillonnage, des erreurs dans la collecte des données dues à des variations personnelles, des malentendues, des biais, la négligence... etc).",

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                },
                                "accuracySampling": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "accuracySampling",
                                                "label": "Exactitude - Erreurs d'échantillonnage"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Exactitude - Erreurs d'échantillonnage",
                                        "description": "Si l'échantillonnage aléatoire est utilisé, l'exactitude est une évaluation de la différence entre une valeur réelle et sa estimation, dérivée d'un échantillonnage aléatoire (donc due au fait que seulement un sous-ensemble de la population est énuméré), normalement sous forme de coefficient de variation, d'erreur standard ou d'intervalles de confiance. Pour l'échantillonnage non-aléatoire, les erreurs aléatoires ne peuvent pas être calculées sans référence à une sorte de modèle. Dans ce cas-ci, des estimations d'exactitude, une motivation pour le modèle utilisé pour cette estimation et une brève discussion des biais d'échantillonnage doivent être fournis.",

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                },
                                "completeness": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "completeness",
                                                "label": "Intégralité"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Intégralité",
                                        "description": "Etat d'intégralité de la ressource.",

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                }
                            }
                        },
                        "seDataRevision": {
                            "title": "Révision des données",
                            "description": "Cette section décrit la politique et la pratique pour identifier l'état de révision des données, ainsi que la disponibilité des études de révision et des analyses.",
                            "selectors": {
                                "revisionPolicy": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "revisionPolicy",
                                                "label": "Politique de révision"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Politique de révision",
                                        "description": "Politique concernant la révision périodique de la ressource et l'assurance de la transparence des données diffusées.",

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                },
                                "revisionPractice": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "revisionPractice",
                                                "label": "Pratique de révision"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Pratique de révision",
                                        "description": "Informations concernants la révision des données afin de donner aux compilateurs la possibilité d'intégrer des informations nouvelles et plus précises dans la ressource. Il décrit également l'état de révision des données disponibles. Les données peuvent aussi être soumises à des révisions régulières ou ad hoc à la suite de l'introduction de classifications, cadres de compilation et méthodoligies nouveaux afin d'améliorer l'exactitude de la ressource.",

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                }
                            }
                        },
                        "seComparability": {
                            "title": "Cohérence de compatibilité",
                            "description": "Degré de compatibilité des données entre les zones ou les régions géographiques référencées par la ressource. Les données peuvent être obtenues à partir des ênquetes qui sont généralement menées par des agences statistiques différentes. Ces ênquetes font souvent référence aux populations de différentes zones géographiques, parfois basées sur méthodologies différentes.",
                            "selectors": {
                                "comparabilityGeographical": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "comparabilityGeographical",
                                                "label": "Comparabilité géographique"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Comparabilité géographique",
                                        "description": "Degré de compatibilité des données entre les zones ou les régions géographiques référencées par la ressource. Les données peuvent être obtenues à partir des ênquetes qui sont généralement menées par des agences statistiques différentes. Ces ênquetes font souvent référence aux populations de différentes zones géographiques, parfois basées sur méthodologies différentes."

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                },
                                "comparabilityTime": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "comparabilityTime",
                                                "label": "Comparabilité dans le temps"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Comparabilité dans le temps",
                                        "description": "Mesure dans laquelle les données sont comparables ou conciliables dans le temps. Elle se réfère au degré de compatibilité entre les mesures d'une série temporelle (par exemple liée à un pays, à un produit et à une variable) incluses dans la ressource.",

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                },
                                "coherenceIntern": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "coherenceIntern",
                                                "label": "Cohérence interne"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Cohérence interne",
                                        "description": "Estimation générale de la mesure dans laquelle les données sont cohérentes avec la ressource.",

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                }
                            }
                        }
                    }
                },
                "meAccessibility": {
                    "title": "Accessibilité",
                    "sections": {
                        "seDataDissemination": {
                            "title": "Diffusion des données",
                            "sections": {
                                "seDistribution": {
                                    "title": "Distribution",
                                    "description": "Cette section rapporte la modalité de distribution de la ressource en mettant l'accent sur la façon d'accéder à la ressource et sur les formats supportés.",                                    "selectors": {
                                        "onlineResource": {
                                            "selector": {
                                                "id": "input",
                                                "type": "text",
                                                "source": [
                                                    {
                                                        "value": "onlineResource",
                                                        "label": "Lien vers la ressource en ligne"
                                                    }
                                                ]
                                            },
                                            "template": {
                                                "title": "Lien vers la ressource en ligne",
                                                "description": "Lien vers la ressource en ligne. Il est conditionnel à la politique régissant la distribution et au mécanisme de partage. Il n'est pas disponible pour les ressources \u0027restreintes\u0027",

                                            },
                                            "format": {
                                                "output": "string"
                                            }
                                        },
                                        "disseminationFormat": {
                                            "incremental": true,
                                            "selector": {
                                                "id": "input",
                                                "type": "text",
                                                "source": [
                                                    {
                                                        "value": "disseminationFormat",
                                                        "label": "Formats de diffusion"
                                                    }
                                                ]
                                            },
                                            "template": {
                                                "title": "Formats de diffusion",
                                                "description": "Les formats disponibles pour télécharger la ressource (par exemple Excel, CSV, PDF, etc.)... Il est conditionnel à la politique régissant la distribution et au mécanisme de partage. Il n'est pas disponible pour les ressources \u0027restreintes\u0027.",

                                            },
                                            "format": {
                                                "output": "array<string>"
                                            }
                                        }
                                    }
                                },
                                "seReleasePolicy": {
                                    "title": "Politique de diffusion",
                                    "selectors": {
                                        "releaseCalendar": {
                                            "selector": {
                                                "id": "input",
                                                "type": "text",
                                                "source": [
                                                    {
                                                        "value": "releaseCalendar",
                                                        "label": "Calendrier de diffusion"
                                                    }
                                                ]
                                            },
                                            "template": {
                                                "title": "Calendrier de diffusion",
                                                "description": "Politique concernant la diffusion de la ressource conformément au calendrier préétabli. Il fournit également des informations sur la disponibilité du calendrier de diffusion.",

                                            },
                                            "format": {
                                                "output": "label"
                                            }
                                        },
                                        "releaseCalendarAccess": {
                                            "selector": {
                                                "id": "input",
                                                "type": "text",
                                                "source": [
                                                    {
                                                        "value": "releaseCalendarAccess",
                                                        "label": "Accès au calendrier de diffusion"
                                                    }
                                                ]
                                            },
                                            "template": {
                                                "title": "Accès au calendrier de diffusion",
                                                "description": "Lien ou références au calendrier de diffusion.",

                                            },
                                            "format": {
                                                "output": "string"
                                            }
                                        },
                                        "disseminationPeriodicity": {
                                            "cl": DisseminationPeriodicy,
                                            "selector": {
                                                "id": "dropdown"
                                            },
                                            "template": {
                                                "title": "Périodicité de diffusion",
                                                "description": "Fréquence de diffusion des données (par exemple quotidienne, mensuelle, trimestrelle, annuelle).",

                                            },
                                            "format": {
                                                "output": "codes"
                                            }
                                        },
                                        "embargoTime": {
                                            "selector": {
                                                "id": "range",
                                                "format": "DD/MM/YYYY",
                                                "config": {
                                                    type: "double"
                                                }
                                            },
                                            "template": {
                                                "title": "Embargo",
                                                "description": "Intervalle de temps entre l'achèvement du processus de production des données statistiques et leur publication.",

                                            },
                                            "format": {
                                                "output": "period"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "seClarity": {
                            "title": "Clarté",
                            "description": "Cette section donne des informations sur la disponibilité des informations supplémentaires (documentation, métadonnées supplémentaires...) liées à la ressource.",
                            "selectors": {
                                "clarity": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "clarity",
                                                "label": "Clarity"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Clarté",
                                        "description": "Degré de compréhensibilité des métadonnées disponibles. Elle indique si la ressource est accompagnée par des métadonnées appropriées et par d'autres documents pertinents.",

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                },
                                "metadataCompletenessRate": {
                                    "selector": {
                                        "id": "range",
                                        "title": "Taux de complétude des métadonnées",
                                        "config": {
                                            "min": 0,
                                            "max": 100,
                                            "type": "single"
                                        },
                                        "template": {
                                            "title": "Taux de complétude des métadonnées",
                                            "description": "Le pourcentage de complétude des métadonnées offre une évaluation numérique du degré auquel la ressource est documentée.",

                                        },
                                        "format": {
                                            "output": "string"
                                        }
                                    }
                                }
                            }
                        },
                        "seConfidentiality": {
                            "title": "Confidentialité",
                            "description": "Cette section informe sur le niveau de confidentialité et sur la politique appliquée pour la divulgation de la ressource. Cette sous-entité des métadonnées concerne la législation (ou toute autre disposition formelle) liée à la confidentialité des statistiques appliquée à la ressource, ainsi que la confidentialité réelle du traitement des données (aussi en ce qui concerne les données agrégées diffusées).",
                            "selectors": {
                                "confidentialityPolicy": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "confidentialityPolicy",
                                                "label": "Politique de confidentialité"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Politique de confidentialité",
                                        "description": "Des mesures législatives ou des autres procédures formales qui empêchent la divulgation non autorisée des données qui identifient, directement ou indirectement, une personne ou une entité économique. Elle consiste en une description textuelle et en des références à la législation ou à des autres règles liées à la confidentialité statistique."

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                },
                                "confidentialityDataTreatment": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [
                                            {
                                                "value": "confidentialityDataTreatment",
                                                "label": "Confidentialité du traitement des données"
                                            }
                                        ]
                                    },
                                    "template": {
                                        "title": "Confidentialité du traitement des données",
                                        "description": "Des règles appliquées pour le traitement de la ressource pour assurer la confidentialité et empêcher la divulgation non autorisée."

                                    },
                                    "format": {
                                        "output": "label"
                                    }
                                },
                                "confidentialityStatus": {
                                    "cl": StatusConfidenciality,
                                    "selector": {
                                        "id": "dropdown"
                                    },
                                    "template": {
                                        "title": "Etat de confidentialité",
                                        "description": "Des informations codifiées qui décrivent le degré de confidentialité de la ressource"

                                    },
                                    "format": {
                                        "output": "codes"
                                    }
                                }
                            }
                        }
                    }

                },
                "meMaintenance": {
                    "title": "Maintenance",
                    "description": "Cette section fournit des informations sur la fréquence de mise à jour de la ressource et sur la maintenance des métadonnées.",
                    "selectors": {
                        "maintenanceAgency": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [
                                    {
                                        "value": "maintenanceAgency",
                                        "label": "Agence de maintenance"
                                    }
                                ]
                            },
                            "template": {
                                "title": "Agence de maintenance",
                                "description": "Organisation ou autre organisme expert qui maintient la ressource."

                            },
                            "format": {
                                "output": "label"
                            }
                        }
                    },
                    "sections": {
                        "seUpdate": {
                            "title": "Mise à jour",
                            "description": "Cette section comprend les opérations de maintenance concernants la mise à jour périodique de la ressource.",
                            "selectors": {
                                "updateDate": {
                                    "selector": {
                                        "id": "time"
                                    },
                                    "template": {
                                        "title": "Dernière date de mise à jour",
                                        "description": "Dernière date physique de mise à jour.",

                                    },
                                    "format": {
                                        "output": "date"
                                    }
                                },
                                "updatePeriodicity": {
                                    "cl": UpdatePeriodicity,
                                    "selector": {
                                        "id": "dropdown"
                                    },
                                    "template": {
                                        "title": "Fréquence de mise à jour",
                                        "description": "Intervalle de temps entre la fin du processus de production des données statistiques et leur publication."

                                    },
                                    "format": {
                                        "output": "codes"
                                    }
                                }
                            }
                        },
                        "seMetadataMaintenance": {
                            "title": "Maintenance des métadonnées",
                            "description": "Cette section comprend les opérations de maintenance concernants la mise à jour périodique des métadonnées afin d'assurer que la ressource est correctement décrite.",
                            "selectors": {
                                "metadataLastCertified": {
                                    "selector": {
                                        "id": "time"
                                    },
                                    "template": {
                                        "title": "Dernière certification des métadonnées",
                                        "description": "Dernière date de certification des métadonnées.",

                                    },
                                    "format": {
                                        "output": "date"
                                    }
                                },
                                "metadataLastPosted": {
                                    "selector": {
                                        "id": "time"
                                    },
                                    "template": {
                                        "title": "Dernière publication des métadonnées",
                                        "description": "Dernière date de publication des métadonnées. Elle est généralement mise à jour automatiquement par le système de production des métadonnées.",

                                    },
                                    "format": {
                                        "output": "date"
                                    }
                                },
                                "metadataLastUpdate": {
                                    "selector": {
                                        "id": "time"
                                    },
                                    "template": {
                                        "title": "Dernière mise à jour des métadonnées",
                                        "description": "Date la plus récente de mise à jour des métadonnées.",

                                    },
                                    "format": {
                                        "output": "date"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

    });
