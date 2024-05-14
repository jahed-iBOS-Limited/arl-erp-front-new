import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
// import IView from "../../../../_helper/_helperIcons/_view";
import { useHistory } from "react-router-dom";
import {
  GetInformationSectionPagination,
  isActiveByInformationSectionId,
} from "../helper";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
// import IApproval from "../../../../_helper/_helperIcons/_approval";
import { Formik, Form } from "formik";
import IConfirmModal from "../../../../_helper/_confirmModal";

const initData = {
  isActive: "",
};

export function TableRow({ saveHandler }) {
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state?.authData?.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state?.authData?.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetInformationSectionPagination(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setGridData,
        setLoading,
        pageNo,
        pageSize
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    GetInformationSectionPagination(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize
    );
  };


  //singleApprovalndler
  const singleApprovalndler = (index, values) => {
    
    const copyGridData = [...gridData?.landingData];
    copyGridData[index].activeStatus = !copyGridData[index].activeStatus;
    // setGridData(copyGridData);

    const singleData = [copyGridData?.[index]];
    console.log(singleData)
    //const updateGridData = copyGridData?.filter((itm, idx) => idx !== index);
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to active the selected section on ${singleData[0]?.partnerSectionName}?`,
      yesAlertFunc: () => {
        const payload={
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          activeStatus: values,
          partnerSectionId:singleData[0]?.partnerSectionId
        }
        isActiveByInformationSectionId(payload);
        GetInformationSectionPagination(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          setGridData,
          setLoading,
          pageNo,
          pageSize
        );
      },
      noAlertFunc: () => {
        history.push("/config/partner-management/partner-info-section");
      },
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, resetForm, values, isValid, setFieldValue }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="row cash_journal">
                {loading && <Loading />}
                <div className="col-lg-12 pr-0 pl-0">
                 <div className="table-responsive">
                 <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing global-table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}>SL</th>
                        <th>Information Section Name</th>
                        <th style={{ width: "90px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.landingData?.map((item, index) => (
                        <tr key={item.partnerSectionId}>
                          {/* key={item.businessUnitId} */}
                          <td> {index+1}</td>
                          <td>
                            <div className="pl-2">
                              {item?.partnerSectionName}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-around">
                              <span
                                className=""
                                onClick={() => singleApprovalndler(index)}
                              >
                                <input
                                  type="checkbox"
                                  value={item?.isActive || values?.isActive}
                                  checked={item?.isActive}
                                  name="isActive"
                                  onChange={(e) => {
                                    singleApprovalndler(
                                      index,
                                      e.target.checked
                                    );
                                    setFieldValue("isActive", e.target.checked);
                                  }}
                                />
                              </span>
                              <span
                                className="edit"
                                onClick={() => {
                                  localStorage.setItem("partnerSectionName", item?.partnerSectionName)
                                  history.push(
                                    `/config/partner-management/partner-info-section/edit/${item?.partnerSectionId}`
                                  );
                                }}
                              >
                                <IEdit />
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                 </div>
                </div>
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
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
