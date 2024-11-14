import React from "react";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { shallowEqual, useSelector } from "react-redux";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { toast } from "react-toastify";

const MonthTable = ({ tableData, setTableData, singleData, cb, values }) => {

    const { profileData } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);
    const [, onSave, loading] = useAxiosPost()

    // Calculate total quantity
    const totalQuantity = tableData[singleData?.productIndex]?.workCenters[singleData?.workCenterIndex]?.dailySchedules.reduce((total, schedule) => {
        return total + (+schedule.quantity || 0);
    }, 0);

    const saveHandler = () => {
        // Extract product and work center based on the indices
        const monthlyScheduleQty = tableData[singleData?.productIndex]?.productQty;
        if (totalQuantity > monthlyScheduleQty) {
            return toast.warn("Total Quantity should be less then Monthly Schedule Qty")
        }
        const product = tableData[singleData?.productIndex];
        const workCenter = product?.workCenters[singleData?.workCenterIndex];

        // If product and work center exist, build the payload
        if (product && workCenter) {
            const payload = [
                {
                    productId: product.productId, // Assuming each product has a productId
                    workCenterId: workCenter.workCenterId, // Assuming each work center has a workCenterId
                    dailySchedules: workCenter.dailySchedules.map((schedule) => ({
                        scheduleDate: schedule.scheduleDate, // Assuming schedule has a scheduleDate
                        quantity: +schedule.quantity, // Assuming schedule has a quantity
                    })),
                },
            ];

            // Make the API call
            const apiURL = `/mes/ProductionEntry/CreateOrUpdateProductionSchedule?businessUnitId=${values?.businessUnit?.value}&yearId=${values?.year?.value}&monthId=${values?.month?.value}&actionBy=${profileData?.userId}`;

            onSave(apiURL, payload, cb, true);
        }
    };


    const handleQuantityChange = (scheduleDate, newQuantity) => {
        const updatedData = [...tableData];

        // Find the specific product and work center using singleData indices
        const productIndex = singleData?.productIndex;
        const workCenterIndex = singleData?.workCenterIndex;

        if (productIndex !== undefined && workCenterIndex !== undefined) {
            const product = updatedData[productIndex];
            const workCenter = product.workCenters[workCenterIndex];

            // Update the quantity for the corresponding schedule
            const updatedWorkCenters = workCenter.dailySchedules.map((schedule) => {
                if (schedule.scheduleDate === scheduleDate) {
                    return { ...schedule, quantity: newQuantity }; // Update the quantity
                }
                return schedule;
            });

            // Update the product's work center with the modified work center
            product.workCenters[workCenterIndex] = {
                ...workCenter,
                dailySchedules: updatedWorkCenters
            };

            // Update the tableData state in the parent component
            setTableData(updatedData);
        }
    };



    // Ensure table data is available and the work center has daily schedules
    const hasValidData =
        singleData?.productIndex !== undefined &&
        singleData?.workCenterIndex !== undefined &&
        tableData[singleData.productIndex]?.workCenters[singleData.workCenterIndex]?.dailySchedules?.length > 0;

    return (
        <>
            <div className="text-right mb-5">
                <button onClick={() => {
                    saveHandler()
                }} className="btn btn-primary">Save</button>
            </div>
            <div className="d-flex justify-content-around">
                <div>
                    <p><strong>Product Name: </strong> {tableData[singleData?.productIndex]?.productName}</p>
                </div>
                <div>
                    <p><strong>Month: </strong> {values?.month?.label}</p>
                </div>
                <div>
                    <p><strong>Monthly Schedule Qty: </strong> {tableData[singleData?.productIndex]?.productQty}</p>
                </div>
            </div>
            {loading && <Loading />}
            {hasValidData ? (
                <>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData[singleData.productIndex]?.workCenters[singleData.workCenterIndex]?.dailySchedules.map((day, index) => (
                                    <tr key={index}>
                                        <td>{_dateFormatter(day?.scheduleDate)}</td>
                                        <td>
                                            <InputField
                                                value={day.quantity}
                                                onChange={(e) => handleQuantityChange(day.scheduleDate, e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                <tr><td className="text-center"><strong>Total</strong></td> <td className=""><span className="pl-4">{totalQuantity}</span></td></tr>
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <p>No data available to display.</p> // Optional message when data is not available
            )}
        </>
    );
};

export default MonthTable;
