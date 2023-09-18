const GoogleSheetsMapper = {
  async fetchGoogleSheetsData({ apiKey, sheetId, sheetsOptions = [] }) {
    try {
      const response =
        sheetsOptions.length === 0
          ? await fetchAllSheetsData({ apiKey, sheetId })
          : await fetchBatchData({ apiKey, sheetId, sheetsOptions });

      return mapData({ sheets: response.valueRanges, sheetsOptions });
    } catch (error) {
      throw error;
    }
  },
};

export default GoogleSheetsMapper;

const GOOGLE_API_URL = "https://sheets.googleapis.com/v4/spreadsheets";

const getRanges = (sheetNames = []) => {
  return sheetNames.map((sheetName) => `ranges=${sheetName}`).join("&");
};

const getSheetsTitleUrl = (sheetId, apiKey) => {
  return `${GOOGLE_API_URL}/${sheetId}?fields=sheets%2Fproperties%2Ftitle&key=${apiKey}`;
};

const getBatchUrl = (sheetId, ranges, apiKey) => {
  const rangesQueryString = getRanges(ranges);

  return `${GOOGLE_API_URL}/${sheetId}/values:batchGet?${rangesQueryString}&key=${apiKey}`;
};

class ApiResponseError extends Error {
  constructor(message, response) {
    super(message);
    this.response = response;
    Object.setPrototypeOf(this, ApiResponseError.prototype);
    Error.captureStackTrace(this, ApiResponseError);
  }
}

const makeFetch = async (url, config = {}) => {
  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new ApiResponseError(
        `Request to '${url}' failed with ${response.status}${
          response.statusText ? `: ${response.statusText}` : ""
        }`,
        {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        }
      );
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const mapRecords = (records, headerData) => {
  return records
    .filter((record) => record.length > 0)
    .map((record) =>
      record.reduce((obj, item, index) => {
        obj[headerData[index]] = item;
        return obj;
      }, {})
    );
};

const mapData = ({ sheets, sheetsOptions = [] }) => {
  return sheets.map((sheet) => {
    const id = sheet.range.split("!")[0].replace(/'/g, "");
    const rows = sheet.values || [];

    if (rows.length > 0) {
      const sheetsOptionsSheet = sheetsOptions.find((sheet) => sheet.id === id);
      const headerRowIndex = sheetsOptionsSheet?.headerRowIndex ?? 0;
      const header = rows[headerRowIndex];
      const records = rows.filter((_, index) => index > headerRowIndex);
      const recordsData = mapRecords(records, header);

      return {
        id,
        data: recordsData,
      };
    }

    return {
      id,
      data: [],
    };
  });
};

const fetchBatchData = async ({ apiKey, sheetId, sheetsOptions = [] }) => {
  const sheetsNames = sheetsOptions.map((option) => option.id);
  const url = getBatchUrl(sheetId, sheetsNames, apiKey);

  return await makeFetch(url);
};

const fetchAllSheetsData = async ({ apiKey, sheetId }) => {
  const urlTitles = getSheetsTitleUrl(sheetId, apiKey);
  const { sheets } = await makeFetch(urlTitles);
  const sheetsOptions = sheets.map((sheet) => ({
    id: sheet.properties.title,
  }));

  return await fetchBatchData({ apiKey, sheetId, sheetsOptions });
};
