import {
    Grid,
    FormControl,
    InputLabel,
    Button,
    Input,
    Checkbox,
    TablePagination,
    InputAdornment,
    Dialog,
    DialogActions,
    IconButton,
    Icon
  } from "@material-ui/core";
  import React, { Component } from "react";
  import SearchIcon from "@material-ui/icons/Search";
  import MaterialTable, {
    MTableToolbar,
  } from "material-table";
  import { useTranslation } from 'react-i18next';
//   import { searchByPage } from "../Strain/StrainService";
  import DialogContent from "@material-ui/core/DialogContent";
  import DialogTitle from "@material-ui/core/DialogTitle";
  import Draggable from "react-draggable";
  import Paper from "@material-ui/core/Paper";
  import { toast } from "react-toastify";
  import {
    saveItem, searchByPagePositionTitle, searchByPagePositionTitleLevel, searchByPageTypeOfShip, updateItem, checkCode
  } from "./JobService";
  
  toast.configure({
    autoClose: 2000,
    draggable: false,
    limit: 3,
  });
  
  function PaperComponent(props) {
    return (
      <Draggable
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
  }
  
  class SelectPositionPopup extends React.Component {
    state = {
      itemList: [],
      rowsPerPage: 10,
      page: 0,
      listPositionChoose: [],
    }
  
    componentDidMount() {
      this.updatePageData();
    }
  
    componentWillMount() {
      let { open, handleClose, selectedItem, listPositionPick , itemId } = this.props;
      // console.log("itemId")
      // console.log(itemId)
  
      this.setState({itemId : itemId})
      if (listPositionPick != null && listPositionPick.length > 0) {
        const sampleCommon = [...listPositionPick];
        // console.log(sampleCommon);
        this.setState({ listPositionChoose: sampleCommon });
      }
    }
  
    handleClick = (event, item) => {
      // console.log(item);
      // console.log(event);
      item.isCheck = event.target.checked;

      let { listPositionChoose } = this.state;
      if (listPositionChoose == null) {
        listPositionChoose = [];
      }
      if (listPositionChoose != null && listPositionChoose.length == 0 && item.isCheck == true) {
        listPositionChoose.push(item);
      } else {
        let itemInList = false;
        listPositionChoose.forEach(el => {
          if (el.id == item.id) {
            itemInList = true;
          }
        });
        if (!itemInList && item.isCheck == true) {
          listPositionChoose.push(item);
        } else {
          if (item.isCheck === false) {
            listPositionChoose = listPositionChoose.filter(
              proper => proper.id !== item.id
            );
          }
        }
      }
      this.setState({ listPositionChoose });
    };
  
    // handleKeyDownEnterSearch = e => {
    //   if (e.key === 'Enter') {
    //     this.search();
    //   }
    // };
    setPage = page => {
      this.setState({ page }, function () {
        this.updatePageData();
      });
    };
  
    setRowsPerPage = event => {
      this.setState({ rowsPerPage: event.target.value, page: 0 }, function () {
        this.updatePageData();
      });
    };
  
    handleChangePage = (event, newPage) => {
      this.setPage(newPage);
    };
  
    // search() {
    //   this.setState({ page: 0 }, function () {
    //     var searchObject = {};
    //     searchObject.text = this.state.keyword;
    //     searchObject.pageIndex = this.state.page + 1;
    //     searchObject.pageSize = this.state.rowsPerPage;
  
    //     let listCheck = this.state.itemList;
    //     searchByPagePositionTitleLevel(searchObject).then(({ data }) => {
    //       let { listPositionChoose } = this.state;
    //       let itemListClone = [...data.content];
    //       itemListClone.map(item => {
    //         const found = listPositionChoose.find(
    //           obj => obj.id == item.id
    //         );
    //         console.log(this.state.itemId)
    //         if (found && this.state.itemId != undefined) {
    //           item.isCheck = true;
    //           item.isDisable = true;
    //         } else {
    //           item.isCheck = false;
    //           item.isDisable = false;
    //         }
    //       });
    //       this.setState({ itemList: itemListClone, totalElements: data.totalElements })
  
    //     });
    //   });
    // }
  
    updatePageData = () => {
      let jobPositionTitles = this.props.jobPositionTitles
      var searchObject = {};
      searchObject.pageIndex = this.state.page + 1;
      searchObject.pageSize = this.state.rowsPerPage;
  
      searchByPagePositionTitleLevel(searchObject).then(({ data }) => {
        let { listPositionChoose } = this.state;
        let itemListClone = [...data.content];
        itemListClone.map(item => {
          const found = listPositionChoose.find(
            obj => obj.id == item.id
          );
          if (found) {
            item.isCheck = true;
            if (this.state.itemId != undefined){
              item.isDisable = true
            }
          } else {
            item.isCheck = false;
            item.isDisable = false;
          }
        });
        itemListClone.forEach((e1)=>{
          jobPositionTitles.forEach((e2)=>{
            if(e1.code === e2.positionTitleDto.code){
              listPositionChoose.push(e1);
              e1.isCheck = true
            }
          })
        })


        this.setState({ itemList: itemListClone, totalElements: data.totalElements,listPositionChoose })
      }
      );
    };
  
    // handleChange = (event, source) => {
    //   this.setState({
    //     [event.target.name]: event.target.value
    //   });
    // };
  
    render() {
  
      const { t, i18n, handleClose, handleSelect, open,jobPositionTitles } = this.props;
      let {
        text,
        itemList,
        listPositionChoose,
      } = this.state;
  
      let columns = [
        {
          title: t("general.select"),
          field: "custom",
          align: "left",
          width: "250",
          render: rowData => (
            <Checkbox
              id={`radio${rowData.id}`}
              name="radSelected"
              value={rowData.id}
              checked={rowData.isCheck}
              disabled={rowData.isDisable}
  
              onClick={event => this.handleClick(event, rowData)}
            />
          )
        },
        {
          title: t("general.positionTitle"),
          field: "name",
          width: "250",
          headerStyle: {
            minWidth: "100px",
            paddingLeft: "0px",
            paddingRight: "0px",
            textAlign: "center",
          },
          cellStyle: {
            minWidth: "100px",
            paddingLeft: "0px",
            paddingRight: "0px",
            textAlign: "center",
          }
        },
      ];
  
      return (
        <Dialog
          open={open}
          PaperComponent={PaperComponent}
          maxWidth={"md"}
          fullWidth
        >
          <DialogTitle className="styleColor" style={{ cursor: "move" }} id="draggable-dialog-title">
            <span className="mb-20">
              Vị trí ứng tuyển
            </span>
            <IconButton
              style={{ position: 'absolute', right: '10px', top: '10px' }}
              onClick={() => handleClose()}
            >
              <Icon color="error" title={t('close')}>
                close
              </Icon>
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
          <Grid container spacing={1}>
            <Grid md={8} sm={8} xs={6}>
            </Grid>
            <Grid item xs={12}>
              <MaterialTable
                data={itemList}
                columns={columns}
                options={{
                  selection: false,
                  actionsColumnIndex: -1,
                  paging: false,
                  search: false,
                  rowStyle: rowData => ({
                    backgroundColor: (rowData.tableData.id % 2 === 1) ? '#EEE' : '#FFF',
                  }),
                  headerStyle: {
                    backgroundColor: '#007b8f',
                    color: '#fff',
                  },
                  padding: 'dense',
                  toolbar: false,
                  draggable: false,
                }}
                components={{
                  Toolbar: props => (
                    <div style={{ witdth: "100%" }}>
                      <MTableToolbar {...props} />
                    </div>
                  )
                }}
                onSelectionChange={rows => { 
                  this.setState({ sampleCommon: rows })
                }}
                localization={{
                  body: {
                    emptyDataSourceMessage: `${t(
                      "general.emptyDataMessageTable"
                    )}`,
                  },
                }}
              />
              <TablePagination
                align="left"
                className="px-16"
                rowsPerPageOptions={[1, 2, 3, 5, 10, 25]}
                component="div"
                labelRowsPerPage={t('general.rows_per_page')}
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('general.of')} ${count !== -1 ? count : `more than ${to}`}`}
                count={this.state.totalElements}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                backIconButtonProps={{
                  "aria-label": "Previous Page"
                }}
                nextIconButtonProps={{
                  "aria-label": "Next Page"
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.setRowsPerPage}
              />
            </Grid>
          </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              className="mb-16 mr-36 align-bottom color__white"
              variant="contained"
              color="secondary"
              onClick={() => handleClose()}
            >
              {t("general.cancel")}
            </Button>
            <Button
              className="mb-16 mr-16 align-bottom background__color"
              variant="contained"
              color="primary"
              onClick={() =>{ 
                handleSelect(listPositionChoose)
              } }
            >
              {t("general.select")}
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
  
  }
  export default SelectPositionPopup;
  