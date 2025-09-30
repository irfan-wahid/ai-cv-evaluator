const config   = require('../config')
const response = {
                    'status'       : 'success', 
                    'error_message': null, 
                    'data'         : {},
                 }

module.exports.default = response

module.exports.error = (errType) => {
        let errorMsg = ''
        if(errType == 'forbidden'){
            errorMsg = 'Bad Request - Unauthorized: '
        }
        else if(errType == 'connection'){
            errorMsg = 'Bad Connection - Connection is Error/Expired (RTO): '
        }
        else if(errType == 'unknown'){
            errorMsg = 'Bad Session - Unknown Error has happened: '
        }
        else if(errType == 'system'){
            errorMsg = 'Bad System Error - System Error has happened: '
        }

        return { 
            'status'       : 'error', 
            'error_message': errorMsg, 
            'data'         : null,
        }
}