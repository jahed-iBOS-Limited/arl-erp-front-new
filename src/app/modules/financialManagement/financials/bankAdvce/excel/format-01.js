// import { merge } from "lodash"
import { dateFormatWithMonthName } from "../../../../_helper/_dateFormate";
import { _todayDate } from "../../../../_helper/_todayDate";
import {createFile} from "../../../../_helper/excel/index"




class Cell {
    constructor(label,align,format){
        this.text= label;
        this.alignment=`${align}:middle`;
        this.format=format
    }
    getCell () {
        return {
            text:this.text,
            fontSize:7,
            border:"all 000000 thin",
            alignment:this.alignment || "",
            textFormat:this.format
        }
    }
}
// slNo:"Sl No",
// strAccountNo:"Account No",
// strBankAccountName:"Account Name",
// numAmount:"Amount",
// strInstrumentNo:"Instrument No",
// strBankBranchName:"Branch",
const getTableData = (row) => {
    const data =row?.map((item, index) => {
      return [
          new Cell(index+1,"left","text").getCell(),
          new Cell(item?.strAccountNo,"left","text").getCell(),
          new Cell(item?.strBankAccountName,"left","text").getCell(),
          new Cell(item?.numAmount,"right","money").getCell(),
          new Cell(item?.strInstrumentNo,"left","text").getCell(),
          new Cell(item?.strBankBranchName,"left","text").getCell(),
      ];
    });
    return data
  };
  

export const formatOne = (values,row,selectedBusinessUnit,total,
    totalInWords, adviceBlobData, fileName) =>{
    const excel = {
        name:"Bank Advice",
        sheets:[
            {
                name:"Payment Advice IBBL Report",
                gridLine: false,
                rows:[
                    // [
                    //     {
                    //         text:  selectedBusinessUnit?.label,
                    //         fontSize:16,
                    //         underline:true,
                    //         bold:true,
                    //         cellRange:"A1:F1",
                    //         merge:true,
                    //         alignment:"center:middle"
                    //     }
                    // ],
                    // [
                    //     {
                    //         text:"Akij House, 198 Bir Uttam, Gulshan Link Road, Tejgaon, Dhaka-1208.",
                    //         fontSize:12,
                    //         underline:true,
                    //         bold:true,
                    //         cellRange:"A1:F1",
                    //         merge:true,
                    //         alignment:"center:middle"
                    //     }
                    // ],
                    // [
                    //     "_blank*2"
                    // ],
                    // [
                    //     {
                    //         text:  "To",
                    //         fontSize:10,
                    //         bold:true,
                    //         cellRange:"A1:D1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     },
                    //     {
                    //         text:dateFormatWithMonthName(_todayDate()),
                    //         fontSize:10,
                    //         bold:true,
                    //         cellRange:"E1:F1",
                    //         merge:true,
                    //     },
                    // ],
                    // [
                    //     {
                    //         text:  "The Manager",
                    //         fontSize:10,
                    //         bold:true,
                    //         cellRange:"A1:F1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     },
                    // ],
                    // [
                    //     {
                    //         text: values?.bankAccountNo?.bankName,
                    //         fontSize:10,
                    //         cellRange:"A1:F1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     },
                    // ],
                    // [
                    //     {
                    //         text:values?.bankAccountNo?.address,
                    //         fontSize:10,
                    //         cellRange:"A1:F1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     },
                    // ],
                    // [
                    //     {
                    //         text:"Subject : Payment Instruction."												,
                    //         fontSize:10,
                    //         bold:true,
                    //         underline:true,
                    //         cellRange:"A1:F1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     },
                    // ],
                    // [
                    //     {
                    //         text:"Dear Sir,"												,
                    //         fontSize:9,
                    //         bold:true,
                    //         cellRange:"A1:F1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     },
                    // ],
                    // [
                    //     {
                    //         text:`We do hereby requesting you to make payment by transferring the amount to the respective Account Holder as shown below in detailed `,
                    //         fontSize:9,
                    //         bold:true,
                    //         cellRange:"A1:F1",
                    //         merge:true,
                    //         alignment:"left:middle",
                    //         wrapText:true
                    //     },
                    // ],
                    // [
                    //     {
                    //         text:`by debiting our CD Account No. ${values?.bankAccountNo?.bankAccNo}`,
                    //         fontSize:9,
                    //         bold:true,
                    //         cellRange:"A1:F1",
                    //         merge:true,
                    //         alignment:"left:middle",
                    //         wrapText:true
                    //     },
                    // ],
                    // [
                    //     {
                    //         text:"Detailed particulars of each Account Holder:",
                    //         fontSize:9,
                    //         bold:true,
                    //         cellRange:"A1:F1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     },
                    // ],
                    [
                        {
                            text:'SL No.',
                            fontSize:9,
                            bold:true,
                            border:"all 000000 thin",
                            alignment:"center:middle"
                            
                        },
                        {
                            text:'Bank Account No',
                            fontSize:9,
                            bold:true,
                            border:"all 000000 thin",
                            alignment:"center:middle"
                        },
                        {
                            text:'Account Name',
                            fontSize:9,
                            bold:true,
                            border:"all 000000 thin",
                            alignment:"center:middle"
                        },
                        {
                            text:'Net Amount',
                            fontSize:9,
                            bold:true,
                            border:"all 000000 thin",
                            alignment:"center:middle"
                        },
                        {
                            text:'Instrument No',
                            fontSize:9,
                            bold:true,
                            border:"all 000000 thin",
                            alignment:"center:middle"
                        },
                        {
                            text:'Branch',
                            fontSize:9,
                            bold:true,
                            border:"all 000000 thin",
                            alignment:"center:middle"
                        },
                    ],
                    ...getTableData(row),
                    // [
                    //     {
                    //         text:"",
                    //         fontSize:7,
                    //         border:"all 000000 thin"
                    //     },
                    //     {
                    //         text:"Total",
                    //         fontSize:9,
                    //         bold:true,
                    //         border:"all 000000 thin",
                    //         alignment:"left:middle"
                    //     },
                    //     {
                    //         text:"",
                    //         fontSize:7,
                    //         border:"all 000000 thin"
                    //     },
                    //     {
                    //         text:total,
                    //         fontSize:7,
                    //         border:"all 000000 thin",
                    //         bold:true,
                    //         alignment:"right:middle",
                    //         textFormat:"money"
                    //     },
                    //     {
                    //         text:"",
                    //         fontSize:7,
                    //         border:"all 000000 thin"
                    //     },
                    //     {
                    //         text:"",
                    //         fontSize:7,
                    //         border:"all 000000 thin"
                    //     },
                    // ],
                    // [
                    //     "_blank*1"
                    // ],
                    // [
                    //     {
                    //         text:  `In Word : ${totalInWords} Taka Only.`,
                    //         fontSize:10,
                    //         bold:true,
                    //         cellRange:"A1:F1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     }
                    // ],
                    // [
                    //     "_blank*1"
                    // ],
                    // [
                    //     {
                    //         text:  `For : ${selectedBusinessUnit?.label}`,
                    //         fontSize:11,
                    //         bold:true,
                    //         cellRange:"A1:F1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     }
                    // ],
                    // [
                    //     "_blank*2"
                    // ],
                    // [
                    //     {
                    //         text:  `Authorize Signature`,
                    //         fontSize:10,
                    //         bold:true,
                    //         cellRange:"A1:C1",
                    //         merge:true,              alignment:"left:middle"
                    //     },
                    //     {
                    //         text:  `Authorize Signature`,
                    //         fontSize:10,
                    //         bold:true,
                    //         cellRange:"D1:F1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     },
                    // ],
                ]
            }
        ]
    }

    createFile(excel, adviceBlobData, fileName)



}