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
import PersonalInformation from "./collpaseComponent/personalInformation/addEditForm";
// import FamilyInformation from "./collpaseComponent/familyInformation/addEditForm";
// import PersonalContactInformation from "./collpaseComponent/personalContactInformation/addEditForm";
// import OthersContactInformation from "./collpaseComponent/othersContactInformation/addEditForm";
// import EducationalInformation from "./collpaseComponent/educationalInformation/addEditForm";
// import ProfessionalInformation from "./collpaseComponent/professionalInformation/addEditForm";
// import TrainingInformation from "./collpaseComponent/trainingInformation/addEditForm";
// import NomineeInformation from "./collpaseComponent/nomineeInformation/addEditForm";
import ICustomCard from "./../../../../../_helper/_customCard";

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

export default function SalesPersonalInfoCollapsePanel() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState("false");
  const history = useHistory();
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    // toast.dismiss(1)
  };

  const { state } = useLocation();

  useEffect(() => {
    if (state?.checkbox === "personalInformation") {
      setExpanded("panel2");
    } else if (state?.checkbox === "familyInformation") {
      setExpanded("panel3");
    } else if (state?.checkbox === "otherContactInformation") {
      setExpanded("panel5");
    } else if (state?.checkbox === "educationalInformation") {
      setExpanded("panel6");
    } else if (state?.checkbox === "employeeTrainigInfoStatus") {
      setExpanded("panel8");
    } else if (state?.checkbox === "nomineeInformation") {
      setExpanded("panel9");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const backHandler = () => {
    history.goBack();
  };
  return (
    <div className={classes.root}>
      <ICustomCard
        title={`Personal Information [${state?.employeeFullName ||
          state?.tableData?.employeeFullName}-${state?.employeeCode ||
          state?.tableData?.employeeCode}]`}
        backHandler={backHandler}
      >
        {/* Personal Information */}
        <ExpansionPanel
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
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
        {/* Family Information */}
        {/* <ExpansionPanel
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3bh-content"
            id="panel3bh-header"
          >
            <Typography className={classes.heading}>
              Family Information
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <FamilyInformation />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel> */}
        {/* Personal Contact Information */}
        {/* <ExpansionPanel
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel4"}
          onChange={handleChange("panel4")}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4bh-content"
            id="panel4bh-header"
          >
            <Typography className={classes.heading}>
              Personal Contact Information
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <PersonalContactInformation />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel> */}
        {/* Others Contact Information */}
        {/* <ExpansionPanel
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel5"}
          onChange={handleChange("panel5")}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel5bh-content"
            id="panel5bh-header"
          >
            <Typography className={classes.heading}>
              Others Contact Information
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <OthersContactInformation />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel> */}
        {/* Educational Information Information */}
        {/* <ExpansionPanel
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel6"}
          onChange={handleChange("panel6")}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel6bh-content"
            id="panel6bh-header"
          >
            <Typography className={classes.heading}>
              Educational Information
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <EducationalInformation />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel> */}
        {/* Professional Information */}
        {/* <ExpansionPanel
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel7"}
          onChange={handleChange("panel7")}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel7bh-content"
            id="panel7bh-header"
          >
            <Typography className={classes.heading}>
              Working Experience
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <ProfessionalInformation />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel> */}
        {/* Training Information */}
        {/* <ExpansionPanel
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel8"}
          onChange={handleChange("panel8")}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel8bh-content"
            id="panel7bh-header"
          >
            <Typography className={classes.heading}>
              Training/Certificate Information
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <TrainingInformation />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel> */}
        {/* Nominee Information */}
        {/* <ExpansionPanel
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel9"}
          onChange={handleChange("panel9")}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel9bh-content"
            id="panel7bh-header"
          >
            <Typography className={classes.heading}>
              Nominee Information
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <NomineeInformation />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel> */}
      </ICustomCard>
    </div>
  );
}
