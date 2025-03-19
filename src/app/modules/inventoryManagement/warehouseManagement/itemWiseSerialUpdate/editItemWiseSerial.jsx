import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Select from "react-select";
import customStyles from "../../../selectCustomStyle";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "../../../_helper/_form";
import { IInput } from "../../../_helper/_input";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {};
export default function ItemWiseSerialEdit() {
  const [objProps, setObjprops] = useState({});
  const [rowData, getRowData, , setRowData] = useAxiosGet();
  const [chalanNoDDL, getChallanNoDDL] = useAxiosGet();
  const [, saveData] = useAxiosPost();

  const { id } = useParams();
  //const location = useLocation();
  //const [modifyData, setModifyData] = useState(initData);

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // eslint-disable-next-line no-unused-vars
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  useEffect(() => {
    getRowData(
      `/wms/ItemWiseSerialUpdate/GetItemWiseSerialListByMRRId?MRRId=${id}`
    );
    getChallanNoDDL(
      `/wms/ItemWiseSerialUpdate/GetChallanListDDL?BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveHandler = async (values, cb) => {
    const rowList = rowData?.map((itm, index) => {
      return {
        sl: 0,
        autoId: itm?.autoId,
        itemId: itm?.itemId,
        itemName: itm?.itemName,
        uoMid: itm?.uoMid,
        uoMname: itm?.uoMname,
        supplierId: itm?.supplierId,
        supplierName: itm?.supplierName,
        purchaseOrderId: itm?.purchaseOrderId,
        purchaseOrderCode: itm?.purchaseOrderCode,
        purchaseOrderDate: itm?.purchaseOrderDate,
        mrrid: itm?.mrrid,
        mrrcode: itm?.mrrcode,
        mrrdate: itm?.mrrdate,
        itemWiseSerialNo: itm?.itemWiseSerialNo,
        customerId: itm?.challanNoForGet?.customerId || 0,
        customerName: itm?.challanNoForGet?.customerName || "",
        challanNo: itm?.challanNoForGet?.label || "",
        salesOrderId: itm?.challanNoForGet?.salesOrderId || 0,
        salesOrderCode: itm?.challanNoForGet?.salesOrderCode || "",
        salesOrderDate: itm?.challanNoForGet?.salesOrderDate || "",
        serialNo: itm?.serialNo,
        challanDate: itm?.challanNoForGet?.deliveryDate || "",
        itemCode: itm?.itemCode || "",
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

  console.log("row", rowData);

  const rowDtoHandler = (name, index, value) => {
    const data = [...rowData];
    rowData[index][name] = value;
    setRowData(data);
  };

  return (
    <IForm title="Edit Item Wise Serial" getProps={setObjprops}>
      {false && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
            saveHandler(values, () => {
              resetForm(initData);
              //setItemList([]);
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
                {/* <div className="form-group  global-form">
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
                        isDisabled={id}
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
                          setWarehouseDDL(`/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit.value}&PlantId=${valueOption?.value}&OrgUnitTypeId=8`)
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
                        setMrrNoDDL(``)
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
                        }}
                        errors={errors}
                      />
                    </div>
                  </div>
                </div> */}

                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>Item Code </th>
                            <th>Item Name </th>
                            <th>UoM </th>
                            <th>Supplier</th>
                            <th>Serial No</th>
                            <th>Challan No</th>
                            <th>Customer Name</th>
                            <th>SO No</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.length > 0 &&
                            rowData?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center">
                                  {item?.itemCode}
                                </td>
                                <td className="text-left">{item?.itemName}</td>
                                <td className="text-center">{item?.uoMname}</td>
                                <td>{item?.supplierName}</td>
                                <td
                                  className="disabled-feedback disable-border"
                                  style={{ width: "150px" }}
                                >
                                  <IInput
                                    value={rowData[index]?.serialNo}
                                    name="serialNo"
                                    type="text"
                                    onChange={(e) => {
                                      rowDtoHandler(
                                        "serialNo",
                                        index,
                                        e.target.value
                                      );
                                    }}
                                  />
                                </td>
                                {/* <td className="disabled-feedback disable-border" style={{ width: '150px' }}>
                                 <IInput
                                    value={rowData[index]?.challanNo}
                                    name="challanNo"
                                    type="text"
                                    onChange={e => {                               
                                       rowDtoHandler(
                                          'challanNo',
                                          index,
                                          e.target.value
                                       );
                                    }}
                                 />
                              </td> */}
                                <td style={{ width: "150px" }}>
                                  <Select
                                    value={item?.challanNoForGet || {}}
                                    onChange={(valueOption) => {
                                      rowDtoHandler("challanNoForGet", index, {
                                        value: valueOption?.label,
                                        label: valueOption?.label,
                                        salesOrderId: valueOption?.salesOrderId,
                                        salesOrderCode:
                                          valueOption?.salesOrderCode,
                                        salesOrderDate:
                                          valueOption?.salesOrderDate,
                                        customerId: valueOption?.customerId,
                                        customerName: valueOption?.customerName,
                                        deliveryDate: valueOption?.deliveryDate,
                                      });
                                    }}
                                    styles={customStyles}
                                    isSearchable={true}
                                    options={chalanNoDDL}
                                    placeholder="Challan No"
                                  />
                                </td>
                                <td className="text-center">
                                  {item?.challanNoForGet?.customerName}
                                </td>
                                <td className="text-center">
                                  {item?.challanNoForGet?.salesOrderCode}
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
