import React, { Component } from "react";
import {
    Dialog,
    Button,
    Grid,
    InputLabel,
    FormControl,
    MenuItem,
    Select,
    Checkbox,
    TextField,
    FormControlLabel,
    Collapse,
    Paper,
    Card,
    CardContent,
    CardActions,
    CardHeader,
    Typography,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { addRelative, getRelative, searchByPage, removeRelative, getRelativeByIdSailor } from "../SailorService";
import { toast } from "react-toastify";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SelectValidator from "../../Component/ValidateSelect/ValidateSelect";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { ConfirmationDialog } from "../../../../egret";


function Relatives(props) {
    let { t } = useTranslation();
    let { handleClose, dataSailor } = props
    const [idDelete, setIdDelete] = useState('')
    const [viewOnly, setViewOnly] = useState(dataSailor.viewOnly)
    const [loading, setLoading] = useState(false)
    const [shouldOpenDeleteDialog, setShouldOpenDeleteDialog] = useState(false)
    const [relative, setRelative] = useState({
        item: {},
        itemList: [],
    })

    useEffect(() => {
        if (dataSailor?.id) {
            getDataList(dataSailor.id);
        } else {
            handleAdd();
        }
        addRuleValidation();
    }, [])

    let relationShipList = [
        { id: 1, name: "Vợ" },
        { id: 2, name: "Chồng" },
        { id: 3, name: "Con" },
        { id: 4, name: "Bố mẹ" },
        { id: 5, name: "Ông bà" },
        { id: 6, name: "Khác" },
    ]

    const addRuleValidation = () => {
        let isPhone = new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/);
        let isName = new RegExp(/^[a-zA-Z _ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳýỵỷỹ]*$/);
        ValidatorForm.addValidationRule("isName", (value) => {
            return isName.test(value?.trim());
        });
        ValidatorForm.addValidationRule("isPhone", (value) => {
            return isPhone.test(value?.trim());
        });
    }

    const getDataList = (id) => {
        getRelativeByIdSailor(id)
            .then(({ data }) => {
                if (data?.data.length === 0) {
                    handleAdd();
                }
                else {
                    relative.itemList = data?.data
                    setRelative({ ...relative, itemList: relative?.itemList })
                }
            })
            .catch(err => toast.error(err))
    }

    const handleAdd = () => {
        let item = {
            name: '',
            phone: '',
            relationship: '',
            address: '',
            beneficiary: false
        };
        relative.itemList.push(item);
        setRelative({ ...relative, itemList: relative?.itemList })
    };
    const handleConfirmDelete = () => {
        if (relative?.itemList[idDelete]?.id) {
            removeRelative(relative?.itemList[idDelete]?.id)
                .then(({ data }) => {
                    toast.success(t("general.deleteSuccess"))
                    relative.itemList.splice(idDelete, 1)
                    setShouldOpenDeleteDialog(false)
                    getDataList(dataSailor.id)
                })
                .catch((err) => {
                    toast.error(err)
                })
        } else {
            relative.itemList.splice(idDelete, 1)
            setShouldOpenDeleteDialog(false)
        }
    };

    const handleDelete = (idDelete) => {
        setIdDelete(idDelete)
        setShouldOpenDeleteDialog(true)
    }

    const handleChange = (event, index) => {
        let item = relative?.itemList[index];
        item[event.target?.name] = event.target?.value;
        setRelative({ ...relative, itemList: relative?.itemList });
    };

    const handleCheck = (event, index) => {
        let item = relative?.itemList[index];
        item.beneficiary = event.target?.checked;
        setRelative({ ...relative, itemList: relative?.itemList });
    }

    const handleSubmit = () => {
        setLoading(true)
        addRelative(relative?.itemList, dataSailor?.id)
            .then((res) => {
                if (res?.data.code === 200) {
                    toast.success(t("general.addSuccess"));
                    getDataList(dataSailor?.id)
                }
                else toast.warning(res?.data?.message);
                setLoading(false)
            })

            .catch((err) => {
                toast.error(err.response.data.message);
                setLoading(false)

            });
    };
    return <div>
        {shouldOpenDeleteDialog && (
            <ConfirmationDialog
                title={t("confirm")}
                open={shouldOpenDeleteDialog}
                onConfirmDialogClose={() => { setShouldOpenDeleteDialog(false) }}
                onYesClick={handleConfirmDelete}
                text={t("Sailor.deleteConfirm")}
                cancel={"Hủy"}
                agree={"Đồng ý"}
            />
        )}
        <ValidatorForm onSubmit={() => handleSubmit()}>
            {relative?.itemList?.map((item, index) => {
                return (
                    <div id={index} key={index} className={index !== 0 ? 'mt-10' : ''}>
                        <Card elevation={5}>
                            <CardHeader
                                className="pb-0"
                                titleTypographyProps={{
                                    variant: "subtitle1",
                                    className: "text-info",
                                    style: { fontWeight: 500 }
                                }}
                                title={'Người thân ' + (index + 1) + ':'}
                                action={
                                    viewOnly ? null :
                                        <Grid container xs={12} justifyContent="flex-end">
                                            <IconButton size="small" className="mr-8">
                                                <CloseIcon
                                                    variant="contained"
                                                    color="error"
                                                    fontSize="small"
                                                    onClick={() => {
                                                        handleDelete(index)
                                                    }}
                                                />
                                            </IconButton>
                                        </Grid>
                                }
                            />
                            <CardContent>
                                <Grid
                                    xs={12}
                                    container
                                    justifyContent="space-around"
                                    spacing={1}
                                    className="mb-8">
                                    <Grid item sm={3} xs={3}>
                                        <TextValidator
                                            fullWidth
                                            label={
                                                <span>
                                                    {t("Sailor.relativeName")}
                                                    <span style={{ color: "red" }}>
                                                        *
                                                    </span>
                                                </span>
                                            }
                                            multiline
                                            type="text"
                                            name="name"
                                            value={item?.name || ''}
                                            inputProps={{ readOnly: viewOnly }}
                                            onChange={(e) => handleChange(e, index)}
                                            validators={[
                                                "required",
                                                "isName",
                                                "maxStringLength:255"
                                            ]}
                                            errorMessages={[
                                                t("general.required"),
                                                t("general.stringOnly"),
                                                t("general.maxLength255"),
                                            ]}
                                        />
                                    </Grid>
                                    <Grid item sm={3} xs={3}>
                                        <SelectValidator
                                            fullWidth
                                            className="pt-4"
                                            label={
                                                <span>
                                                    {t("Sailor.relationship")}
                                                    <span style={{ color: "red" }}>
                                                        *
                                                    </span>
                                                </span>
                                            }
                                            name="relationship"
                                            id="relationship"
                                            value={relative?.itemList[index]?.relationship}
                                            inputProps={{ readOnly: viewOnly }}
                                            onChange={
                                                (e) =>
                                                    handleChange(e, index)
                                            }
                                            validators={["required",]}
                                            errorMessages={[t("general.required"),]}
                                            renderInput={(params) =>
                                                viewOnly ?
                                                    <TextValidator
                                                        {...params}
                                                        fullWidth
                                                        label={
                                                            <span>
                                                                {t("Sailor.relationship")}
                                                                <span style={{ color: "red" }}>*</span>
                                                            </span>
                                                        }
                                                        InputProps={{ readOnly: viewOnly }}
                                                    />
                                                    :
                                                    <TextValidator
                                                        {...params}
                                                        fullWidth
                                                        value={item?.relationship}
                                                        label={
                                                            <span>
                                                                {t("Sailor.relationship")}
                                                                <span style={{ color: "red" }}>*</span>
                                                            </span>
                                                        }
                                                        inputProps={{ readOnly: viewOnly }}
                                                        validators={["required"]}
                                                        errorMessages={[t("general.required")]}
                                                    />
                                            }
                                        >
                                            {relationShipList?.map(
                                                (item) => {
                                                    return (
                                                        <MenuItem
                                                            key={item?.id}
                                                            value={item?.id}>
                                                            {item?.name}
                                                        </MenuItem>
                                                    );
                                                }
                                            )}
                                        </SelectValidator>
                                       
                                    </Grid>
                                    <Grid item sm={3} xs={3}>
                                        <TextValidator
                                            className="m-0"
                                            fullWidth
                                            label={
                                                <span>
                                                    {t("Sailor.phoneNumber")}
                                                    <span style={{ color: "red" }}>*</span>
                                                </span>
                                            }
                                            type="text"
                                            name="phone"
                                            value={item?.phone || ''}
                                            inputProps={{ readOnly: viewOnly }}
                                            onChange={(e) => handleChange(e, index)}
                                            validators={["required", "isPhone",]}
                                            errorMessages={[t("general.required"), t("general.phoneRegex")]}
                                        />
                                    </Grid>
                                    <Grid item sm={3} xs={3}>
                                        <TextValidator
                                            fullWidth
                                            multiline
                                            label={
                                                <span>
                                                    {t("user.address")}
                                                    <span style={{ color: "red" }}>*</span>
                                                </span>
                                            }
                                            type="text"
                                            name="address"
                                            inputProps={{ readOnly: viewOnly }}
                                            value={item?.address || ''}
                                            onChange={(e) => handleChange(e, index)}
                                            validators={["required", "maxStringLength:255"]}
                                            errorMessages={[t("general.required"), t("general.maxLength255"),]}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid xs={12} sm={12} container>
                                    <Grid item xs={12}>
                                        <FormControl component="fieldset" >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="beneficiary"
                                                        color="primary"
                                                        onChange={(e) => handleCheck(e, index)}
                                                        checked={item?.beneficiary}
                                                        disabled={viewOnly}
                                                    />
                                                }
                                                label="Người thụ hưởng"
                                                labelPlacement="end"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </div>
                );
            })}

            {viewOnly ? null :
                <Grid container sm={12} justifyContent="center" className="mt-10 pr-16">
                    <Button
                        variant="contained"
                        className="mb-8 mr-12"
                        disabled={loading}
                        color="secondary"
                        onClick={handleAdd}>
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
            }
        </ValidatorForm>
    </div>;
}

export default Relatives;
