import { Button, Card, CardContent, Grid } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { appConst } from "app/AppConst";
import ValidatedDatePicker from "app/views/Component/ValidateSelect/ValidatePicker";
import SelectValidator from "app/views/Component/ValidateSelect/ValidateSelect";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getAllItem as searchSailorStatus } from "../SailorStatus/SailorStatusService";
import { getAllItem as searchTypeOfSailor } from "../TypeOfSailor/TypeOfSailorService";
import { useTranslation } from "react-i18next";
import { addFile, addSailorInformation, editSailorInformation, getFile, getNewEssId, getSailorById } from "../SailorService";
import { searchByPage as searchPositionTitleLevel } from "app/views/PositionTitleLevel/PositionTitleLevelService";
import { deleteSailor, searchByPage } from "../SailorService";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import Select from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import { MenuItem } from "@material-ui/core";
import { searchByPage as searchNation } from "app/views/Nation/NationService";
import moment from "moment";

function PersonalInfor(props) {
    let { dataSailor } = props
    let { t } = useTranslation();
    const [nationList, setNationList] = useState([])
    const [crewTypeList, setCrewTypeList] = useState([])
    const [positionTitleLevelList, setPositionTitleLevelList] = useState([])
    const [statusCrewList, setStatusCrewList] = useState([])
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState(false)
    const [viewOnly, setViewOnly] = useState(false)

    const listVisaOption = [
        { id: 0, name: t("Yes"), status: true },
        { id: 1, name: t("No"), status: false },
    ];
    const listMaritalOption = [
        { id: 1, name: "Đã kết hôn", status: true },
        { id: 2, name: "Chưa kết hôn", status: false },
    ];

    const [personalInfor, setPersonalInfor] = useState({
        id: "",
        essId: "",
        hasVisa: "",
        numberVisa: "",
        maritalOption: null,
        joinOn: null,
        dateOfBirth: null,
        expiryVisa: null,
        positionTitleLevel: null,
        national: null,
        name: "",
        crewType: null,
        crewStatus: null,
        alias: "",
        placeOfBirth: "",
        permanentAddress: "",
        temporaryAddress: "",
        phone: "",
        email: "",
        nearestAirport: "",
        status: true,
        note: "",
        height: null,
        weight: null,
        bmi: null,
        essId: "",
        rowsPerPage: 5,
        titleImageUrl: null
    })
    useEffect(() => {
        getDataAllList()
        setViewOnly(dataSailor?.viewOnly)
        getandSet(dataSailor?.id)

        addValidationRule();

        return () => {
            removeValidationRule();
        }
    }, [])

    const getandSet = (id) => {
        if (id) {
            getSailorById(id)
                .then(({ data }) => {
                    let dataFromAPI = data?.data
                    setPersonalInfor({
                        ...dataFromAPI
                    })
                }).catch(err => toast.error(err))
        }
    }

    const handleChangeHasVisa = (event) => {
        if (event.target.value === false) {
            personalInfor.numberVisa = ""
            personalInfor.expiryVisa = null
        } else {
            personalInfor.numberVisa = personalInfor?.numberVisa || ""
            personalInfor.expiryVisa = personalInfor?.expiryVisa || null
        }

        personalInfor.hasVisa = event.target.value
        setPersonalInfor({
            ...personalInfor,
            hasVisa: personalInfor.hasVisa,
            numberVisa: personalInfor.numberVisa,
            expiryVisa: personalInfor.expiryVisa
        })
    }
    const removeValidationRule = () => {
        ValidatorForm.removeValidationRule("isName");
        ValidatorForm.removeValidationRule("isEmail")
    }

    const addValidationRule = () => {
        let isName = new RegExp(/^[a-zA-Z _ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*$/);
        let isEmail = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)

        ValidatorForm.addValidationRule('isName', (value) => {
            return isName.test(value);
        });
        ValidatorForm.addValidationRule('isEmail', (value) => {
            return isEmail.test(value);
        });
    }

    const getDataAllList = () => {
        let searchObject = {};
        searchObject.keyword = "";
        searchObject.pageIndex = page + 1;
        searchObject.pageSize = 999;
        searchNation(searchObject).then(({ data }) => {
            setNationList([...data.content])
        });
        searchPositionTitleLevel(searchObject).then(({ data }) => {
            setPositionTitleLevelList([...data?.content])
        })
        searchSailorStatus().then((data) => {
            setStatusCrewList([...data?.data])
        })
        searchTypeOfSailor().then((data) => {
            setCrewTypeList([...data?.data])
        })
    }

    const handleChangeSelect = (value, source) => {
        personalInfor[source] = value
        setPersonalInfor({
            ...personalInfor,
            [source]: personalInfor[source]
        });
    };

    const handleChange = (event, source) => {
        if (source) {
            if (source === "dateOfBirth" || source === "expiryVisa" || source === "joinOn") {
                setPersonalInfor({
                    ...personalInfor,
                    [source]: event ? new Date(event) : null
                })
            } else {
                setPersonalInfor({ ...personalInfor, [source]: event.target.value })
            }
        } else {
            setPersonalInfor({ ...personalInfor, [event.target.name]: event.target.value })
        }
    };

    const handleImageUpload = (upLoadedFile) => {
        let formData = new FormData();
        formData.append("file", upLoadedFile);
        personalInfor.upLoadedFile = URL.createObjectURL(upLoadedFile)
        setPersonalInfor({
            ...personalInfor,
            upLoadedFile: personalInfor.upLoadedFile
        })
        addFile(formData).then(({ data }) => {
            setImage(data?.id)
        }).catch(err => toast.error(err))
    };

    const setImage = (name) => {
        getFile(name)
            .then((res) => {
                if (res.status === 200) {
                    personalInfor.titleImageUrl = res?.config.url
                    setPersonalInfor({
                        ...personalInfor,
                        titleImageUrl: personalInfor.titleImageUrl
                    })
                } else toast.warning(t("general.error"))
            })
            .catch(err => toast.error(t("general.error")))
    }


    const handleChangeNumber = (event) => {
        if (/^[0-9.]*$/.test(event?.target?.value)) {
            setPersonalInfor({
                ...personalInfor,
                [event?.target?.name]: Number(event?.target?.value)
            })
        }
    };

    const handleFormSubmit = (e) => {
        setLoading(true)
        if (personalInfor?.id) {
            editSailorInformation(personalInfor, personalInfor.id)
                .then(({ data }) => {
                    if (data.code === 200) {
                        toast.success(t("general.updateSuccess"));
                        getandSet(data?.data.id)
                        dataSailor.handleResetId(data?.data.id)
                    } else {
                        toast.error(data.message);
                    }
                    setLoading(false)
                })
                .catch((err) => {
                    toast.error(t("general.error"));
                    toast.error(err.response.data.message)
                    setLoading(false)
                });
        } else {
            addSailorInformation(personalInfor)
                .then(({ data }) => {
                    if (data.code === 200) {
                        toast.success(t("general.addSuccess"));
                        getandSet(data?.data.id);
                        dataSailor.handleResetId(data?.data.id);
                    }
                    else {
                        toast.error(data.message);
                    }
                    setLoading(false)
                })
                .catch((err) => {
                    toast.error(err.response.data.message);
                    setLoading(false)
                });
        }
    }
    return (
        <div >
            <ValidatorForm onSubmit={() => { handleFormSubmit() }}>
                <Card container elevation={0}>
                    <CardContent>
                        <Grid container spacing={2} md={12} sm={12} xs={12}>
                            <Grid item container spacing={2} md={9} sm={9} xs={9}>
                                <Grid item md={4} sm={4} xs={4}>
                                    <TextValidator
                                        fullWidth
                                        multiline
                                        label={
                                            <span>
                                                {t("Sailor.fullName")}
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
                                            </span>
                                        }
                                        type="text"
                                        name="name"
                                        value={personalInfor?.name || ""}
                                        inputProps={{ readOnly: viewOnly }}
                                        onChange={handleChange}
                                        validators={[
                                            "required",
                                            "isName",
                                            "maxStringLength:255"
                                        ]}
                                        errorMessages={[
                                            t("general.required"),
                                            t("general.isName"),
                                            t("general.maxLength255"),
                                        ]}
                                    />
                                </Grid>
                                <Grid item md={4} sm={4} xs={4} >
                                    <TextValidator
                                        fullWidth
                                        multiline
                                        label={t("Sailor.alias")}
                                        type="text"
                                        name="alias"
                                        value={personalInfor?.alias || ''}
                                        inputProps={{ readOnly: viewOnly }}
                                        onChange={handleChange}
                                        validators={["maxStringLength:255"]}
                                        errorMessages={[t("general.maxLength255"),]}
                                    />
                                </Grid>
                                <Grid item md={4} sm={4} xs={4}>
                                    <ValidatedDatePicker
                                        className="m-0"
                                        fullWidth
                                        format="dd/MM/yyyy"
                                        margin="normal"
                                        label={
                                            <span>
                                                Ngày sinh
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
                                            </span>
                                        }
                                        name="dateOfBirth"
                                        placeholder="dd/MM/yyyy"
                                        value={personalInfor?.dateOfBirth || null}
                                        onChange={(e) => handleChange(e, "dateOfBirth")}
                                        inputProps={{ readOnly: viewOnly, shrink: true }}
                                        KeyboardButtonProps={{ "aria-label": "change date", }}
                                        minDate={new Date('01/01/1900')}
                                        minDateMessage={t('validateMessage.minDate') + '01/01/1900'}
                                        maxDate={new Date()}
                                        maxDateMessage={ t("validateMessage.maxDate") + 'hiện tại'}
                                        invalidDateMessage={t("validateMessage.invalidDate")}
                                        validators={["required"]} 
                                        errorMessages={[t("general.required")]}
                                    />

                                </Grid>
                                <Grid item md={4} sm={4} xs={4}>
                                    <TextValidator
                                        fullWidth
                                        label={
                                            <span>
                                                Nơi sinh
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
                                            </span>
                                        }
                                        multiline
                                        type="text"
                                        name="placeOfBirth"
                                        value={personalInfor?.placeOfBirth || ""}
                                        inputProps={{ readOnly: viewOnly }}
                                        onChange={handleChange}
                                        validators={["required", "maxStringLength:255"]}
                                        errorMessages={[t("general.required"), t("general.maxLength255"),]}
                                    />
                                </Grid>
                                <Grid item md={4} sm={4} xs={4}>
                                    <TextValidator
                                        fullWidth
                                        label={
                                            <span>
                                                {t("Sailor.permanent")}
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
                                            </span>
                                        }
                                        multiline
                                        type="text"
                                        name="permanentAddress"
                                        value={personalInfor?.permanentAddress || ""}
                                        inputProps={{ readOnly: viewOnly }}
                                        onChange={handleChange}
                                        validators={["required", "maxStringLength:255"]}
                                        errorMessages={[t("general.required"), t("general.maxLength255"),]}
                                    />
                                </Grid>
                                <Grid item md={4} sm={4} xs={4}>
                                    <TextValidator
                                        fullWidth
                                        label={
                                            <span>
                                                {t("Sailor.temporary")}
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
                                            </span>
                                        }
                                        multiline
                                        type="text"
                                        name="temporaryAddress"
                                        value={personalInfor?.temporaryAddress || ""}
                                        inputProps={{ readOnly: viewOnly }}
                                        onChange={handleChange}
                                        validators={["required"]}
                                        errorMessages={[t("general.required"),]}
                                    />
                                </Grid>
                                <Grid item md={4} sm={4} xs={4} style={{ padding: "11px" }}>
                                    <Autocomplete
                                        fullWidth
                                        onChange={
                                            (e, newOption) => handleChangeSelect(newOption, "national")
                                        }
                                        getOptionLabel={(option) => option.name}
                                        readOnly={viewOnly}
                                        value={personalInfor?.national || null}
                                        options={nationList}
                                        renderInput={(params) =>
                                            viewOnly ?
                                                <TextValidator
                                                    {...params}
                                                    label={
                                                        <span>
                                                            {t("Sailor.nationality")}
                                                            <span style={{ color: "red" }}>*</span>
                                                        </span>
                                                    }
                                                    value={personalInfor?.national || null}
                                                    InputProps={{ readOnly: viewOnly }}
                                                />
                                                :
                                                <TextValidator
                                                    {...params}
                                                    label={
                                                        <span>
                                                            {t("Sailor.nationality")}
                                                            <span style={{ color: "red" }}>*</span>
                                                        </span>
                                                    }
                                                    value={personalInfor?.national || null}
                                                    validators={["required"]}
                                                    errorMessages={[t("general.required")]}
                                                />
                                        }
                                    />
                                </Grid>
                                <Grid item md={4} sm={4} xs={4}>
                                    <TextValidator
                                        fullWidth
                                        label={
                                            <span>
                                                {t("Sailor.phoneNumber")}
                                                <span style={{ color: "red" }}>*</span>
                                            </span>
                                        }
                                        type="text"
                                        name="phone"
                                        InputProps={{ readOnly: viewOnly }}
                                        value={personalInfor?.phone || ""}
                                        onChange={handleChange}
                                        validators={["required", "matchRegexp:(84|0[3|5|7|8|9])+([0-9]{8})"]}
                                        errorMessages={[t("general.required"), t("general.phoneRegex"),]}
                                    />
                                </Grid>
                                <Grid item md={4} sm={4} xs={4}>
                                    <TextValidator
                                        fullWidth
                                        label={
                                            <span>
                                                Email
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
                                            </span>
                                        }
                                        type="text"
                                        name="email"
                                        value={personalInfor?.email || ""}
                                        inputProps={{ readOnly: viewOnly }}
                                        onChange={handleChange}
                                        validators={["required", "isEmail"]}
                                        errorMessages={[t("general.required"), t("general.isEmail")]}
                                    />
                                </Grid>
                                <Grid item md={4} sm={4} xs={4} style={{ padding: "11px" }}>
                                    <Autocomplete
                                        fullWidth
                                        onChange={
                                            (e, newOption) => handleChangeSelect(newOption, 'positionTitleLevel')
                                        }
                                        getOptionLabel={(option) => option.name}
                                        readOnly={viewOnly}
                                        options={positionTitleLevelList}
                                        value={personalInfor?.positionTitleLevel || null}
                                        renderInput={(params) =>
                                            viewOnly ?
                                                <TextValidator
                                                    {...params}
                                                    label={
                                                        <span>
                                                            {t("Position.name")}
                                                            <span style={{ color: "red" }}>*</span>
                                                        </span>
                                                    }
                                                    value={personalInfor?.positionTitleLevel || null}
                                                    InputProps={{ readOnly: viewOnly }}
                                                />
                                                :
                                                <TextValidator
                                                    {...params}
                                                    label={
                                                        <span>
                                                            {t("Position.name")}
                                                            <span style={{ color: "red" }}>*</span>
                                                        </span>
                                                    }
                                                    value={personalInfor?.positionTitleLevel || null}
                                                    validators={["required"]}
                                                    errorMessages={[t("general.required")]}
                                                />
                                        }
                                    />
                                </Grid>
                                <Grid item md={4} sm={4} xs={4}>
                                    <ValidatedDatePicker
                                        className="m-0"
                                        fullWidth
                                        format="dd/MM/yyyy"
                                        margin="normal"
                                        label={
                                            <span>
                                                Ngày tham gia
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
                                            </span>
                                        }
                                        name="joinOn"
                                        value={personalInfor?.joinOn || null}
                                        onChange={(e) => handleChange(e, 'joinOn')}
                                        inputProps={{ readOnly: viewOnly, shrink: true }}
                                        KeyboardButtonProps={{ "aria-label": "change date", }}
                                        minDate={new Date('01/01/1900')}
                                        minDateMessage={t('validateMessage.minDate') + '01/01/1900'}
                                        maxDate={new Date()}
                                        maxDateMessage= {t('validateMessage.maxDate') + 'hiện tại'}
                                        invalidDateMessage={t("validateMessage.invalidDate")}
                                        validators={["required"]}
                                        errorMessages={[t("general.required")]}
                                    />
                                </Grid>
                                <Grid item md={4} sm={4} xs={4} style={{ padding: "11px" }}>
                                    <Autocomplete
                                        fullWidth
                                        onChange={
                                            (e, newOption) => handleChangeSelect(newOption, 'crewType')
                                        }
                                        getOptionLabel={(option) => option.name}
                                        readOnly={viewOnly}
                                        value={personalInfor?.crewType || null}
                                        options={crewTypeList}
                                        renderInput={(params) =>
                                            viewOnly ?
                                                <TextValidator
                                                    {...params}
                                                    label={
                                                        <span>
                                                            {t("Dashboard.typeofsailor")}
                                                            <span style={{ color: "red" }}>*</span>
                                                        </span>
                                                    }
                                                    value={personalInfor?.crewType || null}
                                                    InputProps={{ readOnly: viewOnly }}
                                                />
                                                :
                                                <TextValidator
                                                    {...params}
                                                    label={
                                                        <span>
                                                            {t("Dashboard.typeofsailor")}
                                                            <span style={{ color: "red" }}>*</span>
                                                        </span>
                                                    }
                                                    value={personalInfor?.crewType || null}
                                                    validators={["required"]}
                                                    errorMessages={[t("general.required")]}
                                                />
                                        }
                                    />
                                </Grid>
                                <Grid item md={4} sm={4} xs={4} style={{ padding: "11px" }}>
                                    <SelectValidator
                                        fullWidth
                                        className="pt-4"
                                        label={
                                            <span>
                                                {t("Sailor.maritalStatus")}
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
                                            </span>
                                        }
                                        name="maritalOption"
                                        id="maritalOption"
                                        value={personalInfor?.maritalOption || ""}
                                        inputProps={{ readOnly: viewOnly }}
                                        onChange={(e) => handleChange(e)}
                                        validators={["required",]}
                                        errorMessages={[t("general.required"),]}
                                    >
                                        {listMaritalOption?.map(
                                            (item) => {
                                                return (
                                                    <MenuItem
                                                        key={item.id}
                                                        value={item.id}>
                                                        {item.name}
                                                    </MenuItem>
                                                );
                                            }
                                        )}
                                    </SelectValidator>
                                </Grid>
                                <Grid item md={4} sm={4} xs={4}>
                                    <TextValidator
                                        fullWidth
                                        label={
                                            <span>
                                                {t("Sailor.airport")}
                                            </span>
                                        }
                                        type="text"
                                        name="nearestAirport"
                                        readOnly={viewOnly}
                                        value={personalInfor?.nearestAirport}
                                        inputProps={{ readOnly: viewOnly }}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={4} sm={4} xs={4} style={{ padding: "11px" }}>
                                    <Autocomplete
                                        fullWidth
                                        onChange={
                                            (e, newOption) => handleChangeSelect(newOption, 'crewStatus')
                                        }
                                        getOptionLabel={(option) => option.name}
                                        value={personalInfor?.crewStatus || null}
                                        options={statusCrewList}
                                        renderInput={(params) =>
                                            viewOnly ?
                                                <TextValidator
                                                    {...params}
                                                    label={
                                                        <span>
                                                            {t("Sailor.sailorStatus")}
                                                            <span style={{ color: "red" }}>*</span>

                                                        </span>
                                                    }
                                                    InputProps={{ readOnly: viewOnly }}
                                                    value={personalInfor?.crewStatus || null}
                                                />
                                                :
                                                <TextValidator
                                                    {...params}
                                                    label={
                                                        <span>
                                                            {t("Sailor.sailorStatus")}
                                                            <span style={{ color: "red" }}>*</span>
                                                        </span>
                                                    }
                                                    value={personalInfor?.crewStatus || null}
                                                    validators={["required"]}
                                                    errorMessages={[t("general.required")]}
                                                />
                                        }
                                    />
                                </Grid>
                                <Grid item md={4} sm={4} xs={4} style={{ padding: "11px" }}>
                                    <SelectValidator
                                        className="pt-3"
                                        fullWidth
                                        label={
                                            <span>
                                                Visa
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
                                            </span>
                                        }
                                        value={personalInfor?.hasVisa}
                                        inputProps={{ name: "hasVisa", id: "hasVisa", readOnly: viewOnly }}
                                        onChange={(e) => { handleChangeHasVisa(e) }}
                                        validators={["required"]}
                                        errorMessages={[t("general.required")]}
                                    >
                                        {listVisaOption.map((item) => {
                                            return (
                                                <MenuItem
                                                    key={item?.id}
                                                    value={item?.status}>
                                                    {item?.name}
                                                </MenuItem>
                                            );
                                        })}
                                    </SelectValidator>
                                </Grid>
                                <Grid item md={4} sm={4} xs={4}>
                                    <TextValidator
                                        fullWidth
                                        label={
                                            <span>
                                                Số thẻ visa
                                                {personalInfor?.hasVisa &&
                                                    <span style={{ color: "red" }}>
                                                        *
                                                    </span>}
                                            </span>
                                        }
                                        type="text"
                                        name="numberVisa"
                                        inputProps={{ readOnly: viewOnly }}
                                        value={personalInfor?.numberVisa ? personalInfor?.numberVisa : ''}
                                        validators={personalInfor?.hasVisa ? ["required", "matchRegexp:^[0-9]*$"] : []}
                                        errorMessages={personalInfor?.hasVisa ? [t("general.required"), t("Sailor.invalidVisa")] : []}
                                        disabled={!personalInfor?.hasVisa}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={4} sm={4} xs={4}>
                                    <ValidatedDatePicker
                                        className="m-0"
                                        fullWidth
                                        format="dd/MM/yyyy"
                                        margin="normal"
                                        name="expiryVisa"
                                        id="expiryVisa"
                                        label={
                                            <span>
                                                Ngày hết hạn
                                                {personalInfor?.hasVisa &&
                                                    <span style={{ color: "red" }}>*</span>
                                                }
                                            </span>
                                        }
                                        disabled={!personalInfor?.hasVisa}
                                        inputProps={{ readOnly: viewOnly, shrink: true }}
                                        KeyboardButtonProps={{ "aria-label": "change date", }}
                                        value={personalInfor?.hasVisa ? personalInfor?.expiryVisa : null}
                                        onChange={(e) => handleChange(e, "expiryVisa")}
                                        minDate={new Date()}
                                        minDateMessage={t('validateMessage.minDate') + '01/01/1900'}
                                        invalidDateMessage={t("validateMessage.invalidDate")}
                                        validators={personalInfor?.hasVisa === true ? ["required"] : []}
                                        errorMessages={personalInfor?.hasVisa === true ? [t("general.required")] : [] }
                                    />
                                </Grid>
                                <Grid item container xs={12} md={12} sm={12} style={{ padding: "11px" }}>
                                    <Grid item md={4} sm={4} xs={4} className="pr-8">
                                        <TextValidator
                                            fullWidth
                                            label={
                                                <span>
                                                    Chiều cao (cm)
                                                    <span style={{ color: "red" }}>*</span>
                                                </span>
                                            }
                                            type="text"
                                            name="height"
                                            inputProps={{ readOnly: viewOnly }}
                                            value={personalInfor?.height || ''}
                                            onChange={handleChangeNumber}
                                            validators={ ["required", "isFloat", "minFloat:0.00001", "matchRegexp:^.{1,3}$"] }
                                            errorMessages={ [t("general.required"), t("validateMessage.wrongFormat"), t("validateMessage.minHeight"), t("validateMessage.maxHeight")] }
                                        />
                                    </Grid>
                                    <Grid item md={4} sm={4} xs={4} className="px-8">
                                        <TextValidator
                                            fullWidth
                                            label={
                                                <span>
                                                    Cân nặng (kg)
                                                    <span style={{ color: "red" }}>*</span>
                                                </span>
                                            }
                                            type="text"
                                            name="weight"
                                            inputProps={{ readOnly: viewOnly }}
                                            value={personalInfor?.weight || ""}
                                            onChange={handleChangeNumber}
                                            validators={["required", "isFloat", "minFloat:0.00001", "matchRegexp:^.{1,3}$"]}
                                            errorMessages={[
                                                t("general.required"), 
                                                t("validateMessage.wrongFormat"), 
                                                t("validateMessage.minWeight"), 
                                                t("validateMessage.maxWeight")
                                            ]}
                                        />
                                    </Grid>
                                    <Grid item md={4} sm={4} xs={4} className="pl-8">
                                        <TextValidator
                                            fullWidth
                                            disabled
                                            label={
                                                <span>
                                                    BMI (kg/m2)
                                                </span>
                                            }
                                            type="number"
                                            name="BMI"
                                            readOnly={viewOnly}
                                            value={personalInfor?.bmi || ''}
                                            inputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item md={12} sm={12} xs={12}>
                                    <TextValidator
                                        fullWidth
                                        label="Ghi chú"
                                        type="text"
                                        name="note"
                                        multiline
                                        className="dotted"
                                        value={personalInfor?.note || ''}
                                        onChange={handleChange}
                                        InputProps={{
                                            disableUnderline: true,
                                            readOnly: viewOnly,
                                        }}
                                        minlength={255}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item spacing={2} md={3} sm={3} xs={3}>
                                <Grid item md={12} sm={12} xs={12}>
                                    {
                                        <TextValidator
                                            fullWidth
                                            placeholder={"ESS ID"}
                                            type="text"
                                            name="essId"
                                            inputProps={{ readOnly: true, style: { textAlign: 'center' } }}
                                            value={personalInfor?.essId || ''}
                                            className="text--center"
                                            InputProps={{ disableUnderline: true, }}
                                        />
                                    }
                                </Grid>
                                <Grid item md={12} sm={12} xs={12} className="img__container-avatar">
                                    <img
                                        src={personalInfor?.titleImageUrl ? personalInfor?.titleImageUrl : 'https://www.pngitem.com/pimgs/m/516-5167304_transparent-background-white-user-icon-png-png-download.png'}
                                        alt="uploaded image"
                                        draggable={false}
                                    />
                                </Grid>
                                <Grid item container md={12} sm={12} xs={12} justifyContent="center">
                                    {
                                        viewOnly ? null :
                                            <label htmlFor="contained-button-file">
                                                <Button variant="contained" color="primary" component="span">
                                                    Chọn file
                                                </Button>
                                            </label>
                                    }
                                </Grid>
                                <input
                                    hidden
                                    accept="image/*"
                                    name="filename"
                                    onChange={(event) => {
                                        handleImageUpload(
                                            event.target.files[0]
                                        );
                                    }}
                                    id="contained-button-file"
                                    multiple
                                    type="file"
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                {
                    !viewOnly && <div style={{
                        textAlign: 'center'
                    }}>
                        <Button
                            variant="contained"
                            className="mr-12"
                            color="secondary"
                            disabled={loading}
                            onClick={() => dataSailor.handleClose()}>
                            {t("general.cancel")}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            onClick={() => {

                            }}
                            type="submit">
                            {t("general.save")}
                        </Button>
                    </div>
                }
            </ValidatorForm>
        </div >

    )

}

export default PersonalInfor;
