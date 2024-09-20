/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search', 'N/ui/serverWidget', 'N/email', 'N/runtime'],
    /**
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, search, serverWidget, email, runtime) => {
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
                    // Create form
                    let form = serverWidget.createForm({
                        title: 'Sales Order Form'
                    });

                    // Add Name field
                    form.addField({
                        id: 'custpage_fname',
                        type: serverWidget.FieldType.TEXT,
                        label: 'First Name'
                    }).isMandatory = true;

                    // Add Name field
                    form.addField({
                        id: 'custpage_lname',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Last Name'
                    }).isMandatory = true;

                    // Add Phone number field
                    form.addField({
                        id: 'custpage_phone',
                        type: serverWidget.FieldType.PHONE,
                        label: 'Phone Number'
                    }).isMandatory = true;

                    // Add Email field
                    form.addField({
                        id: 'custpage_email',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Email'
                    }).isMandatory = true;

                    let itemSublist = form.addSublist({
                        id: 'custpage_jj_item_sublist',
                        type: serverWidget.SublistType.INLINEEDITOR,
                        label: 'Item List'
                    });

                    itemSublist.addField({
                        id: 'custpage_items',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Items',
                        source: 'item'
                    });

                    itemSublist.addField({
                        id: 'custpage_item_description',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Item Description'
                    });

                    itemSublist.addField({
                        id: 'custpage_quantity',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Quantity'
                    }).isMandatory = true;

                    itemSublist.addField({
                        id: 'custpage_price',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Price'
                    }).isMandatory = true;

                    itemSublist.addField({
                        id: 'custpage_amount',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Amount'
                    });

                    // Add Submit button
                    form.addSubmitButton({
                        label: 'Submit'
                    });

                    form.clientScriptModulePath = 'SuiteScripts/JobinAndJismi/RAF/jj_cs_create_sales_order.js';

                    // Display the form
                    scriptContext.response.writePage(form);

                } else {

                    let emailAddress = scriptContext.request.parameters.custpage_email;
                    let firstName = scriptContext.request.parameters.custpage_fname;
                    let lastName = scriptContext.request.parameters.custpage_lname;
                    let phone = scriptContext.request.parameters.custpage_phone;
                    let item = scriptContext.request.parameters.custpage_items;
                    let quantity = scriptContext.request.parameters.custpage_quantity;

                    // Perform the customer search
                    let customerSearch = search.create({
                        type: search.Type.CUSTOMER,
                        columns: ['entityid', 'salesrep'],
                        filters: [
                            ['email', 'is', emailAddress]// Filter by email
                        ]
                    });

                    let customerResult = customerSearch.run().getRange({
                        start: 0,
                        end: 1000
                    });

                    if (customerResult.length > 0) {

                        // Create the sales order record
                        let salesOrder = record.create({
                            type: record.Type.SALES_ORDER,
                            isDynamic: true
                        });

                        customerResult.forEach(function (result) {

                            let name = result.getText('entityid');

                            salesRep = result.getText('salesrep');

                            salesOrder.setText({
                                fieldId: 'entityid', 
                                text: name
                            });

                            salesOrder.selectLine({
                                sublistId: 'items',
                                line: 0
                            });

                            salesOrder.setCurrentSublistValue({
                                sublistId: 'items',
                                fieldId: 'item',
                                value: item,
                                ignoreFieldChange: true,
                            });

                            salesOrder.setCurrentSublistValue({
                                sublistId: 'items',
                                fieldId: 'quantity',
                                value: quantity,
                                ignoreFieldChange: true,
                            });

                            salesOrder.commitLine({
                                sublistId: 'items'
                            });
                        });

                        // Get the total amount of the sales order
                        let totalAmount = currentRecord.getValue({
                            fieldId: 'total'
                        });

                        if (totalAmount > 500) {

                            let userId = runtime.getCurrentUser().id;

                            let salesRepRecord = record.load({
                                type: record.Type.EMPLOYEE,
                                entityid: salesRep,
                                isDynamic: true,
                            });

                            let recipientId = salesRepRecord.getValue({
                                fieldId: 'supervisor'
                            });

                            email.send({
                                author: userId,  
                                recipients: recipientId,  //sales reps supervisor
                                subject: "Sales Order Generated",
                                body: "Sales Order Generated"
                            });
                        };
                        salesOrder.save();

                        scriptContext.response.write('Thank you for placing order!.');
                    }

                    else {

                        // Create the customer record
                        let customerRecord = record.create({
                            type: record.Type.CUSTOMER,
                            isDynamic: true,
                        });

                        let fullName = customerRecord.setValue({
                            fieldId: 'companyname',
                            value: firstName + lastName
                        });

                        customerRecord.setValue({
                            fieldId: 'email',
                            value: emailAddress
                        });

                        customerRecord.setValue({
                            fieldId: 'phone',
                            value: phone
                        });

                        customerRecord.setValue({
                            fieldId: 'subsidiary',
                            value: 14
                        });
                        customerRecord.save();

                        // Create the sales order record
                        let salesOrder = record.create({
                            type: record.Type.SALES_ORDER,
                            isDynamic: true
                        });

                        salesOrder.setText({
                            fieldId: 'entityid', 
                            text: fullName
                        });

                        salesOrder.selectLine({
                            sublistId: 'items',
                            line: 0
                        });

                        salesOrder.setCurrentSublistValue({
                            sublistId: 'items',
                            fieldId: 'item',
                            value: item,
                            ignoreFieldChange: true,
                        });

                        salesOrder.setCurrentSublistValue({
                            sublistId: 'items',
                            fieldId: 'quantity',
                            value: quantity,
                            ignoreFieldChange: true,
                        });

                        salesOrder.commitLine({
                            sublistId: 'items'
                        });

                        // Get the total amount of the sales order
                        let totalAmount = currentRecord.getValue({
                            fieldId: 'total'
                        });

                        if (totalAmount > 500) {

                            let userId = runtime.getCurrentUser().id;

                            let salesRepRecord = record.load({
                                type: record.Type.EMPLOYEE,
                                entityid: salesRep,
                                isDynamic: true,
                            });

                            let recipientId = salesRepRecord.getValue({
                                fieldId: 'supervisor'
                            });

                            email.send({
                                author: userId,  
                                recipients: recipientId,  // sales reps supervisor
                                subject: "Sales Order Generated",
                                body: "Sales Order Generated"
                            });
                        };

                        salesOrder.save();

                        scriptContext.response.write('Thank you for registering new customer!.');

                    }
                }
            } catch (e) {
                log.error({
                    title: 'Error in onRequest',
                    details: e.message
                });
                scriptContext.response.write('An error occurred while processing your request: ' + e.message);
            }


        };

        return { onRequest }

    });
