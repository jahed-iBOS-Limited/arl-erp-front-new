/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import AttachmentUploadForm from "./entryModal";
import { getAttachmentUploads } from "../helper";
import NewSelect from "../../../../_helper/_select";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { getDistributionChannelById } from "../../../configuration/distributionChannel/_redux/Actions";
import { getDistributionChannelDDL } from "../../../orderManagement/salesOrder/_redux/Api";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";
import IButton from "../../../../_helper/iButton";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import AttachmentUploaderNew from "../../../../_helper/attachmentUploaderNew";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const initData = {
  type: { value: 1, label: "BUET Test Report" }, channel: "", customer: ""
};

function AttachmentUpload() {
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const dispatch = useDispatch();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedRow, setSelectedRow] = useState('')
  const [type, getType, , setType] = useAxiosGet()
  const [distributionChannelDDL, getDistributionChannelDDL] = useAxiosGet()
  const [customerTargetPolicy, getCustomerTargetPolicy, getCustomerTargetPolicyLoading, setCustomerTargetPolicyData] = useAxiosGet()
  const [, updateCustomerRowAttachement, updateCustomerRowAttachementLoading] = useAxiosPost()


  useEffect(() => {

    commonGridDataFunc(initData, pageNo, pageSize)
    getType(`/partner/BusinessPartnerBasicInfo/GetPolicyAttachmentType`, (data) => {
      const updatedType = data.map(item => {
        return {
          value: item?.typeId,
          label: item?.typeName
        }
      }
      )
      setType(updatedType)

      getDistributionChannelDDL(`/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`)
    })
  }, [accId, buId]);


  const handleCustomerTargetPolicyLanding = (values, pageNo, pageSize) => {
    getCustomerTargetPolicy(`/partner/BusinessPartnerBasicInfo/GetBusinessPartnerPolicyPagination?search=${values?.customer.length > 0 ? values?.customer : ""}&businessUnitId=${buId}&channelId=${values?.channel?.value}&attachmentTypeId=${values?.type?.value}&pageNo=${pageNo}&pageSize=${pageSize}`)
  }


  const getLandingData = (values, pageNo = 0, pageSize = 15) => {
    getAttachmentUploads(
      accId,
      buId,
      values?.type?.value,
      "",
      "",
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );
  };


  // const setPositionHandler = (pageNo, pageSize, values) => {
  //   getLandingData(values, pageNo, pageSize);
  //   if (values?.type?.value === 3) {
  //     getCustomerTargetPolicy(`/partner/BusinessPartnerBasicInfo/GetBusinessPartnerPolicyPagination?search=${values?.customer?.label}&businessUnitId=${buId}&channelId=${values?.channel?.value}&attachmentTypeId=${values?.type?.value}&pageNo=${pageNo}&pageSize=${pageSize}`)
  //   }
  // };
  const commonGridDataFunc = (values, pageNo, pageSize) => {
    if (values?.type?.value === 3) {
      handleCustomerTargetPolicyLanding(values, pageNo, pageSize)
    } else {
      getLandingData(
        { ...values },
        pageNo,
        pageSize
      );

    }
  }
  return (
    <>
      {(loading || updateCustomerRowAttachementLoading || getCustomerTargetPolicyLoading) && <Loading />}
      <ICustomCard
        title="Attachment Upload"
        createHandler={() => {
          setShow(true);
        }}
      >
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue, errors, touched }) => (
            <>
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      value={values?.type}
                      name="type"
                      options={type}
                      onChange={(valueOption) => {
                        setFieldValue("type", valueOption);
                        const modfyValues = {
                          ...values,
                          type: valueOption
                        }
                        commonGridDataFunc(modfyValues, pageNo, pageSize)
                      }}
                      placeholder="Select One"
                      errors={errors}
                      touched={touched}
                      label="Type"
                    />
                  </div>
                  {
                    values?.type?.value === 3 && (
                      <>
                        <div className="col-lg-3">
                          <NewSelect
                            name="channel"
                            options={distributionChannelDDL}
                            value={values?.channel}
                            label="Distribution Channel"
                            onChange={(valueOption) => {
                              setFieldValue("channel", valueOption);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>

                        <div className="col-lg-3">
                          <InputField
                            value={values?.customer}
                            label="Customer"
                            name="customer"
                            type="text"
                            onChange={(e) => {
                              setFieldValue("customer", e.target.value);
                            }}
                          />
                        </div>


                        <div className="col-lg-3 row">
                          <IButton
                            onClick={() => {
                              commonGridDataFunc(values, pageNo, pageSize)
                            }}
                            disabled={!values?.channel?.value}
                            colSize={6}
                          />
                          {customerTargetPolicy?.data?.filter(item => item?.isSelected)?.length > 0 &&

                            <IButton
                              onClick={() => {
                                if (customerTargetPolicy?.data?.filter(item => item.isSelected === true && item.attachment.length > 0)) {

                                  updateCustomerRowAttachement(`/partner/BusinessPartnerBasicInfo/CreateBusinessPartnerPolicy`, customerTargetPolicy?.data, () => {
                                    commonGridDataFunc(values, pageNo, pageSize);
                                  })
                                }
                              }}
                              className={'ml-2 btn-primary'}
                              colSize={6}
                            >
                              Update
                            </IButton>
                          }
                        </div>
                      </>
                    )
                  }
                </div>
                {values?.type?.value !== 3 && gridData?.data?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Report Type</th>
                          {buId === 175 && values?.type?.value === 1 && (
                            <>
                              <th>Party Name</th>
                              <th>Casting Date</th>
                              <th>Test report Date</th>
                              <th>PSI</th>
                              <th>Delivery Qty</th>
                            </>
                          )}
                          <th style={{ width: "90px" }}>Attached File</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.data?.map((td, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td> {td?.strTypeName} </td>
                            {buId === 175 && values?.type?.value === 1 && (
                              <>
                                <td> {td?.strBusinessPartnerName} </td>
                                <td> {_dateFormatter(td?.dteCastingDate)} </td>
                                <td>
                                  {" "}
                                  {_dateFormatter(td?.dteTestReportDate)}{" "}
                                </td>
                                <td> {td?.strItemName} </td>
                                <td className="text-right">
                                  {td?.numDeliveryQty}{" "}
                                </td>
                              </>
                            )}
                            <td className="text-center">
                              <ICon
                                title={
                                  td?.strAttatchment
                                    ? "View Attached File"
                                    : "No File Attached!"
                                }
                                onClick={() => {
                                  if (td?.strAttatchment) {
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        td?.strAttatchment
                                      )
                                    );
                                  } else {
                                    toast.warn("No File Attached!");
                                  }
                                }}
                              >
                                {td?.strAttachmentTypeName === "img" ? (
                                  <i class="far fa-file-image"></i>
                                ) : td?.strAttachmentTypeName === "pdf" ? (
                                  <i class="far fa-file-pdf"></i>
                                ) : (
                                  <i class="far fa-file-exclamation"></i>
                                )}
                              </ICon>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {values?.type?.value === 3 && customerTargetPolicy?.data?.length > 0 &&
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              checked={customerTargetPolicy?.data?.every(item => item.isSelected)}
                              onChange={(e) => {
                                const checked = e.target.checked
                                const updateCustomerTargetPolicy = customerTargetPolicy?.data.map(item => {
                                  return {
                                    ...item, isSelected: checked
                                  }
                                })
                                // console.log(customerTargetPolicy)
                                // console.log(updateCustomerTargetPolicy)
                                setCustomerTargetPolicyData(prevValue => {
                                  return { ...prevValue, data: updateCustomerTargetPolicy }
                                })
                              }}
                            />
                          </th>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Channel</th>
                          <th>Customer</th>
                          <th>Reason</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerTargetPolicy?.data?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td
                                className="text-center"
                              >
                                <input
                                  type="checkbox"
                                  checked={item?.isSelected}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    const updatedData = customerTargetPolicy?.data.map((rowData, idx) => {
                                      if (idx === index) {
                                        return { ...rowData, isSelected: checked };
                                      }
                                      return rowData;
                                    });

                                    setCustomerTargetPolicyData(prevValue => {
                                      return { ...prevValue, data: updatedData }
                                    })

                                  }}
                                />
                              </td>
                              <td className="text-center">{index + 1}</td>
                              <td> {item?.channelName} </td>
                              <td> {item?.businessPartnerName} </td>
                              <td> {item?.reason} </td>
                              <td>
                                <div className="">
                                  {item?.attachment ? (
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
                                              item?.attachment
                                            )
                                          );
                                        }}
                                        className="mt-2 ml-2"
                                      >
                                        <i
                                          style={{ fontSize: "16px" }}
                                          className={`fa pointer fa-eye`}
                                          aria-hidden="true"
                                        ></i>
                                      </span>
                                    </OverlayTrigger>
                                  ) : null}


                                  {item.isSelected && <span className="ml-2">
                                    <AttachmentUploaderNew
                                      CBAttachmentRes={(image) => {
                                        if (image[0]?.id) {
                                          const updatedData = customerTargetPolicy?.data.map((rowData, idx) => {
                                            if (idx === index) {
                                              return {
                                                ...rowData,
                                                attachment: image[0]?.id,
                                              };
                                            }
                                            return rowData;
                                          });

                                          setCustomerTargetPolicyData((prevValue) => {
                                            return { ...prevValue, data: updatedData };
                                          });
                                        }
                                      }}
                                      showIcon
                                      attachmentIcon='fa fa-paperclip'
                                      customStyle={{ 'background': 'transparent', 'padding': '4px 0' }}
                                      fileUploadLimits={1}
                                    />
                                  </span>}

                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                }

                {values?.type?.value === 3 && customerTargetPolicy?.data?.length > 0 && (
                  <PaginationTable
                    count={customerTargetPolicy?.totalCount}
                    setPositionHandler={(pageNo, pageSize) => {
                      commonGridDataFunc(values, pageNo, pageSize)
                    }}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )}

                {values?.type?.value !== 3 && gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
                    setPositionHandler={(pageNo, pageSize) => {
                      commonGridDataFunc(values, pageNo, pageSize)
                    }}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )}
              </Form>
              <IViewModal show={show} onHide={() => setShow(false)}>
                <AttachmentUploadForm
                  value={values}
                  setShow={setShow}
                  getLandingData={() => {
                    commonGridDataFunc(values, pageNo, pageSize)
                  }}
                  reportType={type}
                  gridData={gridData}
                />
              </IViewModal>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default AttachmentUpload;
