/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
/**************************************************
 * Induction Training
 * OTP-7925 : Custom form to store blood donor details and track them in database
 * 
 * *******************************************************************
 * 
 * Author : Jobin and Jismi IT Services LLP.
 * 
 * Date Created : 8 October 2024
 * 
 * Description : Create a blood donor registration form that must contain Name (First Name, Last Name), Gender, Phone Number, Blood Group, Last Donation Date. When data is entered into the form, store the values in the custom record.
 * REVISION HISTORY 
 * @version  1.0 : : 8 October 2024 : Created the intial build  by  JJ0365 
 * 
 * 
 * 
 **********************************************************************************************/
define(['N/record', 'N/ui/serverWidget', 'N/format', 'N/search'],
    /**
 * @param{record} record
 * @param{serverWidget} serverWidget
 * @param{format} format
 */
    (record, serverWidget, format, search) => {
        /**
         *Create a blood donor form to fetch details of the blood donor.
         *
         * @param {*} scriptContext
         */
        function createBloodDonorForm(scriptContext) {
            try {
                var form = serverWidget.createForm({
                    title: 'Blood Donor Details'
                });

                // Add fields to the form
                form.addField({
                    id: 'custpage_jj_first_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'First Name'
                }).isMandatory = true;

                form.addField({
                    id: 'custpage_jj_last_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Last Name'
                });

                form.addField({
                    id: 'custpage_jj_gender',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Gender',
                    source: 'customlist_jj_gender'
                }).isMandatory = true;

                form.addField({
                    id: 'custpage_jj_phone_number',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone Number'
                }).isMandatory = true;

                form.addField({
                    id: 'custpage_jj_blood_group',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Blood Group',
                    source: 'customlist_jj_blood_group'
                }).isMandatory = true;

                form.addField({
                    id: 'custpage_jj_last_donation_date',
                    type: serverWidget.FieldType.DATE,
                    label: 'Last Donation Date'
                }).isMandatory = true;

                // Add a submit button
                form.addSubmitButton({
                    label: 'Submit Donor Details'
                });

                // Render the form
                scriptContext.response.writePage(form);
            }
            catch (e) {
                log.error("Error: ", e);
            }
        }

        /**
         *Function to create blood donor record in netsuite from the details fetched from suitlet form
         *
         * @param {*} scriptContext
         */
        function createBloodDonorRecord(scriptContext) {
            try {
                var firstName = scriptContext.request.parameters.custpage_jj_first_name;
                var lastName = scriptContext.request.parameters.custpage_jj_last_name;
                var gender = scriptContext.request.parameters.custpage_jj_gender;
                var phoneNumber = scriptContext.request.parameters.custpage_jj_phone_number;
                var bloodGroup = scriptContext.request.parameters.custpage_jj_blood_group;
                var lastDonationDate = scriptContext.request.parameters.custpage_jj_last_donation_date;
                let formattedDate = format.parse({ value: lastDonationDate, type: format.Type.DATE });
                let todayDate = new Date();

                if (formattedDate > todayDate) {
                    scriptContext.response.write("The date cannot be a future date!!");
                    throw "dateError";
                }

                if (phoneNumber < 1000000 || phoneNumber > 9999999999) {
                    scriptContext.response.write("Invalid Phone Number!!");
                    throw "Phone Number Error";
                }

                //Duplicate record detection

                let bloodDonorSearch = search.create({
                    type: 'customrecord_jj_blood_donor_otp7925',
                    filters: [
                        ['custrecord_jj_first_name', 'is', firstName],
                        'AND',
                        ['custrecord_jj_last_name', 'is', lastName],
                        'AND',
                        ['custrecord_jj_phone_number', 'is', phoneNumber],
                        'AND',
                        ['custrecord_jj_gender', 'anyof', gender],
                        'AND',
                        ['custrecord_jj_blood_group', 'anyof', bloodGroup],
                        'AND',
                        ['custrecord_jj_last_donation_date', 'on', lastDonationDate]
                    ]
                });

                let result = bloodDonorSearch.run().getRange({
                    start: 0,
                    end: 1
                });

                if (result.length > 0) {
                    scriptContext.response.write("Creation of duplicate record is not allowed!!");
                    throw "Duplicate Record Error";
                }

                var donorRecord = record.create({
                    type: 'customrecord_jj_blood_donor_otp7925' // custom record type
                });

                donorRecord.setValue({ fieldId: 'custrecord_jj_first_name', value: firstName });
                donorRecord.setValue({ fieldId: 'custrecord_jj_last_name', value: lastName });
                donorRecord.setValue({ fieldId: 'custrecord_jj_gender', value: gender });
                donorRecord.setValue({ fieldId: 'custrecord_jj_phone_number', value: phoneNumber });
                donorRecord.setValue({ fieldId: 'custrecord_jj_blood_group', value: bloodGroup });
                donorRecord.setValue({ fieldId: 'custrecord_jj_last_donation_date', value: formattedDate });

                // Save the record
                donorRecord.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: false
                });

                // Display a confirmation message
                scriptContext.response.write("Blood Donor Details successfully submitted.");
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
                    // Create the form
                    createBloodDonorForm(scriptContext);
                }

                else {
                    // Handle the POST request

                    // Creating a custom record for blood donors
                    createBloodDonorRecord(scriptContext);
                }
            }

            catch (e) {
                log.error("Error: ", e);
            }
        }

        return { onRequest }

    });
