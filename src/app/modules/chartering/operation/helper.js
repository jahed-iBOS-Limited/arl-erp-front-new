export const generateFileUrl = (fileId) => {
  return fileId
    ? `https://erp.ibos.io/domain/Document/DownlloadFile?id=${fileId}`
    : "";
};
