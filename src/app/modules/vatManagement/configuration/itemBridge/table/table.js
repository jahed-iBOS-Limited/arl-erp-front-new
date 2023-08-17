/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import ICustomTable from "../../../../_helper/_customTable";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import {
  GetItemSalesForTaxDDL,
  GetTaxItemGroupDDL,
  UpdateTaxItem,
} from "../helper";

const ItemBridge = () => {
  const header = ["SL", "Code", "Name", "Uom Name", "Tax Item", "Action"];
  const initData = {
    itemGroup: "",
  };
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [gridData, setGridData] = useState([]);
  const [taxItemGroupDDL, setTaxItemGroupDDL] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetTaxItemGroupDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setTaxItemGroupDDL,
      (data) => {
        GetItemSalesForTaxDDL(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          "",
          setGridData,
          setLoading,
          data
        );
      }
    );
  }, [profileData, selectedBusinessUnit]);

  const modifyData = (keyName, index, value) => {
    let data = [...gridData];
    let element = data[index];
    element[keyName] = value;
    setGridData(data);
  };

  const paginationSearchHandler = (searchValue) => {
    GetItemSalesForTaxDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      searchValue,
      setGridData,
      setLoading,
      taxItemGroupDDL
    );
  };
  return (
    <>
      <Formik initialValues={initData}>
        {({ touched, setFieldValue }) => (
          <>
            <Card>
              <CardHeader title="Item Bridge" />
              <CardBody>
                <Form className="form form-label-right">
                  {loading && <Loading />}
                  <PaginationSearch
                    placeholder="Item Name or Code"
                    paginationSearchHandler={paginationSearchHandler}
                  />
                  <ICustomTable ths={header}>
                    {gridData?.length > 0 &&
                      gridData?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td
                              style={{ width: "30px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>{item?.code}</td>
                            <td>{item?.label}</td>
                            <td>{item?.uomName}</td>
                            <td>
                              <NewSelect
                                name="taxZoneDDL"
                                options={taxItemGroupDDL || []}
                                value={item?.itemGroup}
                                onChange={(valueOption) => {
                                  modifyData("itemGroup", index, valueOption);
                                }}
                                touched={touched}
                                menuPosition="fixed"
                              />
                            </td>
                            <td
                              style={{ width: "100px" }}
                              className="text-center"
                            >
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                  UpdateTaxItem(
                                    item?.value,
                                    item?.itemGroup?.value,
                                    profileData?.accountId,
                                    selectedBusinessUnit?.value,
                                    setLoading
                                  );
                                }}
                              >
                                Update
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </ICustomTable>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default ItemBridge;
