import React from "react";
import { Label } from "egov-ui-framework/ui-atoms";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { withStyles } from "@material-ui/core/styles";
import get from "lodash/get";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import Divider from "@material-ui/core/Divider";
import Icon from "@material-ui/core/Icon";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const styles = theme => ({
  root: {
    marginBottom: 8
  },
  container: {
    paddingBottom: 10
  }
});

const closebuttonStyle = {
  width: "25px",
  height: "25px",
  color: "#767676"
};

const closeIcon = "close";

const getMultiItem = (billingslabData, classes, style) => {
  let labelCategory = "";
  return billingslabData.map((item, index) => {
    if (item.type === "trade") labelCategory = "TRADETYPE";
    else if ((item.type = "accessories")) labelCategory = "ACCESSORIESCATEGORY";
    return (
      <Grid sm={12} className={classes.container} container={true}>
        <Grid sm={10}>
          <LabelContainer
            labelKey={`TRADELICENSE_${labelCategory}_${item.category
              .toUpperCase()
              .replace(/[.:-\s\/]/g, "_")}`}
            style={{
              color: "rgba(0, 0, 0, 0.6000000238418579)",
              fontSize: "14px",
              fontWeigt: 400,
              lineSpacing: "17px"
            }}
          />
        </Grid>
        <Grid sm={2}>
          <Label
            label={
              labelCategory === "TRADETYPE"
                ? `Rs ${item.rate}`
                : `Rs ${item.total}`
            }
            style={{
              color: "rgba(0, 0, 0, 0.8700000047683716)",
              fontSize: "14px",
              fontWeigt: 400,
              lineSpacing: "17px"
            }}
          />
        </Grid>
      </Grid>
    );
  });
};

class ViewBreakupContainer extends React.Component {
  state = {
    style: {
      color: "rgba(0, 0, 0, 0.8700000047683716)",
      fontSize: "20px",
      fontWeigt: 500,
      lineSpacing: "28px",
      marginTop: 25
    }
  };

  getGridItem = (total, classes, style) => {
    return (
      <Grid sm={12} className={classes.container} container={true}>
        <Grid sm={10}>
          <LabelContainer
            labelName={"Total"}
            labelKey={"PT_FORM4_TOTAL"}
            style={
              style
                ? style
                : {
                    color: "rgba(0, 0, 0, 0.8700000047683716)",
                    fontSize: "14px",
                    fontWeigt: 400,
                    lineSpacing: "17px"
                  }
            }
          />
        </Grid>
        <Grid sm={2}>
          <LabelContainer
            labelName={`Rs ${total}`}
            style={
              style
                ? style
                : {
                    color: "rgba(0, 0, 0, 0.8700000047683716)",
                    fontSize: "14px",
                    fontWeigt: 400,
                    lineSpacing: "17px"
                  }
            }
          />
        </Grid>
      </Grid>
    );
  };
  getRebatePenalty = (label,total, classes, style) => {
    return (
      <Grid sm={12} className={classes.container} container={true}>
        <Grid sm={10}>
          <LabelContainer
            labelName={label}
            labelKey={label}
            style={{
              color: "rgba(0, 0, 0, 0.8700000047683716)",
              fontSize: "14px",
              fontWeigt: 400,
              lineSpacing: "17px"
            }}
          />
        </Grid>
        <Grid sm={2}>
          <LabelContainer
            labelName={`Rs ${total}`}
            style={{
              color: "rgba(0, 0, 0, 0.8700000047683716)",
              fontSize: "14px",
              fontWeigt: 400,
              lineSpacing: "17px"
            }}
          />
        </Grid>
      </Grid>
    );
  };

  handleClose = () => {
    const { screenKey } = this.props;
    this.props.handleField(
      screenKey,
      `components.breakUpDialog`,
      "props.open",
      false
    );
  };

  render() {
    const {
      open,
      tradeUnitData,
      accessoriesUnitData,
      tradeTotal,
      accessoriesTotal,
      classes,
      estimateCardData
    } = this.props;
    const RebateArray=estimateCardData&&estimateCardData.length>1  && estimateCardData.filter(item => item.name.labelKey === "TL_RENEWAL_REBATE");
    const PenaltyArray=estimateCardData && estimateCardData.length>1 &&estimateCardData.filter(item => item.name.labelKey === "TL_RENEWAL_PENALTY");
    const RebateTotal=RebateArray&& get(RebateArray[0],"value",0);
    const PenaltyTotal=PenaltyArray&& get(PenaltyArray[0],"value",0);
    const { style } = this.state;
    const { getGridItem, handleClose } = this;
    const totalBill = tradeTotal + accessoriesTotal+RebateTotal+PenaltyTotal;
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        children={[
          accessoriesTotal > 0 || tradeTotal > 0 ? (
            <div style={{ padding: "16px" }}>
              <div
                onClick={handleClose}
                style={{ float: "right", cursor: "pointer" }}
              >
                <Icon style={closebuttonStyle}>
                  {" "}
                  <i class="material-icons">{closeIcon} </i>
                </Icon>
              </div>
              <div style={{ paddingBottom: "16px", paddingTop: "8px" }}>
                <LabelContainer
                  labelName="Calculation Breakup"
                  labelKey="TL_CALCULATION_BREAKUP"
                  style={{
                    color: "rgba(0, 0, 0, 0.8700000047683716)",
                    fontSize: "20px",
                    fontWeigt: 500,
                    lineSpacing: "28px"
                  }}
                />
              </div>
              {tradeUnitData && tradeUnitData.length > 0 && (
                <div style={{ paddingBottom: "12px" }}>
                  <LabelContainer
                    labelName={"Trade Unit"}
                    labelKey={"TL_NEW_TRADE_DETAILS_TRADE_UNIT_HEADER"}
                    style={{
                      color: "rgba(0, 0, 0, 0.8700000047683716)",
                      fontSize: "16px",
                      fontWeigt: 400,
                      lineSpacing: "19px"
                    }}
                  />
                </div>
              )}
              {tradeUnitData &&
                tradeUnitData.length > 0 &&
                getMultiItem(tradeUnitData, classes)}
              <Divider className={classes.root} />
              {tradeUnitData &&
                tradeUnitData.length > 0 &&
                getGridItem(tradeTotal, classes)}
              {accessoriesUnitData && accessoriesUnitData.length > 0 && (
                <div style={{ paddingBottom: "12px", marginTop: 20 }}>
                  <LabelContainer
                    labelName="Accessory Unit"
                    labelKey="TL_ACCESSORY_UNIT"
                    style={{
                      color: "rgba(0, 0, 0, 0.8700000047683716)",
                      fontSize: "16px",
                      fontWeigt: 400,
                      lineSpacing: "19px"
                    }}
                  />
                </div>
              )}
              {accessoriesUnitData &&
                accessoriesUnitData.length > 0 &&
                getMultiItem(accessoriesUnitData, classes)}
              <Divider className={classes.root} />
              {accessoriesUnitData &&
                accessoriesUnitData.length > 0 &&
                getGridItem(accessoriesTotal, classes)}
             {RebateArray&&RebateArray.length>0 && (
              this.getRebatePenalty("TL_RENEWAL_REBATE",RebateTotal,classes,style)
              )}
              {PenaltyArray&&PenaltyArray.length >0 && (
              this.getRebatePenalty("TL_RENEWAL_PENALTY",PenaltyTotal,classes,style)
              )}
              {getGridItem(totalBill, classes, style)}
            </div>
          ) : (
            <div style={{ padding: "16px", width: "500px" }}>
              <div style={{ paddingBottom: "16px" }}>
                <LabelContainer
                  labelName="Calculation Breakup"
                  labelKey="TL_CALCULATION_BREAKUP"
                  style={{
                    color: "rgba(0, 0, 0, 0.8700000047683716)",
                    fontSize: "20px",
                    fontWeigt: 500,
                    lineSpacing: "28px"
                  }}
                />
              </div>
              {RebateArray&&RebateArray.length>0 && (
              this.getRebatePenalty("TL_RENEWAL_REBATE",RebateTotal,classes,style)
              )}
              {PenaltyArray&&PenaltyArray.length >0 && (
              this.getRebatePenalty("TL_RENEWAL_PENALTY",PenaltyTotal,classes,style)
              )}
              {getGridItem(totalBill, classes, style)}
            </div>
          )
        ]}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const { screenKey } = ownProps;
  const { screenConfig, preparedFinalObject } = screenConfiguration;
  const accessoriesUnitData = get(
    preparedFinalObject,
    "LicensesTemp[0].billingSlabData.accessoriesUnitData"
  );
  const tradeUnitData = get(
    preparedFinalObject,
    "LicensesTemp[0].billingSlabData.tradeUnitData"
  );
  const tradeTotal = get(
    preparedFinalObject,
    "LicensesTemp[0].billingSlabData.tradeTotal"
  );
  const accessoriesTotal = get(
    preparedFinalObject,
    "LicensesTemp[0].billingSlabData.accessoriesTotal"
  );
  const estimateCardData = get(
    preparedFinalObject,
    "LicensesTemp[0].estimateCardData"
  ); 
  const open = get(
    screenConfig,
    `${screenKey}.components.breakUpDialog.props.open`
  );

  return {
    open,
    tradeUnitData,
    accessoriesUnitData,
    tradeTotal,
    accessoriesTotal,
    screenKey,
    screenConfig,
    estimateCardData 
  };
};

const mapDispatchToProps = dispatch => {
  return { handleField: (a, b, c, d) => dispatch(handleField(a, b, c, d)) };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ViewBreakupContainer)
);
