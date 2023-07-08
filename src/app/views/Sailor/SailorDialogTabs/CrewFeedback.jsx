import React, { Component } from "react";
import {
  Button,
  Grid,
  Card,
  CardHeader,
  Tooltip,
  IconButton,
  CardContent,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import CloseIcon from "@material-ui/icons/Close";
import { searchByPage, addCrewFeedback, removeCrewFeedback, getCrewFeedbackByIdSailor } from "../SailorService";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment/moment";
import { ConfirmationDialog } from "egret";
import ValidatePicker from "../../Component/ValidateSelect/ValidatePicker";
import ValidatedDatePicker from "app/views/Component/ValidateSelect/ValidatePicker";


function CrewFeedback(props) {
  const { dataSailor } = props
  let { t } = useTranslation();
  const [idDelete, setIdDelete] = useState('')
  const [loading, setLoading] = useState(false)
  const [shouldOpenDeleteDialog, setShouldOpenDeleteDialog] = useState(false)
  const [viewOnly, setViewOnly] = useState(false)
  const [crewFeedback, setCrewFeedback] = useState({
    itemList: [],
    page: 0,
  })

  useEffect(() => {
    if (dataSailor?.id) {
      getDataList(dataSailor.id);
    } else {
      handleAdd();
    }
    setViewOnly(dataSailor?.viewOnly)
  }, [])

  const getDataList = (id) => {
    getCrewFeedbackByIdSailor(id)
      .then(({ data }) => {
        if (data?.data.length === 0) {
          handleAdd()
        } else {
          setCrewFeedback({ ...crewFeedback, itemList: data?.data })
        }
      })
      .catch(err => toast.error(err))
  }

  const handleAdd = () => {
    let item = {
      name: "",
      feedbackDate: null,
      contentFeedback: "",
    };
    crewFeedback.itemList.push(item);
    setCrewFeedback({ ...crewFeedback, itemList: crewFeedback.itemList });
  };

  const handleDelete = (idDelete) => {
    setIdDelete(idDelete)
    setShouldOpenDeleteDialog(true)
  };

  const handleChange = (event, index, source) => {
    let item = crewFeedback.itemList[index];
    if (source === "feedbackDate") {
      item.feedbackDate = event;
    }
    item[event?.target?.name] = event?.target?.value;
    setCrewFeedback({ ...crewFeedback, itemList: crewFeedback.itemList });
  };

  const handleConfirmDelete = () => {
    if (crewFeedback.itemList[idDelete]?.id) {
      removeCrewFeedback(crewFeedback.itemList[idDelete].id)
        .then(({ data }) => {
          toast.success(t("general.deleteSuccess"))
          crewFeedback.itemList.splice(idDelete, 1)
          setShouldOpenDeleteDialog(false)
          getDataList(dataSailor.id)
        })
        .catch((err) => {
          toast.error(err)
        })
    } else {
      crewFeedback.itemList.splice(idDelete, 1)
      setShouldOpenDeleteDialog(false)
    }};

  const handleSubmit = () => {
    setLoading(true)
    addCrewFeedback(crewFeedback.itemList, dataSailor.id).then(({ data }) => {
      if (data.code === 200) {
        toast.success(t("general.addSuccess"))
        getDataList(dataSailor.id)
      } else {
        toast.warning(data.message)
      }
      setLoading(false)
    }).catch(err => {
      toast.error(err.response.data.message)
      setLoading(false)
    })
  };

  return <div>
    {shouldOpenDeleteDialog && (
      <ConfirmationDialog
        title={t("confirm")}
        open={shouldOpenDeleteDialog}
        onConfirmDialogClose={() => setShouldOpenDeleteDialog(false)}
        onYesClick={handleConfirmDelete}
        text={t("Sailor.deleteConfirm")}
        cancel={"Hủy"}
        agree={"Đồng ý"}
      />
    )}
    <ValidatorForm onSubmit={() => handleSubmit()}>
      {crewFeedback.itemList?.map((item, index) => {
        return (
          <div id={index} key={index} className={index !== 0 ? "mt-10" : ""}>
            <Card elevation={5}>
              <CardHeader
                className="pb-0"
                titleTypographyProps={{
                  variant: "subtitle1",
                  className: "text-info",
                  style: { fontWeight: 500 }
                }}
                title={"Phản hồi " + (index + 1) + ":"}
                action={
                  viewOnly ? null : (
                    <Grid container xs={12} justifyContent="flex-end">
                      <Tooltip title="Xóa phản hồi" placement="top">
                        <IconButton size="small" className="mr-8">
                          <CloseIcon
                            variant="contained"
                            color="error"
                            fontSize="small"
                            onClick={() => handleDelete(index)}
                          />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  )
                }
              />
              <CardContent>
                <Grid
                  xs={12}
                  ms={12}
                  container
                  justifyContent="space-around"
                  spacing={2}>
                  <Grid item xs={6}>
                    <TextValidator
                      fullWidth
                      label="Người phản hồi"
                      type="text"
                      name="name"
                      inputProps={{ readOnly: viewOnly }}
                      value={item?.name}
                      onChange={(e) => handleChange(e, index)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ValidatedDatePicker
                      className="m-0"
                      fullWidth
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="feedbackDate"
                      label={
                        <span>
                          Ngày phản hồi
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      readOnly={viewOnly}
                      InputProps={{ readOnly: viewOnly }}
                      name="feedbackDate"
                      value={item?.feedbackDate || null}
                      KeyboardButtonProps={{ "aria-label": "change date" }}
                      onChange={(e) => handleChange(e, index, "feedbackDate")}
                      minDateMessage={t("validateMessage.minDate") + "01/01/1900"}
                      minDate={new Date('01/01/1900')}
                      invalidDateMessage={t("validateMessage.invalidDate")}
                      validators={["required"]}
                      errorMessages={[t("general.required")]}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextValidator
                      fullWidth
                      label={
                        <span>
                          Nội dung phản hồi
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      type="text"
                      name="contentFeedback"
                      inputProps={{ readOnly: viewOnly }}
                      value={item?.contentFeedback}
                      onChange={(e) => handleChange(e, index)}
                      validators={["required"]}
                      errorMessages={[t("general.required")]}
                      multiline
                      className="dotted"
                      InputProps={{
                        disableUnderline: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </div>
        );
      })}

      {viewOnly ? null : (
        <Grid
          container
          sm={12}
          justifyContent="center"
          className="mt-10 pr-16">
          <Button
            variant="contained"
            disabled={loading}
            color="secondary"
            className="mb-8 mr-12"
            onClick={() => handleAdd()}>
            {t("general.add")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            type="submit"
            className="mb-8">
            {t("general.save")}
          </Button>
        </Grid>
      )}
    </ValidatorForm>
  </div>;
}

export default CrewFeedback;