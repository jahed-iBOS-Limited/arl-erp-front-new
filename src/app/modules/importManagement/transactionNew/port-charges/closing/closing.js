/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
// import { useSelector, shallowEqual } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Loading from "./../../../../_helper/_loading";
import { Modal } from "react-bootstrap";
// import NewSelect from "../../../../_helper/_select";
// import InputField from "../../../../_helper/_inputField";
// import { isUniq } from "../../../../_helper/uniqChecker";
import ClosingLanding from "./landing";
import {
  // saveServicezbreakdown,
  getCommercialCostingServiceBreakdown,
  getClosingInfoForBillAndAdvance,
  createCommercialMultiSupplierBillClose,
} from "../helper";
import { toast } from "react-toastify";
import { shallowEqual, useSelector } from "react-redux";
import { _todayDate } from "../../../../_helper/_todayDate";
import IConfirmModal from './../../../../_helper/_confirmModal';

const validationSchema = Yup.object().shape({});
const initData = {};

const ClosingModal = ({
  show,
  onHide,
  supplierDDL,
  polcNo,
  referenceId,
  setReferenceId,
  shipmentId,
  closingReferenceId,
  closingTotalBookedAmount,
  setClosingReferenceId,
  allPoInfo,
}) => {
  const [setRowDto] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [data, setData] = useState({});

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    if (referenceId) {
      getCommercialCostingServiceBreakdown(referenceId, setRowDto);
    }
  }, [referenceId]);

  //   const addHandler = (payload) => {
  //     if (isUniq("supplierName", payload.supplierName, rowDto)) {
  //       setRowDto([payload, ...rowDto]);
  //     }
  //   };

  const total = {
    TotalBillAmount: 0,
    TotalActualBill: 0,
    TotalVat: 0,
  };

  const saveHandler = () => {
    if (data?.row?.length > 0 && data?.header?.billStatus === "Pending") {
      createCommercialMultiSupplierBillClose(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        allPoInfo?.plantId,
        allPoInfo?.sbuId,
        _todayDate(),
        closingReferenceId,
        total?.TotalActualBill,
        profileData?.userId,
        total?.TotalVat,
        setIsLoading
      );
      // data.row.forEach((item)=> (
      //   // console.log('item create: ', item)

      // ))
    } else {
      toast.warning("Save only for Pending status");
    }
  };

  useEffect(() => {
    if (closingReferenceId) {
      getClosingInfoForBillAndAdvance(
        closingReferenceId,
        setIsLoading,
        setData
      );
    }
  }, [closingReferenceId]);


  return (
    <div className="viewModal">
      <Modal
        show={show}
        onHide={onHide}
        size="xl"
        aria-labelledby="example-modal-sizes-title-xl"
      >
        <>
          {" "}
          <Modal.Header className="bg-custom ">
            <Modal.Title className="text-center">Closing</Modal.Title>
          </Modal.Header>
          {/* <p style={{ borderBottom: "1px solid gray" }} className="my-1"></p> */}
          <Modal.Body id="example-modal-sizes-title-xl">
            <div className="d-flex align-items-center justify-content-center">
              <span className="mx-4">
                <span style={{ fontWeight: "900" }}>PO No:</span>{" "}
                {data?.header?.poNo}
              </span>
              <span className="mx-4">
                <span style={{ fontWeight: "900" }}>LC No :</span>{" "}
                {data?.header?.lcNo}
              </span>
              <span className="mx-4">
                <span style={{ fontWeight: "900" }}>Shipment No : </span>{" "}
                {data?.header?.shipmentNo}
              </span>
              <span className="mx-4">
                <span style={{ fontWeight: "900" }}>Bill Status : </span>{" "}
                {data?.header?.billStatus}
              </span>
            </div>
            <Formik
              enableReinitialize={true}
              initialValues={initData}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                // saveHandler(values, () => {
                //   resetForm(initData);
                //   setRowData([]);
                // });
              }}
            >
              {({
                handleSubmit,
                resetForm,
                values,
                errors,
                touched,
                setFieldValue,
                isValid,
              }) => (
                <Form className="form form-label-right">
                  {isloading && <Loading />}
                  <ClosingLanding
                    data={data}
                    closingTotalBookedAmount={closingTotalBookedAmount}
                    total={total}
                  />
                </Form>
              )}
            </Formik>
          </Modal.Body>
          <Modal.Footer>
            <div>
              <button
                type="button"
                onClick={() => {
                  let confirmObject = {
                    title: "Are you sure?",
                    message: `Do you want to proceed?`,
                    yesAlertFunc: () => {
                      saveHandler()
                    },
                    noAlertFunc: () => {},
                  };
                  IConfirmModal(confirmObject);
                }}
                className="btn btn-primary mr-2"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setData({});
                  setReferenceId(0);
                  setClosingReferenceId(0);
                  onHide();
                }}
                className="btn btn-light btn-elevate"
              >
                Close
              </button>
            </div>
          </Modal.Footer>
        </>
      </Modal>
    </div>
  );
};

export default ClosingModal;
