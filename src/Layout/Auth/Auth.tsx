import { Outlet } from "react-router-dom";
import leftImage from "../../assets/LoginPageLeftSideImage.png";
import rightBg from "../../assets/loginPageRightSideBg.png";
import logo from "../../assets/loginLogo.png";
import GoogleTranslate from "../../components/Shared/GoogleTranslate";
import LanguageSelector from "../../components/common/LanguageSelector";

const Auth = () => {
  return (
    <>
      <GoogleTranslate />
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center justify-center bg-white p-6">
          <img
            src={leftImage}
            alt="illustration"
            className="max-w-[520px] w-full h-auto"
          />
        </div>
        <div className="relative">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${rightBg}')`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 h-full flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl border border-white/30 bg-white/20 backdrop-blur-md shadow-2xl p-6">
              <div className="flex flex-col items-center gap-2 mb-6">
                <div className="absolute top-4 right-4">
                  <LanguageSelector />
                </div>
                <img src={logo} alt="logo" className="h-40" />
              </div>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
