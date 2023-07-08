import {
  Grid,
  Button,
  TablePagination,
  Radio,
  Dialog,
  DialogActions,
  InputAdornment,
  Input,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { Link } from "react-router-dom";
import React from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { searchByPage } from "./PositionTitleService";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
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
class SelectParenPositionPopup extends React.Component {
  state = {
    rowsPerPage: 5,
    page: 0,
    data: [],
    totalElements: 0,
    itemList: [],
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    selectedItem: {},
    keyword: "",
    checkPermissionUserDepartment: true,
  };

  setPage = (page) => {
    this.setState({ page }, function () {
      this.updatePageData();
    });
  };

  setRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function () {
      this.updatePageData();
    });
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  updatePageData = () => {
    var searchObject = {};
    searchObject.type = this.state.keyword;
    searchObject.keyword = this.state.keyword;
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject).then(({ data }) => {
      // var treeValues = [];
      // let itemListClone = [...data.content];
      // itemListClone.forEach((item) => {
      //   var items = this.getListItemChild(item);
      //   treeValues.push(...items);
      // });
      this.setState({
        itemList: [...data.content],
        totalElements: data.totalElements,
      });
    });
  };

  getListItemChild(item) {
    var result = [];
    var root = {};
    root.code = item.code;
    root.name = item.name;
    root.linkUrl = item.linkUrl;
    root.parentId = item.parent?.id;
    root.displayOrder = item.displayOrder;
    root.id = item.id;
    root.description = item.description;
    root.func = item.func;
    root.id = item.id;
    root.industryBlock = item.industryBlock;
    root.foundedDate = item.foundedDate;
    root.foundedNumber = item.foundedNumber;
    root.departmentDisplayCode = item.departmentDisplayCode;
    root.establishDecisionCode = item.establishDecisionCode;
    root.establishDecisionDate = item.establishDecisionDate;
    root.shortName = item.shortName;
    root.parentCode = item.parentCode;
    root.departmentType = item.departmentType;
    result.push(root);
    if (item.children) {
      item.children.forEach((child) => {
        var childs = this.getListItemChild(child);
        result.push(...childs);
      });
    }
    return result;
  }

  componentDidMount() {
    this.updatePageData();
    if (this.props.selectedItem) {
      this.setState({
        selectedItem: this.props.selectedItem,
        selectedValue: this.props.selectedItem.id
      })
    }
  }

  handleClick = (event, item) => {
    //alert(item);
    if (item.id != null) {
      this.setState({ selectedValue: item.id, selectedItem: item });
    } else {
      this.setState({ selectedValue: null, selectedItem: null });
    }
  };

  //   componentWillMount() {
  //     let { open, handleClose, selectedItem, checkPermissionUserDepartment } =
  //       this.props;
  //     this.setState(
  //       { selectedValue: selectedItem.id, checkPermissionUserDepartment },
  //       () => {
  //         this.updatePageData();
  //       }
  //     );
  //   }

  handleKeyDownEnterSearch = (e) => {
    if (e.key === "Enter") {
      this.search();
    }
  };

  handleKeyDownEnterSearch = (e) => {
    if (e.key === "Enter") {
      this.search();
    }
  };

  search() {
    this.setPage(0, function () {
      var searchObject = {};
      searchObject.type = this.state.keyword;
      searchObject.departmentId = this.props?.receiverDepartmentId;
      searchObject.keyword = this.state.keyword;
      searchObject.pageIndex = this.state.page;
      searchObject.pageSize = this.state.rowsPerPage;
      searchByPage(searchObject).then(({ data }) => {
        this.setState({
          itemList: [...data.content],
          totalElements: data.totalElements,
        });
      });
    });
  }

  onClickRow = (selectedRow) => {
    if (selectedRow.id === this.state.selectedItem?.id) {
      this.setState({
        selectedItem: null,
        selectedValue: null
      })
    } else {
      document.querySelector(`#radio${selectedRow.id}`).click();
    }
  };

  handleChange = (event, source) => {
    event.persist();
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      function () {
        this.search();
      }
    );
  };

  render() {
    const { t, i18n, handleClose, handleSelect, selectedItem, open } =
      this.props;
    let { keyword } = this.state;
    let columns = [
      {
        title: t("general.select"),
        field: "custom",
        align: "left",
        width: "250",
        cellStyle: {
          padding: "0px",
          paddingLeft: "10px",
        },
        render: (rowData) => (
          <Radio
            id={`radio${rowData.id}`}
            name="radSelected"
            value={rowData.id}
            checked={this.state.selectedValue === rowData.id}
            onClick={(event) => this.handleClick(event, rowData)}
          />
        ),
      },
      {
        title: t("PositionTitle.name"),
        field: "name",
        align: "left",
        width: "150",
      },
    ];
    return (
      <Dialog
        onClose={handleClose}
        open={open}
        PaperComponent={PaperComponent}
        maxWidth={"md"}
        fullWidth
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <span className="mb-20">{t("PositionTitle.title")}</span>
        </DialogTitle>
        <DialogContent style={{ height: "370px" }}>
          <Grid item md={6} sm={12} xs={12}>
            <Input
              label={t("PositionTitle.search")}
              type="text"
              name="keyword"
              value={keyword}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDownEnterSearch}
              className="w-100 mb-16"
              id="search_box"
              placeholder={t("PositionTitle.search")}
              startAdornment={
                <InputAdornment>
                  <Link to="#">
                    {" "}
                    <SearchIcon
                      onClick={() => this.search(keyword)}
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                      }}
                    />
                  </Link>
                </InputAdornment>
              }
            />
          </Grid>
          <Grid item xs={12}>
            <MaterialTable
              data={this.state.itemList}
              columns={columns}
              onRowClick={(evt, selectedRow) => this.onClickRow(selectedRow)}
              parentChildData={(row, rows) => {
                var list = rows.find((a) => a.id === row.parent?.id);
                return list;
              }}
              options={{
                toolbar: false,
                selection: false,
                actionsColumnIndex: -1,
                paging: false,
                search: false,
                padding: "dense",
              }}
              components={{
                Toolbar: (props) => <MTableToolbar {...props} />,
              }}
              onSelectionChange={(rows) => {
                this.data = rows;
              }}
            />
            <TablePagination
              align="left"
              className="px-16"
              rowsPerPageOptions={[1, 2, 3, 5, 10, 25]}
              component="div"
              labelRowsPerPage={t("general.rows_per_page")}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} ${t("general.of")} ${count !== -1 ? count : `more than ${to}`
                }`
              }
              count={this.state.totalElements}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              backIconButtonProps={{
                "aria-label": "Previous Page",
              }}
              nextIconButtonProps={{
                "aria-label": "Next Page",
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.setRowsPerPage}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            className="mb-16 mr-12 align-bottom"
            variant="contained"
            color="secondary"
            onClick={() => handleClose()}
          >
            {t("general.cancel")}
          </Button>
          <Button
            className="mb-16 mr-16 align-bottom"
            variant="contained"
            color="primary"
            onClick={() => handleSelect(this.state.selectedItem)}
          >
            {t("general.select")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default SelectParenPositionPopup;
