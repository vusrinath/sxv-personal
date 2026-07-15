
Ways in which your app can call mainframe modules that are being sunset by EOY:

Calls to dsv specific documents (dsv-natural-docs.csv)
Calls to dsv-generic or sync-mfproxy-v2 by passing mainframe module name (esag-modules.csv) in request parameters or payload
Calls to isv commands: update-cwf, log-cwf, UpdateAcisEnrollment
Use of of "EntireX" in code


Action Items (due by June 4, 2026):

Analyze all your applications for the impacts of this sunset:
To help with your analysis, I have created a steering document (mf-analysis.md) with necessary inputs & analysis rules. Please feel free to enhance/correct this as needed.
Place this .md file along with above two csv files in your global kiro context (C:\Users\<<racf-id>>\.kiro\steering).
Now you can perform analysis using this .md file on any of your code repo/workspace by using simple prompts in Kiro (sample prompt: "perform analysis in this code base using mf-analysis.md and provide a report") 
Capture the data you are retrieving/updating from/to these mainframe calls 
If you plan to shut down your api or endpoints to support this elimination, please let your consumers know so that they can account for this in their estimate.
Prilimnary list of impacted apps is available in "Estimates" sheet in SAG Exit DSV Natural EOL.xlsx
Estimate the cost of switching to alternate api/SORs if the calls are still needed
Update SAG Exit DSV Natural EOL.xlsx with your app name, analysis and cost estimate in "Estimates" sheet
Use capability-level t-short sizing for estimates (refer "Summary" sheet)
Resources:

SAG Exit DSV Natural EOL.xlsx List of all SAG modules that are being decommissioned : "all-mf-modules" worksheet 
List of dsv documents that in turn call SAG modules being decommissioned: " dsv-docs" worksheet
Production Activity (based on Splunk query)
dsv calls that go to SAG modules: "dsv prod" worksheet 
sync-mfproxy-v2 calls: "sync-mf prod" worksheet 
isv-prod calls : "isv prod" worksheet 
DSV git repo: dsv-data-services
DSV Consumers:
Splunk query: 2026-02-DSV-V1-Cosumer-and-Docs-they-call | Splunk 9.3.1
List as of 2026-02: 2026-02 - DSV Consumers and the Docs they call - ESB - Architecture and Engineering Value Stream
syn-mf-proxy consumers : prod splunk query "index=container_prod* (esb_environment=kong-dr  OR esb_environment=kong-clt*) container_name=*   esb_service=sync-mfproxy-v2-api* esb_consumer=* esb_consumer=*   esb_event=*  METADATA | stats count by  esb_consumer"
Prod ISVSupport

Zoom Recording  (Passcode: s#H2cC)


Potential Solutions: DSV_Alternative_Solutions_Catalog_2026-06-09.docx



Consumer	document	Team	Contact	Ball park estimate
ParticipantDownload

(Quicken Webconnect and Quicken DirectConnect)

product-transaction-download-v4	Nova	Vanishri Gadekal	
ParticipantDownload

(Quicken Webconnect and Quicken DirectConnect)

product-accumulation-download-v4	Nova	Vanishri Gadekal	
mobileretirementrsv1	participant-portfolio-v2	


RetirementIllustrationV1	rix-participant-v6	


IVR	participant-recent-activity-v3	


bus-beneficiary-api	pending-beneficiary-v2	



EFRSpringBatchProcesses	individual-v23	


ACCOUNTINQUIRY	gic-vintages-v2	Panther	
Chouksey, Rahul Yadav, Rohit 



PortfolioAdviceWS	client-detail-v15	


PVC	associate-unit-info-v1	Guardians	
Tyarla, Anuradha Agicha, Vishal 


AssetTransferExternalRSV1	plan-detail-v8	


AssetTransferExternalRSV1	sg-participant-plans-v6	


ParticipantPortfolioV1	participant-recent-activity-v5	Rockstar	
Nawazkhan, Sana Bhole, Darshan 



UnifiedDesktopClientTransactions	slo-data-by-racf-v3	


trps	tcash-participant-info-v2	


trps	tcash-search-v1	


TaxWithholdingWS	participant-elections-dsv-v6	


PVC	participant-plan-lookup-v10	Guardians	
Tyarla, Anuradha Agicha, Vishal 


UnifiedDesktopParticipant	gic-vintages-v3	


PVC	slo-data-by-racf-v1	Guardians	
Tyarla, Anuradha Agicha, Vishal 


RetirementPlanEFTWS	individual-v23	


RetirementPlanEFTWS	global-eft-v4	


PVC	associate-name-v3	Guardians	
Tyarla, Anuradha Agicha, Vishal 


ParticipantFormWS	tax-forms-selection-v1	


ParticipantBeneficiaryWSV1	beneficiary-v1	


trps	employer-remittance-detail-v3	


ElectronicFundTransferService	individual-v23	


UDFAOCASUI	work-flow-data-v1	


UDFAOCASUI	individual-org-v1	


LumpsumTransactionRS	annuitization-rqst-list-v4	


DigitalTransactionHub	dsv-generic	


UDFAOCASUI	finalist-address-verification-v2	


RetirementPlanEFTWS	contribution-limits-v1	


OPSInstCalendar	plan-detail-v7	


ParticipantProfile	tax-forms-selection-v1	Nova	
Jamadagni, Chaitanya Kanaki, Pallavi 


AssetTransferExternalRSV1	employer-investment-options-v1	


AnnuityAdminRSV1	dsv-generic	


ElectronicFundTransferService	contribution-limits-v1	


ParticipantTools	performance-view-v4	Nova	
Jamadagni, Chaitanya Kanaki, Pallavi 


LumpsumTransactionRS	annuitization-contract-info-v4	


trps	employer-remittance-detail-v4	


UDFAOCASUI	participant-plans-v2	


UDFAOCASUI	plan-detail-v5	


TaxWithholdingWS	dsv-generic	Nova	Jamadagni, Chaitanya Kanaki, Pallavi 	
AssetTransferExternalRSV1	external-contacts-for-plan-v1	


RetirementPlanTransactionRSV1	individual-v14	


adas	annuitization-control-table-v1	


RetirementIllustrationV1	rix-mortality-v1	


RetirementIllustrationV1	rix-rate-new-products-v1	


RetirementIllustrationV1	rix-rates-v5	


TDACounselingOmni	tda-part-plan-v2	


TDACounselingOmni	slo-data-by-racf-v1	


RetirementIllustrationV1	vintage-info-v1	


ParticipantBeneficiaryWSV1	pending-beneficiary-v2	


adas	annuitization-rqst-list-v4	


TDACounselingOmni	tda-plan-lookup-v2	


TDACounselingOmni	tda-prior-contrib-v0	


adas	annuitization-beneficiary-info-v1	


adas	annuitization-contract-info-v4	


adas	annuitization-participant-info-v6	


TaxWithholdingWS	tax-country-state-info-v1	


TDACounselingOmni	tda-actuarial-calc-v1	


income-aws-batch	rix-mortality-v1	


income-aws-batch	rix-rate-new-products-v1	


income-aws-batch	rix-rates-v5	


TDACounselingOmni	name-address-v2	






