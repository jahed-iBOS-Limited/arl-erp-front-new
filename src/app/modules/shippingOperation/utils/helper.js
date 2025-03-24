export const generateFileUrl = (fileId) => {
  return fileId
    ? `https://erp.ibos.io/domain/Document/DownlloadFile?id=${fileId}`
    : "";
};

export function getEmailInfoandSendMail(name) {
  let emailInfoUrl = "";
  let sendEmailUrl = "";

  switch (name) {
    case "VESSEL NOMINATION":
      emailInfoUrl = "/automation/vessel_nomitaion_mail_format";
      sendEmailUrl = "/automation/vessel_nomitaion_mail_sent";
      break;
    case "EDPA LOADPORT":
      emailInfoUrl = "/automation/epda_load_mail_format";
      sendEmailUrl = "/automation/epda_load_mail_sent";
      break;
    case "PRE STOWAGE":
      emailInfoUrl = "/automation/pre_stowage_mail_format";
      sendEmailUrl = "/automation/pre_stowage_mail_sent";
      break;
    case "ON HIRE BUNKER SURVEY":
      emailInfoUrl = "/automation/RFQ_On_Hire_BunkerSurvey_mail_format";
      sendEmailUrl = "/automation/RFQ_On_Hire_BunkerSurvey_mail_sent";
      break;
    case "VOYAGE INSTRUCTION":
      emailInfoUrl = "/automation/voyage_instruction_mail_format";
      sendEmailUrl = "/automation/voyage_instruction_mail_sent";
      break;
    case "PI SURVEY":
      emailInfoUrl = "/automation/P_n_I_surveyor_mail_format";
      sendEmailUrl = "/automation/P_n_I_surveyor_mail_sent";
      break;
    case "VOYAGE LICENSE/FLAG WAIVER":
      emailInfoUrl = "/automation/voyage_license_flag_waiver_mail_format";
      sendEmailUrl = "/automation/voyage_license_flag_waiver_mail_sent";
      break;
    case "TCL":
      emailInfoUrl = "/automation/tcl_mail_format";
      sendEmailUrl = "/automation/tcl_mail_sent";
      break;
    case "WEATHER ROUTING COMPANY":
      emailInfoUrl = "/automation/weather_routing_mail_format_multi";
      sendEmailUrl = "/automation/weather_routing_mail_sent_multi";
      break;
    case "DEPARTURE DOCUMENT LOADPORT":
      emailInfoUrl = "/automation/departure_documents_load_port_mail_format";
      sendEmailUrl = "/automation/departure_documents_load_port_mail_sent";
      break;
    case "DEPARTURE DOCUMENT DISCHARGE PORT":
      emailInfoUrl =
        "/automation/departure_documents_discharge_port_mail_format";
      sendEmailUrl = "/automation/departure_documents_discharge_port_mail_sent";
      break;
    case "EPDA DISCHARGE PORT":
      emailInfoUrl = "/automation/epda_discharge_mail_format";
      sendEmailUrl = "/automation/epda_discharge_mail_sent";
      break;
    case "OFFHIRE BUNKER SURVEY":
      emailInfoUrl = "/automation/RFQ_Off_Hire_BunkerSurvey_mail_format";
      sendEmailUrl = "/automation/RFQ_Off_Hire_BunkerSurvey_mail_sent";
      break;
    default:
      emailInfoUrl = "/automation/";
      sendEmailUrl = "/automation/";
      break;
  }

  return { emailInfoUrl: emailInfoUrl, sendEmailUrl: sendEmailUrl };
}

// export default function formatEmailsDynamically(emailArray) {
//   let formattedParts = emailArray.map(item => item.join(','));

//   let result = formattedParts.join(' | ');

//   return result;
// }

export default function formatEmailsDynamically(emailArray) {
  // Check if the emailArray is empty, return empty string if true
  if (emailArray.length === 0) {
    return "";
  }

  // Process the emailArray
  const formattedParts = emailArray.map((item, index) => {
    // Replace empty arrays with "No Emails"
    const formattedItem = item.length > 0 ? item.join(", ") : "No Emails";

    // Add | before each formatted item except the first one
    return index > 0 ? `| ${formattedItem}` : formattedItem;
  });

  // Join all formatted parts with a space
  const result = formattedParts.join(" ");

  return result;
}


 export const emailTemplateStyles = {
    container: {
      width: '100%',
      margin: 'auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      marginBottom: '20px',
    },
    field: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
    },
    label: {
      width: '70px',
      fontSize: '14px',
      color: '#333',
    },
    input: {
      flexGrow: 1,
      padding: '10px',
      fontSize: '14px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      outline: 'none',
      transition: 'border-color 0.2s ease',
    },
    error: {
      color: 'red',
      fontSize: '12px',
      marginLeft: '70px',
      marginBottom: '10px',
    },
    bodyError: {
      color: 'red',
      fontSize: '12px',
    },
    quillContainer: {
      marginBottom: '60px',
    },
    quill: {
      height: '300px',
      borderRadius: '5px',
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '20px',
    },
    button: {
      backgroundColor: '#007bff',
      color: '#fff',
      padding: '10px 20px',
      fontSize: '14px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
  };
