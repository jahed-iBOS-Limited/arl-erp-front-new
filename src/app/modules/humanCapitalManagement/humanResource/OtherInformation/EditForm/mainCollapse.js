import React, { useEffect } from "react";
import {
  makeStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useHistory, useLocation } from "react-router-dom";
import ICustomCard from "./../../../../_helper/_customCard";
import OtherInformationForm from "./collpaseComponent/OtherInformationForm/addEditForm";
import {
  GetEmployeeProfileSettingById_api,
  GetEmployeeProfileSettingHeader_api,
  GetEmployeeProfileSetting_api,
} from "./../helper";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

export default function OtherInformationCollapsePanel() {
  const classes = useStyles();
  const { state: headerData } = useLocation();
  const [expanded, setExpanded] = React.useState(false);
  const [collapesRow, setCollapesRow] = React.useState([]);
  const [rowFormData, setRowFormData] = React.useState([]);
  const [singleData, setSingleData] = React.useState("");

  const history = useHistory();
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  const handleChange = (panel, itm) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    GetEmployeeProfileSetting_api(itm?.strSectionName, setRowFormData);
    GetEmployeeProfileSettingById_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      headerData?.employeeId,
      itm?.intSectionNameId,
      setSingleData
    );
  };
  const backHandler = () => {
    history.goBack();
  };

  useEffect(() => {
    if (profileData?.userId && selectedBusinessUnit?.value) {
      GetEmployeeProfileSettingHeader_api(
        profileData?.userId,
        selectedBusinessUnit?.value,
        setCollapesRow
      );
    }
  }, [profileData, selectedBusinessUnit]);

  console.log("headerData", headerData);

  return (
    <div className={classes.root}>
      <ICustomCard title="Other Information" backHandler={backHandler}>
        {collapesRow?.map((itm, inx) => (
          <ExpansionPanel
            className="general-ledger-collapse-custom"
            expanded={expanded === inx}
            onChange={handleChange(inx, itm)}
            defaultExpanded={true}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel0bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>
                {itm?.strSectionName}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div>
                <OtherInformationForm
                  sectionCardId={itm?.intSectionNameId}
                  singleData={singleData}
                  title={itm?.strSectionName}
                  rowFormData={rowFormData}
                  setSingleData={setSingleData}
                />
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </ICustomCard>
    </div>
  );
}
