/**
 * 
 * 
 * Client : Nill
 * 
 * OTP 7868 - Custom page for display sales order based on the status
 * 
 * 
 * *************************************************************************************
 * ***
 * 
 * Author : Jobin And Jismi IT Services
 * 
 * Date Created : 16 - October - 2024
 * 
 * Description : This script is for populating a Custom page for displaying sales order based on the status. The
 *               form is devoloped using Suitelet
 * 
 * 
 * REVISION HISTORY : 1.0
 * 
 * 
 * 
 * ------------------------------------------------------------------------
 * 
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search', 'N/ui/serverWidget'],
    /**
     * @param{record} record
     * @param{search} search
     * @param{serverWidget} serverWidget
     */
    function(record, search, serverWidget) {
        
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        function onRequest(scriptContext) {
            try{
        
            if (scriptContext.request.method === 'GET') {
                var form = createForm();
                addFieldsToForm(form);
                addSublistToForm(form);
                scriptContext.response.writePage(form);
            }
        }
        catch(error)
        {
            log.error(error);
        }
        }

        return { onRequest: onRequest };

        /**
         * Creates the Suitelet form.
         * @returns {ServerForm} The form object
         */
        function createForm() {
            try{
                return serverWidget.createForm({
                    title: 'Sales Order Form',
                });
            }
            catch(error)
            {
                log.error(error);
            }
            }

         /**
         * Adds fields to the form.
         * @param {ServerForm} form - The form object to which fields are added
         */
         function addFieldsToForm(form) {
            try{
            var statusField = form.addField({
                id: 'custpage_statusfield',
                type: serverWidget.FieldType.SELECT,
                label: 'Status'
            });

            populateStatusField(statusField);

            form.addField({
                id: 'custpage_customerfield',
                type: serverWidget.FieldType.SELECT,
                label: 'Customer',
                source: 'customer'
            });

            form.addField({
                id: 'custpage_subsidiaryfield',
                type: serverWidget.FieldType.SELECT,
                label: 'Subsidiary',
                source: 'subsidiary'
            });

            form.addField({
                id: 'custpage_departmentfield',
                type: serverWidget.FieldType.SELECT,
                label: 'Department',
                source: 'department'
            });

            form.clientScriptModulePath = 'SuiteScripts/JobinAndJismi/OTP-7868 Sales Order Search Form/jj_cs_order_search_form_otp_7868.js';
        }
        catch(error)
        {
            log.error(error);
        }
        }

        /**
         * Populates the status field with options based on a saved search.
         * @param {ServerField} statusField - The status field to populate
         */
        function populateStatusField(statusField) {
            try{
            
            var savedSearch = search.create({
                type: search.Type.SALES_ORDER,
                filters: [
                    ['mainline', 'is', 'T']
                ],
                columns: ['status']
            });

            var addedStatuses = new Set();
            statusField.addSelectOption({
                value: '',
                text: ''
            });

            savedSearch.run().each(function(result) {
                var statusValue = result.getValue({ name: 'status' });
                var statusText = result.getText({ name: 'status' });
                if ((statusText === 'Pending Fulfillment' || 
                    statusText === 'Billed' || 
                    statusText === 'Partially Fulfilled' || 
                    statusText === 'Pending Billing') 
                    && !addedStatuses.has(statusValue)) {
                    statusField.addSelectOption({
                        value: statusValue,
                        text: statusText
                    });
                    addedStatuses.add(statusValue);
                }

                return true;
            });
        }
        catch(error)
        {
            log.error(error);
        }
    }

        /**
         * Adds a sublist to the form.
         * @param {ServerForm} form - The form object to which the sublist is added
         */
        function addSublistToForm(form) {
            try{
            var subList = form.addSublist({
                id: 'salessublist',
                type: serverWidget.SublistType.INLINEEDITOR,
                label: 'Sales Order Sublist',
            });

            subList.addField({
                id: 'custpage_internalid',
                type: serverWidget.FieldType.TEXT,
                label: 'Internal ID'
            });
            subList.addField({
                id: 'custpage_documentnumber',
                type: serverWidget.FieldType.TEXT,
                label: 'Document Number'
            });
            subList.addField({
                id: 'custpage_txndate',
                type: serverWidget.FieldType.TEXT,
                label: 'Transaction Date'
            });
            subList.addField({
                id: 'custpage_status',
                type: serverWidget.FieldType.TEXT,
                label: 'Status'
            });

            subList.addField({
                id: 'custpage_name',
                type: serverWidget.FieldType.TEXT,
                label: 'Customer Name'
            });
            subList.addField({
                id: 'custpage_subsidiary',
                type: serverWidget.FieldType.TEXT,
                label: 'Subsidiary'
            });

            subList.addField({
                id: 'custpage_department',
                type: serverWidget.FieldType.TEXT,
                label: 'Department'
            });
            subList.addField({
                id: 'custpage_saleschannel',
                type: serverWidget.FieldType.TEXT,
                label: 'Class'
            });
            subList.addField({
                id: 'custpage_subtotal',
                type: serverWidget.FieldType.TEXT,
                label: 'Sub Total'
            });
            subList.addField({
                id: 'custpage_taxtotal',
                type: serverWidget.FieldType.TEXT,
                label: 'Tax Total'
            });

            subList.addField({
                id: 'custpage_total',
                type: serverWidget.FieldType.TEXT,
                label: 'Total'
            });
        }
        catch(error)
        {
            log.error(error);
        }
    }
    }
);