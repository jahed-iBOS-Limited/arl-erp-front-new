/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../../_metronic/_partials/controls";
import ICon from "../../../../../chartering/_chartinghelper/icons/_icon";
import IView from "../../../../../chartering/_chartinghelper/icons/_view";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../../_helper/_formatMoney";
import IClose from "../../../../../_helper/_helperIcons/_close";
import Loading from "../../../../../_helper/_loading";
import NewSelect from "../../../../../_helper/_select";
import PaginationTable from "../../../../../_helper/_tablePagination";
import IViewModal from "../../../../../_helper/_viewModal";
import AttachmentUploadForm from "../../attachmentAdd";
import { getAttachments, getBankDDLAll, getFDRLandingData } from "../../helper";
import FDRCloseModal from "./closeModal";
// import { ExcelRenderer } from "react-excel-renderer";

const FdrRegisterLanding = () => {
  const history = useHistory();
  const initData = {
    bank: { label: "ALL", value: 0 },
    status: { value: "Active", label: "Active" },
  };

  const [loading, setLoading] = useState(false);
  const [fdrRegisterData, setFdrRegisterData] = useState({});
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [bankDDL, setBankDDL] = useState([]);
  const [open, setOpen] = useState(false);
  const [fdrNo, setFdrNo] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [openCloseModal, setOpenCloseModal] = useState(false);
  const [singleData, setSingleData] = useState({});
  const [status, setStatus] = useState("Active");

  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getBankDDLAll(setBankDDL, setLoading);
  }, []);

  const getData = () => {
    getFDRLandingData(
      buId,
      0,
      pageNo,
      pageSize,
      setFdrRegisterData,
      setLoading,
      status
    );
  };

  useEffect(() => {
    getData();
  }, []);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getFDRLandingData(
      buId,
      values?.bank?.value,
      pageNo,
      pageSize,
      setFdrRegisterData,
      setLoading,
      status
    );
  };

  const totalPrincipleAmount = useMemo(
    () => fdrRegisterData?.data?.reduce((a, c) => a + c?.numPrinciple, 0),
    [fdrRegisterData?.data]
  );
  const totalInterestAmount = useMemo(
    () =>
      fdrRegisterData?.data?.reduce(
        (a, c) => a + (c?.numPrinciple * c?.numInterestRate) / 100,
        0
      ),
    [fdrRegisterData?.data]
  );
  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <div className="">
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"FDR Register"}>
                <CardHeaderToolbar>
                  <button
                    className="btn btn-primary ml-2"
                    type="submit"
                    disabled={false}
                    onClick={() => {
                      history.push({
                        pathname: `${window.location.pathname}/create`,
                        state: {
                          ...values,
                        },
                      });
                    }}
                  >
                    FDR Register
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="form-group row global-form align-items-end">
                    <div className="col-lg-3">
                      <NewSelect
                        name="bank"
                        options={bankDDL}
                        value={values?.bank}
                        onChange={(valueOption) => {
                          setFieldValue("bank", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        label="Bank"
                        placeholder="Bank"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="status"
                        options={[
                          { value: "All", label: "All" },
                          { value: "Active", label: "Active" },
                          { value: "Inactive", label: "Inactive" },
                        ]}
                        value={values?.status}
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("status", valueOption);
                            setStatus(valueOption?.value);
                          } else {
                            setFieldValue("status", {
                              value: "Active",
                              label: "Active",
                            });
                            setStatus("Active");
                          }
                        }}
                        errors={errors}
                        touched={touched}
                        label="Status"
                      />
                    </div>

                    <div className="col-lg-2">
                      <button
                        className="btn btn-primary mr-2"
                        type="button"
                        onClick={(e) => {
                          getFDRLandingData(
                            buId,
                            values?.bank?.value,
                            pageNo,
                            pageSize,
                            setFdrRegisterData,
                            setLoading,
                            status
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                  <div></div>
                  <div className="row">
                    <div className="col-12">
                    <div className="table-responsive">
             <table className="table table-striped table-bordered global-table mt-0 table-font-size-sm mt-5">
                        <thead className="bg-secondary">
                          <tr>
                            <th>SL</th>
                            <th>Bank</th>
                            <th>FDR No</th>
                            <th>Renewal</th>
                            <th>Tenure</th>
                            <th>OpenDate</th>
                            <th>Mature Date</th>
                            <th>Principle</th>
                            <th>Interest Rate</th>
                            <th>Exp. Interest Amount</th>
                            <th>Lien To</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fdrRegisterData?.data?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-center">
                                {`${item?.strBankName} (${
                                  item?.strBankBranchName
                                    ? item?.strBankBranchName
                                    : ""
                                })`}
                              </td>
                              <td>{item?.strFdrAccountNo}</td>
                              <td className="text-right">{item?.intVersion}</td>
                              <td className="text-right">
                                {item?.intTenureDays}
                              </td>
                              <td className="text-right">
                                {_dateFormatter(item?.dteStartDate)}
                              </td>
                              <td className="text-right">
                                {_dateFormatter(item?.dteMaturityDate)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.numPrinciple)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.numInterestRate)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(
                                  (item?.numPrinciple * item?.numInterestRate) /
                                    100
                                )}
                              </td>
                              <td className="text-right">{item?.strLienTo}</td>
                              <td className="text-center">
                                <div className="d-flex justify-content-around">
                                  <span>
                                    <ICon
                                      title="Attach or View your documents"
                                      onClick={() => {
                                        setFdrNo(item?.strFdrAccountNo);
                                        getAttachments(
                                          buId,
                                          1,
                                          item?.strFdrAccountNo,
                                          setAttachments,
                                          setLoading,
                                          () => {
                                            setOpen(true);
                                          }
                                        );
                                      }}
                                    >
                                      <i class="fas fa-paperclip"></i>
                                    </ICon>
                                  </span>
                                  <span
                                    onClick={() =>
                                      history.push({
                                        pathname: `/financial-management/banking/fdr-register/view/${item?.intFdrAccountId}`,
                                      })
                                    }
                                  >
                                    <IView />
                                  </span>

                                  <span
                                    onClick={() =>
                                      history.push({
                                        pathname: `/financial-management/banking/fdr-register/renew/${item?.intFdrAccountId}`,
                                      })
                                    }
                                    className="text-primary"
                                    style={{
                                      cursor: "pointer",
                                      marginLeft: "4px",
                                    }}
                                  >
                                    Renew
                                  </span>
                                  {item?.isActive ? (
                                    <span
                                      onClick={() => {
                                        setSingleData(item);
                                        setOpenCloseModal(true);
                                      }}
                                    >
                                      <IClose />
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}

                          <tr>
                            <td colSpan={7} className="text-right">
                              <b>Total</b>
                            </td>
                            <td className="text-right">
                              <b> {_formatMoney(totalPrincipleAmount)}</b>
                            </td>
                            <td></td>
                            <td className="text-right">
                              <b> {_formatMoney(totalInterestAmount)}</b>
                            </td>
                            <td colSpan={2}></td>
                          </tr>
                        </tbody>
                      </table>
            </div>
                     
                    </div>
                  </div>
                </Form>
                {fdrRegisterData?.data?.length > 0 && (
                  <PaginationTable
                    count={fdrRegisterData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )}
                <IViewModal show={open} onHide={() => setOpen(false)}>
                  <AttachmentUploadForm
                    typeId={1}
                    setShow={setOpen}
                    fdrNo={fdrNo}
                    attachments={attachments}
                  />
                </IViewModal>
                <IViewModal
                  show={openCloseModal}
                  onHide={() => setOpenCloseModal(false)}
                  modelSize="xl"
                >
                  <FDRCloseModal
                    singleData={singleData}
                    getData={getData}
                    setOpenCloseModal={setOpenCloseModal}
                  />
                </IViewModal>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
};

export default FdrRegisterLanding;
