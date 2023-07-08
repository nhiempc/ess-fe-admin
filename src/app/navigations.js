import ConstantList from "./appConfig";
export const navigations = [
  // {
  //   name: "Dashboard.dashboard",
  //   icon: "dashboard",
  //   path: ConstantList.ROOT_PATH + "dashboard/analytics",
  //   isVisible: true,
  // },
  {
    name: "Dashboard.RegisterApply",
    icon: "person_add",
    isVisible: true,
    children: [
      {
        name: "Dashboard.ShipOwnerRegister",
        path: ConstantList.ROOT_PATH + "shipOwnerRegister",
        isVisible: true,
      },
      {
        name: "Dashboard.SailorRegister",
        path: ConstantList.ROOT_PATH + "RegisterApply",
        isVisible: true,
      }
    ]
  },
  {
    name: "Dashboard.job",
    icon: "campaign",
    path: ConstantList.ROOT_PATH + "job",
    isVisible: true,
  },
  {
    name: "Danh sách thuyền viên",
    isVisible: true,
    path: ConstantList.ROOT_PATH + "sailor_manager/sailor",
    icon: "assignment",
  },


  {
    name: "Dashboard.directory",
    icon: "format_list_bulleted",
    path: "",
    isVisible: true,
    children: [
      // {
      //   name: "Dashboard.AdministrativeUnit",
      //   path: ConstantList.ROOT_PATH + "dashboard/AdministrativeUnits",
      //    icon: "keyboard_arrow_right",
      //   isVisible: true,
      // },
      {
        name: "Dashboard.subcategory.article",
        path: ConstantList.ROOT_PATH + "article-category",
        isVisible: true,
      },
      {
        name: "general.positionTitle",
        path: ConstantList.ROOT_PATH + "position-title",
        isVisible: true,
      },
      {
        name: "Dashboard.certificate",
        path: ConstantList.ROOT_PATH + "certificate",
        isVisible: true,
      },

      {
        name: "Dashboard.partner",
        path: ConstantList.ROOT_PATH + "Partner",
        isVisible: true,
      },
      {
        name: "Dashboard.fleetOfShips",
        path: ConstantList.ROOT_PATH + "ships",
        isVisible: true,
      },

      {
        name: "Dashboard.contactUs",
        path: ConstantList.ROOT_PATH + "contact",
        isVisible: true,
      },
      {
        name: "Dashboard.PositionTitleLevelId",
        path: ConstantList.ROOT_PATH + "position-title-level",
        isVisible: true,
      },
      {
        name: "Dashboard.typeofship",
        path: ConstantList.ROOT_PATH + "dashboard/TypeOfShips",
        isVisible: true,
      },
      {
        name: "Dashboard.typeOfSailor",
        path: ConstantList.ROOT_PATH + "dashboard/type-of-sailors",
        isVisible: true,
      },
      {
        name: "Dashboard.sailorStatus",
        path: ConstantList.ROOT_PATH + "dashboard/sailors-status",
        isVisible: true,
      },
      {
        name: "Dashboard.courses",
        path: ConstantList.ROOT_PATH + "dashboard/courses",
        isVisible: true,
      },
      {
        name: "Dashboard.currency",
        path: ConstantList.ROOT_PATH + "currency",
        isVisible: true,
      },
      {
        name: "Dashboard.nation",
        path: ConstantList.ROOT_PATH + "nation",
        isVisible: true,
      },
      {
        name: "Dashboard.services",
        path: ConstantList.ROOT_PATH + "dashboard/Services",
        isVisible: true,
      },
      // {
      //   name: "Dashboard.Seaport",
      //    icon: "keyboard_arrow_right",
      //   path: ConstantList.ROOT_PATH + "dashboard/Seaport",
      //   isVisible: true,
      // }
    ]
  }
  , {
    name: "Dashboard.manage",
    isVisible: true,
    icon: "manage_accounts",
    children: [
      {
        name: "manage.user",
        isVisible: true,
        path: ConstantList.ROOT_PATH + "user_manager/user",
      },
      // {
      //   name: "manage.menu",
      //   isVisible: true,
      //   path: ConstantList.ROOT_PATH + "list/menu",
      //   icon: "keyboard_arrow_right"
      // },
      {
        name: "Dashboard.newsEvent",
        isVisible: true,
        path: ConstantList.ROOT_PATH + "list/article",
      },
    ]
  }
];
