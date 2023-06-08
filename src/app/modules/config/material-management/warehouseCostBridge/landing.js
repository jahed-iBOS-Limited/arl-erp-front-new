/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import IConfirmModal from "../../../_helper/_confirmModal";
import Loading from "../../../_helper/_loading";

import { approveAll, getNewApplicationData } from "./helper";

const WarehouseCostBridgeLanding = () => {
  const history = useHistory();
  const [rowDto, setRowDto] = useState([]);
  const [newApplicationData, setNewApplicationData] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [loader, setLoader] = useState(false);

  const [allSelect, setAllSelect] = useState(false);
  const [billSubmitBtn, setBillSubmitBtn] = useState(true);

  useEffect(() => {
    if (newApplicationData?.length > 0) {
      setRowDto(
        newApplicationData?.map((itm) => ({
          ...itm,
          isSelect: false,
        }))
      );
    } else {
      setRowDto([]);
    }
  }, [newApplicationData]);

  // // approveSubmitlHandler btn submit handler
  const approveSubmitlHandler = (values) => {
    let confirmObject = {
      title: "Are you sure?",
      yesAlertFunc: async () => {
        const filterData = rowDto?.filter((item) => item?.isSelect);
        if (filterData?.length === 0) {
          toast.warning("Please Select One");
        } else {
          approveAll(filterData, setLoader, () => {
            setAllSelect(false);
            getNewApplicationData(
              profileData?.accountId,
              selectedBusinessUnit?.value,
              setNewApplicationData,
              setLoader
            );
          });
        }
        setBillSubmitBtn(true);
      },
      noAlertFunc: () => {
        history.push("/personal/approval/commonapproval");
      },
    };
    IConfirmModal(confirmObject);
  };

  useEffect(() => {
    getNewApplicationData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setNewApplicationData,
      setLoader
    );
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (!allSelect) {
      const newRowData = rowDto?.map((item) => {
        return {
          ...item,
          isSelect: false,
        };
      });
      setRowDto(newRowData);
    } else {
      const newRowData = rowDto?.map((item) => {
        return {
          ...item,
          isSelect: true,
        };
      });
      setRowDto(newRowData);
    }
  }, [allSelect]);

  const singleCheckBoxHandler = (value, index) => {
    let newRowDto = [...rowDto];
    newRowDto[index].isSelect = value;
    setRowDto(newRowDto);

    const bllSubmitBtn = newRowDto?.some((itm) => itm.isSelect === true);

    if (bllSubmitBtn) {
      setBillSubmitBtn(false);
    } else {
      setBillSubmitBtn(true);
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        resetForm({});
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        errors,
        touched,
        setFieldValue,
        setValues,
        isValid,
      }) => (
        <Card>
          {true && <ModalProgressBar />}
          <CardHeader title="Item Warehouse Cost Bridge">
            <CardHeaderToolbar>
              <button
                type="button"
                className="btn btn-primary mr-1"
                onClick={() => approveSubmitlHandler(values)}
                disabled={billSubmitBtn}
              >
                Approve
              </button>
            </CardHeaderToolbar>
          </CardHeader>
          <CardBody>
            <>
              {loader && <Loading />}

              {/* Table Start */}
              <div className="table-responsive mt-4">
                <table className="table table-striped table-bordered bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th style={{ width: "20px" }}>
                        <input
                          type="checkbox"
                          id="parent"
                          onChange={(event) => {
                            setAllSelect(event.target.checked);
                            setBillSubmitBtn((data) => !data);
                          }}
                        />
                      </th>

                      <th className="text-center">SL</th>
                      <th>Category Name</th>
                      <th>Item Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.length > 0 &&
                      rowDto?.map((data, index) => (
                        <tr className="" key={index}>
                          <td className="text-center">
                            <input
                              id="isSelect"
                              type="checkbox"
                              value={data?.isSelect}
                              checked={data?.isSelect}
                              onChange={(e) => {
                                singleCheckBoxHandler(e.target.checked, index);
                              }}
                            />
                          </td>
                          <td className="text-center">{index + 1}</td>
                          <td>{data?.itemCategoryName}</td>
                          <td>{data?.itemName}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          </CardBody>
        </Card>
      )}
    </Formik>
  );
};

export default WarehouseCostBridgeLanding;
