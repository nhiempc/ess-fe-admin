import React, { Component } from "react";
import { Button, Grid, Card, CardHeader, CardContent, TextareaAutosize } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { addInterviewFeedback, getInterviewFeedbackByIdSailor, removeInterviewFeedback, searchByPage } from "../SailorService";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmationDialog } from "egret";


function InterviewFeedback(props) {
  const { dataSailor } = props
  let { t } = useTranslation();
  const [idDelete, setIdDelete] = useState('')
  const [viewOnly, setViewOnly] = useState(dataSailor.viewOnly)
  const [loading, setLoading] = useState(false)
  const [shouldOpenDeleteDialog, setShouldOpenDeleteDialog] = useState(false)
  const [interviewFeedback, setInterviewFeedback] = useState({
    item: {},
    itemList: [],
    page: 0,
  })

  useEffect(() => {
    if (dataSailor?.id) {
      getDataList(dataSailor.id);
    } else {
      handleAdd()
    };
  }, [props])

  const getDataList = (id) => {
    getInterviewFeedbackByIdSailor(id)
      .then(({ data }) => {
        if (data?.data.length === 0) {
          handleAdd()
        } else {
          setInterviewFeedback({ ...interviewFeedback, itemList: data?.data })
        }
      })
      .catch(err => toast.error(err))
  }

  const handleAdd = () => {
    let item = {
      overallReview: "",
      comment: "",
    };
    interviewFeedback.itemList.push(item);
    setInterviewFeedback({ ...interviewFeedback, itemList: interviewFeedback.itemList });
  };

  const handleDelete = (idDelete) => {
    setIdDelete(idDelete)
    setShouldOpenDeleteDialog(true)
  };

  const handleChange = (event, index) => {
    let item = interviewFeedback?.itemList[index];
    item[event?.target?.name] = event?.target?.value;
    setInterviewFeedback({ ...interviewFeedback, itemList: interviewFeedback.itemList });
  }

  const handleConfirmDelete = () => {
    if (interviewFeedback?.itemList[idDelete]?.id) {
      removeInterviewFeedback(interviewFeedback.itemList[idDelete].id)
        .then(({ data }) => {
          toast.success(t("general.deleteSuccess"))
          interviewFeedback.itemList.splice(idDelete, 1)
          setShouldOpenDeleteDialog(false)
          getDataList(dataSailor.id)
        })
        .catch((err) => {
          toast.error(err)
        })
    } else {
      interviewFeedback.itemList.splice(idDelete, 1)
      setShouldOpenDeleteDialog(false)
    }
  };

  const handleSubmit = () => {
    setLoading(true)
    if (dataSailor?.id) {
      addInterviewFeedback(interviewFeedback?.itemList, dataSailor?.id)
        .then(({ data }) => {
          if (data.code === 200) {
            toast.success(t("general.addSuccess"))
            getDataList(dataSailor.id)
          }
          else {
            toast.warning(data.message)
          }
          setLoading(false)
        })
        .catch(err => {
          toast.error(err.response.data.message)
          setLoading(false)
        })
    }
  }

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
      {interviewFeedback?.itemList?.map((item, index) => {
        return (
          <div
            id={index}
            key={index}
            className={index !== 0 ? "mt-10" : ""}>
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
                    <Grid
                      container
                      xs={12}
                      justifyContent="flex-end">
                      <IconButton
                        size="small"
                        className="mr-8">
                        <CloseIcon
                          variant="contained"
                          color="error"
                          fontSize="small"
                          onClick={() => handleDelete(index)}
                        />
                      </IconButton>
                    </Grid>
                  )
                }
              />
              <CardContent>
                <Grid xs={12} container spacing={1}>
                  <Grid item xs={12}>
                    <TextValidator
                      fullWidth
                      label={
                        <span>
                          {t("Sailor.overallReview")}
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      type="text"
                      name="overallReview"
                      value={item?.overallReview}
                      onChange={(e) => handleChange(e, index)}
                      className="dotted"
                      multiline
                      InputProps={{
                        disableUnderline: true,
                      }}
                      validators={["required"]}
                      errorMessages={[t("general.required")]}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextValidator
                      fullWidth
                      label={
                        <span>
                          {t("Sailor.comment")}
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      type="text"
                      name="comment"
                      value={item?.comment}
                      onChange={(e) => handleChange(e, index)}
                      className="dotted"
                      multiline
                      InputProps={{
                        disableUnderline: true,
                      }}
                      validators={["required"]}
                      errorMessages={[t("general.required")]}
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
            className="mb-8 mr-12"
            disabled={loading}
            color="secondary"
            onClick={() => handleAdd()}>
            {t("general.add")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            type="submit"
            className=" mb-8">
            {t("general.save")}
          </Button>
        </Grid>
      )}
    </ValidatorForm>
  </div>;
}

export default InterviewFeedback;