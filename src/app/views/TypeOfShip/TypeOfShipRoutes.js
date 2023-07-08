import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const TypeOfShipTable = EgretLoadable({
  loader: () => import("./TypeOfShip")
});
// const React15TabulatorSample = EgretLoadable({
//   loader: () => import("./React15TabulatorSample")
// });
const ViewComponent = withTranslation()(TypeOfShipTable);
// const ViewTabuComponent = withTranslation()(React15TabulatorSample);

const TypeOfShipRoutes = [
  {
    path: ConstantList.ROOT_PATH + "dashboard/TypeOfShips",
    exact: true,
    component: ViewComponent
  },
  // {
  //   path: ConstantList.ROOT_PATH + "dashboard/TabuTypeOfShips",
  //   exact: true,
  //   component: ViewTabuComponent
  // }
];

export default TypeOfShipRoutes;
