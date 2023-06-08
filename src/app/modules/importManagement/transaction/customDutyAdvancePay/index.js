import axios from "axios";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import ICustomTable from "../../../_helper/_customTable";
import IForm from "../../../_helper/_form";
import { _formatMoney } from "../../../_helper/_formatMoney";
import IEdit from "../../../_helper/_helperIcons/_edit";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { getShipmentDDL } from "./helper";


const initData = {};

const header = [
   "SL",
   "PO No",
   "Shipment No",
   "Type No",
   "Narration",
   "Payment Amount",
   "Action",
 ];

export default function CustomDutyAdvancePayment() {

// get user profile data from store
const { profileData, selectedBusinessUnit } = useSelector((state) => {
   return state.authData;
 }, shallowEqual);

   const [shipmentDDL, setShipmentDDL] = useState(false);
   //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(75);

   const [gridData, getGridData, gridLoading] = useAxiosGet([]);

   const getLandingData = (poId, shipmentId) => {
      getGridData(`/imp/CustomDuty/GetAllCustomDutyAdvancePayment?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&poId=${poId}&shipmentId=${shipmentId}&PageNo=${pageNo}&PageSize=${pageSize}`)
    };

// useEffect(() => {
//    getLandingData()
// // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [profileData, selectedBusinessUnit]);

   // Get PO List DDL
  const polcList = (v) => {
   if (v?.length < 3) return [];
   return axios.get(
     `/imp/ImportCommonDDL/GetPoNoForAllCharge?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&search=${v}`
   ).then((res) => res?.data);
 };

 //setPositionHandler
 const setPositionHandler = (pageNo, pageSize, shipmentId, poId) => {
   getGridData(`/imp/CustomDuty/GetAllCustomDutyAdvancePayment?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&poId=${poId}&shipmentId=${shipmentId}&PageNo=${pageNo}&PageSize=${pageSize}`)
 };


  const saveHandler = (values, cb) => {};

  const history = useHistory();
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
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
            {gridLoading && <Loading />}
            <IForm
              title="Custom Duty Advance Payment"
              isHiddenReset
              isHiddenBack
              isHiddenSave
              renderProps={() => {
                return (
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        history.push('/managementImport/transaction/advance-payment-customs-duty/create');
                      }}
                    >
                      Create
                    </button>
                  </div>
                );
              }}
            >
              <Form>
              <div className="row global-form">
                    <div className="col-md-3 col-lg-3">
                      <label>PO</label>
                      <SearchAsyncSelect
                        selectedValue={values?.poLc}
                        isSearchIcon={true}
                        paddingRight={10}
                        name="poLc"
                        handleChange={(valueOption) => {
                          setFieldValue("poLc", valueOption);
                          getShipmentDDL(
                            profileData.accountId,
                            selectedBusinessUnit.value,
                            valueOption?.label,
                            setShipmentDDL
                          );
                          setFieldValue("shipment", "");
                        //   getGrid(
                        //     valueOption?.label,
                        //     valueOption ? values?.shipment?.value : ""
                        //   );
                        }}
                        loadOptions={polcList || []}
                        placeholder="Search by PO"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="shipment"
                        options={shipmentDDL || []}
                        label="Shipment No"
                        value={values?.shipment}
                        onChange={(valueOption) => {
                          setFieldValue("shipment", valueOption);
                        //   getGrid(values?.poLc?.label, valueOption?.value);
                          // getLandingData(
                          //   profileData?.accountId,
                          //   selectedBusinessUnit?.value,
                          //   valueOption?.value,
                          //   values?.poLc?.label,
                          //   pageSize,
                          //   pageNo,
                          //   setGridData
                          // );
                        }}
                        placeholder="Shipment"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2 pt-5 mt-1">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                           getLandingData(
                              values?.poLc?.poId,
                              values?.shipment?.value
                           );
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>

                  <ICustomTable ths={header}>
                    {gridData?.data?.length > 0 &&
                      gridData?.data?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td
                              style={{ width: "30px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>
                              <span className="pl-2">{`${item?.strPoNo}`}</span>
                            </td>
                            <td>
                              <span className="pl-2">{`${item?.strShipmentCode}`}</span>
                            </td>
                            <td>
                              <span className="pl-2">{item?.strPaymentType}</span>
                            </td>
                            <td>
                              <span className="pl-2">{item?.strNarration}</span>
                            </td>
                            <td className="text-right">
                              <span className="pl-2 ">
                                {_formatMoney(item?.numPaymentAmount)}
                              </span>
                            </td>
                            <td
                              style={{ width: "100px" }}
                              className="text-center"
                            >
                              <span
                                className="edit pr-2"
                                onClick={(e) =>
                                  history.push({
                                    pathname: `/managementImport/transaction/advance-payment-customs-duty/edit/${item?.intCustomDutyAdvancePaymentId}`,
                                    state: {
                                      poNo: item?.strPoNo,
                                      intCustomDutyAdvancePaymentId: item?.intCustomDutyAdvancePaymentId,
                                      shipmentCode: item?.strShipmentCode,
                                      shipmentId: item?.intShipmentId,
                                    },
                                  })
                                }
                              >
                                <IEdit />
                              </span>
                              {/* <span
                                className="edit"
                                onClick={(e) =>
                                  history.push({
                                    pathname: `/managementImport/transaction/customs-duty/edit/${item?.customDutyId}`,
                                    state: {
                                      PoNo: values?.poLc?.poNumber,
                                      LcNo: values?.poLc?.lcNumber,
                                      shipment: values?.shipment?.label,
                                      shipmentId: values?.shipment?.value,
                                    },
                                  })
                                }
                              >
                                <IEdit />
                              </span> */}
                            </td>
                          </tr>
                        );
                      })}
                  </ICustomTable>

                  {/* Pagination Code */}
                  {gridData?.data?.length > 0 && (
                    <PaginationTable
                      count={gridData?.totalCount}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                    />
                  )}
              </Form>
            </IForm>
        </>
      )}
    </Formik>
  );
}