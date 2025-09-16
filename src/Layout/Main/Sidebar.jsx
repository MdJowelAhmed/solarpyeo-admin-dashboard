import { Menu, Modal, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import {
  Dashboard,
  Sales,
  People,
  PromotionManagement,
  Revenue,
  SubscriptionManagement,
  loginCredentials,
  Settings,
} from "../../components/common/Svg";
import image4 from "../../assets/image4.png";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const path = location.pathname;
  const [selectedKey, setSelectedKey] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [logo, setLogo] = useState(image4); // state for logo
  const navigate = useNavigate();
  const [sidebarWidth, setSidebarWidth] = useState(collapsed ? 80 : 310);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSidebarWidth(collapsed ? 60 : 200);
      else if (window.innerWidth < 1024) setSidebarWidth(collapsed ? 70 : 250);
      else setSidebarWidth(collapsed ? 80 : 310);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [collapsed]);

  const showLogoutConfirm = () => setIsLogoutModalOpen(true);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogoutModalOpen(false);
    navigate("/auth/login");
  };
  const handleCancel = () => setIsLogoutModalOpen(false);

  // Logo upload handler
  // Logo upload handler
  const handleLogoUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
      return Upload.LIST_IGNORE; // Prevent non-JPG/PNG files
    }

    const reader = new FileReader();
    reader.onload = (e) => setLogo(e.target.result);
    reader.readAsDataURL(file);

    return false; // Prevent auto-upload
  };

  <Upload beforeUpload={handleLogoUpload} showUploadList={false}>
    <Button size="small" icon={<UploadOutlined />} className="mt-2">
      Upload Logo
    </Button>
  </Upload>;

  const isItemActive = (itemKey) =>
    selectedKey === itemKey ||
    (itemKey === "subMenuSetting" &&
      ["/profile", "/terms-and-conditions", "/privacy-policy"].includes(
        selectedKey
      ));

  const renderIcon = (IconComponent, itemKey) => {
    const isActive = isItemActive(itemKey);
    return (
      <div
        style={{ width: 20, height: 20 }}
        className={isActive ? "svg-active" : ""}
      >
        <IconComponent
          className="menu-icon"
          fill={isActive ? "#ffffff" : "#1E1E1E"}
        />
      </div>
    );
  };

  const menuItems = [
    {
      key: "/",
      icon: renderIcon(Dashboard, "/"),
      label: <Link to="/">{collapsed ? "" : "Dashboard Overview"}</Link>,
    },
    {
      key: "/submissionManagement",
      icon: renderIcon(SubscriptionManagement, "/submissionManagement"),
      label: (
        <Link to="/submissionManagement">
          {collapsed ? "" : "Submission"}
        </Link>
      ),
    },
    {
      key: "/reportingAnalytics",
      icon: renderIcon(Revenue, "/reportingAnalytics"),
      label: (
        <Link to="/reportingAnalytics">
          {collapsed ? "" : "Reporting & Analytics"}
        </Link>
      ),
    },
    {
      key: "/totalEarnings",
      icon: renderIcon(Revenue, "/totalEarnings"),
      label: (
        <Link to="/totalEarnings">{collapsed ? "" : "Total Earnings"}</Link>
      ),
    },

    // {
    //   key: "/sellManagement",
    //   icon: renderIcon(Sales, "/sellManagement"),
    //   label: (
    //     <Link to="/sellManagement">{collapsed ? "" : "Sell Management"}</Link>
    //   ),
    // },
    // {
    //   key: "/loyaltyProgram",
    //   icon: renderIcon(People, "/loyaltyProgram"),
    //   label: (
    //     <Link to="/loyaltyProgram">{collapsed ? "" : "Loyalty Program"}</Link>
    //   ),
    // },
    // {
    //   key: "/customerManagement",
    //   icon: renderIcon(People, "/customerManagement"),
    //   label: (
    //     <Link to="/customerManagement">
    //       {collapsed ? "" : "Customer Management"}
    //     </Link>
    //   ),
    // },
    // {
    //   key: "/promotionManagement",
    //   icon: renderIcon(PromotionManagement, "/promotionManagement"),
    //   label: (
    //     <Link to="/promotionManagement">
    //       {collapsed ? "" : "Promotions & Discounts"}
    //     </Link>
    //   ),
    // },

    {
      key: "/userManagement",
      icon: renderIcon(loginCredentials, "/userManagement"),
      label: (
        <Link to="/userManagement">{collapsed ? "" : "User Management"}</Link>
      ),
    },
    {
      key: "subMenuSetting",
      icon: renderIcon(Settings, "subMenuSetting"),
      label: collapsed ? "" : "Settings",
      children: [
        {
          key: "/profile",
          label: <Link to="/profile">{collapsed ? "" : "Update Profile"}</Link>,
        },
        // {
        //   key: "/userManagement",
        //   label: (
        //     <Link to="/userManagement">
        //       {collapsed ? "" : "User Management"}
        //     </Link>
        //   ),
        // },
        {
          key: "/terms-and-conditions",
          label: (
            <Link to="/terms-and-conditions">
              {collapsed ? "" : "Terms And Conditions"}
            </Link>
          ),
        },
        {
          key: "/privacy-policy",
          label: (
            <Link to="/privacy-policy">
              {collapsed ? "" : "Privacy Policy"}
            </Link>
          ),
        },
      ],
    },
    {
      key: "/logout",
      icon: <IoIosLogOut size={24} />,
      label: <p onClick={showLogoutConfirm}>{collapsed ? "" : "Logout"}</p>,
    },
  ];

  useEffect(() => {
    const selectedItem = menuItems.find(
      (item) =>
        item.key === path || item.children?.some((sub) => sub.key === path)
    );
    if (selectedItem) {
      setSelectedKey(path);
      if (selectedItem.children) setOpenKeys([selectedItem.key]);
      else {
        const parentItem = menuItems.find((item) =>
          item.children?.some((sub) => sub.key === path)
        );
        if (parentItem) setOpenKeys([parentItem.key]);
      }
    }
  }, [path]);

  const handleOpenChange = (keys) => setOpenKeys(keys);

  return (
    <div
      className="h-full flex flex-col bg-white border-r border-primary transition-all duration-300"
    style={{ width: collapsed ? 80 : 320 }}
    >
      {/* Toggle Button */}
      {/* <div
        className="flex justify-end items-center p-2 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <MenuUnfoldOutlined style={{ fontSize: 20 }} />
        ) : (
          <MenuFoldOutlined style={{ fontSize: 20 }} />
        )}
      </div> */}

      {/* Logo + Upload */}
      {!collapsed && (
        <div className="flex ml-6 py-4">
          <Link to={"/"}>
            <img src={logo} alt="logo" className="w-32 h-32 object-contain" />
          </Link>
          {/* <Upload beforeUpload={handleLogoUpload} showUploadList={false}>
            <Button size="small" icon={<UploadOutlined />} className="mt-2">
              Upload Logo
            </Button>
          </Upload> */}
        </div>
      )}

      {/* Menu */}
      <div className="flex-1 overflow-y-auto">
        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          className="font-poppins text-black border-none"
          items={menuItems.map((item) => ({
            ...item,
            children: item.children
              ? item.children.map((subItem) => ({ ...subItem }))
              : undefined,
          }))}
        />
      </div>

      {/* Logout Modal */}
      <Modal
        centered
        title="Confirm Logout"
        open={isLogoutModalOpen}
        onOk={handleLogout}
        onCancel={handleCancel}
        okText="Logout"
        cancelText="Cancel"
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </div>
  );
};

export default Sidebar;
