/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
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
define(['N/email', 'N/record'],
    /**
     * @param{email} email
     * @param{record} record
     */
    function (email, record) {

        let overdueCustomer = false;
        // /**
        //  * Function to be executed after page is initialized.
        //  *
        //  * @param {Object} scriptContext
        //  * @param {Record} scriptContext.currentRecord - Current form record
        //  * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
        //  *
        //  * @since 2015.2
        //  */
        // function pageInit(scriptContext) {

        // }

        /**
             *Function to be executed when customer field is changed
             *
             * @param {Object} scriptContext
             */
        function checkCustomerOverdue(scriptContext) {
            // Load the customer record
            let customer = record.load({
                type: record.Type.CUSTOMER,
                id: scriptContext.currentRecord.getValue({
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

        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {
            try {
                const currentField = scriptContext.fieldId;

                //Executed when customer field is changed
                if (currentField === 'entity') {
                    checkCustomerOverdue(scriptContext);
                }

            } catch (e) {
                console.log("Error: ", e);
            }

        }

        // /**
        //  * Function to be executed when field is slaved.
        //  *
        //  * @param {Object} scriptContext
        //  * @param {Record} scriptContext.currentRecord - Current form record
        //  * @param {string} scriptContext.sublistId - Sublist name
        //  * @param {string} scriptContext.fieldId - Field name
        //  *
        //  * @since 2015.2
        //  */
        // function postSourcing(scriptContext) {

        // }

        // /**
        //  * Function to be executed after sublist is inserted, removed, or edited.
        //  *
        //  * @param {Object} scriptContext
        //  * @param {Record} scriptContext.currentRecord - Current form record
        //  * @param {string} scriptContext.sublistId - Sublist name
        //  *
        //  * @since 2015.2
        //  */
        // function sublistChanged(scriptContext) {

        // }

        // /**
        //  * Function to be executed after line is selected.
        //  *
        //  * @param {Object} scriptContext
        //  * @param {Record} scriptContext.currentRecord - Current form record
        //  * @param {string} scriptContext.sublistId - Sublist name
        //  *
        //  * @since 2015.2
        //  */
        // function lineInit(scriptContext) {

        // }

        // /**
        //  * Validation function to be executed when field is changed.
        //  *
        //  * @param {Object} scriptContext
        //  * @param {Record} scriptContext.currentRecord - Current form record
        //  * @param {string} scriptContext.sublistId - Sublist name
        //  * @param {string} scriptContext.fieldId - Field name
        //  * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
        //  * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
        //  *
        //  * @returns {boolean} Return true if field is valid
        //  *
        //  * @since 2015.2
        //  */
        // function validateField(scriptContext) {

        // }

        // /**
        //  * Validation function to be executed when sublist line is committed.
        //  *
        //  * @param {Object} scriptContext
        //  * @param {Record} scriptContext.currentRecord - Current form record
        //  * @param {string} scriptContext.sublistId - Sublist name
        //  *
        //  * @returns {boolean} Return true if sublist line is valid
        //  *
        //  * @since 2015.2
        //  */
        // function validateLine(scriptContext) {

        // }

        // /**
        //  * Validation function to be executed when sublist line is inserted.
        //  *
        //  * @param {Object} scriptContext
        //  * @param {Record} scriptContext.currentRecord - Current form record
        //  * @param {string} scriptContext.sublistId - Sublist name
        //  *
        //  * @returns {boolean} Return true if sublist line is valid
        //  *
        //  * @since 2015.2
        //  */
        // function validateInsert(scriptContext) {

        // }

        // /**
        //  * Validation function to be executed when record is deleted.
        //  *
        //  * @param {Object} scriptContext
        //  * @param {Record} scriptContext.currentRecord - Current form record
        //  * @param {string} scriptContext.sublistId - Sublist name
        //  *
        //  * @returns {boolean} Return true if sublist line is valid
        //  *
        //  * @since 2015.2
        //  */
        // function validateDelete(scriptContext) {

        // }

        /**
            * Validation function to be executed when record is saved.
            *
            * @param {Object} scriptContext
            * @param {Record} scriptContext.currentRecord - Current form record
            * @returns {boolean} Return true if record is valid
            *
            * @since 2015.2
            */

        function saveRecord(scriptContext) {
            try {

                if (overdueCustomer) {
                    // Display Confirm Box
                    if (window.confirm("You are creating sales order for an overdue customer!")) {
                        return true;
                    }
                    else return false;
                }

                return true;

            }
            catch (e) {
                console.log("Error: ", e);
            }
        }

        return {
            // pageInit: pageInit,
            fieldChanged: fieldChanged,
            // postSourcing: postSourcing,
            // sublistChanged: sublistChanged,
            // lineInit: lineInit,
            // validateField: validateField,
            // validateLine: validateLine,
            // validateInsert: validateInsert,
            // validateDelete: validateDelete,
            saveRecord: saveRecord
        };

    });
