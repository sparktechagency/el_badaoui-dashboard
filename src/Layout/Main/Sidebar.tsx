import { Menu } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { IoCalendar, IoSettingsOutline } from "react-icons/io5";
import { AiFillProject } from "react-icons/ai";
import Cookies from "js-cookie";
import logo from "../../assets/logo.png";
import { FaUsers } from "react-icons/fa6";
import { RiDashboardHorizontalFill,  RiProjectorLine } from "react-icons/ri";
import { BiSolidCategory } from "react-icons/bi";

interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  children?: MenuItem[];
}

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleLogout = (): void => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("refreshToken");
    Cookies.remove("refreshToken");
    navigate("/auth/login");
  };

  const menuItems: MenuItem[] = [
    {
      key: "/",
      icon: <RiDashboardHorizontalFill size={24} />,
      label: (
        <Link to="/" className="">
          Dashboard
        </Link>
      ),
    },
    {
      key: "/project-management",
      icon: <AiFillProject size={24} />,
      label: <Link to="/project-management">Project</Link>,
    },
    {
      key: "service-management",
      icon: <BiSolidCategory size={24} />,
      label: "Service",
      children: [
        {
          key: "/service-management/categories",
          label: (
            <Link
              to="/service-management/categories"
              className="text-white hover:text-white"
            >
              Categories
            </Link>
          ),
        },
        {
          key: "/service-management/subcategories",
          label: (
            <Link
              to="/service-management/subcategories"
              className="text-white hover:text-white"
            >
              Subcategories
            </Link>
          ),
        },
      ],
    },

    {
      key: "/appointment",
      icon: <IoCalendar size={24} />,
      label: <Link to="/appointment">Appointment</Link>,
    },
    {
      key: "/our-projects",
      icon: <RiProjectorLine size={24} />,
      label: <Link to="/our-projects">Our Projects</Link>,
    },
    {
      key: "/users",
      icon: <FaUsers size={24} />,
      label: <Link to="/users">Users</Link>,
    },
    {
      key: "subMenuSetting",
      icon: <IoSettingsOutline size={24} />,
      label: "Settings",
      children: [
        {
          key: "/personal-information",
          label: (
            <Link
              to="/personal-information"
              className="text-white hover:text-white"
            >
              Personal Info
            </Link>
          ),
        },
        {
          key: "/change-password",
          label: (
            <Link to="/change-password" className="text-white hover:text-white">
              Change Password
            </Link>
          ),
        },

        // {
        //   key: "/about-us",
        //   label: (
        //     <Link to="/about-us" className="text-white hover:text-white">
        //       About Us
        //     </Link>
        //   ),
        // },
        {
          key: "/terms-and-condition",
          label: (
            <Link
              to="/terms-and-condition"
              className="text-white hover:text-white"
            >
              Terms & Conditions
            </Link>
          ),
        },
        {
          key: "/privacy-policy",
          label: (
            <Link to="/privacy-policy" className="text-white hover:text-white">
              Privacy Policy
            </Link>
          ),
        },
        {
          key: "/available-time",
          label: (
            <Link to="/available-time" className="text-white hover:text-white">
            Available Time
            </Link>
          ),
        },
      ],
    },
    {
      key: "/logout",
      icon: <IoIosLogOut size={24} />,
      label: <p onClick={handleLogout}>Logout</p>,
    },
  ];

  useEffect(() => {
    const selectedItem = menuItems.find(
      (item) =>
        item.key === path || item.children?.some((sub) => sub.key === path)
    );

    if (selectedItem) {
      setSelectedKey(path);

      if (selectedItem.children) {
        setOpenKeys([selectedItem.key]);
      } else {
        const parentItem = menuItems.find((item) =>
          item.children?.some((sub) => sub.key === path)
        );
        if (parentItem) {
          setOpenKeys([parentItem.key]);
        }
      }
    }
  }, [path]);

  const handleOpenChange = (keys: string[]): void => {
    setOpenKeys(keys);
  };

  return (
    <div className="mt-5 overflow-y-scroll">
      <div className="px-10">
        <Link
          to={"/"}
          className="mb-10 flex items-center flex-col gap-2 justify-center py-4"
        >
          <img src={logo} alt="" />
        </Link>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        style={{ borderRightColor: "transparent", background: "transparent" }}
        items={menuItems}
      />
    </div>
  );
};

export default Sidebar;
