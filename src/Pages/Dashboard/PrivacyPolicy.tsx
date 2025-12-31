import { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import Title from "../../components/common/Title";
import rentMeLogo from "../../assets/navLogo.png";
import { toast } from "react-hot-toast";
import { usePrivacyPolicyQuery, useUpdatePricyPolicyMutation } from "@/redux/apiSlices/privacyPolicySlice";



const PrivacyPolicy = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const {
    data: privacyPolicy,
    isLoading,
    refetch,
  } = usePrivacyPolicyQuery(null);

  const [updatePrivacyPolicy] = useUpdatePricyPolicyMutation();

  const privacyPolicyData = privacyPolicy?.content;
        

  useEffect(() => {
    if (privacyPolicyData) {
      setContent(privacyPolicyData);
    }
  }, [privacyPolicyData]);

  const privacyPolicyDataSave = async () => {
    const data = {
      type: "privacy-policy",
      content,
    };

    try {
      const res = await updatePrivacyPolicy(data).unwrap();
      if (res.success) {
        toast.success("Privacy Policy updated successfully"); 
        refetch();
      } else {
        toast.error("Something went wrong");
      }
    } catch {
      toast.error("Update failed");
    }
  };

  // ✅ Loading UI AFTER hooks
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <img src={rentMeLogo} alt="" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white">
      <Title className="mb-4">Privacy Policy</Title>

      <JoditEditor
        ref={editor}
        value={content}
        onChange={(newContent) => setContent(newContent)}
      />

      <div className="flex items-center justify-center mt-5">
        <button
          onClick={privacyPolicyDataSave} 
          type="submit"
          className="bg-primary text-white w-[160px] h-[42px] rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>
  );
};


export default PrivacyPolicy;
