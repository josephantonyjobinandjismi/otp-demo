/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
/**************************************************
 * Induction Training
 * OTP-7926 : Search through the database to find the matching blood donors
 * 
 * *******************************************************************
 * 
 * Author : Jobin and Jismi IT Services LLP.
 * 
 * Date Created : 14 October 2024
 * 
 * Description : Create a new form to search for the eligible blood donors, based on the filters blood group and last donation date (should be three months before) with the entered details.
 * It must capture the details of the required blood group (and the last donation date) to find the best and eligible donors.
 * Every eligible donor must be displayed in the form with their details (such as Name, Phone Number).

 * REVISION HISTORY 
 * @version  1.0 : : 14 October 2024 : Created the intial build  by  JJ0365 
 * 
 * 
 * 
 **********************************************************************************************/
define(['N/ui/serverWidget'],
    /**
 * @param{serverWidget} serverWidget
 */
    (serverWidget) => {

        /**
         *Function to create blood donor search form
         *
         * @param {*} scriptContext
         */
         function createBloodDonorFilterForm(scriptContext) {
            try {
                // Create the form
                let form = serverWidget.createForm({
                    title: 'Search Eligible Blood Donors'
                });

                // Blood Group Filter (Dropdown)
                var bloodGroupField = form.addField({
                    id: 'custpage_jj_bloodgroup',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Blood Group'
                });

                // Adding blood group options
                bloodGroupField.addSelectOption({ value: '', text: '' });
                bloodGroupField.addSelectOption({ value: '1', text: 'A+' });
                bloodGroupField.addSelectOption({ value: '2', text: 'A-' });
                bloodGroupField.addSelectOption({ value: '3', text: 'B+' });
                bloodGroupField.addSelectOption({ value: '4', text: 'B-' });
                bloodGroupField.addSelectOption({ value: '5', text: 'AB+' });
                bloodGroupField.addSelectOption({ value: '6', text: 'AB-' });
                bloodGroupField.addSelectOption({ value: '7', text: 'O+' });
                bloodGroupField.addSelectOption({ value: '8', text: 'O-' });

                // Last Donation Date Filter (Date)
                var lastDonationDateField = form.addField({
                    id: 'custpage_jj_lastdonationdate',
                    type: serverWidget.FieldType.DATE,
                    label: 'Last Donation Date'
                });

                let bloodDonarsublist = form.addSublist({
                    id: 'custpage_jj_blood_sublist',
                    type: serverWidget.SublistType.INLINEEDITOR,
                    label: 'Blood Donar Details'
                });

                bloodDonarsublist.addField({
                    id: 'custpage_jj_first_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'First Name'
                });

                bloodDonarsublist.addField({
                    id: 'custpage_jj_last_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Last Name'
                });

                bloodDonarsublist.addField({
                    id: 'custpage_jj_phone_number',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone Number'
                });

                form.clientScriptModulePath = "SuiteScripts/JobinAndJismi/OTP-7926 Blood Donor Search Form/jj_cs_blood_donor_search_form_otp_7926.js";

                // Display the form to the user
                scriptContext.response.writePage(form);
            }
            catch (e) {
                log.error("Error: ", e);
            }
        }

        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try {
                if (scriptContext.request.method === 'GET') {
                    createBloodDonorFilterForm(scriptContext);
                }
            }

            catch (e) {
                log.error("Error: ", e);
            }
        }

        return {onRequest}

    });
