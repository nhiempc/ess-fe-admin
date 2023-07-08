import React, { Component } from "react";
import {
  Button,
  Grid,
  InputLabel,
  FormControl,
  Input,
  Card,
  CardContent,
  CardHeader,
  Tooltip,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { searchByPage as searchCertificate } from "app/views/Certificate/CertificateService";
import IconButton from "@material-ui/core/IconButton";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { 
  addDocumentCertificate, 
  addFile, 
  addInternalCertificate, 
  getDocumentCertificateByIdSailor, 
  getFile,  
  removeDocumentCertificate 
} from "../SailorService";
import { toast } from "react-toastify";
import moment from "moment";
import CloseIcon from "@material-ui/icons/Close";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ValidatePicker from "../../Component/ValidateSelect/ValidatePicker";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmationDialog } from "egret";
import ConstantList from '../../../appConfig'


function DocumentCertificate(props) {
  const { dataSailor } = props
  let { t } = useTranslation();
  const [page, setPage] = useState(0)
  const [viewOnly, setViewOnly] = useState(dataSailor.viewOnly)

  const [certificate, setCertificate] = useState({
    item: {},
    itemList: [],
  })
  const [certificateList, setCertificateList] = useState([])
  const [loading, setLoading] = useState(false)
  const [idDelete, setIdDelete] = useState('')
  const [shouldOpenDeleteDialog, setShouldOpenDeleteDialog] = useState(false)

  useEffect(() => {
    if (dataSailor?.id) {
      getDataList(dataSailor.id);
    } else {
      handleAdd();
    }

    getCertificateList();
  }, [props])

  const getDataList = (id) => {
    getDocumentCertificateByIdSailor(id)
      .then(({ data }) => {
        if (data?.data.length === 0) {
          handleAdd()
        } else {
          setCertificate({ ...certificate, itemList: data.data })
        }
      })
      .catch(err => toast.error(err))
  }


  const handleAdd = () => {
    let item = {
      expirationDate: null,
      fileDescription: {},
      uploadUrl: "",
      note: "",
      certificate: "",
      selectedFile: null,
      uploadedFile: ""
    };
    certificate.itemList.push(item);
    setCertificate({ ...certificate, itemList: certificate.itemList });
  };

  const handleDelete = (idDelete) => {
    setIdDelete(idDelete)
    setShouldOpenDeleteDialog(true)
  };

  const getCertificateList = () => {
    let searchObject = {};
    searchObject.keyword = "";
    searchObject.pageIndex = page + 1;
    searchObject.pageSize = 999;
    searchCertificate(searchObject).then(({ data }) => {
      setCertificateList([...data?.content])
    });
  };

  const handleChange = (event, index, source) => {
    let item = certificate?.itemList[index];
    if (source) {
      item[source] = event
    } else {
      item[event?.target?.name] = event?.target?.value;
    }
    setCertificate({ ...certificate, itemList: certificate?.itemList })
  };

  const handleChangeSelect = (value, index, source) => {
    let item = certificate?.itemList[index];
    item[source] = value
    setCertificate({
      ...certificate,
      itemList: certificate?.itemList
    });
  };

  const handleImageUpload = (upLoadedFile, index) => {
    let formData = new FormData();
    formData.append("file", upLoadedFile);
    addFile(formData).then(({ data }) => {
      certificate.itemList[index].fileDescription = data
      setCertificate({...certificate, itemList: certificate?.itemList})
    }).catch(err => toast.error(err))
  };

  const handleConfirmDelete = () => {
    if (certificate.itemList[idDelete]?.id) {
      removeDocumentCertificate(certificate.itemList[idDelete].id)
        .then(({ data }) => {
          toast.success(t("general.deleteSuccess"))
          certificate.itemList.splice(idDelete, 1)
          setShouldOpenDeleteDialog(false)
          getDataList(dataSailor.id)
        })
        .catch((err) => {
          toast.error(err)
        })
    } else {
      certificate.itemList.splice(idDelete, 1)
      setShouldOpenDeleteDialog(false)
    }
  };

  const handleSubmit = () => {
    setLoading(true)
    addDocumentCertificate(certificate.itemList, dataSailor.id)
      .then(({ data }) => {
        if (data.code === 200) {
          toast.success(t("general.addSuccess"));
          getDataList(dataSailor?.id);
        } else {
          toast.warning(data.message);
        }
        setLoading(false)
      })
      .catch((err) => {
        toast.error(t("general.error"));
        toast.error(err.response.data.message)
        setLoading(false)
      });
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
    <ValidatorForm onSubmit={handleSubmit}>
      {certificate?.itemList?.map((item, index) => {
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
                title={
                  <div>Chứng chỉ giấy tờ thuyền viên {index + 1} : 
                    <br/>
                    {item?.status === ConstantList.expireCertificate.expired || item?.status === ConstantList.expireCertificate.expireUnder12M
                    ? <span style={{color: 'red', fontSize: '14px', fontWeight: 'normal'}}>*{item?.messageStatus}</span> 
                    : item?.status === ConstantList.expireCertificate.expireOver12M
                    ? <span style={{color: 'green', fontSize: '14px', fontWeight: 'normal'}}>*{item?.messageStatus}</span> 
                    : ''}
                  </div>}
                action={viewOnly ? null :
                  <Grid
                    container
                    xs={12}
                    justifyContent="flex-end">
                    <Tooltip title="Xóa chứng chỉ" placement="top">
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
                    </Tooltip>
                  </Grid>
                }
              />
              <CardContent>
                <Grid xs={12} container spacing={1}>
                  <Grid item xs={4}>
                    <Autocomplete
                      fullWidth
                      onChange={
                        (e, newOption) => handleChangeSelect(newOption, index, "certificate")
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
                      inputProps={{ readOnly: viewOnly }}
                      value={item?.expirationDate || null}
                      onChange={(e) => handleChange(e, index, "expirationDate")}
                      KeyboardButtonProps={{ "aria-label": "change date", }}
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
                        value={item?.fileDescription?.name || ""}
                        inputProps={{ readOnly: viewOnly }}
                        endAdornment={
                          <>
                            <IconButton size="small" color="primary" aria-label="upload picture" component="label">
                              <input
                                hidden
                                accept="all/*"
                                type="file"
                                onChange={(event) => {
                                  handleImageUpload(
                                    event.target.files[0],
                                    index
                                  );
                                }}
                              />
                              <CloudUploadIcon />
                            </IconButton>
                          </>
                        }
                        margin="normal"
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
                      className="dotted"
                      multiline
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

      {viewOnly ? null : <Grid container sm={12} justifyContent="center" className="mt-10 pr-16">
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
          type="submit"
          disabled={loading}
          className="mb-8">
          {t("general.save")}
        </Button>
      </Grid>}
    </ValidatorForm>
  </div>;
}

export default DocumentCertificate;