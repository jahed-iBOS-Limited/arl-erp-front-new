import React from "react";
import InputField from "../../../../_helper/_inputField";

export default function TaxCalculationReport({
  noteData,
  allValueResult,
  commonNumberFormat,
  allGridData,
  netTaxCalculation,
  setNetTaxCalculation,
  monthlyReturn,
}) {
  const {
    result34,
    result35,
    result36,
    result37,
    result40,
    result41,
    result42,
    result43,
    result44,
    result45,
    result46,
    result47,
    result48,
    result49,
    result50,
    result51,
    result52,
    result53,
  } = allValueResult;
  const { objRowList } = monthlyReturn;
  const commonNoteFind = (noteNo) => {
    if (objRowList?.length > 0) {
      return objRowList?.find((data) => +data.noteNo === +noteNo);
    } else {
      return false;
    }
  };
  const getNote_34 = commonNoteFind(34);
  const getNote_35 = commonNoteFind(35);
  const getNote_36 = commonNoteFind(36);
  const getNote_37 = commonNoteFind(37);
  const getNote_38 = commonNoteFind(38);
  const getNote_39 = commonNoteFind(39);
  const getNote_40 = commonNoteFind(40);
  const getNote_41 = commonNoteFind(41);
  const getNote_42 = commonNoteFind(42);
  const getNote_43 = commonNoteFind(43);
  const getNote_44 = commonNoteFind(44);
  const getNote_45 = commonNoteFind(45);
  const getNote_46 = commonNoteFind(46);
  const getNote_47 = commonNoteFind(47);
  const getNote_48 = commonNoteFind(48);
  const getNote_49 = commonNoteFind(49);
  const getNote_50 = commonNoteFind(50);
  const getNote_51 = commonNoteFind(51);
  const getNote_52 = commonNoteFind(52);
  const getNote_53 = commonNoteFind(53);
  const note_34 = {
    noteNo: "note_34",
    value: 0,
    sd: 0,
    vat: getNote_34?.vat || result34,
  };
  const note_35 = {
    noteNo: "note_35",
    value: 0,
    sd: 0,
    vat: getNote_35?.vat || result35,
  };
  const note_36 = {
    noteNo: "note_36",
    value: 0,
    sd: 0,
    vat: getNote_36?.vat || result36,
  };
  const note_37 = {
    noteNo: "note_37",
    value: 0,
    sd: 0,
    vat: getNote_37?.vat || result37,
  };
  const note_38 = {
    noteNo: "note_38",
    value: 0,
    sd: 0,
    vat:
      getNote_38?.vat ||
      (noteData[0]?.noteNo === 38
        ? commonNumberFormat(noteData?.[0]?.amount)
        : ""),
  };
  const note_39 = {
    noteNo: "note_38",
    value: 0,
    sd: 0,
    vat:
      getNote_39?.vat ||
      (noteData[1]?.noteNo === 39
        ? commonNumberFormat(noteData?.[1]?.amount)
        : ""),
  };
  const note_40 = {
    noteNo: "note_40",
    value: 0,
    sd: 0,
    vat: getNote_40?.vat || result40,
  };
  const note_41 = {
    noteNo: "note_41",
    value: 0,
    sd: 0,
    vat: getNote_41?.vat || result41,
  };
  const note_42 = {
    noteNo: "note_42",
    value: 0,
    sd: 0,
    vat: getNote_42?.vat || result42,
  };
  const note_43 = {
    noteNo: "note_43",
    value: 0,
    sd: 0,
    vat: getNote_43?.vat || result43,
  };
  const note_44 = {
    noteNo: "note_44",
    value: 0,
    sd: 0,
    vat: getNote_44?.vat || result44,
  };
  const note_45 = {
    noteNo: "note_45",
    value: 0,
    sd: 0,
    vat: getNote_45?.vat || result45,
  };
  const note_46 = {
    noteNo: "note_46",
    value: 0,
    sd: 0,
    vat: getNote_46?.vat || result46,
  };
  const note_47 = {
    noteNo: "note_47",
    value: 0,
    sd: 0,
    vat: getNote_47?.vat || result47,
  };
  const note_48 = {
    noteNo: "note_48",
    value: 0,
    sd: 0,
    vat: getNote_48?.vat || result48,
  };
  const note_49 = {
    noteNo: "note_49",
    value: 0,
    sd: 0,
    vat: getNote_49?.vat || result49,
  };
  const note_50 = {
    noteNo: "note_50",
    value: 0,
    sd: 0,
    vat: getNote_50?.vat || result50,
  };
  const note_51 = {
    noteNo: "note_51",
    value: 0,
    sd: 0,
    vat: getNote_51?.vat || result51,
  };
  const note_52 = {
    noteNo: "note_52",
    value: 0,
    sd: 0,
    vat: getNote_52?.vat || result52,
  };
  const note_53 = {
    noteNo: "note_53",
    value: 0,
    sd: 0,
    vat: getNote_53?.vat || result53,
  };

  allGridData[33] = note_34;
  allGridData[34] = note_35;
  allGridData[35] = note_36;
  allGridData[36] = note_37;
  allGridData[37] = note_38;
  allGridData[38] = note_39;
  allGridData[39] = note_40;
  allGridData[40] = note_41;
  allGridData[41] = note_42;
  allGridData[42] = note_43;
  allGridData[43] = note_44;
  allGridData[44] = note_45;
  allGridData[45] = note_46;
  allGridData[46] = note_47;
  allGridData[47] = note_48;
  allGridData[48] = note_49;
  allGridData[49] = note_50;
  allGridData[50] = note_51;
  allGridData[51] = note_52;
  allGridData[52] = note_53;

  return (
    <>
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th colSpan="3">Part - 7: NET TAX CALCULATION</th>
          </tr>
          <tr>
            <th style={{ width: "550px" }}>Items</th>
            <th>Note</th>
            <th>Amount (Tax)</th>
          </tr>
        </thead>
        <tbody>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Net Payable VAT for the Tax Period (Section- 45)(9C-23B+28-33)
              </div>
            </td>
            <td>
              <div className="text-right pr-2">34</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_34?.vat)}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Net Payable VAT for the Tax Period after Adjustment with Closing
                Balance and Balance of from 18.6 [34-(52+56)]
              </div>
            </td>
            <td>
              <div className="text-right pr-2">35</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_35?.vat)}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Net Payable Supplementary Duty for the Tax Period (Before
                adjustment with Closing Balance) [9B+38-(39+40)]
              </div>
            </td>
            <td>
              <div className="text-right pr-2">36</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_36?.vat)}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Net Payable Supplementary Duty for the Tax Period after Adjusted
                with Closing Balance and Balance of from 18.6 [36-(53+57)]
              </div>
            </td>
            <td>
              <div className="text-right pr-2">37</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_37?.vat)}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Supplementary Duty Against Issuance of Debit Note
              </div>
            </td>
            <td>
              <div className="text-right pr-2">38</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_38.vat)}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Supplementary Duty Against Issuance of Credit Note
              </div>
            </td>
            <td>
              <div className="text-right pr-2">39</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_39?.vat)}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Supplementary Duty Paid on Inputs Against Exports
              </div>
            </td>
            <td>
              <div className="text-right pr-2">40</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_40?.vat)}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Interest on Overdue VAT (Based on note -35)
              </div>
            </td>
            <td>
              <div className="text-right pr-2">41</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_41?.vat)}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Interest on Overdue SD (Based on note -37)
              </div>
            </td>
            <td>
              <div className="text-right pr-2">42</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_42?.vat)}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Fine/Penalty for Non-submission of Return
              </div>
            </td>
            <td>
              <div className="text-right pr-2">43</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_43?.vat)}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">Other Fine/Penalty/Interest</div>
            </td>
            <td>
              <div className="text-right pr-2">44</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {/* {commonNumberFormat(note_44?.vat)} */}
                {objRowList?.length > 0 ? (
                  commonNumberFormat(note_44?.vat)
                ) : (
                  <InputField
                    style={{ height: "25px" }}
                    value={netTaxCalculation?.note44}
                    name="names"
                    placeholder="Name"
                    type="number"
                    onChange={(e) => {
                      setNetTaxCalculation((prv) => {
                        return { ...prv, note44: e.target.value };
                      });
                    }}
                    className="form-control is-valid inputBorderNone"
                  />
                )}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">Payable Excise Duty</div>
            </td>
            <td>
              <div className="text-right pr-2">45</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_45?.vat)}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">Payable Development Surcharge</div>
            </td>
            <td>
              <div className="text-right pr-2">46</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_46?.vat)}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">Payable ICT Development Surcharge</div>
            </td>
            <td>
              <div className="text-right pr-2">47</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_47?.vat)}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">Payable Health Care Surcharge</div>
            </td>
            <td>
              <div className="text-right pr-2">48</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_48?.vat)}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Payable Environmental Protection Surcharge
              </div>
            </td>
            <td>
              <div className="text-right pr-2">49</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_49?.vat)}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Net Payable VAT for treasury Deposit (35+41+43+44)
              </div>
            </td>
            <td>
              <div className="text-right pr-2">50</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_50?.vat)}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Net Payable SD for treasury Deposit (37+42)
              </div>
            </td>
            <td>
              <div className="text-right pr-2">51</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_51?.vat)}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Closing Balance of Last Tax Period (VAT)
              </div>
            </td>
            <td>
              <div className="text-right pr-2">52</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_52?.vat)}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Closing Balance of Last Tax Period (SD)
              </div>
            </td>
            <td>
              <div className="text-right pr-2">53</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {commonNumberFormat(note_53?.vat)}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
