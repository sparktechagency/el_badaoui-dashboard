import randomImg from "../../../assets/randomProfile2.jpg";
import salongoLogo from "../../../assets/salon-go-logo.png";

// Dummy data for Professionals Component

const Professionals = () => {
  // Simulate loading state
  const dummyProfessionalsData = {
    data: [
      {
        name: "Professional One",
        conversionRate: 85,
        profileImg: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      {
        name: "Professional Two",
        conversionRate: 78,
        profileImg: "https://randomuser.me/api/portraits/men/2.jpg",
      },
      {
        name: "Professional Three",
        conversionRate: 92,
        profileImg: "https://randomuser.me/api/portraits/women/3.jpg",
      },
      {
        name: "Professional Four",
        conversionRate: 65,
        profileImg: "https://randomuser.me/api/portraits/men/4.jpg",
      },
      {
        name: "Professional Five",
        conversionRate: 73,
        profileImg: "https://randomuser.me/api/portraits/women/5.jpg",
      },
      {
        name: "Professional Six",
        conversionRate: 80,
        profileImg: "https://randomuser.me/api/portraits/men/6.jpg",
      },
    ],
  };
  const isLoading = false;
  const professionalsData = dummyProfessionalsData;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <img src={salongoLogo} alt="" />
      </div>
    );
  }

  const professionals = professionalsData?.data;

  const topProfessionals = [...(professionals || [])]
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .slice(0, 5);

  return (
    <div className="md:w-[60%] border h-[290px] bg-white rounded-2xl pb-5 md:flex flex-col justify-center">
      <p className="text-base font-semibold px-10 py-4">Professionals</p>
      <div className="md:flex flex-col px-10 gap-4">
        {topProfessionals?.map((value, index) => (
          <div key={index} className="flex items-center gap-4">
            <img
              className="w-7 h-7 rounded-full"
              src={value?.profileImg || randomImg}
              alt={value?.name}
            />

            <h1 className="text-sm font-medium w-32 truncate">{value?.name}</h1>

            <div className="flex items-center flex-1">
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${value.conversionRate}%` }}
                ></div>
              </div>
            </div>

            <p className="text-sm font-medium">{value?.conversionRate}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Professionals;