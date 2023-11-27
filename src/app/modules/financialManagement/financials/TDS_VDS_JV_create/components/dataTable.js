import React, { useEffect, useState } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import NewSelect from "../../../../_helper/_select";

const fakeData = [
  {
    paymentRequestId: 100188,
    paymentRequestCode: null,
    paymentRequestDate: "2023-08-14T00:00:00",
    accountId: 0,
    businessUnitId: 4,
    refType: 6,
    refId: 113902,
    refCode: "SI-ACCL-AUG23-130",
    bankAccountNo: null,
    bankName: null,
    partnerId: 13225,
    partnerName: "M/S Nogorbari Traders",
    reqestAmount: 499500,
    tdsamount: 24975,
    vdsamount: 0,
    instrumentTypeName: "EFT",
  },
  {
    paymentRequestId: 100189,
    paymentRequestCode: null,
    paymentRequestDate: "2023-08-15T00:00:00",
    accountId: 1,
    businessUnitId: 3,
    refType: 5,
    refId: 113903,
    refCode: "SI-ACCL-AUG23-131",
    bankAccountNo: null,
    bankName: null,
    partnerId: 13226,
    partnerName: "ABC Corporation",
    reqestAmount: 750000,
    tdsamount: 37500,
    vdsamount: 1000,
    instrumentTypeName: "Cheque",
  },
  {
    paymentRequestId: 100190,
    paymentRequestCode: null,
    paymentRequestDate: "2023-08-16T00:00:00",
    accountId: 2,
    businessUnitId: 5,
    refType: 4,
    refId: 113904,
    refCode: "SI-ACCL-AUG23-132",
    bankAccountNo: null,
    bankName: null,
    partnerId: 13227,
    partnerName: "XYZ Enterprises",
    reqestAmount: 300000,
    tdsamount: 15000,
    vdsamount: 500,
    instrumentTypeName: "Wire Transfer",
  },
  {
    paymentRequestId: 100191,
    paymentRequestCode: null,
    paymentRequestDate: "2023-08-17T00:00:00",
    accountId: 3,
    businessUnitId: 2,
    refType: 3,
    refId: 113905,
    refCode: "SI-ACCL-AUG23-133",
    bankAccountNo: null,
    bankName: null,
    partnerId: 13228,
    partnerName: "Global Trading Co.",
    reqestAmount: 1200000,
    tdsamount: 60000,
    vdsamount: 2000,
    instrumentTypeName: "Credit Card",
  },
  {
    paymentRequestId: 100192,
    paymentRequestCode: null,
    paymentRequestDate: "2023-08-18T00:00:00",
    accountId: 4,
    businessUnitId: 1,
    refType: 2,
    refId: 113906,
    refCode: "SI-ACCL-AUG23-134",
    bankAccountNo: null,
    bankName: null,
    partnerId: 13229,
    partnerName: "Tech Innovations Ltd.",
    reqestAmount: 200000,
    tdsamount: 10000,
    vdsamount: 100,
    instrumentTypeName: "ACH Transfer",
  },
];

export default function TdsVdsJvDataTable({
  values,
  allSelect = true,
  setAllSelect,
  setFieldValue,
  errors,
  touched
}) {
  const [data, setData] = useState([]);

  const handleSelectTableRow = (tableData , index) =>{
    const modifiedData= [...tableData];
    if(tableData[index]?.isSelect){
      modifiedData[index].isSelect = ![...tableData][index]?.isSelect
    }else {
      modifiedData[index].isSelect = true;
    }
    setData(modifiedData);
  }

  //set onloaded data to the local state
  useEffect(()=>{setData(fakeData)}, []);



  return (
    <div className="loan-scrollable-table employee-overall-status">
      <div style={{ maxHeight: "450px" }} className="scroll-table _table">
        <table className="global-table table table-font-size-sm">
          <thead>
            <tr>
              <th style={{ minWidth: "40px" }}>SL</th>

              <th style={{ minWidth: "40px", textAlign: "center" }}>
                <span className="d-flex flex-column justify-content-center align-items-center text-center">
                  <label>Select</label>
                  <input
                    style={{ width: "15px", height: "15px" }}
                    name="isSelect"
                    checked={allSelect}
                    className="form-control ml-2"
                    type="checkbox"
                    onChange={(e) => setAllSelect(!allSelect)}
                  />
                </span>
              </th>
              <th style={{ minWidth: "75px" }}>Request Id</th>
              <th style={{ minWidth: "75px" }}>Request Date</th>
              <th style={{ minWidth: "100px" }}>Ref. Id</th>
              <th style={{ minWidth: "120px" }}>Ref. Code</th>
              <th style={{ minWidth: "120px" }}>Bank Name</th>
              <th style={{ minWidth: "120px" }}>Partner Name</th>
              <th style={{ minWidth: "130px" }}>Request Amount</th>
              <th style={{ minWidth: "70px" }}>TDS Amount</th>
              <th style={{ minWidth: "70px" }}>VDS Amount</th>
              <th style={{ minWidth: "70px" }}>Total Amount</th>
              <th style={{ minWidth: "170px"}}>DDL1</th>
              <th style={{ minWidth: "170px" }}>DDL2</th>
              <th style={{ minWidth: "170px" }}>DDL3</th>
              <th style={{ minWidth: "70px" }}>Action</th>
            </tr>
          </thead>
          <tbody style={{ overflow: "scroll" }}>
            {data.length>0 && data?.map((item, index, tableData) => {
              return (
                <tr key={item.paymentRequestId}>
                  <td
                    className="text-center"
                    style={{ fontSize: 11, width: "15px" }}
                  >
                    {index + 1}
                  </td>
                  <td
                    style={{ width: "40px", fontSize: 11 }}
                    className="text-center pl-2"
                  >
                    <span className="d-flex flex-column justify-content-center align-items-center text-center">
                      <input
                        style={{ width: "15px", height: "15px" }}
                        name="isSelect"
                        checked={item?.isSelect ?? false}
                        className="form-control ml-2"
                        type="checkbox"
                        onChange={(e) => handleSelectTableRow(tableData, index)}
                      />
                    </span>
                  </td>
                  <td className='text-center' style={{ fontSize: 11 }}>
                    {item?.paymentRequestId}
                  </td>
                  <td className='text-center' style={{ fontSize: 11 }}>
                    {_dateFormatter(item?.paymentRequestDate)}
                  </td>
                  <td className='text-center' style={{ fontSize: 11 }}>
                    {item?.refId}
                  </td>
                  <td className='text-center' style={{ fontSize: 11 }}>
                    {item?.refCode}
                  </td>
                  <td className='text-center' style={{ fontSize: 11 }}>
                    {item?.bankName}
                  </td>
                  <td className='text-center' style={{ fontSize: 11 }}>
                    {item?.partnerName}
                  </td>
                  <td className='text-center' style={{ fontSize: 11 }}>
                    {item?.reqestAmount}
                  </td>
                  <td className='text-center' style={{ fontSize: 11 }}>
                    {item?.tdsamount}
                  </td>
                  <td className='text-center' style={{ fontSize: 11 }}>
                    {item?.vdsamount}
                  </td>
                  <td className='text-center' style={{ fontSize: 11 }}>
                    {"Amount"}
                  </td>
                  <td className='text-center' style={{ fontSize: 11 }}>
                  <NewSelect
                      name="DDL1"
                      options={[{label:"demo", value: 1}]}
                        value={values?.DDL1}
                      // label="DDL1"
                      onChange={(valueOption) => {
                        setFieldValue("DDL1", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </td>
                  <td className='text-center' style={{ fontSize: 11 }}>
                    <NewSelect
                      name="DDL2"
                      options={[{label:"demo", value: 1}]}
                        value={values?.DDL2}
                      // label="DDL2"
                      onChange={(valueOption) => {
                        setFieldValue("DDL2", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </td>
                  <td className='text-center' style={{ fontSize: 11 }}>
                  <NewSelect
                      name="DDL3"
                      options={[{label:"All", value: 1}, {label:"Some", value: 2}]}
                        value={values?.DDL3}
                      // label="DDL3"
                      onChange={(valueOption) => {
                        setFieldValue("DDL3", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </td>
                  <td className='text-center' style={{ fontSize: 11 }}>
                    <div>
                      <IView />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
