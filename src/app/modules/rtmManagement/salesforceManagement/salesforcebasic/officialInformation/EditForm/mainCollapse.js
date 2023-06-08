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
import ICustomCard from "./../../../../../_helper/_customCard";
import BasicEmployeeInformation from "./collpaseComponent/basicEmployeeInformation/addEditForm";
import PersonalInformation from "../../personalInformation/EditForm/collpaseComponent/personalInformation/addEditForm";
import SalesforceTerrioryInfo from "./collpaseComponent/salesforceTerritoryInfo/addEditForm";

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

export default function SalesOfficialInfoCollapsePanel() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const history = useHistory();
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    // toast.dismiss(1)
  };
  const { state } = useLocation();

  useEffect(() => {
    if (state?.checkbox === "employeeInformation") {
      setExpanded("panel0");
    } else if (state?.checkbox === "administrativeInformation") {
      setExpanded("panel1");
    } else if (state?.checkbox === "employeeRemuneration") {
      setExpanded("panel12");
    } else if (state?.checkbox === "banklInformation") {
      setExpanded("panel10");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const backHandler = () => {
    history.goBack();
  };
  return (
    <div className={classes.root}>
      <ICustomCard title={`Sales Force Information`} backHandler={backHandler}>
        {/* Basic Sales Force Information tab */}
        <ExpansionPanel
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel0"}
          onChange={handleChange("panel0")}
          defaultExpanded={true}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel0bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.heading}>
              Basic Sales Force Information
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <BasicEmployeeInformation />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        {/* Personal Information tab */}
        <ExpansionPanel
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
          defaultExpanded={true}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.heading}>
              Personal Information
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <PersonalInformation />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        {/* Salesforce territory info tab */}
        <ExpansionPanel
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
          defaultExpanded={true}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography className={classes.heading}>
              Salesforce territory Info
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <SalesforceTerrioryInfo />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </ICustomCard>
    </div>
  );
}
