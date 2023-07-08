import React, { Component } from "react";
import {
  Button,
  Grid,
  InputLabel,
  FormControl,
  Input,
  Card,
  CardHeader,
  Tooltip,
  CardContent,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { searchByPage as searchCertificate } from "app/views/Certificate/CertificateService";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import moment from "moment/moment";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { addCertificateByShipOwner, addFile, getFile, getCertificateByShipOwner, removeCertificateByShipOwner, searchByPage } from "../SailorService";
import { toast } from "react-toastify";
import ValidatePicker from "../../Component/ValidateSelect/ValidatePicker";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmationDialog } from "egret";


function CertificateShipOwner(props) {
  const { dataSailor } = props
  let { t } = useTranslation();
  const [certificateList, setCertificateList] = useState([])
  const [idDelete, setIdDelete] = useState('')
  const [loading, setLoading] = useState(false)
  const [viewOnly, setViewOnly] = useState(dataSailor.viewOnly)
  const [shouldOpenDeleteDialog, setShouldOpenDeleteDialog] = useState(false)
  const [certificateShipOwner, setCertificateShipOwner] = useState({
    filesList: [],
    selectedFile: null,
    item: {},
    itemList: [],
    page: 0,
    upLoadedFile: '',
    uploadUrl: '',
  })

  useEffect(() => {
    if (dataSailor?.id) {
      getDataList(dataSailor.id);
    } else {
      handleAdd();
    }
    getCertificateList();
  }, [])

  const getDataList = (id) => {
    getCertificateByShipOwner(id)
      .then(({ data }) => {
        if (data?.data.length === 0) {
          handleAdd()
        } else {
          setCertificateShipOwner({ ...certificateShipOwner, itemList: data.data })
        }
      })
      .catch(err => toast.error(err))
  }

  const handleAdd = () => {
    let item = {
      certificate: "",
      expirationDate: null,
      uploadUrl: "",
      fileDescription: {},
      upLoadedFile: '',
      note: "",
      id: ""
    };
    certificateShipOwner.itemList.push(item);
    setCertificateShipOwner({ ...certificateShipOwner, itemList: certificateShipOwner.itemList });
  };

  const handleDelete = (idDelete) => {
    setIdDelete(idDelete)
    setShouldOpenDeleteDialog(true)
  };

  const getCertificateList = () => {
    let searchObject = {};
    searchObject.keyword = "";
    searchObject.pageIndex = certificateShipOwner.page + 1;
    searchObject.pageSize = 999;
    searchCertificate(searchObject).then(({ data }) => {
      setCertificateList([...data.content])
    });
  };

  const handleChange = (event, index, source) => {
    let item = certificateShipOwner.itemList[index];
    if (source) {
      item[source] = event
    }
    item[event?.target?.name] = event?.target?.value;
    setCertificateShipOwner({ ...certificateShipOwner, itemList: certificateShipOwner.itemList });
  };

  const handleChangeAutoComplete = (value, index, source) => {
    let item = certificateShipOwner.itemList[index];
    item[source] = value;
    setCertificateShipOwner({ ...certificateShipOwner, itemList: certificateShipOwner.itemList });
  };


  const handleImageUpload = (upLoadedFile, index) => {
    let formData = new FormData();
    formData.append("file", upLoadedFile);
    addFile(formData)
      .then(({ data }) => {
        certificateShipOwner.itemList[index].fileDescription = data
        setCertificateShipOwner({
          ...certificateShipOwner,
          itemList: certificateShipOwner.itemList
        })
      }).catch(err => toast.error(err))
  };

  const handleConfirmDelete = () => {
    if (certificateShipOwner.itemList[idDelete]?.id) {
      removeCertificateByShipOwner(certificateShipOwner.itemList[idDelete].id)
        .then(({ data }) => {
          toast.success(t("general.deleteSuccess"))
          certificateShipOwner.itemList.splice(idDelete, 1)
          setShouldOpenDeleteDialog(false)
          getDataList(dataSailor.id)
        })
        .catch((err) => {
          toast.error(err)
        })
    } else {
      certificateShipOwner.itemList.splice(idDelete, 1)
      setShouldOpenDeleteDialog(false)
    }
  };

  const handleSubmit = () => {
    setLoading(true)
    if (dataSailor?.id)
      addCertificateByShipOwner(certificateShipOwner.itemList, dataSailor.id)
        .then(({ data }) => {
          if (data.code === 200) {
            toast.success(t("general.addSuccess"))
            getDataList(dataSailor.id)
          } else {
            toast.warning(data.message)
          }
          setLoading(false)
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
      {certificateShipOwner.itemList?.map((item, index) => {
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
                title={"Chứng chỉ " + (index + 1) + ":"}
                action={viewOnly ? null : (
                  <Grid container xs={12} justifyContent="flex-end">
                    <Tooltip title="Xóa chứng chỉ" placement="top">
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
                    </Tooltip>
                  </Grid>
                )}
              />
              <CardContent>
                <Grid xs={12} container spacing={1} className="mb-8 ">
                  <Grid item xs={4}>
                    <Autocomplete
                      fullWidth
                      onChange={
                        (e, newOption) => handleChangeAutoComplete(newOption, index, "certificate")
                      }
                      getOptionLabel={(option) => option.name}
                      readOnly={viewOnly}
                      value={item?.certificate}
                      options={certificateList}
                      renderInput={(params) =>
                        viewOnly ?
                          <TextValidator
                            {...params}
                            label={
                              <span>
                                {t("Sailor.certificate")}
                                <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            value={item?.certificate}
                            InputProps={{ readOnly: viewOnly }}
                          />
                          :
                          <TextValidator
                            {...params}
                            label={
                              <span>
                                {t("Sailor.certificate")}
                                <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            value={item?.certificate}
                            validators={["required"]}
                            errorMessages={[t("general.required")]}
                          />
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <ValidatePicker
                      className="m-0"
                      fullWidth
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="expirationDate"
                      name="expirationDate"
                      label={
                        <span>
                          {t("Ngày hết hạn")}
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      readOnly={viewOnly}
                      value={item?.expirationDate || null}
                      onChange={(e) => handleChange(e, index, "expirationDate")}
                      KeyboardButtonProps={{ "aria-label": "change date", }}
                      inputProps={{ readOnly: viewOnly }}
                      minDateMessage={t("validateMessage.minDate") + "hiện tại"}
                      minDate={new Date()}
                      invalidDateMessage={t('validateMessage.invalidDate')}
                      validators={["required"]}
                      errorMessages={[t("general.required")]}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth={true}>
                      <InputLabel>
                        Upload chứng chỉ
                      </InputLabel>
                      <Input
                        type="text"
                        name="selectedFile"
                        margin="normal"
                        inputProps={{ readOnly: viewOnly }}
                        value={item.fileDescription?.name || ""}
                        endAdornment={
                          <>
                            {
                              viewOnly ? null :
                                <IconButton size="small" color="primary"
                                  aria-label="upload picture" component="label">
                                  <input
                                    hidden
                                    accept="all/*"
                                    type="file"
                                    onChange={(e) => {
                                      handleImageUpload(
                                        e.target.files[0],
                                        index
                                      );
                                    }}
                                  />
                                  <CloudUploadIcon inputProps={{ readOnly: viewOnly }} />
                                </IconButton>
                            }
                          </>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextValidator
                      fullWidth
                      label="Ghi chú"
                      type="text"
                      name="note"
                      value={item?.note}
                      onChange={(e) => { handleChange(e, index); }}
                      inputProps={{ readOnly: viewOnly }}
                      multiline
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
            color="secondary"
            disabled={loading}
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

export default CertificateShipOwner;