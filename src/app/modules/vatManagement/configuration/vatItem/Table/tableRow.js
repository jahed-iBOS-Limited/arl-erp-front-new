import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import IView from "../../../../_helper/_helperIcons/_view";
import { useHistory } from "react-router-dom";
import { getTaxItemTypeDDL_api, GetVatItemPagination } from "../helper";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import IViewModal from "../../../../_helper/_viewModal";
import VatViewForm from "../viewForm/viewForm";
const initData = {
  id: undefined,
  taxItemTypeId: "",
};
// Validation schema
const validationSchema = Yup.object().shape({});
export function TableRow() {
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const history = useHistory();
  const [taxItemTypeDDL, setTaxItemTypeDDL] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  useEffect(() => {
    getTaxItemTypeDDL_api(setTaxItemTypeDDL);
  }, []);

  const gridDataFunc = (pageNo, pageSize, searchValue, itemType) => {
    GetVatItemPagination(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      searchValue,
      itemType
    );
  };
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      gridDataFunc(pageNo, pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    gridDataFunc(pageNo, pageSize, null, values?.taxItemTypeId?.value);
  };

  const paginationSearchHandler = (searchValue, values) => {
    gridDataFunc(pageNo, pageSize, searchValue, values?.taxItemTypeId?.value);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
            <div className="row global-form">
              <div className="col-lg-3">
                <NewSelect
                  name="taxItemTypeId"
                  options={taxItemTypeDDL}
                  value={values?.taxItemTypeId}
                  label="Tax Item Type"
                  onChange={(valueOption) => {
                    setFieldValue("taxItemTypeId", valueOption);
                    gridDataFunc(pageNo, pageSize, null, valueOption?.value);
                  }}
                  placeholder=" Tax Item Type"
                  errors={errors}
              
                  touched={touched}
                />
              </div>
            </div>
            <div className="row">
              {loading && <Loading />}
              <div className="col-lg-12 ">
                <PaginationSearch
                  placeholder="Item Type or Category"
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                />
                <div className="react-bootstrap-table table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Tax Item Type</th>
                        <th>Tax Item Category</th>
                        <th>SupplyType</th>
                        <th>Tax Item Group Name</th>
                        <th>UOM Name</th>
                        <th>HS Code</th>
                        <th style={{ width: "60px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => (
                        <tr>
                          {/* key={item.businessUnitId} */}
                          <td> {item.sl}</td>
                          <td>
                            <div className="pl-2">{item.taxItemTypeName}</div>
                          </td>
                          <td>
                            <div className="pl-2">
                              {item.taxItemCategoryName}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{item.supplyTypeName}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item.taxItemGroupName}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item.uomName}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item.hsCode}</div>
                          </td>

                          <td>
                            <div className="d-flex justify-content-around">
                              <span className="view mx-1">
                                <IView
                                  clickHandler={() => {
                                    setId(item?.taxItemGroupId);
                                    setShowModal(true);
                                  }}
                                />
                              </span>
                              <span
                                className="edit mr-1"
                                onClick={() => {
                                  history.push(
                                    `/mngVat/cnfg-vat/vat-item/edit/${item.taxItemGroupId}`
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

                {/* Modal Start */}
                <IViewModal
                  show={showModal}
                  onHide={() => setShowModal(false)}
                  children={<VatViewForm id={id} />}
                />
                {/* Modal End */}
              </div>
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
              )}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
