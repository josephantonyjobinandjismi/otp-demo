/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/format', 'N/record', 'N/search'],
    /**
     * @param{format} format
     * @param{record} record
     * @param{search} search
     */
    function (format, record, search) {

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

            if (scriptContext.fieldId === 'custpage_items' || scriptContext.fieldId === 'custpage_quantity') {

                let currentRecord = scriptContext.currentRecord;

                let item = currentRecord.getCurrentSublistValue({
                    sublistId: 'custpage_jj_item_sublist',
                    fieldId: 'custpage_items'
                });

                console.log(item);

                if (item) {

                    // Perform the item search
                    let itemSearch = search.create({
                        type: search.Type.ITEM,
                        columns: ['salesdescription', 'internalid', 'price'],
                        filters: [['internalid', 'is', item]]
                    });

                    let searchResult = itemSearch.run().getRange({
                        start: 0,
                        end: 1
                    });

                    searchResult.forEach(function (result) {
                        let itemDescription = result.getValue('salesdescription');
                        let itemPrice = result.getValue('price');

                        currentRecord.setCurrentSublistValue({
                            sublistId: 'custpage_jj_item_sublist',
                            fieldId: 'custpage_item_description',
                            value: itemDescription,
                            ignoreFieldChange: true,
                        });

                        currentRecord.setCurrentSublistValue({
                            sublistId: 'custpage_jj_item_sublist',
                            fieldId: 'custpage_price',
                            value: itemPrice,
                            ignoreFieldChange: true,
                        });
                    });

                        let price = currentRecord.getCurrentSublistValue({
                            sublistId: 'custpage_jj_item_sublist',
                            fieldId: 'custpage_price'
                        });

                        console.log(price);

                        let quantity = currentRecord.getCurrentSublistValue({
                            sublistId: 'custpage_jj_item_sublist',
                            fieldId: 'custpage_quantity'
                        });

                        let amount = price * quantity;

                        currentRecord.setCurrentSublistValue({
                            sublistId: 'custpage_jj_item_sublist',
                            fieldId: 'custpage_amount',
                            value: amount,
                            ignoreFieldChange: true,
                        });

                }
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
            // saveRecord: saveRecord
        };

    });
