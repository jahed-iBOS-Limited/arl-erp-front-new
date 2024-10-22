import React, { useEffect, useState } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IViewModal from "../../../../_helper/_viewModal";
import CreateCostModal from "./createModal";
import { shallowEqual, useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { imarineBaseUrl } from "../../../../../App";
import PaginationTable from "../../../../_helper/_tablePagination";
import { Formik } from "formik";
import * as Yup from "yup";
import Loading from "../../../../_helper/_loading";

const validationSchema = Yup.object().shape({});

const ProductMainIndex = ({
  costingConfiguration,
  isModalShowObj,
  setIsModalShowObj,
}) => {
  const history = useHistory();
  const [uomDDL, getUomDDL, uomDDLLoading] = useAxiosGet();
  const [
    productLanding,
    getProductLanding,
    productLandingLandingLoading,
  ] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const { selectedBusinessUnit, profileData } = useSelector(
    (state) => state.authData,
    shallowEqual
  );

  useEffect(() => {
    commonLandingApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  useEffect(() => {
    getUomDDL(
      `/item/ItemUOM/GetItemUOMDDL?AccountId=${profileData.accountId}&BusinessUnitId=${selectedBusinessUnit.value}`
    );
  }, []);

  const commonLandingApi = (PageNo = pageNo, PageSize = pageSize) => {
    getProductLanding(
      `/costmgmt/Precosting/ProductLanding?businessUnitId=${selectedBusinessUnit.value}&pageNo=${PageNo}&pageSize=${PageSize}`
    );
  };

  console.log("productLanding", productLanding);
  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <>
            {(uomDDLLoading || productLandingLandingLoading) && <Loading />}
            <div className="col-lg-12">
              <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th
                        style={{
                          minWidth: "400px",
                        }}
                      >
                        Product Name
                      </th>
                      <th
                        style={{
                          minWidth: "200px",
                        }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productLanding?.data?.length > 0 &&
                      productLanding?.data?.map((item, i) => (
                        <tr key={i + 1}>
                          <td className="text-center">{i + 1}</td>
                          <td className="text-left">{item?.productName}</td>
                          <td>
                            <div className="pl-2" style={{ display: "flex" }}>
                              <div class="order-md-1 p-1">
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">
                                      {"Product to FG Configuration"}
                                    </Tooltip>
                                  }
                                >
                                  <input
                                    type="checkbox"
                                    value={item?.itemStatus}
                                    checked={item?.finishGoodMappingsCount > 0}
                                    name="itemStatus"
                                    onClick={() =>
                                      history.push({
                                        pathname: `/internal-control/costing/costingconfiguration/product-to-fg`,
                                        state: { item, checkBox: "itemStatus" },
                                      })
                                    }
                                  />
                                </OverlayTrigger>
                                <label htmlFor="ptofg" className="pl-1">
                                  Product to finished Good
                                </label>
                              </div>

                              <div class="order-md-1 p-1">
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">
                                      {"Product to RM Configuration"}
                                    </Tooltip>
                                  }
                                >
                                  <input
                                    type="checkbox"
                                    value={item?.itemAttributeConfigStatus}
                                    checked={item?.materialMappingsCount > 0}
                                    name="itemAttributeConfigStatus"
                                    onClick={() =>
                                      history.push({
                                        pathname: `/internal-control/costing/costingconfiguration/product-to-rm`,
                                        state: { item, checkBox: "itemStatus" },
                                      })
                                    }
                                  />
                                </OverlayTrigger>
                                <label htmlFor="ptorm" className="pl-1">
                                  Product to Raw Material
                                </label>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            {productLanding?.data?.length > 0 && (
              <PaginationTable
                count={productLanding?.totalCount}
                setPositionHandler={(pageNo, pageSize) => {
                  commonLandingApi(pageNo, pageSize);
                }}
                values={values}
                paginationState={{
                  pageNo,
                  setPageNo,
                  pageSize,
                  setPageSize,
                }}
              />
            )}
          </>
        )}
      </Formik>

      {isModalShowObj?.isProductCreate && (
        <>
          <IViewModal
            title="Create New Product"
            show={isModalShowObj?.isProductCreate}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isProductCreate: false,
                isCostElementCreate: false,
              });
            }}
          >
            <CreateCostModal
              uomDDL={uomDDL || []}
              CB={() => {
                commonLandingApi();
                setIsModalShowObj({
                  ...isModalShowObj,
                  isProductCreate: false,
                  isCostElementCreate: false,
                });
              }}
            />
          </IViewModal>
        </>
      )}
    </div>
  );
};

export default ProductMainIndex;
