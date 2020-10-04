'use strict';

module.exports = {

    /**
     * Parse Model object
     * @param {Value} value 
     */
    parseJSON: async (value) => {
        return await JSON.parse(JSON.stringify(value));
    },


    
    /**
     * Check if object is empty
     * @param {Object} obj 
     */
    isEmpty: async (obj) => {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    },



    /**
     * Checks for null Value
     * @param {Array} payload 
     */
    emptyArrayChecker: async (payload) => {
        return (payload.length < 1 || payload == undefined || payload == null)
    }
}
