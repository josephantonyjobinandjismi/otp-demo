/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
/**************************************************
 * Induction Training
 * OTP-7872 : Restrict Item Fulfillment
 * 
 * *******************************************************************
 * 
 * Author : Jobin and Jismi IT Services LLP.
 * 
 * Date Created : 10 October 2024
 * 
 * Description : This script is for displaying warning message for item fulfillment if custom checkbox is checked.
 * REVISION HISTORY 
 * @version  1.0 : : 10 October 2024 : Created the intial build  by  JJ0365 
 * 
 * 
 * 
 **********************************************************************************************/
define(['N/record'],
    /**
     * @param{record} record
     */
    function (record) {
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
                let salesOrder = scriptContext.currentRecord;

                let customFieldChecked = salesOrder.getValue('custbody_jj_hold_fulfillment_otp_7872');

                if (customFieldChecked) {
                    // Display Confirm Box
                    if (window.confirm("You are creating a sales order which has been restricted item fulfillment!")) {
                        return true;
                    }

                    else return false;
                }

                return true;
            }

            catch (error) {
                log.debug(error);
            }
        }

        return {
            saveRecord: saveRecord
        };

    });
