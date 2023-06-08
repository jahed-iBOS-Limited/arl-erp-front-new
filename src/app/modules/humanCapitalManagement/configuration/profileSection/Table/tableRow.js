import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
// import IView from "../../../../_helper/_helperIcons/_view";
import { useHistory } from "react-router-dom";
import {
  GetProfileSectionPagination,
  isActiveByProfileSectionId,
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
      GetProfileSectionPagination(
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
    GetProfileSectionPagination(
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
    const copyGridData = [...gridData?.data];
    copyGridData[index].itemCheck = !copyGridData[index].itemCheck;
    // setGridData(copyGridData);

    const singleData = [copyGridData?.[index]];
    const updateGridData = copyGridData?.filter((itm, idx) => idx !== index);
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to active the selected section on ${singleData[0]?.strProfileSection}?`,
      yesAlertFunc: () => {
        // const payload = singleData.map((itm) => ({
        //   accountingJournalId: itm.cashJournalId,
        //   journalTypeId: itm.accountingJournalTypeId,
        //   transactionDate: date,
        //   actionBy: profileData.userId,
        // }));
        // dispatch(saveCompleted_action(payload, updateRowDto, setRowDto));
        isActiveByProfileSectionId(singleData[0]?.intProfileSectionId, values);
        GetProfileSectionPagination(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          setGridData,
          setLoading,
          pageNo,
          pageSize
        );
      },
      noAlertFunc: () => {
        history.push("/human-capital-management/hcmconfig/profile-section");
      },
    };
    IConfirmModal(confirmObject);
    console.log("singleData", singleData);
    console.log("updateGridData", updateGridData);
    console.log("values", values);
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
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing global-table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}>SL</th>
                        <th>Profile Section Name</th>
                        <th style={{ width: "90px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => (
                        <tr>
                          {/* key={item.businessUnitId} */}
                          <td> {item.sl}</td>
                          <td>
                            <div className="pl-2">
                              {item?.strProfileSection}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-around">
                              <span
                                className=""
                                onClick={() => singleApprovalndler(index)}
                              >
                                {/* <IApproval /> */}
                                {/* <label class="switch">
                                  <input
                                    type="checkbox"
                                    value={item?.itemCheck}
                                    checked={item?.itemCheck}
                                    name={item?.itemCheck}
                                  />
                                  <span class="slider round"></span>
                                </label> */}
                                <input
                                  type="checkbox"
                                  // value={item?.isActive || values?.isActive}
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
                                  history.push(
                                    `/human-capital-management/hcmconfig/profile-section/edit/${item?.intProfileSectionId}`
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
                <div>
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
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
