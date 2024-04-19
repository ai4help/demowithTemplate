//Icons

const icon1 = <i className="bx bx-home side-menu__icon"></i>
const icon5 = <i className="bx bx-error side-menu__icon"></i>
const icon16 = <i className="bx bx-layer side-menu__icon"></i>

//Badges
const badge2 = <span className="badge bg-warning-transparent ms-2">12</span>

export const MENUITEMS = [
  {
    menutitle: "MAIN",
    Items: [
      { path: "/components/session", icon: icon1, type: "link", active: false, selected: false, title: "Start Session" },
      { path: "/components/widgets/widgets", icon: icon5, type: "link", active: false, selected: false, title: "Blogs" },
      { path: "/components/widgets/widgets", icon: icon16, type: "link", active: false, selected: false, title: "My Profile" },
    ],
  }
];
