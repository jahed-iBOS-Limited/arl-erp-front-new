
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { GetAllGLExtendPagination } from "../../helper";
import NewSelect from "../../../../../../_helper/_select";
import * as Yup from "yup";

// Validation schema
const validationSchema = Yup.object().shape({
  businessUnitName: Yup.object().shape({
    label: Yup.string().required("BusinessUnit Name is required"),
    value: Yup.string().required("BusinessUnit Name is required"),
  }),
});

export default function FormCmp({
  initData,
  btnRef,
  businessUnitDDL,
  saveHandler,
  resetBtnRef,
  disableHandler,
  profileData,
  selectedBusinessUnit,
  isEdit,
  rowDtoHandler,
  disabled,
  setRowDto,
  remover,
  rowDto,
}) {
  // const [gridData, setGridData] = useState({});

  const [pageSize, setPageSize] = React.useState(1000);

  const [pageNo, setPageNo] = React.useState(0);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit) {
      GetAllGLExtendPagination(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        pageNo,
        pageSize,
        setRowDto,
        setLoading
      );
    }

  }, [profileData, selectedBusinessUnit]);

  // one item select
  const itemSlectedHandler = (value, index) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index].itemCheck = !copyRowDto[index].itemCheck;
    setRowDto(copyRowDto);
  };

  // All item select
  const allGridCheck = (value) => {
    const modifyGridData = rowDto?.map((itm) => ({
      ...itm,
      itemCheck: value,
    }));
    setRowDto(modifyGridData);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          businessUnitName: {
            value: selectedBusinessUnit ? selectedBusinessUnit?.value : "",
            label: selectedBusinessUnit ? selectedBusinessUnit?.label : "",
          },
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
          });
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
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className="form ml-3">
              <div className="row cash_journal d-flex justify-content-between">
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnitName"
                    options={businessUnitDDL}
                    value={values?.businessUnitName}
                    label="Business Unit Name"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnitName", valueOption);
                    }}
                    placeholder="Business Unit Name"
                    errors={errors}
                    touched={touched}
                  />

                </div>
              </div>
              <div className="row cash_journal">
                <div className="col-lg-12 pr-0 pl-0">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered  global-table">
                      <thead>
                        <tr>
                          {/* {type === "notComplated" ? ( */}
                          <th style={{ width: "25px" }}>
                            <input
                              type="checkbox"
                              id="parent"
                              onChange={(event) => {
                                allGridCheck(event.target.checked);
                              }}
                            />
                          </th>
                          {/* ) : null} */}
                          <th>SL</th>
                          <th>Code</th>
                          <th>GL Name</th>
                          <th>Account Category</th>
                          <th>Account Class</th>
                          <th>Account Group</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.length > 0 &&
                          rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <input
                                  id="itemCheck"
                                  type="checkbox"
                                  className=""
                                  value={item.itemCheck}
                                  checked={item.itemCheck}
                                  name={item.itemCheck}
                                  onChange={(e) => {
                                    //setFieldValue("itemCheck", e.target.checked);
                                    itemSlectedHandler(e.target.checked, index);
                                  }}
                                />
                              </td>
                              <td>
                                <div className="text-center">{item?.sl}</div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {item?.strGeneralLedgerCode}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {item?.strGeneralLedgerName}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {item?.accountCategoryName}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {item?.accountClassName}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {item?.accountGroupName}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* Row Dto Table End */}
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
                disabled={!values.businessUnitName}
              ></button>
              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
