import React from "react";
import { Redirect } from "react-router-dom";
import homeRoutes from "./views/home/HomeRoutes";
import sessionRoutes from "./views/sessions/SessionRoutes";
import dashboardRoutes from "./views/dashboard/DashboardRoutes";
import administrativeUnitRoutes from "./views/AdministrativeUnit/AdministrativeUnitRoutes";
import fiscalYearRoutes from "./views/FiscalYear/FiscalYearRoutes";
import otherRoutes from "./views/others/OtherRoutes";
import UserRoutes from "./views/User/UserRoutes";
import departmentRoutes from "./views/Department/DepartmentRoutes";
import roleRoutes from "./views/Role/RoleRoutes";
import ConstantList from "./appConfig";
import MenuRoutes from "./views/Menus/MenuRoutes";
import pageLayoutRoutes from "./views/page-layouts/PageLayoutRoutees";
import PositionTitleLevelRoutes from "./views/PositionTitleLevel/PositionTitleLevelRoutes";
import partnerRoutes from "./views/Partner/PartnerRoutes";
import CurrencyRoutes from "./views/Currency/CurrencyRoutes";
import JobRoutes from "./views/Job/JobRoutes";
import TypeOfShipRoutes from "./views/TypeOfShip/TypeOfShipRoutes";
import RegisterApplyRouter from "./views/RegisterApply/RegisterApplyRouter";
import ContactUs from "./views/ContactUs/ContactRoutes";
import CertificateRoutes from "./views/Certificate/CertificateRoutes";
import PositionTitleRoutes from "./views/PositionTitle/PositionTitleRoutes";
import ShipOwnerRegisterRoutes from "./views/ShipOwnerRegister/ShipOwnerRegisterRoutes";
import ArticleRoutes from './views/Article/ArticleRoutes';
import ShipsRoute from './views/Ships/ShipsRouter';
import nationRoutes from "./views/Nation/NationRoutes";
import ServicesRoutes from "./views/Services/ServicesRoutes";
import SeaprotRoutes from "./views/Seaport/SeaportRoutes";
import CategoryRoutes from "./views/Category/CategoryRoutes";
import SailorRoutes from "./views/Sailor/SailorRoutes";
import TypeOfSailorRoutes from "./views/TypeOfSailor/TypeOfSailorRoutes";
import SailorStatusRoutes from "./views/SailorStatus/SailorStatusRoutes";
import CoursesRoutes from "./views/Courses/CoursesRoutes";
const redirectRoute = [
  {
    path: ConstantList.ROOT_PATH,
    exact: true,
    component: () => <Redirect to={ConstantList.HOME_PAGE} />, //Luôn trỏ về HomePage được khai báo trong appConfig
  },
];

const errorRoute = [
  {
    component: () => <Redirect to={ConstantList.ROOT_PATH + "session/404"} />,
  },
];

const routes = [
  ...nationRoutes,
  ...homeRoutes,
  ...ContactUs,
  ...JobRoutes,
  ...ShipsRoute,
  ...redirectRoute,
  ...CertificateRoutes,
  ...CategoryRoutes,
  ...sessionRoutes,
  ...ServicesRoutes,
  ...SeaprotRoutes,
  ...partnerRoutes,
  // ...dashboardRoutes,
  ...administrativeUnitRoutes,
  ...fiscalYearRoutes,
  ...TypeOfShipRoutes,
  ...departmentRoutes,
  ...pageLayoutRoutes,
  ...UserRoutes,
  ...roleRoutes,
  ...MenuRoutes,
  ...PositionTitleLevelRoutes,
  ...CurrencyRoutes,
  ...RegisterApplyRouter,
  ...ShipOwnerRegisterRoutes,
  ...PositionTitleRoutes,
  ...ArticleRoutes,
  ...SailorRoutes,
  ...TypeOfSailorRoutes,
  ...SailorStatusRoutes,
  ...CoursesRoutes,
  ...errorRoute,
];

export default routes;
