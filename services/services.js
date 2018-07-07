const formatDate = (dtObj) => {
  return dtObj.toLocaleDateString();
  // return `${dtObj.toISOString().split('T')[0]}`;
};

const formatTime = (dtObj) => {
  return dtObj.toLocaleTimeString();
  // return `${dtObj.toISOString().split('T')[1].split('.')[0]}`;
};

const prepareDataForSubmit = (rawData, columnOrder) => {
  /*
  payload should look like
  { "values": [[
      value for column A, value for column B ....
    ]]
  }
  */
  let payload = [];
  payload = columnOrder.map((columnValue, idx) => {
    if (idx === 0) {
      return Date.now();
    } else if (rawData[columnValue.toLowerCase()]) {
      return rawData[columnValue.toLowerCase()];
    } else {
      return "";
    }
  })
  return JSON.stringify({ "values": [payload] });
};

const queryParamObjToQueryString = (qParamsObj) => {
  return `?${Object.keys(qParamsObj).map(key => key + '=' + qParamsObj[key]).join('&')}`
};

const generateOauth2URL = (client_id, client_secret, refresh_token) => {
  const qParamsObj = {
    client_id: client_id,
    client_secret: client_secret,
    refresh_token: refresh_token,
    grant_type: "refresh_token",
  };
  const queryString = queryParamObjToQueryString(qParamsObj);
  const url = `https://www.googleapis.com/oauth2/v4/token${queryString}`
  console.log("GoogleSheetsAppendURL:", url);
  return url;
};

const generateGoogleSheetsAppendURL = (spreadsheetId, range, qParamsObj) => {
  const queryString = qParamsObj ? queryParamObjToQueryString(qParamsObj) : "";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append${queryString}`
  console.log("GoogleSheetsAppendURL:", url);
  return url;
};

export {
  formatDate,
  formatTime,
  prepareDataForSubmit,
  generateOauth2URL,
  generateGoogleSheetsAppendURL,
}