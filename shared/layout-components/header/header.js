import React, { useEffect, useState } from 'react'
import { Alert, Badge, Button, ButtonGroup, Card, Col, Dropdown, Form, ListGroup, Modal } from 'react-bootstrap'
import Link from 'next/link'
import { MENUITEMS } from '../sidebar/nav';
import { ThemeChanger } from "../../redux/action";
import { connect } from "react-redux";
import store from "../../redux/store";
import { Data1, Data2, Data3 } from '../header/headerdata'
import { basePath } from '../../../next.config';

const Header = ({ local_varaiable, ThemeChanger }) => {
    const [showa1, setShowa1] = useState(true);
    const toggleShowa1 = () => setShowa1(!showa1);

    const [showa2, setShowa2] = useState(true);
    const toggleShowa2 = () => setShowa2(!showa2);

    const [showa3, setShowa3] = useState(true);
    const toggleShowa3 = () => setShowa3(!showa3);

    const [show1, setShow1] = useState(false);
    const [InputValue, setInputValue] = useState("");
    const [show2, setShow2] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [NavData, setNavData] = useState([]);
    const [searchcolor, setsearchcolor] = useState("text-dark");
    const [searchval, setsearchval] = useState("Type something");

    const [Data, setData] = useState(Data1);
    const [Dataa, setDataa] = useState(Data2);
    const [searchdata, setSearchdata] = useState(Data3);

    function handleDelete(id) {
        const updatedInvoiceData = Data.filter((idx) => idx.id !== id);
        setData(updatedInvoiceData);
    }
    function handleDelete1(id) {
        const updatedInvoiceDataa = Dataa.filter((idx) => idx.id !== id);
        setDataa(updatedInvoiceDataa);
    }
    function handleDelete2(id) {
        const updatedInvoicesearchdata = searchdata.filter((idx) => idx.id !== id);
        setSearchdata(updatedInvoicesearchdata);
    }

    //Dark Model
    const ToggleDark = () => {

        ThemeChanger({
            ...local_varaiable,
            "dataThemeMode": local_varaiable.dataThemeMode == 'dark' ? 'light' : 'dark',
            "dataHeaderStyles": local_varaiable.dataHeaderStyles == 'dark' ? 'light' : 'dark',
            "dataMenuStyles": local_varaiable.dataNavLayout == 'horizontal' ? local_varaiable.dataMenuStyles == 'dark' ? 'light' : 'dark' : "dark",
        });
        const theme = store.getState();

        if (theme.dataThemeMode != 'dark') {
            ThemeChanger({
                ...theme,
                "bodyBg1": '',
                "bodyBg2": '',
                "darkBg": '',
                "inputBorder": '',
                "dataHeaderStyles": '',
            });
            localStorage.removeItem("ynexdarktheme");
            localStorage.removeItem("darkBgRGB1");
            localStorage.removeItem("darkBgRGB2");
            localStorage.removeItem("darkBgRGB3");
            localStorage.removeItem("ynexMenu");
            localStorage.removeItem("ynexHeader");

        }
        else {
            localStorage.setItem("ynexdarktheme", "dark");
        }

    };

    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        const element = document.documentElement;
        if (
            !document.fullscreenElement &&
            !document.mozFullScreenElement &&
            !document.webkitFullscreenElement
        ) {
            // Enter fullscreen mode
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            // Exit fullscreen mode
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    };

    useEffect(() => {
        const fullscreenChangeHandler = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', fullscreenChangeHandler);

        return () => {
            document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
        };
    }, []);

    const myfunction = (inputvalue) => {
        document.querySelector(".search-result")?.classList.remove("d-none");

        const i = [];
        const allElement2 = [];

        MENUITEMS.map(mainlevel => {
            if (mainlevel.Items) {
                setShow1(true);
                mainlevel.Items.map(sublevel => {

                    if (sublevel.children) {
                        sublevel.children.map((sublevel1) => {

                            i.push(sublevel1);
                            if (sublevel1.children) {
                                sublevel1.children.map((sublevel2) => {

                                    i.push(sublevel2);
                                    return sublevel2;
                                });
                            }
                            return sublevel1;
                        });
                    }
                    return sublevel;
                });
            }
            return mainlevel;
        }
        );
        for (const allElement of i) {
            if (allElement.title.toLowerCase().includes(inputvalue.toLowerCase())) {
                if (allElement.title.toLowerCase().startsWith(inputvalue.toLowerCase())) {
                    setShow2(true);
                    allElement2.push(allElement);
                }
            }
        }
        if (!allElement2.length || inputvalue === "") {
            if (inputvalue === "") {
                setShow2(false);
                setsearchval("Type something");
                setsearchcolor('text-dark');
            }
            if (!allElement2.length) {
                setShow2(false);
                setsearchcolor('text-danger');
                setsearchval("There is no component with this name");
            }
        }
        setNavData(allElement2);

    };
    const Switchericon = () => {
        document.querySelector(".offcanvas-end")?.classList.toggle("show");
        const Rightside = document.querySelector(".offcanvas-end");
        if (document.querySelector(".switcher-backdrop")?.classList.contains('d-none')) {
            document.querySelector(".switcher-backdrop")?.classList.add("d-block");
            document.querySelector(".switcher-backdrop")?.classList.remove("d-none");
        }
    };
    const removeItem = (itemToRemove) => {
        const updatedCart = cartItems.filter((item) => item.id !== itemToRemove.id);
        setCartItems(updatedCart);
    };
    const toggleSidebar = () => {
        const theme = store.getState()
        let sidemenuType = theme.dataNavLayout;
        if (window.innerWidth >= 992) {
            if (sidemenuType === 'vertical') {
                let verticalStyle = theme.dataVerticalStyle;
                let navStyle = theme.dataNavStyle;
                switch (verticalStyle) {
                    // closed
                    case "closed":
                        ThemeChanger({ ...theme, "dataNavStyle": "" })
                        if (theme.toggled === "close-menu-close") {
                            ThemeChanger({ ...theme, "toggled": "" })
                        } else {
                            ThemeChanger({ ...theme, "toggled": "close-menu-close" })
                        }
                        break;
                    // icon-overlay
                    case "overlay":
                        ThemeChanger({ ...theme, "dataNavStyle": "" })
                        if (theme.toggled === "icon-overlay-close") {
                            ThemeChanger({ ...theme, "toggled": "" })
                        } else {
                            if (window.innerWidth >= 992) {
                                ThemeChanger({ ...theme, "toggled": "icon-overlay-close" })
                            }
                        }
                        break;
                    // icon-text
                    case "icontext":
                        ThemeChanger({ ...theme, "dataNavStyle": "" })
                        if (theme.toggled === "icon-text-close") {
                            ThemeChanger({ ...theme, "toggled": "" })
                        } else {
                            ThemeChanger({ ...theme, "toggled": "icon-text-close" })
                        }
                        break;
                    // doublemenu
                    case "doublemenu":
                        ThemeChanger({ ...theme, "dataNavStyle": "" })
                        if (theme.toggled === "double-menu-open") {
                            ThemeChanger({ ...theme, "toggled": "double-menu-close" })
                        } else {
                            let sidemenu = document.querySelector(".side-menu__item.active");
                            if (sidemenu) {
                                ThemeChanger({ ...theme, "toggled": "double-menu-open" })
                                if (sidemenu.nextElementSibling) {
                                    sidemenu.nextElementSibling.classList.add("double-menu-active");
                                } else {

                                    ThemeChanger({ ...theme, "toggled": "" })
                                }
                            }
                        }
                        // doublemenu(ThemeChanger);
                        break;
                    // detached
                    case "detached":
                        if (theme.toggled === "detached-close") {
                            ThemeChanger({ ...theme, "toggled": "" })
                        } else {
                            ThemeChanger({ ...theme, "toggled": "detached-close" })
                        }
                        break;
                    // default
                    case "default":
                        ThemeChanger({ ...theme, "toggled": "" })
                }
                switch (navStyle) {
                    case "menu-click":
                        if (theme.toggled === "menu-click-closed") {
                            ThemeChanger({ ...theme, "toggled": "" });
                        }
                        else {
                            ThemeChanger({ ...theme, "toggled": "menu-click-closed" });
                        }
                        break;
                    // icon-overlay
                    case "menu-hover":
                        if (theme.toggled === "menu-hover-closed") {
                            ThemeChanger({ ...theme, "toggled": "" });
                        } else {
                            ThemeChanger({ ...theme, "toggled": "menu-hover-closed" });

                        }
                        break;
                    case "icon-click":
                        if (theme.toggled === "icon-click-closed") {
                            ThemeChanger({ ...theme, "toggled": "" });
                        } else {
                            ThemeChanger({ ...theme, "toggled": "icon-click-closed" });

                        }
                        break;
                    case "icon-hover":
                        if (theme.toggled === "icon-hover-closed") {
                            ThemeChanger({ ...theme, "toggled": "" });
                        } else {
                            ThemeChanger({ ...theme, "toggled": "icon-hover-closed" });

                        }
                        break;
                }
            }
        }
        else {

            const theme = store.getState()
            if (theme.toggled === "close") {
                ThemeChanger({ ...theme, "toggled": "open" })
                setTimeout(() => {
                    if (theme.toggled == "open") {
                        document.querySelector("#responsive-overlay")?.classList.add("active");
                        document
                            .querySelector("#responsive-overlay")
                            .addEventListener("click", () => {
                                document
                                    .querySelector("#responsive-overlay")
                                    .classList.remove("active");
                                menuClose();
                            });
                    }
                    window.addEventListener("resize", () => {
                        if (window.screen.width >= 992) {
                            document.querySelector("#responsive-overlay")?.classList.remove("active");
                        }
                    });
                }, 100);
            } else {
                ThemeChanger({ ...theme, "toggled": "close" })
            }
        }
    }
    useEffect(() => {
        const handleResize = () => {
            const windowObject = window;
            if (windowObject.innerWidth <= 991) {
                // ThemeChanger({ ...local_varaiable, "toggled": "close" })
            } else {
                // ThemeChanger({...local_varaiable,"toggled":""})
            }
        };
        handleResize(); // Check on component mount
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);

        };
    }, []);
    const [cartItems, setCartItems] = useState([...Data]);
    const [cartItemCount, setCartItemCount] = useState(Data.length);
    const handleRemove = (itemId) => {
        const updatedCart = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedCart);
        setCartItemCount(updatedCart.length);
    };

    const [notifications, setNotifications] = useState([...Data2]);

    const handleNotificationClose = (index) => {
        // Create a copy of the notifications array and remove the item at the specified index
        const updatedNotifications = [...notifications];
        updatedNotifications.splice(index, 1);
        setNotifications(updatedNotifications);
    };
    return (
        <>
            <header className="app-header">
                <div className="main-header-container container-fluid">
                    <div className="header-content-left">
                        <div className="header-element">
                            <div className="horizontal-logo">
                                <Link href="/components/dashboard/crm" className="header-logo">
                                    <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/desktop-logo.png`} alt="logo" className="desktop-logo" />
                                    <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/toggle-logo.png`} alt="logo" className="toggle-logo" />
                                    <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/desktop-dark.png`} alt="logo" className="desktop-dark" />
                                    <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/toggle-dark.png`} alt="logo" className="toggle-dark" />
                                    <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/desktop-white.png`} alt="logo" className="desktop-white" />
                                    <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/brand-logos/toggle-white.png`} alt="logo" className="toggle-white" />
                                </Link>
                            </div>
                        </div>
                        {/*                         <div className="header-element" >
                            <Link aria-label="Hide Sidebar" onClick={() => toggleSidebar()}
                                className="sidemenu-toggle header-link animated-arrow hor-toggle horizontal-navtoggle" data-bs-toggle="sidebar" href="#!"><span></span></Link>
                        </div> */}

                    </div>
                    <div className="header-content-right">
                        {/* <div className="header-element header-search">
                            <Link href="#!" className="header-link" data-bs-toggle="modal" data-bs-target="#searchModal" onClick={handleShow}>
                                <i className="bx bx-search-alt-2 header-link-icon"></i>
                            </Link>
                        </div> */}
                        {/* <Dropdown className="header-element country-selector">
                            <Dropdown.Toggle as='a' className="header-link dropdown-toggle no-caret" data-bs-auto-close="outside" data-bs-toggle="dropdown">

                                <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/flags/us_flag.jpg`} alt="img" className="rounded-circle header-link-icon" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="main-header-dropdown dropdown-menu-end" data-popper-placement="none">
                                <li>
                                    <Dropdown.Item href="#!" className="d-flex align-items-center" >
                                        <span className="avatar avatar-xs lh-1 me-2">
                                            <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/flags/us_flag.jpg`} alt="img" />
                                        </span>
                                        English
                                    </Dropdown.Item>
                                </li>
                                <li>
                                    <Dropdown.Item href="#!" className="d-flex align-items-center" >
                                        <span className="avatar avatar-xs lh-1 me-2">
                                            <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/flags/spain_flag.jpg`} alt="img" />
                                        </span>
                                        Spanish
                                    </Dropdown.Item>
                                </li>
                                <li>
                                    <Dropdown.Item href="#!" className="d-flex align-items-center">
                                        <span className="avatar avatar-xs lh-1 me-2">
                                            <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/flags/french_flag.jpg`} alt="img" />
                                        </span>
                                        French
                                    </Dropdown.Item>
                                </li>
                                <li>
                                    <Dropdown.Item href="#!" className="d-flex align-items-center" >
                                        <span className="avatar avatar-xs lh-1 me-2">
                                            <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/flags/germany_flag.jpg`} alt="img" />
                                        </span>
                                        German
                                    </Dropdown.Item>
                                </li>
                                <li>
                                    <Dropdown.Item href="#!" className=" d-flex align-items-center" >
                                        <span className="avatar avatar-xs lh-1 me-2">
                                            <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/flags/italy_flag.jpg`} alt="img" />
                                        </span>
                                        Italian
                                    </Dropdown.Item>
                                </li>
                                <li>
                                    <Dropdown.Item href="#!" className="d-flex align-items-center" >
                                        <span className="avatar avatar-xs lh-1 me-2">
                                            <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/flags/russia_flag.jpg`} alt="img" />
                                        </span>
                                        Russian
                                    </Dropdown.Item>
                                </li>
                            </Dropdown.Menu>
                        </Dropdown> */}
                        <div className="header-element header-theme-mode">
                            <Link href="#!" className="header-link layout-setting" onClick={() => ToggleDark()}>
                                <span className="light-layout">
                                    <i className="bx bx-moon header-link-icon"></i>
                                </span>
                                <span className="dark-layout">
                                    <i className="bx bx-sun header-link-icon"></i>
                                </span>
                            </Link>
                        </div>
                        {/* <Dropdown className="header-element cart-dropdown" autoClose="outside">
                            <Dropdown.Toggle as='a' className="header-link no-caret" data-bs-auto-close="outside" data-bs-toggle="dropdown">
                                <i className="bx bx-cart header-link-icon"></i>
                                <Badge bg=" bg-primary rounded-pill header-icon-badge" id="cart-icon-badge">{cartItemCount}</Badge>
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end" className="main-header-dropdown dropdown-menu dropdown-menu-end" data-popper-placement="none">
                                <div className="p-3">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <p className="mb-0 fs-17 fw-semibold">Cart Items</p>
                                        <span className="badge bg-success-transparent" id="cart-data"> {cartItemCount} Item{cartItemCount !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>
                                <div>
                                    <hr className="dropdown-divider" />
                                </div>
                                <ul className="list-unstyled mb-0" id="header-cart-items-scroll">
                                    {cartItems.map((idx) => (
                                        <Dropdown.Item as='li' key={Math.random()} >
                                            <div className="d-flex align-items-start cart-dropdown-item">
                                                <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}${idx.src}`} alt="img" className="avatar avatar-sm avatar-rounded br-5 me-3" />
                                                <div className="flex-grow-1">
                                                    <div className="d-flex align-items-start justify-content-between mb-0">
                                                        <div className="mb-0 fs-13 text-dark fw-semibold">
                                                            <Link href="#!">{idx.text1}</Link>
                                                        </div>
                                                        <div>
                                                            <span className="text-black mb-1">{idx.text2}</span>
                                                            <Link href="#!" className="header-cart-remove float-end dropdown-item-close"><i className="ti ti-trash" onClick={() => handleRemove(idx.id)}></i></Link>
                                                        </div>
                                                    </div>
                                                    <div className="min-w-fit-content d-flex align-items-start justify-content-between">
                                                        <ul className="header-product-item d-flex">
                                                            <li>{idx.text3}</li>
                                                            <li>{idx.text4}</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </Dropdown.Item>
                                    ))}
                                </ul>
                                <div className={`p-3 empty-header-item border-top ${cartItemCount === 0 ? 'd-none' : 'd-block'}`}>
                                    <div className="d-grid">
                                        <Link href="#!" className="btn btn-primary">Proceed to checkout</Link>
                                    </div>
                                </div>
                                <div className={`p-5 empty-item ${cartItemCount === 0 ? 'd-block' : 'd-none'}`}>
                                    <div className="text-center">
                                        <span className="avatar avatar-xl avatar-rounded bg-warning-transparent">
                                            <i className="ri-shopping-cart-2-line fs-2"></i>
                                        </span>
                                        <h6 className="fw-bold mb-1 mt-3">Your Cart is Empty</h6>
                                        <span className="mb-3 fw-normal fs-13 d-block">Add some items to make me happy :)</span>
                                        <Link href="#!" className="btn btn-primary btn-wave btn-sm m-1" data-abc="true">continue shopping <i className="bi bi-arrow-right ms-1"></i></Link>
                                    </div>
                                </div>
                            </Dropdown.Menu>
                        </Dropdown> */}

                        {/* <Dropdown className="header-element notifications-dropdown" autoClose="outside">
                            <Dropdown.Toggle as="a" variant='' className="header-link dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside" id="messageDropdown" aria-expanded="false">
                                <i className="bx bx-bell header-link-icon"></i>
                                <span className="badge bg-secondary rounded-pill header-icon-badge pulse pulse-secondary" id="notification-icon-badge">
                                    {notifications.length}</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end" className="main-header-dropdown dropdown-menu dropdown-menu-end" data-popper-placement="none">
                                <div className="p-3">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <p className="mb-0 fs-17 fw-semibold">Notifications</p>
                                        <span className="badge bg-secondary-transparent" id="notifiation-data">{`${notifications.length} Unread`}</span>
                                    </div>
                                </div>
                                <Dropdown.Divider className="dropdown-divider"></Dropdown.Divider>
                                <ul className="list-unstyled mb-0" id="header-notification-scroll">
                                    {notifications.map((notification, index) => (
                                        <Dropdown.Item as="li" className="dropdown-item" key={index}>
                                            <div className="d-flex align-items-start">
                                                <div className="pe-2">
                                                    <span className={`avatar avatar-md bg-${notification.color1} avatar-rounded`}>
                                                        <i className={`ti ${notification.icon} fs-18`}></i>
                                                    </span>
                                                </div>
                                                <div className="flex-grow-1 d-flex align-items-center justify-content-between text-wrap">
                                                    <div>
                                                        <p className="mb-0 fw-semibold">
                                                            <Link href="#!">{notification.text1}</Link>
                                                            <span className={notification.class}>{notification.class1}</span>
                                                        </p>
                                                        <span className="text-muted fw-normal fs-12 header-notification-text">
                                                            {notification.text2}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href="#!"
                                                            className="min-w-fit-content text-muted me-1 dropdown-item-close1"
                                                            onClick={() => handleNotificationClose(index)}
                                                        >
                                                            <i className="ti ti-x fs-16"></i>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </Dropdown.Item>
                                    ))}
                                </ul>
                                <div className={`p-3 empty-header-item1 border-top ${notifications.length === 0 ? 'd-none' : 'd-block'}`}>
                                    <div className="d-grid">
                                        <Link href="#!" className="btn btn-primary">View All</Link>
                                    </div>
                                </div>
                                <div className={`p-5 empty-item1 ${notifications.length === 0 ? 'd-block' : 'd-none'}`}>
                                    <div className="text-center">
                                        <span className="avatar avatar-xl avatar-rounded bg-secondary-transparent">
                                            <i className="ri-notification-off-line fs-2"></i>
                                        </span>
                                        <h6 className="fw-semibold mt-3">No New Notifications</h6>
                                    </div>
                                </div>
                            </Dropdown.Menu>
                        </Dropdown> */}
                        {/* <Dropdown className="header-element header-shortcuts-dropdown">
                            <Dropdown.Toggle as='a' className="header-link no-caret" data-bs-toggle="dropdown" data-bs-auto-close="outside" id="notificationDropdown" aria-expanded="false">
                                <i className="bx bx-grid-alt header-link-icon"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="main-header-dropdown header-shortcuts-dropdown pb-0 dropdown-menu-end" aria-labelledby="notificationDropdown">
                                <div className="p-3">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <p className="mb-0 fs-17 fw-semibold">Related Apps</p>
                                    </div>
                                </div>
                                <div className="dropdown-divider mb-0"></div>
                                <div className="main-header-shortcuts p-2" id="header-shortcut-scroll">
                                    <div className="row g-2">
                                        <div className="col-4">
                                            <Link href="#!">
                                                <div className="text-center p-3 related-app">
                                                    <span className="avatar avatar-sm avatar-rounded">
                                                        <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/apps/figma.png`} alt="" />
                                                    </span>
                                                    <span className="d-block fs-12">Figma</span>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="col-4">
                                            <Link href="#!">
                                                <div className="text-center p-3 related-app">
                                                    <span className="avatar avatar-sm avatar-rounded">
                                                        <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/apps/microsoft-powerpoint.png`} alt="" />
                                                    </span>
                                                    <span className="d-block fs-12">Power Point</span>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="col-4">
                                            <Link href="#!">
                                                <div className="text-center p-3 related-app">
                                                    <span className="avatar avatar-sm avatar-rounded">
                                                        <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/apps/microsoft-word.png`} alt="" />
                                                    </span>
                                                    <span className="d-block fs-12">MS Word</span>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="col-4">
                                            <Link href="#!">
                                                <div className="text-center p-3 related-app">
                                                    <span className="avatar avatar-sm avatar-rounded">
                                                        <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/apps/calender.png`} alt="" />
                                                    </span>
                                                    <span className="d-block fs-12">Calendar</span>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="col-4">
                                            <Link href="#!">
                                                <div className="text-center p-3 related-app">
                                                    <span className="avatar avatar-sm avatar-rounded">
                                                        <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/apps/sketch.png`} alt="" />
                                                    </span>
                                                    <span className="d-block fs-12">Sketch</span>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="col-4">
                                            <Link href="#!">
                                                <div className="text-center p-3 related-app">
                                                    <span className="avatar avatar-sm avatar-rounded">
                                                        <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/apps/google-docs.png`} alt="" />
                                                    </span>
                                                    <span className="d-block fs-12">Docs</span>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="col-4">
                                            <Link href="#!">
                                                <div className="text-center p-3 related-app">
                                                    <span className="avatar avatar-sm avatar-rounded">
                                                        <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/apps/google.png`} alt="" />
                                                    </span>
                                                    <span className="d-block fs-12">Google</span>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="col-4">
                                            <Link href="#!">
                                                <div className="text-center p-3 related-app">
                                                    <span className="avatar avatar-sm avatar-rounded">
                                                        <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/apps/translate.png`} alt="" />
                                                    </span>
                                                    <span className="d-block fs-12">Translate</span>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="col-4">
                                            <Link href="#!">
                                                <div className="text-center p-3 related-app">
                                                    <span className="avatar avatar-sm avatar-rounded">
                                                        <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/apps/google-sheets.png`} alt="" />
                                                    </span>
                                                    <span className="d-block fs-12">Sheets</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 border-top">
                                    <div className="d-grid">
                                        <Link href="#!" className="btn btn-primary">View All</Link>
                                    </div>
                                </div>
                            </Dropdown.Menu>
                        </Dropdown> */}
                        {/* <div className="header-element header-fullscreen">
                            <Link onClick={toggleFullscreen} href="#!" className="header-link">
                                {isFullscreen ? (
                                    <i className="bx bx-exit-fullscreen full-screen-close header-link-icon"></i>
                                ) : (
                                    <i className="bx bx-fullscreen full-screen-open header-link-icon"></i>
                                )}
                            </Link>
                        </div> */}
                        <Dropdown className="header-element profile-dropdown">
                            <Dropdown.Toggle as='a' className="header-link no-caret" id="mainHeaderProfile" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                <div className="d-flex align-items-center">
                                    <div className="me-sm-2 me-0">

                                        <img src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/faces/9.jpg`} alt="img" width="32" height="32" className="rounded-circle" />
                                    </div>
                                    <div className="d-sm-block d-none">
                                        <p className="fw-semibold mb-0 lh-1" id='userName'>Json Taylor</p>
                                        <span className="op-7 fw-normal d-block fs-11">Web Designer</span>
                                    </div>
                                </div>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="main-header-dropdown pt-0 overflow-hidden header-profile-dropdown dropdown-menu-end" aria-labelledby="mainHeaderProfile">
                                <Dropdown.Item><Link className=" d-flex" href="#!"><i className="ti ti-user-circle fs-18 me-2 op-7"></i>Profile</Link></Dropdown.Item>
                                {/* <Dropdown.Item><Link className="d-flex" href="#!"><i className="ti ti-inbox fs-18 me-2 op-7"></i>Inbox <span className="badge bg-success-transparent ms-auto">25</span></Link></Dropdown.Item> */}
                                <Dropdown.Item><Link className="d-flex border-block-end" href="#!"><i className="ti ti-clipboard-check fs-18 me-2 op-7"></i>Task Manager</Link></Dropdown.Item>
                                {/* <Dropdown.Item><Link className="d-flex" href="#!"><i className="ti ti-adjustments-horizontal fs-18 me-2 op-7"></i>Settings</Link></Dropdown.Item> */}
                                {/* <Dropdown.Item><Link className=" d-flex border-block-end" href="#!"><i className="ti ti-wallet fs-18 me-2 op-7"></i>Bal: $7,12,950</Link></Dropdown.Item> */}
                                {/* <Dropdown.Item><Link className="d-flex" href="#!"><i className="ti ti-headset fs-18 me-2 op-7"></i>Support</Link></Dropdown.Item> */}
                                <Dropdown.Item><Link className="d-flex" href="#!"><i className="ti ti-logout fs-18 me-2 op-7"></i>Log Out</Link></Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <div className="header-element">
                            <Link href="#!" className="header-link switcher-icon" data-bs-toggle="offcanvas" data-bs-target="#switcher-canvas" onClick={() => Switchericon()}>
                                <i className="bx bx-cog header-link-icon"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
            <Modal className="modal fade" id="searchModal" tabIndex="-1" aria-labelledby="searchModal" aria-hidden="true" show={show} onHide={handleClose}>
                <Modal.Body>
                    <div className="input-group">
                        <Link href="#!" className="input-group-text" id="Search-Grid"><i className="fe fe-search header-link-icon fs-18"></i></Link>
                        <Form.Control type="search" className="form-control border-0 px-2" placeholder="Search" aria-label="Username" defaultValue={InputValue}
                            autoComplete="off" onChange={(ele => { myfunction(ele.target.value); setInputValue(ele.target.value); })} />
                        <Link href="#!" className="input-group-text" id="voice-search"><i className="fe fe-mic header-link-icon"></i></Link>
                        <Dropdown>
                            <Dropdown.Toggle as='a' className="btn btn-light btn-icon no-caret rounded-0" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="fe fe-more-vertical"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu as="ul">
                                <Dropdown.Item as="li" href="#!">Action</Dropdown.Item>
                                <Dropdown.Item as="li" href="#!">Another action</Dropdown.Item>
                                <Dropdown.Item as="li" href="#!">Something else here</Dropdown.Item>
                                <Dropdown.Divider as="li"><hr className="dropdown-divider" /></Dropdown.Divider>
                                <Dropdown.Item as="li" href="#!">Separated link</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    {show1 ?
                        <Card className=" search-result position-relative z-index-9 search-fix  border mt-1 w-100">
                            <Card.Header className='border-bottom'>
                                <div className="me-2 text-break card-title mb-0">Search result of {InputValue}</div>
                            </Card.Header>
                            <ListGroup className='p-3'>
                                {show2 ?
                                    NavData.map((e) =>
                                        <ListGroup.Item key={Math.random()} className="">
                                            <Link href={`${e.path}/`} className='search-result-item' onClick={() => { setShow1(false), setInputValue(""); }}>{e.title}</Link>
                                        </ListGroup.Item>
                                    )
                                    : <b className={`px-3 ${searchcolor} `}>{searchval}</b>}
                            </ListGroup>

                        </Card>
                        : ""}
                    <div className="mt-4">
                        <p className="font-weight-semibold text-muted mb-2">Are You Looking For...</p>
                        <span className="search-tags"><i className="fe fe-user me-2"></i>People<Link href="#!" className="tag-addon"><i className="fe fe-x"></i></Link></span>
                        <span className="search-tags"><i className="fe fe-file-text me-2"></i>Pages<Link href="#!" className="tag-addon"><i className="fe fe-x"></i></Link></span>
                        <span className="search-tags"><i className="fe fe-align-left me-2"></i>Articles<Link href="#!" className="tag-addon"><i className="fe fe-x"></i></Link></span>
                        <span className="search-tags"><i className="fe fe-server me-2"></i>Tags<Link href="#!" className="tag-addon"><i className="fe fe-x"></i></Link></span>
                    </div>
                    <div className="my-4">
                        <p className="font-weight-semibold text-muted mb-2">Recent Search :</p>
                        <Alert variant='' className="p-2 border br-5 d-flex align-items-center text-muted mb-2 alert" show={showa1}>
                            <Link href="#!"><span>Notifications</span></Link>
                            <Link className="ms-auto lh-1" href="#!" data-bs-dismiss="alert" aria-label="Close" onClick={toggleShowa1}>
                                <i className="fe fe-x text-muted"></i></Link>
                        </Alert>
                        <Alert variant='' className="p-2 border br-5 d-flex align-items-center text-muted mb-2 alert" show={showa2}>
                            <Link href="#!"><span>Alerts</span></Link>
                            <Link className="ms-auto lh-1" href="#!" data-bs-dismiss="alert" aria-label="Close" onClick={toggleShowa2}><i className="fe fe-x text-muted"></i></Link>
                        </Alert>
                        <Alert variant='' className="p-2 border br-5 d-flex align-items-center text-muted mb-0 alert" show={showa3}>
                            <Link href="#!"><span>Mail</span></Link>
                            <Link className="ms-auto lh-1" href="#!" data-bs-dismiss="alert" aria-label="Close" onClick={toggleShowa3}><i className="fe fe-x text-muted"></i></Link>
                        </Alert>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <ButtonGroup className="btn-group ms-auto">
                        <Button variant='primary-light' className="btn btn-sm btn-primary-light">Search</Button>
                        <Button variant='primary' className="btn btn-sm btn-primary">Clear Recents</Button>
                    </ButtonGroup>
                </Modal.Footer>
            </Modal>
        </>
    )
}

const mapStateToProps = (state) => ({
    local_varaiable: state
});
export default connect(mapStateToProps, { ThemeChanger })(Header);
