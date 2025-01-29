/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams, useHistory } from "react-router-dom";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Form from "./form";
import FormTwo from "./formTwo";
import { _todayDate } from "../../../../_helper/_todayDate";
import { toast } from "react-toastify";

const initData = {
  shippingPoint: "",
  route: "",
  wareHouse: "",
  transportZone: "",
  // these are for second form (FormTwo)
  employee: "",
  bank: "",
  branch: "",
  bankAccountName: "",
  bankAccountNumber: "",
  routingNumber: "",
  isPublic: "",
};

export default function ShippingPointTransportZoneForm() {
  // ___________ common states _____________
  const { id } = useParams();
  const { state } = useLocation();
  const history = useHistory();
  const [shipPointDDL, getShipPointDDL, shipPointDDLLoader] = useAxiosGet();
  const [, saveData, savingLoader] = useAxiosPost();

  // _________ first form states _____________
  const [zoneDDL, getZoneDDL, zoneDDLLoader] = useAxiosGet();
  const [routeDDL, getRouteDDL, routeDDLLoader] = useAxiosGet();
  const [wareHouseDDL, getWareHouseDDL, wareHouseDDLLoader] = useAxiosGet();
  const [modifyData, setModifyData] = useState({});

  // _________ second form states _____________
  const [rows, setRows] = useState([]);
  const [employees, getEmployees, empLoader] = useAxiosGet([]);
  const [banks, getBanks, bankLoader] = useAxiosGet([]);
  const [branches, getBranches, branchLoader, setBranches] = useAxiosGet([]);

  // ___________ logged in user's information _____________
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  // ======== This section contains the functions that used in first form named "Form" =========

  const saveHandler = (values, cb) => {
    if ([1].includes(state?.type.value)) {
      const payload = {
        intAutoId: id ? +id : 0,
        intBusinessUnitId: buId,
        intAccountId: accId,
        intShipPointId: values?.shippingPoint?.value,
        intWhid: values?.wareHouse?.value,
        intTransportZoneId: values?.transportZone?.value,
        intRouteId: values?.route?.value,
        userId: id ? userId : null,
      };
      saveData(
        id
          ? `/oms/POSDamageEntry/EditWareHouseZone`
          : `/oms/POSDamageEntry/CreateWareHouseZone`,
        payload,
        cb,
        true
      );
    }
  };
  useEffect(() => {
    // this DDL (shipPoint DDL) is common for both form
    getShipPointDDL(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
    );

    if ([1].includes(state?.type?.value)) {
      getZoneDDL(
        `/tms/TransportZone/GetTransportZoneDDL?AccountId=${accId}&BusinessUnitId=${buId}`
      );
      if (id) {
        getWareHouseDDL(
          `/wms/ShipPoint/GetTransportShipPointWareHouseDDL?accountId=${accId}&businessUnitId=${buId}&ShipPointid=${state?.intShipPointId}`
        );
        getRouteDDL(
          `/wms/ShipPoint/GetTransportZoneRouteDDL?accountId=${accId}&businessUnitId=${buId}&TransportZoneId=${state?.intTransportZoneId}`
        );
        //  __ data setting for filling up the editing form __
        setModifyData({
          shippingPoint: {
            value: state?.intShipPointId,
            label: state?.shipPointName,
          },
          route: {
            value: state?.intRouteId,
            label: state?.routeName,
          },
          wareHouse: {
            value: state?.intWhid,
            label: state?.wareHouseName,
          },
          transportZone: {
            value: state?.intTransportZoneId,
            label: state?.transPortZoneName,
          },
        });
      }
    }
  }, [accId, buId, state]);

  const loading =
    shipPointDDLLoader ||
    zoneDDLLoader ||
    routeDDLLoader ||
    wareHouseDDLLoader ||
    savingLoader;

  // ========== This section contains the functions that used in second form named "FormTwo" ==========

  useEffect(() => {
    getEmployees(
      `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    getBanks(`/costmgmt/BankAccount/GETBankDDl`);
  }, [accId, buId]);

  const saveHandlerTwo = (values, cb) => {
    if (rows?.length < 1) {
      return toast.warn("Please add at least one row!");
    }
    if ([2].includes(state?.type?.value)) {
      saveData(
        `/partner/BusinessPartnerBasicInfo/CreateShipPointAndBankAccountInfo`,
        rows,
        () => {
          cb();
        },
        true
      );
    }
  };

  const addHandler = (values, cb) => {
    const exist = rows.find(
      (row) =>
        row?.enroll === values?.employee?.value ||
        row?.bankAccountNumber === values?.bankAccountNumber
    );
    if (exist) {
      return toast.warn("Duplicate bank account or Employee is ont allowed!");
    }
    try {
      const newRow = {
        enroll: values?.employee?.value,
        employee: values?.employee?.label,
        shippingPointId: values?.shippingPoint?.value,
        shippingPointName: values?.shippingPoint?.label,
        bankId: values?.bank?.value,
        bankName: values?.bank?.label,
        branchId: values?.branch?.value,
        branchName: values?.branch?.label,
        bankAccountNumber: values?.bankAccountNumber,
        routingNumber: values?.routingNumber,
        insertBy: userId,
        insertionDate: _todayDate(),
        accountName: values?.bankAccountName,
        businessUnitId: buId,
      };
      setRows([...rows, newRow]);
      cb && cb();
    } catch (error) {
      console.log(error);
    }
  };

  const remover = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const setBankInfo = (currentValue, setFieldValue) => {
    if (currentValue) {
      setFieldValue("bank", {
        label: currentValue?.bankName,
        value: currentValue?.bankId,
      });
      setFieldValue("branch", {
        label: currentValue?.branchName,
        value: currentValue?.branchId,
      });
      setFieldValue("bankAccountName", currentValue?.bankAccountName);
      setFieldValue("bankAccountNumber", currentValue?.accountNumber);
      setFieldValue("routingNumber", currentValue?.routingNumber);
    } else {
      setFieldValue("bank", "");
      setFieldValue("branch", "");
      setFieldValue("bankAccountName", "");
      setFieldValue("bankAccountNumber", "");
      setFieldValue("routingNumber", "");
    }
  };

  const loadingTwo =
    shipPointDDLLoader ||
    empLoader ||
    bankLoader ||
    branchLoader ||
    savingLoader;

  // title is common
  const title = `${id ? "Edit" : "Create"} ${state?.type?.label}`;

  return (
    <>
      {[1]?.includes(state?.type?.value) ? (
        //  "Shipping Point Transport Zone"
        <Form
          obj={{
            id,
            buId,
            accId,
            title,
            history,
            loading,
            zoneDDL,
            routeDDL,
            getRouteDDL,
            saveHandler,
            shipPointDDL,
            wareHouseDDL,
            getWareHouseDDL,
            initData: id ? modifyData : initData,
          }}
        />
      ) : [2].includes(state?.type?.value) ? (
        // "Shipping Point Bank Configure"
        <FormTwo
          obj={{
            id,
            rows,
            accId,
            title,
            banks,
            remover,
            history,
            branches,
            employees,
            addHandler,
            getBranches,
            setBranches,
            setBankInfo,
            shipPointDDL,
            loading: loadingTwo,
            saveHandler: saveHandlerTwo,
            initData: id ? modifyData : initData,
          }}
        />
      ) : (
        ""
      )}
    </>
  );
}
