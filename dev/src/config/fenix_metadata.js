define(
    function () {

        var IANA = {uid: 'IANAcharacterSet'},
            ROLE = { uid: "ResponsiblePartyRole" },
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
            CoverageSector = {uid: 'CSTAT_Core'};


        return {

            "selectors": {
                "uid": {
                    "selector": {
                        "id": "input",
                        "type": "text",
                        "source": [
                            {
                                "value": "uid",
                                "label": "Uid"
                            }
                        ],
                        config: {
                            readonly: true
                        }
                    },
                    "format": {
                        "output": "string"
                    }
                },

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

                    "format": {
                        "output": "label"
                    },
                    "constraints": {"presence": true}

                },

                "creationDate": {
                    "selector": {
                        "id": "time"
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


                    "format": {
                        "output": "codes"
                    },

                    "constraints": {"presence": true}
                },
                "language": {
                    "cl": Languages,
                    "selector": {
                        "id": "dropdown",
                        "default": ['eng']
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
                                "label": "Language details"
                            }
                        ]
                    },

                    "format": {
                        "output": "label"
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

                    "format": {
                        "output": "string"
                    },
                    "constraints": {"presence": true}
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

                    "format": {
                        "output": "string"
                    }
                },
                "metadataLanguage": {
                    "cl": Languages,
                    "selector": {
                        "id": "dropdown",
                        "default": ['eng']
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
                                "label": "Value assigned to No-data"
                            }
                        ]
                    },

                    "format": {
                        "output": "string"
                    }
                },

                "contacts": {

                    classNames: "well",
                    "incremental": true,
                    initialAmount : 1,

                    "selectors": {
                        "organization": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [{"value": "organization", "label": "Source"}]
                            },
                            "format": {
                                "output": "label"
                            },
                            template: {
                                title: "Source"
                            },
                            "constraints": {"presence": true}

                        },
                        "organizationUnit": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [{"value": "organizationUnit", "label": "Organization unit/division"}]

                            },

                            "format": {
                                "output": "label"
                            }

                        },

                        "role": {
                            enumeration: ROLE,

                            "selector": {
                                "id": "dropdown",
                                config: {
                                    maxItems: 1
                                }
                            },

                            "format": {
                                "output": "label"
                            }

                        },

                        "specify": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [{"value": "specify", "label": "Specify"}],
                                config: {
                                    readonly: true
                                }

                            },

                            "format": {
                                "output": "label"
                            },
                            dependencies: {
                                role: [{id: "readOnlyIfNotValue", event: "select", args: {value: "other"}}]
                            },

                        },

                        "position": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [{"value": "organizationUnit", "label": "Position"}]

                            },

                            "format": {
                                "output": "label"
                            }

                        },
                        "pointOfContact": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [{"value": "pointOfContact", "label": "Point of contact"}]

                            },

                            "format": {
                                "output": "string"
                            }

                        },

                        "phone": {
                            "selector": {
                                "id": "input",
                                "type": "text",
                                "source": [{"value": "phone", "label": "Telephone"}]
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
                                "source": [{"value": "address", "label": "Address"}]
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
                                "source": [{"value": "emailAddress", "label": "E-mail address"}]
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
                                "source": [{"value": "hoursOfService", "label": "Hour of service"}]
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
                    "title": "Content",
                    "description": "This section includes a summary of the content of the resource and the description of the geographical, time and sector coverage.",
                    "selectors": {
                        "keywords": {
                            "selector": {
                                "id": "input",
                                type: "text"
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
                                        "label": "Statistical concepts / definitions"
                                    }
                                ]
                            },

                            "format": {
                                "output": "label"
                            }

                        }
                    },
                    "sections": {
                        "seReferencePopulation": {
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
                                                "label": "Statistical unit"
                                            }
                                        ]
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

                                    "format": {
                                        "output": "codes"
                                    },
                                    "constraints": {"presence": true}
                                },
                                "referenceArea": {
                                    "cl": AreaOfReference,
                                    "selector": {
                                        "id": "dropdown",
                                        sort: false
                                    },

                                    "format": {
                                        "output": "codes"
                                    },
                                    "constraints": {"presence": true}
                                }
                            },
                            "validator": {
                                "valReferencePopulation": true
                            }
                        },
                        "seCoverage": {
                            "title": "Coverage",
                            "selectors": {
                                "coverageSectors": {
                                    "cl": CoverageSector,
                                    "selector": {
                                        "id": "dropdown"
                                    },

                                    "format": {
                                        "output": "codes"
                                    },
                                    "constraints": {"presence": true}
                                },
                                "coverageSectorsDetails": {
                                    "selector": {
                                        "id": "input",
                                        "type": "text",
                                        "source": [{
                                            "value": "coverageSectorsDetails",
                                            "label": "Coverage Sector Details"
                                        }]
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

                                    "format": {
                                        "output": "codes"
                                    },
                                    "constraints": {"presence": true}
                                },
                                "coverageTime": {
                                    "format": {
                                        "output": "period"
                                    },
                                    selectors: {
                                        from: {
                                            classNames: "col-xs-6",
                                            selector: {
                                                id: "time"
                                            }

                                        },
                                        to: {
                                            classNames: "col-xs-6",
                                            selector: {
                                                id: "time"
                                            }
                                        }
                                    }
                                }
                            },
                            "validator": {
                                "valCoverage": true
                            }
                        }
                    }
                },
                "meInstitutionalMandate": {
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
                                        "label": "Data sharing arrangements"
                                    }
                                ]
                            },

                            "format": {
                                "output": "label"
                            }
                        }
                    }
                },
                "meStatisticalProcessing": {
                    "title": "Statistical Processing",
                    "sections": {
                        "seDataSource": {
                            "title": "Data source",
                            "sections": {
                                "sePrimaryDataCollection": {
                                    "title": "Primary Data Collection",
                                    "selectors": {
                                        "typeOfCollection": {
                                            "cl": TypeOfCollection,
                                            "selector": {
                                                "id": "dropdown"
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
                                                        "label": "Sampling procedure"
                                                    }
                                                ]
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
                                                        "label": "Data collection"
                                                    }
                                                ]
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
                                                        "label": "Organization"
                                                    }
                                                ]
                                            },

                                            "format": {
                                                "output": "string"
                                            }
                                        },
                                    }
                                },
                                "seSecondaryDataCollection": {
                                    "title": "Secondary Data Collection",
                                    "selectors": {
                                        "originOfCollectedData": {
                                            "cl": OriginOfCollectedData,
                                            "selector": {
                                                "id": "dropdown"
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
                                                        "label": "Description of raw data"
                                                    }
                                                ]
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
                                                        "label": "Organization"
                                                    }
                                                ]
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
                                                        "label": "Data collection"
                                                    }
                                                ]
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
                                                "label": "Weights"
                                            }
                                        ]
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
                                                "label": "Process of aggregation"
                                            }
                                        ]
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
                                                "label": "Aggregation formula"
                                            }
                                        ]
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
                                                "label": "Details on process of adjustment"
                                            }
                                        ]
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
                                                "label": "Type of index"
                                            }
                                        ]
                                    },

                                    "format": {
                                        "output": "label"
                                    }
                                },
                                "basePeriod": {
                                    "selector": {
                                        "id": "time"
                                    },

                                    "format": {
                                        "output": "date"
                                    }
                                }
                            }
                        },
                        "seDataValidation": {
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
                                                "label": "Data validation - output"
                                            }
                                        ]
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
                                                "label": "Data validation - source"
                                            }
                                        ]
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
                                        "label": "Data quality assessment"
                                    }
                                ]
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
                                        "label": "Quality assurance"
                                    }
                                ]
                            },

                            "format": {
                                "output": "label"
                            }
                        }
                    },
                    "sections": {
                        "seAccuracy": {
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
                                                "label": "Accuracy - sampling error"
                                            }
                                        ]
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
                                                "label": "Completeness"
                                            }
                                        ]
                                    },

                                    "format": {
                                        "output": "label"
                                    }
                                }
                            }
                        },
                        "seDataRevision": {
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
                                                "label": "Revision practice"
                                            }
                                        ]
                                    },

                                    "format": {
                                        "output": "label"
                                    }
                                }
                            }
                        },
                        "seComparability": {
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
                                                "label": "Time comparability"
                                            }
                                        ]
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
                                                "label": "Internal coherence"
                                            }
                                        ]
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
                    "title": "Accessibility",
                    "sections": {
                        "seDataDissemination": {
                            "title": "Data Dissemination",
                            "sections": {
                                "seDistribution": {
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

                                            "format": {
                                                "output": "string"
                                            }
                                        },
                                        "disseminationFormat": {

                                            "selector": {
                                                "id": "input",
                                                "type": "text",
                                                "source": [
                                                    {
                                                        "value": "disseminationFormat",
                                                        "label": "Dissemination formats"
                                                    }
                                                ]
                                            },

                                            "format": {
                                                "output": "array"
                                            }
                                        }
                                    }
                                },
                                "seReleasePolicy": {
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
                                                        "label": "Access to the release calendar"
                                                    }
                                                ]
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

                                            "format": {
                                                "output": "codes"
                                            }
                                        },
                                        "embargoTime": {
                                            "format": {
                                                "output": "period"
                                            },
                                            selectors: {
                                                from: {
                                                    classNames: "col-xs-6",
                                                    selector: {
                                                        id: "time"
                                                    }

                                                },
                                                to: {
                                                    classNames: "col-xs-6",
                                                    selector: {
                                                        id: "time"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "seClarity": {
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

                                    "format": {
                                        "output": "label"
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
                                        }
                                    },
                                    "format": {
                                        "output": "string"
                                    },

                                }
                            }
                        },
                        "seConfidentiality": {
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
                                                "label": "Confidentiality - Data treatment"
                                            }
                                        ]
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

                            "format": {
                                "output": "label"
                            }
                        }
                    },
                    "sections": {
                        "seUpdate": {
                            "title": "Update",
                            "description": "This section involves maintenance operations concerning the periodic update of the resource.",
                            "selectors": {
                                "updateDate": {
                                    "selector": {
                                        "id": "time"
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

                                    "format": {
                                        "output": "codes"
                                    }
                                }
                            }
                        },
                        "seMetadataMaintenance": {
                            "title": "Metadata Maintenance",
                            "description": "This section involves maintenance operations concerning the periodic update of metadata to ensure that the resource is properly described.",
                            "selectors": {
                                "metadataLastCertified": {
                                    "selector": {
                                        "id": "time"
                                    },

                                    "format": {
                                        "output": "date"
                                    }
                                },
                                "metadataLastPosted": {
                                    "selector": {
                                        "id": "time"
                                    },

                                    "format": {
                                        "output": "date"
                                    }
                                },
                                "metadataLastUpdate": {
                                    "selector": {
                                        "id": "time"
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
