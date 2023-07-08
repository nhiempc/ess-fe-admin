import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const Category = EgretLoadable({
  loader: () => import("./Category")
});
const ViewComponent = withTranslation()(Category);
const CategoryRoutes = [
  {
    path: ConstantList.ROOT_PATH + "article-category",
    exact: true,
    component: ViewComponent
  }
];

export default CategoryRoutes;