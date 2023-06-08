import React, { useCallback, useEffect, useState } from "react";
import ICustomCard from "../../../_helper/_customCard";
import { Formik, Field } from "formik";
import { Form } from "react-bootstrap";
import Loading from "../../../_helper/_loading";
import ButtonStyleOne from "../../../_helper/button/ButtonStyleOne";
import IViewModal from "../../../_helper/_viewModal";
import ICustomTable from "../../../_helper/_customTable";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IView from "../../../_helper/_helperIcons/_view";
import IConfirmModal from "../../../_helper/_confirmModal";
import { approveRejectAction, getApprovalLandingAction } from "./helper";
import { shallowEqual, useSelector } from "react-redux";
import BonusApproveView from "./bonusApproveView";

const initData = {
  status: "0",
};

const BonusApproval = () => {
  const [loader, setLoader] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentRowData, setCurrentROwData] = useState([]);
  const [data, setData] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const getLanding = (statusId) => {
    getApprovalLandingAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      statusId,
      setLoader,
      setData
    );
  };

  useEffect(() => {
    getLanding(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const confirmPopUp = (typeId, id, statusId) => {
    let confirmObject = {
      title: "Are you sure?",
      message: "",
      yesAlertFunc: async () => {
        let obj = {
          id: id,
          approveStatusId: typeId,
          approveBy: profileData?.userId,
        };
        approveRejectAction(obj, setLoader, getLanding, statusId, setIsShowModal);
      },
      noAlertFunc: () => {
        "";
      },
    };
    IConfirmModal(confirmObject);
  };

  const bonusTotal = useCallback(
    data?.reduce((acc, item) => acc + +item?.bonusAmount, 0),
    [data]
  );

  return (
    <>
      {loader && <Loading />}
      <ICustomCard title="Bonus Approval">
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm(initData);
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <>
              <Form className="form form-label-right">
                {console.log("values", values)}
                <div className="row global-form">
                  <div className="col-lg-5">
                    <label className="mr-3">
                      <span style={{ position: "relative", top: "3px" }}>
                        <Field
                          onChange={(e) => {
                            setFieldValue("status", e.target.value);
                            getLanding(e.target.value);
                          }}
                          type="radio"
                          name="status"
                          value="0"
                        />
                      </span>
                      <span className="ml-2">Pending</span>
                    </label>
                    <label className="mr-3">
                      <span style={{ position: "relative", top: "3px" }}>
                        <Field
                          onChange={(e) => {
                            setFieldValue("status", e.target.value);
                            getLanding(e.target.value);
                          }}
                          type="radio"
                          name="status"
                          value="1"
                        />
                      </span>
                      <span className="ml-2">Approved</span>
                    </label>
                    <label>
                      <span style={{ position: "relative", top: "3px" }}>
                        <Field
                          onChange={(e) => {
                            setFieldValue("status", e.target.value);
                            getLanding(e.target.value);
                          }}
                          type="radio"
                          name="status"
                          value="2"
                        />
                      </span>
                      <span className="ml-2">Rejected</span>
                    </label>
                  </div>
                </div>
                <ICustomTable
                  ths={
                    values?.status === "0"
                      ? [
                          "SL",
                          "Bonus Name",
                          "Workplace Group",
                          "Effective Date",
                          "Bonus Amount",
                          "Action",
                          "Action",
                        ]
                      : [
                          "SL",
                          "Bonus Name",
                          "Workplace Group",
                          "Effective Date",
                          "Bonus Amount",
                          "Action",
                        ]
                  }
                >
                  {data?.map((item, index) => (
                    <tr>
                      <td style={{ width: "30px" }}>{index + 1}</td>
                      <td>{item?.bonusName}</td>
                      <td>{item?.workPlaceGroupName}</td>
                      <td className="text-center" style={{ width: "160px" }}>
                        {_dateFormatter(item?.effectiveDateTime)}
                      </td>
                      <td className="text-right" style={{ width: "160px" }}>
                        {item?.bonusAmount}
                      </td>
                      <td style={{ width: "35px" }} className="text-center">
                        <IView
                          clickHandler={() => {
                            setCurrentROwData(item);
                            setIsShowModal(true);
                          }}
                        />
                      </td>
                      {values?.status === "0" && (
                        <td style={{ width: "180px" }} className="text-center">
                          <ButtonStyleOne
                            label="Approve"
                            onClick={() =>
                              confirmPopUp(1, item?.id, values?.status)
                            }
                            style={{ marginRight: "3px" }}
                            type="button"
                          />
                          <ButtonStyleOne
                            label="Reject"
                            onClick={() =>
                              confirmPopUp(2, item?.id, values?.status)
                            }
                            type="button"
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                  {data?.length > 0 && (
                    <tr>
                      <td style={{ width: "30px" }}></td>
                      <td></td>
                      <td></td>
                      <td className="text-left" style={{ width: "160px" }}>
                        <b>Total</b>
                      </td>
                      <td className="text-right" style={{ width: "160px" }}>
                        {bonusTotal}
                      </td>
                      <td
                        style={{ width: "35px" }}
                        className="text-center"
                      ></td>
                      {values?.status === "0" && (
                        <td
                          style={{ width: "180px" }}
                          className="text-center"
                        ></td>
                      )}
                    </tr>
                  )}
                </ICustomTable>
                <IViewModal
                  show={isShowModal}
                  onHide={() => setIsShowModal(false)}
                  title="View Bonus Approval"
                >
                  <BonusApproveView
                    values={values}
                    confirmPopUp={confirmPopUp}
                    currentRowData={currentRowData}
                  />
                </IViewModal>
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
};

export default BonusApproval;
