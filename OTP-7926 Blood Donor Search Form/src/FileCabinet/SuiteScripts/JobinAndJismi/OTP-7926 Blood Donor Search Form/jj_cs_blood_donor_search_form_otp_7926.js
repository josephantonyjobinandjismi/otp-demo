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
            try {
                var currentRecord = scriptContext.currentRecord;
                var fieldId = scriptContext.fieldId;
    
                // Trigger the search when the blood group or the date filter changes
                if (fieldId === 'custpage_jj_bloodgroup' || fieldId === 'custpage_jj_lastdonationdate') {
                    var bloodGroup = currentRecord.getValue('custpage_jj_bloodgroup');
                    var selectedDate = currentRecord.getValue('custpage_jj_lastdonationdate'); // Selected custom date filter
                    var filters = [];
    
                    if (selectedDate && bloodGroup) {
                        var filterDate = new Date(selectedDate);
    
                        // Format the date for NetSuite compatibility
                        var formattedFilterDate = format.format({
                            value: filterDate,
                            type: format.Type.DATE
                        });
    
                        // Search for records where the last donation date is on or before the selected date
                        filters.push(['custrecord_jj_blood_group', 'anyof', bloodGroup]);
                        filters.push('AND');
                        filters.push(['custrecord_jj_last_donation_date', 'onorbefore', formattedFilterDate]);   
                    }

                    else {
                        if (bloodGroup) {
                        // If no date is selected, apply the 3-months-before logic with blood group filter
                        var currentDate = new Date();
                        var threeMonthsAgo = new Date();
                        threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
    
                        var formattedThreeMonthsAgo = format.format({
                            value: threeMonthsAgo,
                            type: format.Type.DATE
                        });
                        
                        // Apply the blood group filter and the 3-months-before filter
                        filters.push(
                            ['custrecord_jj_blood_group', 'anyof', bloodGroup],
                            'AND',
                            ['custrecord_jj_last_donation_date', 'onorbefore', formattedThreeMonthsAgo]
                        );
                    }

                    else {
                        var filterDate = new Date(selectedDate);
    
                        // Format the date for NetSuite compatibility
                        var formattedFilterDate = format.format({
                            value: filterDate,
                            type: format.Type.DATE
                        });

                        filters.push(['custrecord_jj_last_donation_date', 'onorbefore', formattedFilterDate]);
                    }
                    }
                    
                    // Create a search to find records based on the filters
                    var mySearch = search.create({
                        title: "Blood Donor",
                        type: 'customrecord_jj_blood_donor_otp7925',
                        filters: filters,
                        columns: [
                            'custrecord_jj_first_name',
                            'custrecord_jj_last_name',
                            'custrecord_jj_phone_number',
                            'custrecord_jj_last_donation_date'
                        ]
                    });
    
                    // Clear any existing lines in the sublist before adding new ones
                    let sublistId = 'custpage_jj_blood_sublist';
                    var lineCount = currentRecord.getLineCount({ sublistId: sublistId });

                    for (var j = 0; j < lineCount; j++) {
                        currentRecord.removeLine({
                            sublistId: sublistId,
                            line: 0, // Always remove the first line since lines will shift
                            ignoreRecalc: true
                        });
                    }
                    
                    // Loop through the search results and populate the sublist
                    var searchResult = mySearch.run();
                    
                    searchResult.each(function(result) {
                        var donorFirstName = result.getValue('custrecord_jj_first_name');
                        var donorLastName = result.getValue('custrecord_jj_last_name');
                        var donorNumber = result.getValue('custrecord_jj_phone_number');
        
                        // Select a new line in the sublist
                        currentRecord.selectNewLine({
                            sublistId: sublistId
                        });
    
                        // Set donor name and phone number in the sublist fields
                        currentRecord.setCurrentSublistValue({
                            sublistId: sublistId,
                            fieldId: 'custpage_jj_first_name',
                            value: donorFirstName
                        });
    
                        currentRecord.setCurrentSublistValue({
                            sublistId: sublistId,
                            fieldId: 'custpage_jj_last_name',
                            value: donorLastName
                        });
    
                        currentRecord.setCurrentSublistValue({
                            sublistId: sublistId,
                            fieldId: 'custpage_jj_phone_number',
                            value: donorNumber
                        });

                        // Commit the line
                        currentRecord.commitLine({
                            sublistId: sublistId
                        });

                        return true;
                    });
                }
            }

            catch (e) {
                console.log("Error: ", e);
            }
        }

        return {
            fieldChanged: fieldChanged,
        };
    });
