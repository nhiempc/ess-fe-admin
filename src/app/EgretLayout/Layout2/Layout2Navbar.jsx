import React, { Component } from "react";
import { EgretHorizontalNav } from "egret";
import { navigations } from "../../navigations";
import { withStyles, MuiThemeProvider } from "@material-ui/core";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const ViewEgretHorizontalNav = withTranslation()(EgretHorizontalNav);
class Layout2Navbar extends Component {
  state = {};
  render() {
    let { theme, settings } = this.props;
    const navbarTheme =
      settings.themes[settings.layout2Settings.navbar.theme] || theme;
    return (
      <MuiThemeProvider theme={navbarTheme}>
        <Helmet>
          <style>
            {`.horizontal-nav a, 
              .horizontal-nav label {
                display: flex;
                flex-direction: column;
                color: ${navbarTheme.palette.primary.contrastText};
              }
              .horizontal-nav li a:after {
                content: none;
              }
              .horizontal-nav ul li ul li{
                border-top: 1px solid ${navbarTheme.palette.primary.dark};
              }
              .horizontal-nav a .material-icons,
              .horizontal-nav label .material-icons{
                font-size: 16px
              }
              .horizontal-nav ul li ul a{
                justify-content: center;
                padding: 8px 10px;
                min-width: 200px;
                max-width: 256px
              }
              .horizontal-nav ul ul{
                max-width: 256px;
                min-width: 200px;
                left: 0
              }
              .horizontal-nav ul ul li{
                max-width: 256px;
                min-width: 200px;
              }
              .layout-contained .container, .layout-boxed .container{
                padding: 0
              }
              .horizontal-nav li:hover, 
              .horizontal-nav label:hover {
                color: ${navbarTheme.palette.hover.contrastText};
                background-color: ${navbarTheme.palette.hover.main};
              }
              .horizontal-nav ul.menu{
                padding: 0
              }
              .horizontal-nav ul.menu > li{
                padding: 0
              }
              .horizontal-nav a, .horizontal-nav label{
                padding: 13px 30px;
                min-width: 200px;
                max-width: 256px
              }
              .horizontal-nav a.active, 
              .horizontal-nav label.active {
                color: ${navbarTheme.palette.hover.contrastText};
                background-color: ${navbarTheme.palette.hover.main};
              }
              .navbar,
              .horizontal-nav ul ul {
                background: ${navbarTheme.palette.primary.main};
              }
              .horizontal-nav ul li ul li:hover,
              .horizontal-nav ul li ul li.open {
                background: ${navbarTheme.palette.primary.dark};
              }
              .layout-contained .container{
                max-width: 1920px
              }
            `}
          </style>
        </Helmet>
        <div className="navbar">
          <div className="container" style={{display:'flex', justifyContent:"center"}}>
            <ViewEgretHorizontalNav navigation={navigations} max={6} />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

Layout2Navbar.propTypes = {
  settings: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  settings: state.layout.settings
});

export default withStyles({}, { withTheme: true })(
  connect(
    mapStateToProps,
    {}
  )(Layout2Navbar)
);
