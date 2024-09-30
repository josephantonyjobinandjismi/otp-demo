/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
/**************************************************
 * Induction Training
 * OTP-7870 : Overdue Warning
 * 
 * *******************************************************************
 * 
 * Author : Jobin and Jismi IT Services LLP.
 * 
 * Date Created : 24 September 2024
 * 
 * Description : Give a warning to the (Sales rep) while they create a sales order for the overdue customer.
 * REVISION HISTORY 
 * @version  1.0 : : 24 September 2024 : Created the intial build  by  JJ0365 
 * 
 * 
 * 
 **********************************************************************************************/
define(['N/record'],
    /**
     * @param{record} record
     */
    function (record) {

        let overdueCustomer = false;

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

        /**
         *Function to be executed when customer field is changed
         *
         * @param {Object} scriptContext
         */
        function checkCustomerOverdue(scriptContext) {

            try {
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
            catch (e) {
                console.log("Error: ", e);
            }
        }

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
            fieldChanged: fieldChanged,
            saveRecord: saveRecord
        };

    });
