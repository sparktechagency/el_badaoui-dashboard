
import logo from "../../assets/randomProfile2.jpg";
import { useFetchAdminProfileQuery } from "../../redux/apiSlices/authSlice";
import LanguageSelector from "../../components/common/LanguageSelector";

interface UserData {
  firstName?: string;
  lastName?: string;
  role?: string;
  image?: string;
}

interface AdminProfileResponse {
  data?: UserData;
}

const Header = () => {
  const { data: userData, isLoading } = useFetchAdminProfileQuery() as {
    data?: AdminProfileResponse;
    isLoading: boolean;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-20 text-lg text-secondary">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center gap-5 justify-end">
      {/* <Link to="/notification" className="h-fit mt-[10px]">
        <Badge count={5}>
          <FaRegBell color="#4E4E4E" size={24} />
        </Badge>
      </Link> */}

      <LanguageSelector />

      <div className="flex gap-2 items-center justify-center border-4 p-1 rounded-full">
        <img
          style={{
            clipPath: "circle()",
            width: 45,
            height: 45,
          }}
          src={
            userData?.data?.image
              ? `${import.meta.env.VITE_API_BASE_URL || ""}${
                  userData?.data?.image
                }`
              : logo
          }
          alt="person-male--v2"
          className="clip"
        />
        <div className="flex pr-2 flex-col">
          <p className="text-xl">
            {userData?.data?.firstName + " " + userData?.data?.lastName ||
              "Unknown Admin"}
          </p>
          {/* <p className="text-sm text-gray-500">{userData?.data?.role}</p> */}
        </div>
      </div>
    </div>
  );
};

export default Header;
