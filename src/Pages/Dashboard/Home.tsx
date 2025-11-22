import GeneralStateSection from "@/components/ui/Home/GeneralStateSection";
import EstimateAnalytics from "@/components/ui/Home/EstimateAnalytics";
import ProjectStatus from "@/components/ui/Home/ProjectStatus";
import RecentActiveProject from "@/components/ui/Home/RecentActiveProject";

const Home = () => {
  return (
    <div className="">
      <GeneralStateSection />
      <div className="flex w-full gap-4 my-4">
        <div className="w-[70%]">
          <EstimateAnalytics />
        </div>
        <div className="w-[30%]">
          <ProjectStatus />
        </div>
      </div>
      <RecentActiveProject />
    </div>
  );
};

export default Home;
