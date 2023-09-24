import React, { useEffect } from "react";
import { Form, Formik } from "formik";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import RemoteAttendanceMap from "./map";
import { convertKeysSpace } from "../../allReport/utility";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
// Validation schema
export default function _Form({ mapData, setMapData, datalist, loading }) {
  const [sheetTypeList, setSheetTypeList] = React.useState([]); // sheet type list
  const [allSheetData, setAllSheetData] = React.useState("");
  const handleRefresh = () => {
    window.location.reload();
  };
  const formikRef = React.useRef(null);

  useEffect(() => {
    try {
      // sheet type ddl list set
      sheetTypeListSetFunc(datalist);
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datalist]);

  const sheetTypeListSetFunc = (datalist) => {
    const _sheetTypeList = [];
    if (datalist?.length > 0) {
      datalist.forEach((element) => {
        if (element?.id === "SheetTypeName") {
          if (element?.data?.length > 0) {
            element.data.forEach((item, idx) => {
              const newObj = convertKeysSpace(item);
              if (newObj?.ddltypename) {
                _sheetTypeList.push({
                  value: idx,
                  label: newObj?.ddltypename || "",
                });
              }
            });
          }
        }
      });
    }
    setSheetTypeList(_sheetTypeList);
    if (formikRef.current) {
      formikRef.current.setFieldValue("sheetType", _sheetTypeList?.[0] || "");
    }
    const result = sheetDataListCatagoryWise(
      datalist,
      _sheetTypeList?.[0]?.label
    );
    setAllSheetData(result);
  };

  const sheetDataListCatagoryWise = (datalist, sheetTypeName) => {
    const catagoryWiseMatch =
      datalist?.find((item) => {
        // itemKey space remove
        const itemKey = item?.id || "";
        const stringWithoutSpaces = itemKey.replace(/\s/g, "");
        const newKey = stringWithoutSpaces.toLowerCase();

        // sheetTypeName space remove
        const _sheetTypeName = sheetTypeName || "";
        const stringWithoutSpaces2 = _sheetTypeName.replace(/\s/g, "");
        const newKey2 = stringWithoutSpaces2.toLowerCase();
        return newKey === newKey2;
      })?.data || [];

    const _list = [];
    // for in loop
    for (const item of catagoryWiseMatch) {
      const newObj = convertKeysSpace(item);
      const latitude = parseFloat(newObj?.gpscoordinate?.split(",")?.[0]);
      const longitude = parseFloat(newObj?.gpscoordinate?.split(",")?.[1]);
      _list.push({
        ...newObj,
        latitude: latitude && longitude ? latitude : 0,
        longitude: latitude && longitude ? longitude : 0,
      });
    }
    return _list;
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          sheetType: "",
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
        innerRef={formikRef}
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
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"ARL Maps"}>
                <CardHeaderToolbar>
                  <button
                    onClick={handleRefresh}
                    className='btn btn-primary ml-2'
                    type='button'
                  >
                    Location Refresh
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody className=''>
                {loading && <Loading />}
                <Form className='form form-label-left'>
                  <div className='row global-form'>
                    <div className='col-lg-3'>
                      <NewSelect
                        name='sheetType'
                        options={sheetTypeList || []}
                        value={values?.sheetType}
                        onChange={(valueOption) => {
                          setAllSheetData([]);
                          setFieldValue("sheetType", valueOption);
                          const result = sheetDataListCatagoryWise(
                            datalist,
                            valueOption?.label
                          );
                          setAllSheetData(result);
                        }}
                        errors={errors}
                        touched={touched}
                        label='Sheet Type'
                        placeholder='Sheet Type'
                      />
                    </div>
                  </div>
                </Form>

                <RemoteAttendanceMap
                  setMapData={setMapData}
                  mapData={mapData}
                  datalist={datalist}
                  allSheetData={allSheetData}
                />
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
