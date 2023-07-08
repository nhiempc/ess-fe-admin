import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import viLocale from "date-fns/locale/vi";
import moment from "moment";

function FilteringGroupInput({
     shipList,
     typeOfShipList,
     positionTitleList,
     handleSearchFilter,
     sailorStatusList,
     itemList
}) {

    const object = {
        positionTitleLevelId:null,
        nameOfShip:'',
        typeOfShip:'',
        signOnShip:null,
        sailorStatusId: '',
        signOffShip:null,
        expiryContract:null,
    }
    const {t, i18n} = useTranslation();
    const [keyword, setKeyword] = useState(object);


    useEffect(() => {
    }, []);

    const handleSelectChange = (event) => {
        setKeyword({...keyword, [event.target.name]:event.target.value});
    }

    const handleDateChange = (event, source) => {
        setKeyword({...keyword, [source]:event});
    }

    const selectFilterCondition = (item, source) => {
        if (!keyword[source]) {
            return true;
        } else {
            return item.currentShip[source] ? item.currentShip[source]?.includes(keyword[source]) : false;
        }
    }

    const dateFilterCondition = (item, source) => {
        let temp = moment(item.currentShip[source]).format("MM/DD/YYYY")
        if(!keyword[source]){
            return true;
        }
        else{
            return keyword[source] ? temp?.includes(moment(keyword[source]).format("MM/DD/YYYY")) : false;
        }

    }

    const handleSearch = () => { 
        let objectFilter = {
            ship: keyword.nameOfShip,
            shipType : keyword.typeOfShip,
            titleSailor : keyword.positionTitleLevelId,
            status : keyword?.sailorStatusId,
            signOnShip : keyword.signOnShip,
            contractExpiryDate : keyword.expiryContract,
            signOffShip : keyword.signOffShip,
        }
        handleSearchFilter(objectFilter)
    }

    const handleSearchReset = () =>{
        let objectFilter = {}
        setKeyword(object);
        handleSearchFilter(objectFilter);
    }

    return (
        <>
            <Grid container className='mt-16'>
                <Grid item container xs={9} spacing={2}>
                    <Grid item container xs={12} spacing={2} className='mb-8'>
                        <Grid item xs={3} className='px-24'>
                            <FormControl fullWidth >
                                <InputLabel className="top-n16 mt-4">
                                    {t("Sailor.search.nameOfShip")}
                                </InputLabel>
                                <Select
                                    className=""
                                    value={keyword.nameOfShip}
                                    inputProps={{ name: "nameOfShip" }}
                                    onChange={handleSelectChange}
                                >
                                    {shipList.map((item) => (
                                        <MenuItem
                                            key={item.code}
                                            value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}  className='px-24'>
                            <FormControl fullWidth >
                                <InputLabel className="top-n16 mt-4">
                                    {t("Sailor.search.typeOfShip")}
                                </InputLabel>
                                <Select
                                    className=""
                                    value={keyword.typeOfShip}
                                    inputProps={{ name: "typeOfShip" }}
                                    onChange={handleSelectChange}
                                >
                                    {typeOfShipList.map((item) => (
                                        <MenuItem
                                            key={item.code}
                                            value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}  className='px-24'>
                            <FormControl fullWidth >
                                <InputLabel className="top-n16">
                                    {t("Sailor.search.positionTitleLevelId")}
                                </InputLabel>
                                <Select
                                    className=""
                                    value={keyword.positionTitleLevelId}
                                    inputProps={{ name: "positionTitleLevelId" }}
                                    onChange={handleSelectChange}
                                >
                                    {positionTitleList.map((item) => (
                                        <MenuItem
                                            key={item.code}
                                            value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3} className='px-24'>
                            <FormControl fullWidth >
                                <InputLabel className="top-n16">
                                    {t("Sailor.search.status")}
                                </InputLabel>
                                <Select
                                    className=""
                                    value={keyword?.sailorStatusId}
                                    inputProps={{ name: "sailorStatusId" }}
                                    onChange={handleSelectChange}
                                >
                                    {sailorStatusList.map((item) => (
                                        <MenuItem
                                            key={item.code}
                                            value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item container xs={12} spacing={2}>
                        <Grid item xs={4} className='px-24'>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                                < KeyboardDatePicker
                                    autoOk
                                    className="m-0"
                                    fullWidth
                                    variant="inline"
                                    format="dd/MM/yyyy"
                                    placeholder="dd/MM/yyyy"
                                    margin="normal"
                                    label={t("Sailor.search.signOnShip")}
                                    value={keyword.signOnShip || null}
                                    onChange={(e) => handleDateChange(e, "signOnShip")}
                                    InputLabelProps={{ shrink: true }}
                                    KeyboardButtonProps={{ "aria-label": "change date" }}
                                    invalidDateMessage={t("validateMessage.invalidDate")}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={4} className='px-24'>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                                < KeyboardDatePicker
                                    autoOk
                                    className="m-0"
                                    fullWidth
                                    variant="inline"
                                    format="dd/MM/yyyy"
                                    placeholder="dd/MM/yyyy"
                                    margin="normal"
                                    label={t("Sailor.search.expiryContract")}
                                    value={keyword.expiryContract || null}
                                    onChange={(e) => handleDateChange(e, "expiryContract")}
                                    InputLabelProps={{ shrink: true }}
                                    KeyboardButtonProps={{ "aria-label": "change date" }}
                                    invalidDateMessage={t("validateMessage.invalidDate")}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={4} className='px-24'>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
                                < KeyboardDatePicker
                                    autoOk
                                    className="m-0"
                                    fullWidth
                                    variant="inline"
                                    format="dd/MM/yyyy"
                                    placeholder="dd/MM/yyyy"
                                    margin="normal"
                                    label={t("Sailor.search.signOffShip")}
                                    value={keyword.signOffShip || null}
                                    onChange={(e) => handleDateChange(e, "signOffShip")}
                                    InputLabelProps={{ shrink: true }}
                                    KeyboardButtonProps={{ "aria-label": "change date" }}
                                    invalidDateMessage={t("validateMessage.invalidDate")}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid xs={1}></Grid>
                <Grid container xs={2} spacing={2} >
                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            color="primary"
                            variant="contained"
                            className="ml-12 mt-12"
                            onClick={handleSearch}
                        >
                            Tìm kiếm
                            <SearchIcon />
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            color="secondary"
                            variant="contained"
                            className="ml-12"
                            onClick={handleSearchReset}
                        > Đặt lại</Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}


export default FilteringGroupInput