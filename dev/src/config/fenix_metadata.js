define(
    function () {

        var IANA = {body: [], uid: 'IANAcharacterSet'},
            Role = {
                "owner": "Owner",
                "distributor": "Distributor",
                "producer": "Producer",
                "other": "Other"
            },
            GAUL = {body: [], uid: 'GAUL0', version:"2014" },
            Languages = {body: [], uid: 'ISO639-2', version:"1998" },
            PeriodOfReference = {body: [], uid: 'FAO_Period', version:"1.0"},
            TypeOfCollection = {body: [], uid: 'FAOSTAT_Collection', version:"1.0"},
            OriginOfCollectedData = {body: [], uid: 'FAOSTAT_OriginData', version:"1.0"},
            DataAdjustment = {body: [], uid: 'CL_ADJUSTMENT', version:"1.1"},
            StatusConfidenciality = {body: [], uid: 'CL_CONF_STATUS', version:"1.0"},
            AreaOfReference = {body: [], uid: 'GAUL_ReferenceArea', version:"1.0"},
            DisseminationPeriodicy = {body: [], uid: 'FAO_Period', version:"1.0"},
            PeriodicityDataCollection = {body: [], uid: 'FAO_Period', version:"1.0"},
            UpdatePeriodicity = {body: [], uid: 'FAO_Period', version:"1.0"},
            CoverageSector = {body: [], uid: 'CRS_purpose_codes'}; // CSTAT_Core

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
            "identification": {
                "title": "Identification",
                "description": "Basic Metadata",
                "sections": {},
                "selectors": {
                    "title": {
                        "selector": {
                            "id": "input",
                            "type": "text",
                            "source": [
                                {
                                    "value": "title",
                                    "label": "Title"
                                }
                            ]
                        },
                        "template": {
                            "title": "Title",
                            "description": "Textual label used as title of the resource.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    },
                    "creationDate": {
                        "selector": {
                            "id": "time",
                            "source": [
                                {
                                    "value": "creationdate",
                                    "label": "Creation Date"
                                }
                            ]
                        },
                        "template": {
                            "title": "Creation Date",
                            "description": "Creation date of the resource.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    },
                    "characterSet": {
                        "cl": IANA,
                        "selector": {
                            "id": "dropdown",
                        },
                        "template": {
                            "title": "Character-set",
                            "description": "Full name of the character coding standard used by the resource.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    },
                    "metadataStandardName": {
                        "selector": {
                            "id": "input",
                            "type": "text",
                            "default": "FENIX",
                            "source": [
                                {
                                    "value": "metadataStandardName",
                                    "label": "metadataStandardName"
                                }
                            ]
                        },
                        "template": {
                            "title": "Used metadata standard",
                            "description": "Name of the metadata standard specifications used. In FENIX framework this field would be pre-compiled by 'FENIX'.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    },
                    "language": {
                        "cl": Languages,
                        "default": 'eng',
                        "selector": {
                            "id": "dropdown"
                        },
                        "template": {
                            "title": "Language(s)",
                            "description": "Language used by the resource for textual information.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    },
                    "languageDetails": {
                        "selector": {
                            "id": "input",
                            "type": "text",
                            "source": [
                                {
                                    "value": "languageDetails",
                                    "label": "Language details"
                                }
                            ]
                        },
                        "template": {
                            "title": "Language details",
                            "description": "Comments and additional details about the language used for the textual information of the resource. This field is addressed to highlight some particular inconsistencies in the language (or languages) used in the resource, if any. For example to alert that the resource is not completely homogeneous in the language used for textual information. Otherwise it can be leaved empty.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
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
                                    "label": "metadataStandardVersion"
                                }
                            ]
                        },
                        "template": {
                            "title": "Version of metadata standard",
                            "description": "Version of the metadata standard specifications used.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    },
                    "metadataLanguage": {
                        "cl": Languages,
                        "default": 'eng',
                        "selector": {
                            "id": "dropdown"
                        },
                        "template": {
                            "title": "metadataLanguage",
                            "description": "Language(s) used for metadata",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    },
                    "noDataValue": {
                        "selector": {
                            "id": "input",
                            "type": "text",
                            "source": [
                                {
                                    "value": "noDataValue",
                                    "label": "Value assigned to No-data"
                                }
                            ]
                        },
                        "template": {
                            "title": "Value assigned to No-data",
                            "description": " Value assigned to the cells to represent the absence of data. Missing values are usually highlight through apposite ags, however the data matrix does not report empty cells but a predefined combination of characters (such as 'NA', '000' . . . ) indicating the absence of data.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    }
                },
                "validator": {
                    "valIdentification": true
                }
            },
            "contacts": {
                "title": "Contacts",
                "description": "Responsible party that could be identify as the data source. FENIX metadata contains more than one field of the type 'ResponsibleParty' addressed to report all the information necessary to contact party(ies) playing different roles in respect to the resource. In particular this field (belonging to the Identification entity) should report the party who owns authority on the resource.",
                "sections": {},
                "selectors": {
                    "organization": {
                        "selector": {
                            "id": "input",
                            "type": "text",
                            "source": [
                                {
                                    "value": "organization",
                                    "label": "Organization"
                                }
                            ]
                        },
                        "template": {
                            "title": "Organization",
                            "description": "Name of the responsible organization.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    },
                    "organizationUnit": {
                        "selector": {
                            "id": "input",
                            "type": "text",
                            "source": [
                                {
                                    "value": "organizationUnit",
                                    "label": "Organization unit/division"
                                }
                            ]
                        },
                        "template": {
                            "title": "Organization unit/division",
                            "description": "Addressable subdivision of an organization.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    },
                    "pointOfContact": {
                        "selector": {
                            "id": "input",
                            "type": "text",
                            "source": [
                                {
                                    "value": "pointOfContact",
                                    "label": "Point of contact"
                                }
                            ]
                        },
                        "template": {
                            "title": "Point of contact",
                            "description": "Responsible person-surname, given name, title separated by a delimiter. It contains information about the party who can be contacted for acquiring knowledge the resource.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    },
                    "position": {
                        "selector": {
                            "id": "input",
                            "type": "text",
                            "source": [
                                {
                                    "value": "position",
                                    "label": "Position"
                                }
                            ]
                        },
                        "template": {
                            "title": "Position",
                            "description": " Role or position of the responsible person.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    },
                    "role": {
                        "selector": {
                            "id": "dropdown",
                            "enumeration": Role
                        },
                        "template": {
                            "title": "Role",
                            "description": "Function performed by the responsible party concerning the resource.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    },
                    "specify": {
                        "selector": {
                            "id": "input",
                            "type": "text",
                            "source": [
                                {
                                    "value": "specify",
                                    "label": "Specify"
                                }
                            ]
                        },
                        "template": {
                            "title": "Specify",
                            "description": "Textual metadata element that allows to specify the role performed by the responsible party. This field is conditional to the element .",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    },
                    "contactInfo": {
                        "selector": {
                            "id": "input", // INCREMENTAL
                            "type": "text",
                            "source": [
                                {
                                    "value": "contactInfo",
                                    "label": "This will be the incremental one"
                                }
                            ]
                        },
                        "template": {
                            "title": "contactInfo",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    }
                },
                "validator": {
                    "valContacts": true
                }
            },
            "content": {
                "title": "Content",
                "description": "This section includes a summary of the content of the resource and the description of the geographical, time and sector coverage.",
                "selectors": {
                    "keywords": {
                        "selector": {
                            "id": "input", // INCREMENTAL
                            "type": "text",
                            "source": [
                                {
                                    "value": "keywords",
                                    "label": "Keywords"
                                }
                            ]
                        },
                        "template": {
                            "title": "Keywords",
                            "description": "Commonly used word(s), formalized word(s) or phrase(s) used to describe the resource.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }

                    },
                    "abstract": {
                        "selector": {
                            "id": "input",
                            "type": "text",
                            "source": [
                                {
                                    "value": "abstract",
                                    "label": "Abstract"
                                }
                            ]
                        },
                        "template": {
                            "title": "Abstract",
                            "description": "Overview of the main characteristics of the resource and summary of the information contained in the resource, in an easily understandable manner, for technical and non-technical users.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }

                    },
                    "statisticalConceptsDefinitions": {
                        "selector": {
                            "id": "textarea",
                            "source": [
                                {
                                    "value": "statisticalConceptsDefinitions",
                                    "label": "Statistical concepts / definitions"
                                }
                            ]
                        },
                        "template": {
                            "title": "Statistical concepts / definitions",
                            "description": " Definitions of the statistical concepts under measure (i.e. the statistical domain) and the main variables provided. The considered types of variables (e.g. raw figures, annual growth rates, index, ow or stock data, ...) should be defined and described in accordance with internationally accepted statistical standards, guidelines, or good practices.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }

                    }
                },
                "sections": {
                    "referencePopulation": {
                        "title": "Reference Population",
                        "selectors": {
                            "statisticalPopulation": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "statisticalPopulation",
                                            "label": "Statistical population"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Statistical population",
                                    "description": "Target statistical population (one or more) the resource refers to.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "statisticalUnit": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "statisticalUnit",
                                            "label": "Statistical unit"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Statistical unit",
                                    "description": "Simplest unit for which information is sought and for which statistics are ultimately compiled.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "referencePeriod": {
                                "selector": {
                                    "id": "dropdown",
                                    "cl": PeriodOfReference
                                },
                                "template": {
                                    "title": "Period of reference",
                                    "description": "Specific time periods (e.g. a day, a week, a month, a fiscal year, a calendar year or several calendar years) the statistical variables refer to.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "referenceArea": {
                                "selector": {
                                    "id": "dropdown",
                                    "cl": AreaOfReference
                                },
                                "template": {
                                    "title": "Area of reference",
                                    "description": "Type of geographical units the resource represents or refers to. Note that the spatial resolution must refer to the minimum mapping unit whose bounds are officially recognized indipendently from the measurement process of the phonomenon taken into account. Examples are: countries, administrative level 2, etc.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            }
                        },
                        "validator": {
                            "valReferencePopulation": true
                        }
                    },
                    "coverage": {
                        "title": "Coverage",
                        "selectors": {
                            "sector": {
                                "selector": {
                                    "id": "dropdown",
                                    "cl": CoverageSector
                                },
                                "template": {
                                    "title": "Sector",
                                    "description": " Sector(s) the resource refers to as specified in the selected codelist. The word 'Sector' indicates the subject area the resource refers to. These sectors can be institutional sectors, economic or other sectors (e.g. local government sector, agriculture, forestry, business services, etc.).",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "coverageSectorsDetails": {
                                "selector": {
                                    "id": "dropdown",
                                    //"cl": coverageSectorsDetails,
                                    "source": [
                                        {
                                            "value": "coverageSectorsDetails",
                                            "label": "Coverage Sector Details"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Coverage Sector Details",
                                    "description": "Textual element delimiting the statistical results with regard to the main sectors covered.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "coverageGeographic": {
                                "selector": {
                                    "id": "dropdown",
                                    "cl": GAUL
                                },
                                "template": {
                                    "title": "Geographic extent",
                                    "description": "Geographical coverage represented by the resource. It is highly recommended to make reference to officially recognized or easily identifiable macro-areas (e.g. South Saharan Africa, North America, OECD member countries..).",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "coverageTime": {
                                "selector": {
                                    "id": "range",
                                    "format": "DD/MM/YYYY",
                                    "config": {
                                        type: "double"
                                    },
                                    "source": [{
                                        "value": "coverageTime",
                                        "label": "Coverage period"
                                    }]

                                },
                                "template": {
                                    "title": "Coverage period",
                                    "description": "Information about the time period for which data are available. It requests to report the time window of reference (reporting the starting date and the ending date) even if it presents some lacks.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            }
                        },
                        "validator": {
                            "valCoverage": true
                        }
                    }
                }
            },
            "institutionalMandate": {
                "title": "Institutionale Mandate",
                "selectors": {
                    "legalActsAgreements": {
                        "selector": {
                            "id": "input",
                            "type": "text",
                            "source": [
                                {
                                    "value": "legalActsAgreements",
                                    "label": "Legal acts/agreements"
                                }
                            ]
                        },
                        "template": {
                            "title": "Legal acts/agreements",
                            "description": "References (citations or website link) to legal acts or other formal or informal agreements that assign responsibility as well as authority to an agency for the collection, processing, and dissemination of the resource.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    },
                    "institutionalMandateDataSharing": {
                        "selector": {
                            "id": "input",
                            "type": "text",
                            "source": [
                                {
                                    "value": "institutionalMandateDataSharing",
                                    "label": "Data sharing arrangements"
                                }
                            ]
                        },
                        "template": {
                            "title": "Data sharing arrangements",
                            "description": "References (citations or website link) to arrangements or procedures for data sharing and coordination.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    }
                }
            },
            "statistaicalProcessing": {
                "title": "Statistical Processing",
                "sections": {
                    "primaryDataCollection": {
                        "title": "Primary Data Collection",
                        "selectors": {
                            "typeOfCollection": {
                                "selector": {
                                    "id": "dropdown",
                                    "cl": TypeOfCollection
                                },
                                "template": {
                                    "title": "Type of collection",
                                    "description": "Coded element which specifies the type of data collection method (e.g. census, random sampling, etc.).",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "samplingProcedure": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "samplingProcedure",
                                            "label": "Sampling procedure"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Sampling procedure",
                                    "description": "The type of sample design used to select the survey respondents to represent the population. It may refer to information on sample design, sample size, sample frame, sample updating etc.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "dataCollection": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "dataCollection",
                                            "label": "Data collection"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Data collection",
                                    "description": "Methods used to gather data from the respondents (e.g. postal survey, CAPI, on-line survey, face-to-face interviews etc.) and description of data collection methods. This metadata element also includes more precise information about the kind of questionnaire (structured, unstructured etc.) and if necessary somenoteworthy aspects of the data collection process.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "collectionPeriodicity": {
                                "selector": {
                                    "id": "dropdown",
                                    "cl": PeriodicityDataCollection
                                },
                                "template": {
                                    "title": "Periodicity of data collection",
                                    "description": "Frequency with which the data are collected from the sources.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "organization": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "organization",
                                            "label": "Organization"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Organization",
                                    "description": "Organization is mandatory when 'Other International Organizations' has been chosen in originOfCollectedData *** If the element \u003c\u003coriginOfCollectedData\u003e\u003e has been generally specified as \u0027other International Organizations\u0027 this element requests to report the exact source of the resource.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                        }
                    },
                    "secondaryDataCollection": {
                        "title": "Secondary Data Collection",
                        "selectors": {
                            "originOfCollectedData": {
                                "selector": {
                                    "id": "dropdown",
                                    "cl": OriginOfCollectedData
                                },
                                "template": {
                                    "title": "Origin of collected data",
                                    "description": "Coded element which allows to specify in a standard way the origin of the resource.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "rawDataDescription": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "rawDataDescription",
                                            "label": "Description of raw data"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Description of raw data",
                                    "description": "Characteristics and components of the raw statistical data used for compiling statistical aggregates. It indicates if data set is based on a survey or on administrative data source. If administrative registers are used, the description of registers should be given (source, year, primary purpose, potential deficiencies, etc. ).",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "dataCollection": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "dataCollection",
                                            "label": "Data collection"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Data collection",
                                    "description": "Data collection details.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            }
                        }
                    },
                    "dataCompilation": {
                        "title": "Data Compilation",
                        "selectors": {
                            "missingData": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "missingData",
                                            "label": "Missing data"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Missing data",
                                    "description": "It describe under which circumstance missing data are estimated or imputed and when the cells are left empty. It also describe methodologies used to estimate/impute missing values.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "weights": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "weights",
                                            "label": "Weights"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Weights",
                                    "description": "Description of weights system (if any) used in order to produce accurate statistical results. This field reports the criteria for using weights in analysis of collection, the formulas and coefficients developed and how they are applied to data.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "aggregationProcessing": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "aggregationProcessing",
                                            "label": "Process of aggregation"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Process of aggregation",
                                    "description": "Information about the methodology used to aggregate data.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "aggregationFormula": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "aggregationFormula",
                                            "label": "Aggregation formula"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Aggregation formula",
                                    "description": "Formula used to aggregate data.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "dataAdjustment": {
                                "selector": {
                                    "id": "dropdown",
                                    "cl": DataAdjustment
                                },
                                "template": {
                                    "title": "Process of adjustment",
                                    "description": "Type of adjustment used represented by a code.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "dataAdjustmentDetails": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "dataAdjustmentDetailss",
                                            "label": "Details on process of adjustment"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Details on process of adjustment",
                                    "description": "Set of procedures employed to modify statistical data to enable it to be conform with national or international standards (such as seasonal adjustment methods, time series decomposition, or other similar methods).",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "indexType": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "indexType",
                                            "label": "Type of index"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Type of index",
                                    "description": "Data collection details.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "basePeriod": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "basePeriod",
                                            "label": "Base period"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Base period",
                                    "description": "Period of time used as a base of an index number or to which a time series refers (e.g. base year 2000 for certain annual data).",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            }
                        }
                    },
                    "dataValidation": {
                        "title": "Data Validation",
                        "selectors": {
                            "dataValidationIntermediate": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "dataValidationIntermediate",
                                            "label": "Data validation - intermediate"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Data validation - intermediate",
                                    "description": "Assessment of the quality and correctness of intermediate calculations leading to statistical outputs.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "dataValidationOutput": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "dataValidationOutput",
                                            "label": "Data validation - output"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Data validation - output",
                                    "description": "Assessment of discrepancies and/or inaccuracies observed in the statistical outputs.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "dataValidationSource": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "dataValidationSource",
                                            "label": "Data validation - source"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Data validation - source",
                                    "description": "It describe under which circumstance missing data are estimated or imputed and when the cells are left empty. It also describe methodologies used to estimate/impute missing values.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            }
                        }
                    }
                }
            },
            "dataQuality": {
                "title": "Data Quality",
                "description": "This section provides a description and evaluation of the data quality. It allows to describe the data quality assurance process, inclusive of data validation, completeness and accuracy standards. In addition an assessment of the comparability and intern coherence of the resource is considered a quality dimension.",
                "selectors": {
                    "qualityManagement": {
                        "selector": {
                            "id": "input",
                            "type": "text",
                            "source": [
                                {
                                    "value": "qualityManagement",
                                    "label": "Quality management"
                                }
                            ]
                        },
                        "template": {
                            "title": "Quality management",
                            "description": "Structure, responsibilities and procedures established for guaranteeing the quality of the data.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    },
                    "qualityAssessment": {
                        "selector": {
                            "id": "input",
                            "type": "text",
                            "source": [
                                {
                                    "value": "qualityAssessment",
                                    "label": "Data quality assessment"
                                }
                            ]
                        },
                        "template": {
                            "title": "Data quality assessment",
                            "description": "Overall qualitative assessment of the quality of the statistical outputs.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    },
                    "qualityAssurance": {
                        "selector": {
                            "id": "input",
                            "type": "text",
                            "source": [
                                {
                                    "value": "qualityAssurance",
                                    "label": "Quality assurance"
                                }
                            ]
                        },
                        "template": {
                            "title": "Quality assurance",
                            "description": "Description of the process assuring that the data production processes conforms to the statistical quality standards.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    }
                },
                "sections": {
                    "accuracy": {
                        "title": "Accuracy",
                        "description": "Closeness of computations or estimates to the exact values that the statistics were intended to measure. Accuracy can contain either measures of numerical results of the methods for assessing the accuracy of data or qualitative assessment indicators. It may also be described in terms of the major sources of error that potentially cause inaccuracy (e.g. sampling, non-response, response error).",
                        "selectors": {
                            "accuracyNonSampling": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "accuracyNonSampling",
                                            "label": "Accuracy - non sampling error"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Accuracy - non sampling error",
                                    "description": "Error in sample estimates which cannot be attributed to sampling fluctuations. (e.g. defects in the sampling frame, faulty demarcation of sample units, defects in the selection of sample units, mistakes in the collection of data due to personal variations, misunderstanding, bias, negligence . . . etc.)",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "accuracySampling": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "accuracySampling",
                                            "label": "Accuracy - sampling error"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Accuracy - sampling error",
                                    "description": "If probability sampling is used, the accuracy is an evaluation of difference between a population value and an estimate thereof, derived from a random sample (so due to the fact that only a subset of the population is enumerate), normally in the form of coefficient of variation, standard error or confidence intervals. For non-probability sampling, random errors cannot be calculated without reference to some kind of model, in this case estimates of the accuracy, a motivation for the invoked model for this estimation and brief discussion of sampling bias should be provided.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            }
                        }
                    },
                    "dataRevision": {
                        "title": "Data Revision",
                        "description": "This section describes the policy and practice for identifying the revision status of the data, as well as the availability of revision studies and analysis.",
                        "selectors": {
                            "revisionPolicy": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "revisionPolicy",
                                            "label": "Revision policy"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Revision policy",
                                    "description": "Policy concerning the periodically revision of the resource and ensuring the transparency of disseminated data.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "revisionPractice": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "revisionPractice",
                                            "label": "Revision practice"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Revision practice",
                                    "description": "Information concerning the revision of data in order to give compilers the possibility of incorporating new and more accurate information in the resource. It also describes the revision status of available data. Data may also be subject to regular or ad hoc revisions as a result of the introduction of new classification, compilation frameworks and methodologies in order to improve the accuracy of the resource.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            }
                        }
                    },
                    "relevance": {
                        "title": "Relevance",
                        "description": "Evaluation of data-quality through user satisfaction involving also information about the resource-completeness.",
                        "selectors": {
                            "userNeeds": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "userNeeds",
                                            "label": "User needs"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "User needs",
                                    "description": "Classification of users with some indication of their importance, an indication of the uses for which they want the statistical outputs and as well users and uses given special considerations. Unmet user needs and the reasons for not meeting them should be included as well.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "userSatisfaction": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "userSatisfaction",
                                            "label": "User satisfaction"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "User satisfaction",
                                    "description": "How the views and opinions of the users are collected. In addition the main results regarding the user satisfaction should be shown (in the form of a user satisfaction index if available) and the date of most recent user satisfaction survey.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "completeness": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "completeness",
                                            "label": "Completeness"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Completeness",
                                    "description": "State of completeness of the resource.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "completenessPercentage": {
                                "selector": {
                                    "id": "range",
                                    "config": {
                                        "min": 0,
                                        "max": 100,
                                        "type": "single"
                                    },
                                    "source": [{
                                        "value": "completenessPercentage",
                                        "label": "Percentage of completeness"
                                    }]
                                },
                                "template": {
                                    "title": "Percentage of completeness",
                                    "description": "Percentage of the state of completeness of the resource.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            }
                        }
                    },
                    "compatibilityCoherence": {
                        "title": "Comparability Coherence",
                        "description": "Degree of data comparability across the geographic areas or regions referenced by the resource. Data might be derived from surveys that in general are conducted by different statistical agencies. These surveys often refer to populations of different geographical areas, sometimes based on different methodologies.",
                        "selectors": {
                            "comparabilityGeographical": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "comparabilityGeographical",
                                            "label": "Geographic comparability"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Geographic comparability",
                                    "description": "Degree of data comparability across the geographic areas or regions referenced by the resource. Data might be derived from surveys that in general are conducted by different statistical agencies. These surveys often refer to populations of different geographical areas, sometimes based on different methodologies.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "comparabilityTime": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "comparabilityTime",
                                            "label": "Time comparability"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Time comparability",
                                    "description": "Extent to which data are comparable or reconcilable over time. It refers to the degree of comparability between the measures of a time series (e.g. related to a country, a commodity and a variable) included in the resource.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "coherenceIntern": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "coherenceIntern",
                                            "label": "Internal coherence"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Internal coherence",
                                    "description": "General estimate of the extent to which data are consistent within the resource.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            }
                        }
                    },
                    "timelinessAndPunctuality": {
                        "title": "Timeliness and Punctuality",
                        "description": "Evaluation of the timeliness of the resource dissemination with respect to the phenomenon it describes. In addition this section take in to account the punctuality of data dissemination.",
                        "selectors": {
                            "timeliness": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "timeliness",
                                            "label": "Timeliness"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Timeliness",
                                    "description": "It refers to the speed of data availability, length of time between data availability and the event or phenomenon they describe.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "punctuality": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "punctuality",
                                            "label": "Punctuality"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Punctuality",
                                    "description": "Time lag between the release date of data and the target date announced in some official release calendar.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            }
                        }
                    }
                }
            },
            "accesibility": {
                "title": "Accessibility",
                "sections": {
                    "dataDissemination": {
                        "title": "Data Dissemination",
                        "sections": {
                            "distribution": {
                                "title": "Distribution",
                                "description": "This section reports the mode of distribution of the resource with a focus on how to access the resource, the supported formats.",
                                "selectors": {
                                    "onlineResource": {
                                        "selector": {
                                            "id": "input",
                                            "type": "text",
                                            "source": [
                                                {
                                                    "value": "onlineResource",
                                                    "label": "Link to the on-line resource"
                                                }
                                            ]
                                        },
                                        "template": {
                                            "title": "Link to the on-line resource",
                                            "description": "Link to the on-line resource. It is conditional to the policy governing distribution and sharing mechanism. For \u0027restricted\u0027 resources it is not available.",
                                            "hideSwitch": false,
                                            "hideRemoveButton": false
                                        }
                                    },
                                    "disseminationFormat": {
                                        "selector": {
                                            "id": "input",  // INCREMENTAL
                                            "type": "text",
                                            "source": [
                                                {
                                                    "value": "disseminationFormat",
                                                    "label": "Dissemination formats"
                                                }
                                            ]
                                        },
                                        "template": {
                                            "title": "Dissemination formats",
                                            "description": "Formats available for downloading the resources (e.g. excel, csv, pdf, etc.). . . It is conditional to the policy governing distribution and sharing mechanism. For \u0027restricted\u0027 resources it is not available.",
                                            "hideSwitch": false,
                                            "hideRemoveButton": false
                                        }
                                    }
                                }
                            },
                            "policy": {
                                "title": "Release Policy",
                                "selectors": {
                                    "releaseCalendar": {
                                        "selector": {
                                            "id": "input",
                                            "type": "text",
                                            "source": [
                                                {
                                                    "value": "releaseCalendar",
                                                    "label": "Release calendar"
                                                }
                                            ]
                                        },
                                        "template": {
                                            "title": "Release calendar",
                                            "description": "Policy regarding the release of the resource in accordance with the pre-announced schedule. It also provides information on the availability of the release calendar.",
                                            "hideSwitch": false,
                                            "hideRemoveButton": false
                                        }
                                    },
                                    "releaseCalendarAccess": {
                                        "selector": {
                                            "id": "input",
                                            "type": "text",
                                            "source": [
                                                {
                                                    "value": "releaseCalendarAccess",
                                                    "label": "Access to the release calendar"
                                                }
                                            ]
                                        },
                                        "template": {
                                            "title": "Access to the release calendar",
                                            "description": "Link or references to the release calendar.",
                                            "hideSwitch": false,
                                            "hideRemoveButton": false
                                        }
                                    },
                                    "disseminationPeriodicity": {
                                        "selector": {
                                            "id": "dropdown",
                                            "cl": DisseminationPeriodicy
                                        },
                                        "template": {
                                            "title": "Dissemination periodicity",
                                            "description": "Frequency of data dissemination (e.g. daily, monthly, quarterly, yearly)",
                                            "hideSwitch": false,
                                            "hideRemoveButton": false
                                        }
                                    },
                                    "embargoTime": {
                                        "selector": {
                                            "id": "time"
                                        },
                                        "template": {
                                            "title": "Embargo time",
                                            "description": "Time span between the completion of the production process of statistical data and their publication.",
                                            "hideSwitch": false,
                                            "hideRemoveButton": false
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "clarity": {
                        "title": "Clarity",
                        "description": "This section gives information about the availability of additional information (documentation, further metadata, ... ) linked to the resource.",
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
                                    "title": "Clarity",
                                    "description": "Extent to which easily comprehensible metadata are available. It indicates whether a resource is accompanied by appropriate metadata and other relevant documentation.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "metadataCompletenessRate": {
                                "selector": {
                                    "id": "range",
                                    "title": "Metadata completeness rate",
                                    "config": {
                                        "min": 0,
                                        "max": 100,
                                        "type": "single"
                                    },
                                    "source": [{
                                        "value": "metadataCompletenessRate",
                                        "label": "Metadata completeness rate"
                                    }],
                                    "template": {
                                        "title": "Metadata completeness rate",
                                        "description": "The percentage of completeness of metadata offers a numerical evaluation of the extent to which the resource is documented.",
                                        "hideSwitch": false,
                                        "hideRemoveButton": false
                                    }
                                }
                            }
                        }
                    },
                    "confidentiality": {
                        "title": "Confidentiality",
                        "description": "This section information on the level of confidentiality and the applied policy for releasing the resource. This metadata sub-entity concerns legislation (or any other formal provision) related to statistical confidentiality applied to the resource as well as the actual confidentiality data treatment applied (also with regard to the aggregated data disseminated).",
                        "selectors": {
                            "confidentialityPolicy": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "confidentialityPolicy",
                                            "label": "Confidentiality - Policy"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Confidentiality - Policy",
                                    "description": "Legislative measures or other formal procedures which prevent unauthorized disclosure of data that identify a person or economic entity either directly or indirectly. It consists in textual description and references to legislation or other rules related to statistical confidentiality.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "confidentialityDataTreatment": {
                                "selector": {
                                    "id": "input",
                                    "type": "text",
                                    "source": [
                                        {
                                            "value": "confidentialityDataTreatment",
                                            "label": "Confidentiality - Data treatment"
                                        }
                                    ]
                                },
                                "template": {
                                    "title": "Confidentiality - Data treatment",
                                    "description": "Rules applied for treating the resource to ensure confidentiality and prevent unauthorized disclosure.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "confidentialityStatus": {
                                "selector": {
                                    "id": "dropdown",
                                    "cl": StatusConfidenciality
                                },
                                "template": {
                                    "title": "Status of confidentiality",
                                    "description": "Coded information describing the degree of confidentiality of the resource",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            }
                        }
                    }
                }

            },
            "maintenance": {
                "title": "Maintenance",
                "description": "This section provides information about the frequency of resource upgrade and metadata maintenance.",
                "selectors": {
                    "maintenanceAgency": {
                        "selector": {
                            "id": "input",
                            "type": "text",
                            "source": [
                                {
                                    "value": "maintenanceAgency",
                                    "label": "Maintenance agency"
                                }
                            ]
                        },
                        "template": {
                            "title": "Maintenance agency",
                            "description": "Organization or other expert body that maintains the resource.",
                            "hideSwitch": false,
                            "hideRemoveButton": false
                        }
                    }
                },
                "sections": {
                    "update": {
                        "title": "Update",
                        "description": "This section involves maintenance operations concerning the periodic update of the resource.",
                        "selectors": {
                            "updateDate": {
                                "selector": {
                                    "id": "time"
                                },
                                "template": {
                                    "title": "Last update date",
                                    "description": "Last physical update date.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "updatePeriodicity": {
                                "selector": {
                                    "id": "dropdown",
                                    "cl": UpdatePeriodicity
                                },
                                "template": {
                                    "title": "Frequency of update",
                                    "description": "Time span between the completion of the production process of statistical data and their publication.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            }
                        }
                    },
                    "metadataMaintenance": {
                        "title": "Metadata Maintenance",
                        "description": "This section involves maintenance operations concerning the periodic update of metadata to ensure that the resource is properly described.",
                        "selectors": {
                            "metadataLastCertified": {
                                "selector": {
                                    "id": "time"
                                },
                                "template": {
                                    "title": "Metadata last certified",
                                    "description": "Latest date of certification of the metadata.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "metadataLastPosted": {
                                "selector": {
                                    "id": "time"
                                },
                                "template": {
                                    "title": "Metadata last posted",
                                    "description": "Latest date of publication of the metadata. It is usually automatically updated by the metadata production system.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            },
                            "metadataLastUpdate": {
                                "selector": {
                                    "id": "time"
                                },
                                "template": {
                                    "title": "Metadata last update",
                                    "description": "Most recent date of update of the metadata.",
                                    "hideSwitch": false,
                                    "hideRemoveButton": false
                                }
                            }
                        }
                    }
                }
            }
        }

    });
