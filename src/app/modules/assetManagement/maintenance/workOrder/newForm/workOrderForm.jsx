import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import IForm from "../../../../_helper/_form";
import { _todayDate, _todayDateTime12HFormet } from "../../../../_helper/_todayDate";
import { getServiceDDL, saveWorkOrderData } from "../helpers";
import Form from "./form";

const initData = {
    assetNo: "",
    assetName: "",
    businessUnit: "",
    picked: "Preventive",
    service: "",
    priority: "",
    assetDate: _todayDateTime12HFormet(),
    problem: "",
};

export default function WorkOrderForm({ // It's a common component for both assetOrder and serviceRequest
    currentRowData,
    sbuName,
    plantName,
    warehouseName,
    setGridData,
    setisShowModalforCreate,
    actionFor = "serviceRequest" //  "assetOrder" or "serviceRequest"  Default value.  Important!
}) {
    const location = useLocation();
    const [isDisabled, setDisabled] = useState(false);

    // get user profile data from store
    const profileData = useSelector((state) => {
        return state.authData.profileData;
    }, shallowEqual);

    // get selected business unit from store
    const selectedBusinessUnit = useSelector((state) => {
        return state.authData.selectedBusinessUnit;
    }, shallowEqual);

    const [serviceDDL, setServiceDDL] = useState([]);
    const [assetListDDL, setAssetListDDL] = useState([]);

    useEffect(() => {
        getServiceDDL(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            plantName?.value,
            warehouseName?.value,
            setServiceDDL
        );
        // getAssetListDDL(plantName.value, setAssetListDDL);
    }, [profileData?.accountId, selectedBusinessUnit?.value]);


    const saveHandler = async (values, cb) => {
        setDisabled(true);
        if (values && profileData?.accountId && selectedBusinessUnit?.value) {

            const isPreventive = () => {
                if (values?.picked === "OthersInstallation") {
                    return 0;
                }
                return values.picked === "Preventive" ? true : false;
            }


            let businessUnitId;
            if (actionFor === 'serviceRequest') {
                businessUnitId = selectedBusinessUnit?.value; // Use selectedBusinessUnit for serviceRequest
            } else {
                businessUnitId = 4; // Hardcoded 4 for assetOrder
            }


            const payload = {
                assetId: values?.assetNo?.value,
                assetCode: values?.assetNo?.code,
                assetDescription: values?.assetNo?.label ? values?.assetNo?.label?.split("[")[0] : "",
                accountId: profileData?.accountId,
                sbuId: sbuName?.value,
                plantId: plantName?.value,
                businessUnitId: businessUnitId, // Dynamically assign the value
                itemServiceId: values?.service?.value,
                itemServiceName: values?.service?.label,
                warehouseId: warehouseName?.value,
                warehouseName: warehouseName?.label,
                dueMaintenanceDate: _todayDate(),
                isPreventive: isPreventive(),
                IsOthersInstallation: values?.picked === "OthersInstallation" ? true : false,
                startDateTime: values?.assetDate,
                isComplete: false,
                status: "",
                costCenterId: 0,
                priority: values?.priority?.value,
                priorityName: values?.priority?.label,
                customerContactName: "",
                customerContactNo: "",
                problems: values?.problem,
                notes: "",
                actionBy: profileData?.userId,
            };
            saveWorkOrderData(
                payload,
                cb,
                profileData?.accountId,
                selectedBusinessUnit?.value,
                plantName?.value,
                setGridData,
                setDisabled,
                setisShowModalforCreate
            );
        } else {
            setDisabled(false);
        }
    };

    const [objProps, setObjprops] = useState({});

    return (
        <div className="Assetorders">
            <IForm
                title="Work Order"
                getProps={setObjprops}
                isDisabled={isDisabled}
                isHiddenReset
                isHiddenBack
            >
                <Form
                    {...objProps}
                    initData={initData}
                    saveHandler={saveHandler}
                    accountId={profileData?.accountId}
                    selectedBusinessUnit={selectedBusinessUnit}
                    serviceDDL={serviceDDL}
                    assetListDDL={assetListDDL}
                    plantId={plantName?.value}
                    setAssetListDDL={setAssetListDDL}
                    formType={actionFor} // Pass the actionFor prop to Form component
                />
            </IForm>
        </div>
    );
}