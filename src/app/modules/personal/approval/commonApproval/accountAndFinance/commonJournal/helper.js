import axios from "axios";
// get selected business unit from store
export const getItemGridData = async (
    activityId,
    accId,
    buId,
    userId,
    setter,
    setLoading,
    pageNo,
    pageSize,
    search,
    plantId
) => {
    const Search = search ? `&Search=${search}` : "";
    try {
        setLoading(true);
        const res = await axios.get(
            // `/procurement/Approval/GetItemRequestListForApproval?BusinessUnitId=${buId}&UserId=${userId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
            `/procurement/Approval/CoomonApprovalList?AcountId=${accId}&BusinessUnitId=${buId}&UserId=${userId}&ActivityId=${activityId}&viewOrder=desc&PageNo=${pageNo || 1}&PageSize=${pageSize}${Search}&plantId=${plantId}`
        );
        if (res.status === 200 && res?.data) {
            setter({
                data: res?.data?.map((itm) => ({
                    ...itm,
                    isSelect: false,
                })),
                totalCount: res?.data[0]?.totalRows,
                currentPage: res?.data?.currentPage,
                pageSize: res?.data?.pageSize,
            })
            // console.log(res.data)
            // setter(res?.data);
            setLoading(false);
        }
    } catch (error) {
        setLoading(false);
    }
};
