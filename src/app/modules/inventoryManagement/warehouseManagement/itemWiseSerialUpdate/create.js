import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import IForm from "../../../_helper/_form";
import FormikError from "../../../_helper/_formikError";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {};
export default function ItemWiseSerialCreate() {
  const [objProps, setObjprops] = useState({});
  const [sbuDDL, setSbuDDL] = useAxiosGet();
  const [plantDDL, setPlantDDL] = useAxiosGet();
  const [warehouseDDL, setWarehouseDDL] = useAxiosGet();
  //const [warehouseDDL, setWarehouseDDL] = useAxiosGet()
  const [mrrNoDDL, getMrrNoDDL] = useAxiosGet();
  const [rowData, getRowData, , setRowData] = useAxiosGet();
  const [, saveData] = useAxiosPost();
  //const [modifyData, setModifyData] = useState(initData);

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  // profileData?.userId,
  // profileData?.accountId,
  // selectedBusinessUnit.value
  useEffect(() => {
    setSbuDDL(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit.value}&Status=true`
    );
    setPlantDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit.value}&OrgUnitTypeId=7`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (values, cb) => {
    const rowList = rowData?.map((itm, index) => {
      return {
        sl: 0,
        autoId: 0,
        itemId: itm?.itemId,
        itemName: itm?.itemName,
        uoMid: itm?.uoMid,
        uoMname: itm?.uoMname,
        supplierId: values?.mrrNo?.businessPartnerId,
        supplierName: values?.mrrNo?.businessPartnerName,
        purchaseOrderId: values?.mrrNo?.poId,
        purchaseOrderCode: values?.mrrNo?.poCode,
        purchaseOrderDate: values?.mrrNo?.poDate,
        mrrid: values?.mrrNo?.mrrId,
        mrrcode: values?.mrrNo?.mrrCode,
        mrrdate: values?.mrrNo?.mrrDate,
        itemWiseSerialNo: index + 1,
        customerId: 0,
        customerName: "",
        challanNo: "",
        salesOrderId: 0,
        salesOrderCode: "",
        //salesOrderDate: "",
        challanDate: "",
        itemCode: "",
        serialNo: "",
        actionBy: profileData?.userId,
        insertDate: _todayDate(),
        isActive: true,
        lastActionDateTime: _todayDate(),
      };
    });

    saveData(
      `/wms/ItemWiseSerialUpdate/ItemWiseSerialCreateAndEdit`,
      rowList,
      cb,
      true
    );
  };

  return (
    <IForm title="Create Item Wise Serial Update" getProps={setObjprops}>
      {false && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
            saveHandler(values, () => {
              resetForm(initData);
              setRowData([]);
            });
          }}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            setFieldValue,
            isValid,
            errors,
            touched,
          }) => (
            <>
              <Form className="form form-label-right">
                {false && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-2">
                      <NewSelect
                        name="sbu"
                        options={sbuDDL}
                        value={values?.sbu}
                        label="Select SBU"
                        onChange={(valueOption) => {
                          setFieldValue("sbu", valueOption);
                        }}
                        errors={errors}
                        //isDisabled={}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="plant"
                        options={plantDDL}
                        value={values?.plant}
                        label="Select Plant"
                        onChange={(valueOption) => {
                          setFieldValue("plant", valueOption);
                          setWarehouseDDL(
                            `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit.value}&PlantId=${valueOption?.value}&OrgUnitTypeId=8`
                          );
                        }}
                        errors={errors}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="warehouse"
                        options={warehouseDDL}
                        value={values?.warehouse}
                        label="Select Warehouse"
                        onChange={(valueOption) => {
                          setFieldValue("warehouse", valueOption);
                        }}
                        errors={errors}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>PO No</label>
                      <SearchAsyncSelect
                        selectedValue={values.poNumber}
                        handleChange={(valueOption) => {
                          setFieldValue("poNumber", valueOption);
                          getMrrNoDDL(
                            `/wms/ItemWiseSerialUpdate/GetMRRListDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&SBUId=${values?.sbu?.value}&PlantId=${values?.plant?.value}&WarehouseId=${values?.warehouse?.value}&ReferenceId=${valueOption?.value}&ReferenceCode=${valueOption?.label}`
                          );
                          setFieldValue("mrrNo", "");
                        }}
                        loadOptions={(v) => {
                          if (v.length < 3) return [];
                          return axios
                            .get(
                              `/wms/ItemWiseSerialUpdate/GetItemWiseSerialPurchaseOrderDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit.value}&SBUId=${values?.sbu?.value}&PlantId=${values?.plant?.value}&WarehouseId=${values?.warehouse?.value}&SearchTerm=${v}`
                            )
                            .then((res) => {
                              const updateList = res?.data.map((item) => ({
                                ...item,
                                value: item?.intPurchaseOrderId,
                                label: item?.intPurchaseOrderNumber,
                              }));
                              return updateList;
                            });
                        }}
                        disabled={true}
                        isDisabled={false}
                      />
                      <FormikError
                        errors={errors}
                        name="poNumber"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="mrrNo"
                        options={mrrNoDDL}
                        value={values?.mrrNo}
                        label="Select MRR No"
                        onChange={(valueOption) => {
                          setFieldValue("mrrNo", valueOption);
                          getRowData(
                            `/wms/ItemWiseSerialUpdate/GetMRRItemListByMRRId?MRRId=${valueOption?.value}`
                          );
                        }}
                        errors={errors}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th className="text-left">Item Name </th>
                            <th>UoM </th>
                            <th>Supplier Name </th>
                            <th>Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.length > 0 &&
                            rowData?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-left">{item?.itemName}</td>
                                <td className="">{item?.uoMname}</td>
                                <td className="">
                                  {values?.mrrNo?.businessPartnerName}
                                </td>
                                <td className="text-center">
                                  {item?.transactionQuantity}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ display: "none" }}
                  ref={objProps?.btnRef}
                  onSubmit={() => handleSubmit()}
                ></button>

                <button
                  type="reset"
                  style={{ display: "none" }}
                  ref={objProps?.resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>
              </Form>
            </>
          )}
        </Formik>
      </>
    </IForm>
  );
}
