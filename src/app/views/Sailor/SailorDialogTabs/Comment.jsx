import React, { Component } from "react";
import {
  Button,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CloseIcon from "@material-ui/icons/Close";
import { addComment, getCommentByIdSailor, removeComment, searchByPage } from "../SailorService";
import { toast } from "react-toastify"
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmationDialog } from "egret";
import ValidatePicker from "../../Component/ValidateSelect/ValidatePicker";
import ValidatedDatePicker from "../../Component/ValidateSelect/ValidatePicker";
import moment from "moment/moment";

function Comment(props) {
  const { id, dataSailor } = props
  let { t } = useTranslation();
  const [idDelete, setIdDelete] = useState('')
  const [loading, setLoading] = useState(false)
  const [shouldOpenDeleteDialog, setShouldOpenDeleteDialog] = useState(false)
  const [viewOnly, setViewOnly] = useState(false)
  const [comment, setComment] = useState({
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
    getCommentByIdSailor(id)
      .then(({ data }) => {
        if (data.data.length === 0) {
          handleAdd()
        } else {
          setComment({ ...comment, itemList: data.data })
        }
      })
      .catch(err => toast.error(err))
  }

  const handleAdd = () => {
    let item = {
      commentDay: null,
      reasonForComment: "",
      startDate: null,
      endDate: null,
      gpa: null,
      commentOfPersonInChange: "",
      managerComment: "",
    };
    comment.itemList.push(item);
    setComment({ ...comment, itemList: comment.itemList });
  };

  const handleDelete = (idDelete) => {
    setIdDelete(idDelete)
    setShouldOpenDeleteDialog(true)
  };

  const handleChange = (event, index, source) => {
    let item = comment.itemList[index];
    if (source) {
      item[source] = event
    }
    item[event?.target?.name] = event?.target?.value;
    setComment({ ...comment, itemList: comment.itemList });
  };

  const handleConfirmDelete = () => {
    if (comment.itemList[idDelete]?.id) {
      removeComment(comment.itemList[idDelete].id)
        .then(({ data }) => {
          toast.success(t("general.deleteSuccess"))
          comment.itemList.splice(idDelete, 1)
          setShouldOpenDeleteDialog(false)
          getDataList(dataSailor.id)
        })
        .catch((err) => {
          toast.error(err)
        })
    } else {
      comment.itemList.splice(idDelete, 1)
      setShouldOpenDeleteDialog(false)
    }
  };

  const handleSubmit = () => {
    setLoading(true)
    comment.itemList.forEach(item => item.gpa = parseFloat(item.gpa))
    setComment({ ...comment, itemList: comment.itemList });
    addComment(comment.itemList, dataSailor.id)
      .then(({ data }) => {
        setLoading(false)
        if (data?.code === 200) {
          toast.success(t("general.addSuccess"))
          getDataList(dataSailor.id)
        } else {
          toast.warning(data.message)
        }
      })
      .catch(err => { 
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
      {comment.itemList?.map((item, index) => {
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
                title={"Nhận xét " + (index + 1) + ":"}
                action={viewOnly ? null :
                  <Grid
                    container
                    xs={12}
                    justifyContent="flex-end">
                    <Tooltip title="Xóa nhận xét" placement="top">
                      <IconButton
                        size="small"
                        className="mr-8">
                        <CloseIcon
                          variant="contained"
                          color="error"
                          fontSize="small"
                          onClick={() =>
                            handleDelete(index)
                          }
                        />
                      </IconButton>
                    </Tooltip >
                  </Grid>
                }
              />
              <CardContent>
                <Grid
                  xs={12}
                  ms={12}
                  container
                  justifyContent="space-between"
                  spacing={2}
                  className="mb-8">
                  <Grid item xs={4}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <ValidatePicker
                        className="m-0"
                        fullWidth
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="commentDay"
                        label="Ngày nhận xét"
                        value={item?.commentDay || null}
                        defaultValue={""}
                        onChange={(e) => handleChange(e, index, "commentDay")}
                        readOnly={viewOnly}
                        inputProps={{ readOnly: viewOnly }}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        minDateMessage={
                          item?.startDate 
                          ? t("validateMessage.minDate") + "bắt đầu" 
                          : t("validateMessage.minDate") + "01/01/1900"
                        }
                        minDate={item?.startDate ? new Date(item?.startDate) : new Date('01/01/1900')}
                        maxDate={item?.endDate ? new Date(item?.endDate) : new Date()}
                        maxDateMessage={
                          item?.endDate
                          ? t("validateMessage.maxDate") + "kết thúc"
                          : t("validateMessage.maxDate") + "hiện tại"
                        }
                        invalidDateMessage={t('validateMessage.invalidDate')}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={8}>
                    <TextValidator
                      fullWidth
                      label={
                        <span>
                          Lý do nhận xét
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      type="text"
                      name="reasonForComment"
                      value={item?.reasonForComment}
                      onChange={(e) => handleChange(e, index)}
                      validators={["required"]}
                      errorMessages={[t("general.required")]}
                      inputProps={{ readOnly: viewOnly }}
                    />
                  </Grid>
                </Grid>
                <Grid
                  xs={12}
                  ms={12}
                  container
                  justifyContent="space-between"
                  spacing={2}
                  className="mb-8">
                  <Grid item xs={4}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <ValidatedDatePicker
                        className="m-0"
                        fullWidth
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="startDate"
                        label="Kỳ nhận xét từ ngày"
                        value={item?.startDate || null}
                        onChange={(e) => handleChange(e, index, "startDate")}
                        readOnly={viewOnly}
                        inputProps={{ readOnly: viewOnly }}
                        KeyboardButtonProps={{ "aria-label": "change date", }}
                        maxDate={new Date()}
                        minDateMessage={t('validateMessage.minDate') + "01/01/1900"}
                        minDate={new Date('01/01/1900')}
                        maxDateMessage={t('validateMessage.maxDate') + "hiện tại"}
                        invalidDateMessage={t("validateMessage.invalidDate")}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={4}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <ValidatedDatePicker
                        className="m-0"
                        fullWidth
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="endDate"
                        label="Đến ngày"
                        value={item?.endDate || null}
                        onChange={(e) => handleChange(e, index, "endDate")}
                        readOnly={viewOnly}
                        inputProps={{ readOnly: viewOnly }}
                        KeyboardButtonProps={{ "aria-label": "change date", }}
                        minDate={item?.startDate ? new Date(item?.startDate) : ''}
                        minDateMessage={t("validateMessage.minDate") + "bắt đầu"}
                        invalidDateMessage={t("validateMessage.invalidDate")}
                        validators={["required"]}
                        errorMessages={[t("general.required")]}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={4}>
                    <TextValidator
                      fullWidth
                      label={
                        <span>
                          Điểm trung bình
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      type="number"
                      name="gpa"
                      value={item?.gpa}
                      onChange={(e) => handleChange(e, index)}
                      validators={["required"]}
                      errorMessages={[t("general.required")]}
                      inputProps={{ readOnly: viewOnly }}
                    />
                  </Grid>
                </Grid>
                <Grid
                  xs={12}
                  ms={12}
                  container
                  justifyContent="space-between"
                  spacing={2}>
                  <Grid item xs={12}>
                    <TextValidator
                      fullWidth
                      label={
                        <span>
                          Nhận xét của phụ trách
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      type="text"
                      name="commentOfPersonInChange"
                      value={item?.commentOfPersonInChange}
                      onChange={(e) => handleChange(e, index)}
                      multiline
                      className="dotted"
                      inputProps={{ readOnly: viewOnly }}
                      InputProps={{
                        disableUnderline: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextValidator
                      fullWidth
                      label={
                        <span>
                          Nhận xét của quản lý
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      type="text"
                      name="managerComment"
                      value={item?.managerComment}
                      onChange={(e) => handleChange(e, index)}
                      multiline
                      className="dotted"
                      inputProps={{ readOnly: viewOnly }}
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
        )
      })}

      {!viewOnly &&
        <Grid container sm={12} justifyContent="center" className="mt-10 pr-16">
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
        </Grid>}
    </ValidatorForm>
  </div>;
}

export default Comment;
