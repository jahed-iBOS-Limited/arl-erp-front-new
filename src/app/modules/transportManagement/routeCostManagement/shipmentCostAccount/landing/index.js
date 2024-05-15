/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { Formik, Form } from "formik";
import { _todayDate } from "../../../../_helper/_todayDate";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IConfirmModal from "./../../../../_helper/_confirmModal";
import NewSelect from "./../../../../_helper/_select";
import { toast } from "react-toastify";
import {
  GetShipmentCostEntryByCompany_api,
  GetShipmentCostEntryByOther_api,
  EditVCostAccountApprove_api,
} from "../helper";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  isBillSubmit: "",
};

function ShipmentCostAccountLanding() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  // one item select
  const itemSlectedHandler = (value, index) => {
    const copyRowDto = [...gridData];
    copyRowDto[index].itemCheck = !copyRowDto[index]?.itemCheck;
    setGridData(copyRowDto);
  };

  // All item select
  const allGridCheck = (value) => {
    const modifyGridData = gridData?.map((itm) => ({
      ...itm,
      itemCheck: value,
    }));
    setGridData(modifyGridData);
  };

  const reportTypeChangeHandler = (changeValue) => {
    const type = changeValue?.value;
    if (type === 1) {
      GetShipmentCostEntryByCompany_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setGridData,
        setLoading
      );
    } else {
      GetShipmentCostEntryByOther_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setGridData,
        setLoading
      );
    }
  };

  const billSubmit = (values) => {
    let confirmObject = {
      title: "Are you sure?",
      yesAlertFunc: async () => {
        const filterData = gridData?.filter((item) => item?.itemCheck);
        if (filterData?.length === 0) {
          toast.warning("Please Select One");
        } else {
          const payload = filterData?.map((item) => {
            return {
              shipmentCostId: item?.shipmentCostId,
              tripId: item?.tripId,
              isApproved: true,
              actionBy: profileData?.userId,
            };
          });
          EditVCostAccountApprove_api(
            payload,
            reportTypeChangeHandler,
            setLoading,
            values
          );
        }
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };
  return (
    <>
      {loading && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <ICustomCard
              title='Shipment Cost Account Approve'
              renderProps={() => (
                <>
                  <button
                    onClick={() => billSubmit(values)}
                    type='button'
                    className='btn btn-primary px-4 py-2'
                  >
                    Save
                  </button>
                </>
              )}
            >
              <Form>
                <div className='row global-form'>
                  <div className='col-lg-3'>
                    <NewSelect
                      name='reportType'
                      options={[
                        { value: 1, label: "Internal" },
                        { value: 2, label: "External" },
                      ]}
                      value={values?.reportType}
                      label='ReportType'
                      onChange={(valueOption) => {
                        setFieldValue("reportType", valueOption);
                        reportTypeChangeHandler(valueOption);
                      }}
                      placeholder='ReportType'
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-12 table-responsive'>
                    <table className='table table-striped table-bordered global-table'>
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Party Name</th>
                          <th>Shipment Date</th>
                          <th>Shipment Code</th>
                          <th>Route Name</th>
                          <th>Vehicle No</th>
                          <th>Amount</th>
                          <th>
                            {" "}
                            <input
                              type='checkbox'
                              id='parent'
                              onChange={(event) => {
                                allGridCheck(event.target.checked);
                              }}
                            />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((item, index) => (
                          <tr key={index}>
                            <td> {index + 1}</td>
                            <td>
                              <div className='pl-2'>{item?.partyName ? item?.partyName : "-"}</div>
                            </td>
                            <td>
                              <div className='pl-2'>
                                {" "}
                                {_dateFormatter(item?.shipmentDate)}
                              </div>
                            </td>
                            <td>
                              <div className='pl-2'>{item?.shipmentCode}</div>
                            </td>
                            <td>
                              <div className='pl-2'>{item?.routeName}</div>
                            </td>
                            <td>
                              <div className='pl-2'>{item?.veichleNo}</div>
                            </td>
                            <td>
                              <div className='pl-2'>
                                {item?.actualCost || 0}
                              </div>
                            </td>
                            <td>
                              <div className='d-flex justify-content-center align-items-center'>
                                <input
                                  id='itemCheck'
                                  type='checkbox'
                                  value={item?.itemCheck}
                                  checked={item?.itemCheck}
                                  onChange={(e) => {
                                    itemSlectedHandler(e.target.checked, index);
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Form>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
}

export default ShipmentCostAccountLanding;
