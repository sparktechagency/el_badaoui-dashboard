import { createBrowserRouter } from "react-router-dom";
import Auth from "../Layout/Auth/Auth";
import Main from "../Layout/Main/Main";
import Home from "../Pages/Dashboard/Home";
import Users from "../Pages/Dashboard/Users";
import PrivacyPolicy from "../Pages/Dashboard/PrivacyPolicy";
import ChangePassword from "../Pages/Auth/ChangePassword";
import Login from "../Pages/Auth/Login";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import ResetPassword from "../Pages/Auth/ResetPassword";
import NotFound from "../NotFound";
import Notifications from "../Pages/Dashboard/Notifications";
import User from "../Pages/Dashboard/User";
import UserProfile from "../Pages/Dashboard/AdminProfile/UserProfile";
import TermsAndCondition from "../Pages/Dashboard/TermsAndCondition";
import Faq from "../Pages/Dashboard/Faq";
import AboutUs from "../components/ui/Settings/AboutUs";
import OfferList from "../components/ui/Settings/OfferList";
import ProjectManagement from "@/Pages/Dashboard/ProjectManagement";
import ProjectManagementDetails from "@/Pages/Dashboard/ProjectManagementDetails";
import Categories from "@/Pages/Dashboard/serviceManagement/Categories";
import Subcategories from "@/Pages/Dashboard/serviceManagement/Subcategories";
import AppointmentManagement from "@/Pages/Dashboard/AppointmentManagement";
import OurProjectsManagement from "@/Pages/Dashboard/OurProjectsManagement";
import AvailableTime from "@/components/ui/Settings/AvailableTime";

const router = createBrowserRouter([
  {
    path: "/",
    // element: <ProtectedRoute><Main /></ProtectedRoute> ,
    element: (
      // <PrivateRoute>
      <Main />
      // </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/project-management",
        element: <ProjectManagement />,
      },
      {
        path: "/project-management/:id",
        element: <ProjectManagementDetails />,
      },
      {
        path: "/service-management/categories",
        element: <Categories />,
      },
      {
        path: "/service-management/subcategories",
        element: <Subcategories />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/appointment",
        element: <AppointmentManagement />,
      },
      {
        path: "/our-projects",
        element: <OurProjectsManagement />,
      },
      {
        path: "/user/:id",
        element: <User />,
      },
      {
        path: "/personal-information",
        element: <UserProfile />,
      },
      {
        path: "/change-password",
        element: <ChangePassword />,
      },

      {
        path: "f-a-q",
        element: <Faq />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },
      {
        path: "offer-list",
        element: <OfferList />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-and-condition",
        element: <TermsAndCondition />,
      },
      {
        path:"/available-time",
        element:<AvailableTime/>
      },
      // {
      //   path: "/edit-terms-and-conditions",
      //   element: <TermsAndCondition />,
      // },
      // {
      //   path: "/press",
      //   element: <Press />,
      // },

      {
        path: "/change-password",
        element: <ChangePassword />,
      },

      {
        path: "/profile",
        element: <UserProfile />,
      },
      {
        path: "/notification",
        element: <Notifications />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "/auth",
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
