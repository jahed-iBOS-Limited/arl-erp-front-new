/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ICard from "../../../../../_helper/_card";
import Loading from "../../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../../_helper/_redux/Actions";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import { common_api_for_4_types_of_bill } from "../../helper";
import BillApproveForm from "../../../approvebillregister/approveForm";

const initData = {
  approveAmount: "",
  approveAmountMax: "",
  remarks: "",
};

function ViewCNFBill({
  billRegisterId,
  gridItem,
  landingValues,
  setModalShow,
  gridDataFunc,
}) {
  // get profile data from store
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [gridData, getGridData, loadingGridData] = useAxiosGet();

  useEffect(() => {
    const url = common_api_for_4_types_of_bill(accId, buId, billRegisterId, 25);
    getGridData(url);
  }, [accId, buId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          approveAmount: gridItem?.monTotalAmount,
          approveAmountMax: gridItem?.monTotalAmount,
        }}
        onSubmit={(values) => {}}
      >
        {({ values }) => (
          <ICard title={`View CNF Bill`}>
            {(loadingGridData || loading) && <Loading />}

            <form className="form form-label-right ">
              <BillApproveForm
                obj={{
                  values,
                  gridItem,
                  gridDataFunc,
                  landingValues,
                  setModalShow,
                }}
              />
              <div className="table-responsive">
                <table className="table global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Mother Vessel</th>
                      <th>Lighter Vessel</th>
                      <th>CNF Name</th>
                      <th>Port Name</th>
                      <th>Program Qty</th>
                      <th>CNF Rate</th>
                      <th>LC Rate</th>
                      <th>VAT on CNF</th>
                      <th>Income TAX on CNF</th>
                      <th>Attachment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridData?.map((item, index) => {
                      return (
                        <>
                          <tr key={index}>
                            <td
                              style={{ width: "30px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>{item?.motherVesselName}</td>
                            <td>{item?.lighterVesselName}</td>
                            <td>{item?.cnfname}</td>
                            <td>{item?.portName}</td>
                            <td className="text-right">{item?.programQnt}</td>
                            <td className="text-right">{item?.cnfrate || 0}</td>
                            <td className="text-right">{item?.lcrate}</td>
                            <td className="text-right">{item?.vatonCnf}</td>
                            <td className="text-right">
                              {item?.incomeTaxonCnf}
                            </td>
                            <td className="text-center">
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">
                                    View Attachment
                                  </Tooltip>
                                }
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (item?.attachment) {
                                      dispatch(
                                        getDownlloadFileView_Action(
                                          item?.attachment,
                                          null,
                                          null,
                                          setLoading
                                        )
                                      );
                                    } else {
                                      toast.warn("No Attachment Found");
                                    }
                                  }}
                                  className="ml-2"
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    className={`fa pointer fa-eye`}
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </form>
          </ICard>
        )}
      </Formik>
    </>
  );
}

export default ViewCNFBill;
