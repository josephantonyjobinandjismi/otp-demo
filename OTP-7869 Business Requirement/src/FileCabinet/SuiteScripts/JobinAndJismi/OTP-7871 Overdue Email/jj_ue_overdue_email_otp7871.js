/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
/**************************************************
 * Induction Training
 * OTP-7871 : Overdue Email
 * 
 * *******************************************************************
 * 
 * Author : Jobin and Jismi IT Services LLP.
 * 
 * Date Created : 26 September 2024
 * 
 * Description : Give an email alert to the Sales rep's manager while they create a sales order for the overdue customer.
 * REVISION HISTORY 
 * @version  1.0 : : 26 September 2024 : Created the intial build  by  JJ0365 
 * 
 * 
 * 
 **********************************************************************************************/
define(['N/email', 'N/record', 'N/log'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{log} log
 */
    (email, record, log) => {

        let overdueCustomer = false;

        /**
         *Function to check whether a customer is overdue or not
         *
         * @param {Object} scriptContext
         */
        function checkCustomerOverdue(scriptContext) {

            try {
                // Load the customer record
                let customer = record.load({
                    type: record.Type.CUSTOMER,
                    id: scriptContext.newRecord.getValue({
                        fieldId: 'entity'
                    }),
                    isDynamic: true
                })

                //Get no of overdue days
                let daysOverdue = Number(customer.getValue({
                    fieldId: 'daysoverdue'
                }));

                //Check whether the overdue days are greater than zero
                if (daysOverdue > 0) {
                    overdueCustomer = true;
                }
            }
            catch (e) {
                log.debug("Error: ", e);
            }
        }

        /**
         *Function to send email to sales rep's supervisor
         *
         * @param {*} scriptContext
         */
        function sendEmail(scriptContext) {
            try {
                let senderId = scriptContext.newRecord.getValue({
                    fieldId: 'salesrep'
                });

                let salesRep = record.load({
                    type: record.Type.EMPLOYEE,
                    id: senderId,
                    isDynamic: true
                });

                let recipientId = salesRep.getValue({
                    fieldId: 'supervisor'
                });

                let salesRepName = salesRep.getText({
                    fieldId: 'entityid'
                });

                let supervisorName = salesRep.getText({
                    fieldId: 'supervisor'
                });

                let salesOrderLink = `https://td2934324.app.netsuite.com/app/accounting/transactions/salesord.nl?id=${scriptContext.newRecord.id}&whence=&cmid=1727972249814_5444`;

                if (supervisorName) {
                    email.send({
                        author: senderId,
                        recipients: recipientId,
                        subject: 'Sales Order created for Overdue Customer',
                        body: `Dear ${supervisorName},
                This is to inform you that a Sales Order is created by ${salesRepName} for an overdue customer. 
                Find the link of the sales order: ${salesOrderLink}`
                    });
                }
            }
            catch (e) {
                log.debug("Error: ", e);
            }
        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {
            try {

                //Check if the customer is overdue or not
                checkCustomerOverdue(scriptContext);

                if (overdueCustomer) {
                    // Send email to sales reps supervisor
                    sendEmail(scriptContext);
                }

            }
            catch (e) {
                log.debug("Error: ", e);
            }
        }

        return { afterSubmit }

    });
