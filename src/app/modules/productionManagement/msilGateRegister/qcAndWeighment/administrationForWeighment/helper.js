export const onGetRowDataOfQcAndWeighment = ({
  accountId,
  businessUnitId,
  getRowData,
  pageNo,
  pageSize,
  shipPointId,
  weightDate,
  search,
  setPaginationState,
}) => {
  if (pageNo > 0) {
    getRowData(
      `/mes/WeightBridge/GetAllWeightBridgeForAdministrationLanding?PageNo=${pageNo}&PageSize=${pageSize}&AccountId=${accountId}&BusinessUnitId=${businessUnitId ||
        0}&shipPointId=${shipPointId || 0}${
        weightDate ? `&WeightDate=${weightDate}` : ""
      }${search ? `&search=${search}` : ""}`,
      (data) => {
        setPaginationState((prev) => ({
          ...prev,
          total: data?.totalCount,
          pageSize: data?.pageSize,
          page: data?.currentPage,
        }));
      }
    );
  }
};

export const onUpdateWeightageInAdministration = ({
  data,
  updateWeightage,
  onHide,
}) => {
  const payload = {
    weightmentId: +data?.intWeightmentId,
    firstWeight: +data?.numFirstWeight || 0,
    lastWeight: +data?.numLastWeight || 0,
  };
  updateWeightage(`/mes/WeightBridge/EditWeightScale`, payload, onHide, true);
};
