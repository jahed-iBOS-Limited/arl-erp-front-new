/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { isUniq } from "../../../../_helper/uniqChecker";
import {
  getCommercialCostingServiceBreakdown,
  saveServicezbreakdown,
} from "../helper";
import Loading from "./../../../../_helper/_loading";
import AttachmentUploaderNew from "../../../../_helper/attachmentUploaderNew";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";

const validationSchema = Yup.object().shape({});
const initData = {};

const BreakDownModal = ({
  show,
  onHide,
  supplierDDL,
  polcNo,
  referenceId,
  setReferenceId,
  shipmentId,
  chargeTypeId,
}) => {
  const [rowDto, setRowDto] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [, getSubChargeTypeDDL] = useAxiosGet();
  const [subChargeTypeDDL, setSubChargeTypeDDL] = useState([]);
  const [showSubChargeCol, setShowSubChargeCol] = useState("");

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const dispatch = useDispatch();
  console.log({ showSubChargeCol });
  useEffect(() => {
    const url = `/imp/ImportCommonDDL/SubChargeTypeDDL?ChargeTypeId=${chargeTypeId}`;
    chargeTypeId &&
      getSubChargeTypeDDL(url, (data) => {
        const DDL =
          data?.length > 0 &&
          data.map((item) => {
            return {
              label: item.subChargeTypeName,
              value: item.subChargeTypeId,
            };
          });
        setSubChargeTypeDDL(DDL);
      });
  }, [chargeTypeId]);

  useEffect(() => {
    if (referenceId) {
      getCommercialCostingServiceBreakdown(referenceId, setRowDto);
    }
  }, [referenceId]);

  const addHandler = (payload) => {
    if (payload?.subChargeTypeId) {
      const isExist = rowDto.some(
        (item) =>
          item.supplierName === payload.supplierName &&
          item.subChargeTypeId === payload.subChargeTypeId
      );
      if (isExist) {
        return toast.warn("Already Exists!");
      } else {
        setRowDto([payload, ...rowDto]);
      }
    } else {
      if (isUniq("supplierName", payload.supplierName, rowDto)) {
        setRowDto([payload, ...rowDto]);
      }

      // console.log("have ctd")
      // if (isUniq('subChargeTypeId', payload.subChargeTypeId, rowDto)) {
      //   setRowDto([payload, ...rowDto]);
      // }
    }
  };

  const remover = (id) => {
    let data = rowDto.filter((itm, index) => index !== id);
    setRowDto(data);
  };

  const saveHandler = (payload) => {
    if (rowDto.length > 0) {
      saveServicezbreakdown(rowDto, setIsLoading, onHide, setReferenceId);
    } else {
      toast.warning("Please add at least one row");
    }
  };

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
            <Modal.Title className="text-center">
              Service Break Down
            </Modal.Title>
          </Modal.Header>
          {/* <p style={{ borderBottom: "1px solid gray" }} className="my-1"></p> */}
          <Modal.Body id="example-modal-sizes-title-xl">
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
                  <div className="global-form">
                    <div className="row">
                      {subChargeTypeDDL.length > 0 && (
                        <div className="col-lg-3">
                          <NewSelect
                            label="Sub Charge Type "
                            options={subChargeTypeDDL || []}
                            value={values?.subChargeType}
                            placeholder="Select Sub Charge Type"
                            name="subChargeType"
                            onChange={(valueOption) => {
                              setFieldValue("subChargeType", valueOption);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      )}
                      <div className="col-lg-3">
                        <NewSelect
                          label="Supplier"
                          options={supplierDDL || []}
                          value={values?.supplier}
                          placeholder="Select Supplier"
                          name="costElement"
                          onChange={(valueOption) => {
                            setFieldValue("supplier", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.amount}
                          label="Amount"
                          placeholder="Amount"
                          onChange={(e) => {
                            if (e.target.value < 0) {
                              setFieldValue("amount", "");
                            } else {
                              setFieldValue("amount", parseInt(e.target.value));
                            }
                          }}
                          type="number"
                          name="amount"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.description}
                          label="Description (optional)"
                          placeholder="Description"
                          required
                          type="text"
                          name="description"
                        />
                      </div>

                      <div className="col-lg-1" style={{ marginTop: "20px" }}>
                        <button
                          type="button"
                          disabled={!values.supplier || !values.amount}
                          onClick={() => {
                            addHandler({
                              accountId: profileData?.accountId,
                              businessUnitId: selectedBusinessUnit?.value,
                              serviceBreakdownId: 0,
                              referenceId: referenceId,
                              poId: polcNo?.poId,
                              lcId: polcNo?.lcId,
                              shipmentId: shipmentId,
                              supplierId: values?.supplier?.value,
                              supplierName: values?.supplier?.label,
                              description: values?.description,
                              numContractedAmount: values?.amount,
                              subChargeTypeId: values?.subChargeType?.value,
                              subChargeTypeName: values?.subChargeType?.label,
                            });
                            setFieldValue("supplier", "");
                            setFieldValue("amount", "");
                            setFieldValue("description", "");
                            setFieldValue("subChargeType", "");
                            // setFieldValue("attatchmentId", "");
                          }}
                          className="btn btn-primary"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="react-bootstrap-table table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Supplier</th>
                          <th>Description</th>
                          {showSubChargeCol && <th>Sub Charge Type</th>}
                          <th>Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.length > 0 &&
                          rowDto?.map((item, index) => {
                            setShowSubChargeCol(item?.subChargeTypeName);
                            return (
                              <tr key={index}>
                                <td
                                  style={{ width: "30px" }}
                                  className="text-center"
                                >
                                  {index + 1}
                                </td>
                                <td>
                                  <span className="pl-2">
                                    {item?.supplierName}
                                  </span>
                                </td>
                                <td>
                                  <span className="pl-2">
                                    {item?.description}
                                  </span>
                                </td>
                                {showSubChargeCol && (
                                  <td>
                                    <span className="pl-2">
                                      {item?.subChargeTypeName}
                                    </span>
                                  </td>
                                )}
                                <td>
                                  <span className="pl-2">
                                    {item?.numContractedAmount}
                                  </span>
                                </td>
                                <td
                                  // style={{ width: "120px" }}
                                  // colSpan={!showSubChargeCol ? 2 : 1}
                                  className=" d-flex justify-content-around "
                                >
                                  <div className="">
                                    {item?.attatchmentId ? (
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
                                            dispatch(
                                              getDownlloadFileView_Action(
                                                item?.attatchmentId
                                              )
                                            );
                                          }}
                                          className="mt-2 "
                                        >
                                          <i
                                            style={{ fontSize: "16px" }}
                                            className={`fa pointer fa-eye`}
                                            aria-hidden="true"
                                          ></i>
                                        </span>
                                      </OverlayTrigger>
                                    ) : null}
                                  </div>
                                  <div className="">
                                    <AttachmentUploaderNew
                                      style={{
                                        backgroundColor: "transparent",
                                        color: "black",
                                      }}
                                      CBAttachmentRes={(attachmentData) => {
                                        if (Array.isArray(attachmentData)) {
                                          // setAttachment(attachmentData?.[0]?.id);
                                          // setFieldValue(
                                          //   "strAttachment",
                                          //   attachmentData?.[0]?.id
                                          // );
                                          const temp = [...rowDto];
                                          temp[index].attatchmentId =
                                            attachmentData?.[0]?.id;
                                          setRowDto(temp);
                                        }
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <IDelete remover={remover} id={index} />
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </Form>
              )}
            </Formik>
          </Modal.Body>
          <Modal.Footer>
            <div>
              <button
                type="button"
                onClick={() => saveHandler()}
                className="btn btn-primary mr-2"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setRowDto([]);
                  setReferenceId(0);
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

export default BreakDownModal;
