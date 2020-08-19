const constants = require('./constants');

exports.ErrorHandler = class ErrorHandler {
  static parseBadResponse(response) {
    if (!response) {
      return ErrorHandler.returnError(12, null, response);
    }

    const { data, status } = response;
    if (!status) {
      return ErrorHandler.returnError(12, null, data);
    }
    if (status === 500) {
      return ErrorHandler.returnError(15);
    }
    if ([400, 401].includes(status)) {
      if (data.code === '401.205') {
        return ErrorHandler.returnError(16, null, data);
      }
      if (data.code === '401.207') {
        return ErrorHandler.returnError(17, null, data);
      }
      return ErrorHandler.returnError(14, null, data);
    }
    if (status === 404) {
      // Return an error for a bad serial number.
      if (data.code === '404.401') {
        return ErrorHandler.returnError(18, null, data);
      }

      // Handle generic 404 errors, likely indicating something wrong with this implementation.
      return ErrorHandler.returnError(20);
    }

    return ErrorHandler.returnError(11, null, data);
  }

  static returnError(returnCode, error, response) {
    const result = {
      returnCode,
      message: constants.errorMessages[returnCode],
      providerMessage: null,
      unhandledError: null,
    };
    if (response && response.description) {
      result.providerMessage = response.description;
    }
    if (error) {
      result.unhandledError = error;
    }
    return Promise.resolve(result);
  }
};
