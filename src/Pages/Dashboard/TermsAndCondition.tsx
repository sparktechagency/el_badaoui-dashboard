import { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import Title from "../../components/common/Title";
import rentMeLogo from "../../assets/logo.png";
import { toast } from "react-hot-toast";
import {
  useTermsAndConditionQuery,
  useUpdateTermsAndConditionsMutation,
} from "@/redux/apiSlices/termsAndConditionSlice";

const TermsAndCondition = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const {
    data: termsAndCondition,
    isLoading,
    refetch,
  } = useTermsAndConditionQuery(null);

  const [updateTermsAndConditions] = useUpdateTermsAndConditionsMutation();

  const termsAndConditionData = termsAndCondition?.content;

  // ✅ useEffect ALWAYS declared
  useEffect(() => {
    if (termsAndConditionData) {
      setContent(termsAndConditionData);
    }
  }, [termsAndConditionData]);

  const termsDataSave = async () => {
    const data = {
      type: "terms-and-conditions",
      content,
    };

    try {
      const res = await updateTermsAndConditions(data).unwrap();
      if (res.success) {
        toast.success("Terms and Conditions updated successfully");
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
        <img src={rentMeLogo} alt="" className="w-[120px] h-[42px]"/>
        <p className="text-[14px] text-[#6b7280]">...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white">
      <Title className="mb-4">Terms and Conditions</Title>

      <JoditEditor
        ref={editor}
        value={content}
        onChange={(newContent) => setContent(newContent)}
      />

      <div className="flex items-center justify-center mt-5">
        <button
          onClick={termsDataSave}
          type="submit"
          className="bg-primary text-white w-[160px] h-[42px] rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>
  );
};


export default TermsAndCondition;