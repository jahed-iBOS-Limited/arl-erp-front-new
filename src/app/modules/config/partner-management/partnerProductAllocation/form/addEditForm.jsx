import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router";
import NotPermittedPage from "../../../../_helper/notPermitted/NotPermittedPage";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  CreatePartnerProductAllocation,
  customerListDDL,
  EditPartnerProductAllocation,
  GetPartnerProductAllocationById,
  productDDL,
  upozilaDDL,
  getLcNoDDL,
} from "../helper";
import Form from "./form";
import "../style.css";
import { toast } from "react-toastify";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  customer: "",
  dealerName: "",
  upozila: "",
  productName: "",
  allotedQnt: "",
  uomName: "",
  rate: "",
  grandTotal: "",
  remarks: "",
  permissionDate: _todayDate(),
  permissionNo: "",
  lCno: "",
};

export default function PartnerProductAllocationForm() {
  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const { id, type } = useParams();
  const [loading, setLoading] = useState(false);
  const [objProps] = useState({});
  const [productNameDDL, setProductNameDDL] = useState([]);
  const [lcNoDDL, setLcNoDDL] = useState([]);
  const [customerDDL, setCustomerDDL] = useState([]);
  const [upozilaList, setUpozilaList] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    if (id) {
      GetPartnerProductAllocationById(id, setSingleData, setLoading);
    }
    // LC No DDL
    getLcNoDDL(profileData?.accountId, selectedBusinessUnit?.value, setLcNoDDL);
    productDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setProductNameDDL
    );
    customerListDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setCustomerDDL
    );
    upozilaDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setUpozilaList
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = async (values, cb) => {
    if (id) {
      /* Edit Block */
      const data = {
        allotmentId: id,
        itemName: values?.productName?.label,
        allotedQty: +values?.allotedQnt,
        itemRate: +values?.rate,
        totalAmount: +values?.grandTotal,
        remarks: values?.remarks,
        uomId: +values?.productName?.uomId,
        uomName: values?.productName?.uomName,
      };
      EditPartnerProductAllocation(data, setLoading);
    } else {
      /* Create Block */
      if (rowData?.length === 0) {
        toast.warn("Please Add at least one item");
        return;
      }

      const payload = rowData?.map((item) => {
        return {
          allotmentHeaderId: +item?.lCno?.value,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          customerId: +item?.customer?.value,
          fromDate: item?.fromDate,
          toDate: item?.toDate,
          upzila: +item?.upozila?.value,
          upzilaName: item?.upozila?.label,
          itemId: +item?.productName?.value,
          itemName: item?.productName?.label,
          allotedQty: +item?.allotedQnt,
          itemRate: +item?.rate,
          totalAmount: +item?.grandTotal,
          remarks: item?.remarks,
          actionBy: profileData?.userId,
          uomId: +item?.productName?.uomId,
          UomName: item?.productName?.uomName,
          permissionNo: item?.permissionNo,
          permissionDate: item?.permissionDate,
        };
      });
      CreatePartnerProductAllocation(payload, setLoading, cb);
    }
  };

  const rowDataAddHandler = (values) => {
    const checkDuplicate = rowData?.some(
      (item) =>
        item?.customer?.value === values?.customer?.value &&
        item?.productName?.value === values?.productName?.value
    );

    if (checkDuplicate) {
      toast.warning("Duplicate item not allowed!");
      return;
    }

    const copy = [...rowData, values];
    setRowData(copy);
  };

  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let productionAllocation = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 885) {
      productionAllocation = userRole[i];
    }
  }

  if (
    (type === "view" && !productionAllocation?.isView) ||
    (type === "edit" && !productionAllocation?.isEdit)
  )
    return <NotPermittedPage />;

  return (
    <>
      {loading && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={id ? singleData : initData}
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          productNameDDL={productNameDDL}
          customerDDL={customerDDL}
          upozilaList={upozilaList}
          viewType={type}
          rowData={rowData}
          setRowData={setRowData}
          lcNoDDL={lcNoDDL}
          rowDataAddHandler={rowDataAddHandler}
        />
      </div>
    </>
  );
}
