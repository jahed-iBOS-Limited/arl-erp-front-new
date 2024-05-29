/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { brandItemRequestApprove } from "../helper";

export default function BrandItemRequisitionApproveForm({
  getLandingData,
  singleData,
  setOpen,
  values,
}) {
  const {
    profileData: { userId },
    // selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [loading, setLoading] = useState(false);
  // const [, getPermissionInfo] = useAxiosGet();

  const rowData = singleData?.brandItemRows;
  const status = values?.status?.value;

  const approveHandler = () => {
    const payload = {
      brandRequestId: singleData?.brandRequestId,
      actionBy: userId,
      requiredDate: singleData?.requiredDate,
      isApproveByL1: status === 1,
      isApproveByL2: status === 2,
      brandItemRows: [
        {
          rowId: 6,
          brandRequestId: 4,
          approvedQuantity: 50,
          hoapproveQuantity: 0,
        },
        {
          rowId: 7,
          brandRequestId: 4,
          approvedQuantity: 51,
          hoapproveQuantity: 0,
        },
      ],
    };

    // getPermissionInfo(
    //   `/oms/TerritoryInfo/GetRATManagerAndPermission?businessunitId=${buId}&userId=${userId}&channelId=${values?.channel?.value}`,
    //   (resData) => {
    //     if ([1, 2].includes(values?.status?.value)) {
    //       if (
    //         (!singleData?.isApproveByL1 && resData?.isRegionManager) ||
    //         (singleData?.isApproveByL1 &&
    //           !resData?.isTerritoryManager &&
    //           !resData?.isAreaManager &&
    //           !resData?.isRegionManager)
    //       ) {
    //         brandItemRequestApprove(
    //           payload,
    //           () => {
    //             getLandingData(values);
    //             setOpen(false);
    //           },
    //           setLoading
    //         );
    //       } else {
    //         toast.warn("Sorry! You are not permitted to approve.");
    //       }
    //     }
    //   }
    // );

    brandItemRequestApprove(
      payload,
      () => {
        getLandingData(values);
        setOpen(false);
      },
      setLoading
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={singleData}
        onSubmit={() => {}}
      >
        {({ values }) => (
          <>
            {loading && <Loading />}
            <Card>
              <ModalProgressBar />
              <CardHeader title={`Approve Brand Item Requisition`}>
                <CardHeaderToolbar>
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        approveHandler();
                      }}
                      className="btn btn-info"
                      //   disabled={!values?.supplier}
                    >
                      Approve
                    </button>
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <NewSelect
                          name="programType"
                          options={[]}
                          value={values?.programType}
                          label="Program Type"
                          placeholder="Program Type"
                          isDisabled={true}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.purpose}
                          label="Purpose"
                          placeholder="Purpose"
                          type="text"
                          name="purpose"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.requiredDate}
                          label="Required Date"
                          placeholder="Date"
                          type="date"
                          name="requiredDate"
                          disabled={true}
                        />
                      </div>
                    </div>
                  </div>
                </form>
                {rowData?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Item Name</th>
                          <th>Item Code</th>
                          <th>UoM</th>
                          <th>Requested Quantity</th>
                          <th>Channel</th>
                          <th>Territory</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.map((td, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td>{td?.itemName}</td>
                            <td>{td?.itemCode}</td>
                            <td>{td?.uoMname}</td>
                            <td className="text-right">
                              {td?.requestQuantity}
                            </td>
                            <td>{td?.channelName}</td>
                            <td>{td?.territoryName}</td>
                            <td>{td?.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
