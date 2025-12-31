import { useState, useEffect } from "react";
import { Modal, Input, Select, Button, Upload, message, InputNumber } from "antd";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import type { UploadFile } from "antd";
import { useAddExtraServiceMutation, useUpdateExtraServiceMutation } from "@/redux/apiSlices/categoryApi";

type QuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "IMAGE_NAME";
type PriceModifierType = "FIXED" | "PERCENTAGE";

type Option = {
  _id?: string;
  optionText: string;
  optionImage?: File | string | null;
  priceModifierValue: number;
  priceModifierType: PriceModifierType;
};

type ExtraService = {
  _id: string;
  categoryId: string;
  questionText: string;
  questionType: QuestionType | string;
  options: Array<{
    _id: string;
    optionText: string;
    optionImage?: string;
    priceModifierValue: number;
    priceModifierType: PriceModifierType | string;
  }>;
};

type Props = {
  open: boolean;
  onClose: () => void;
  categoryId?: string | null;
  service?: ExtraService | null;
};

const AddExtraServiceModal = ({ open, onClose, categoryId, service }: Props) => {
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>("SINGLE_CHOICE");
  const [options, setOptions] = useState<Option[]>([]);

  const [addExtraService, { isLoading: isCreating }] = useAddExtraServiceMutation();
  const [updateExtraService, { isLoading: isUpdating }] = useUpdateExtraServiceMutation();
  // const isEdit = Boolean(service);


  useEffect(() => {
    if (service) {
      setQuestionText(service.questionText);
      setQuestionType(service.questionType as QuestionType);
      setOptions(
        (service.options || []).map((opt: any) => ({
          _id: opt._id,
          optionText: opt.optionText,
          optionImage: opt.optionImage || null,
          priceModifierValue: opt.priceModifierValue,
          priceModifierType: opt.priceModifierType as PriceModifierType,
        }))
      );
    } else {
      setQuestionText("");
      setQuestionType("SINGLE_CHOICE");
      setOptions([
        {
          optionText: "",
          optionImage: null,
          priceModifierValue: 0,
          priceModifierType: "FIXED",
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, open]);

  const handleAddOption = () => {
    setOptions([
      ...options,
      {
        optionText: "",
        optionImage: null,
        priceModifierValue: 0,
        priceModifierType: "FIXED",
      },
    ]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    } else {
      message.warning("At least one option is required");
    }
  };

  const handleOptionChange = (index: number, field: keyof Option, value: any) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const handleImageUpload = (index: number, file: UploadFile | null) => {
    handleOptionChange(index, "optionImage", file?.originFileObj || null);
  };

  const handleSubmit = async () => {
    if (!questionText.trim()) {
      message.error("Please enter question text");
      return;
    }

    if (options.some((opt) => !opt.optionText.trim())) {
      message.error("All options must have text");
      return;
    }

    if (
      questionType === "IMAGE_NAME" &&
      options.some((opt) => !opt.optionImage)
    ) {
      message.error("All options must have images for IMAGE_NAME type");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("questionText", questionText);
      formData.append("questionType", questionType);
      // screenNo removed per requirements

      const optionsData = options.map((opt) => ({
        _id: opt._id,
        optionText: opt.optionText,
        priceModifierValue: opt.priceModifierValue,
        priceModifierType: opt.priceModifierType,
        ...(typeof opt.optionImage === "string" && { optionImage: opt.optionImage }),
      }));

      formData.append("data", JSON.stringify({ options: optionsData }));

      if (questionType === "IMAGE_NAME") {
        options.forEach((opt, index) => {
          if (opt.optionImage instanceof File) {
            formData.append(`optionImages[${index}]`, opt.optionImage);
          }
        });
      }

      const isEdit = Boolean(service);
      if (isEdit) {
        const id = service!._id;
        await updateExtraService({ id, formData }).unwrap();
        message.success("Extra service updated successfully!");
      } else {
        if (!categoryId) {
          message.error("Category not selected");
          return;
        }
        formData.append("categoryId", categoryId);
        await addExtraService(formData).unwrap();
        message.success("Extra service added successfully!");
      }
      onClose();
    } catch (error: any) {
      message.error(error?.data?.message || "Operation failed");
    }
  };

  return (
    <Modal
      open={open}
      title={service ? "Edit Extra Service" : "Add Extra Service"}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={service ? "Update" : "Create"}
      confirmLoading={isCreating || isUpdating}
      width={900}
      destroyOnClose
      okButtonProps={{ style: { backgroundColor: "#3f51b5", color: "#fff", height: "40px", marginTop: "20px" } }}
      cancelButtonProps={{ style: { height: "40px" } }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Extra Service Text asking question *</label>
          <Input
            placeholder="What type of flooring do you want to Install?"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="h-[45px]"
            disabled={Boolean(service)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Extra Service Type *</label>
            <Select
              value={questionType}
              onChange={(value) => setQuestionType(value)}
              className="w-full h-[45px]"
              options={[
                // { label: "Single Choice", value: "SINGLE_CHOICE" },
                { label: "Multiple Choice", value: "MULTIPLE_CHOICE" },
                { label: "Image with Name", value: "IMAGE_NAME" },
              ]}
              disabled={Boolean(service)}
            />
          </div>

          {/* Screen Number removed */}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Options *</h4>
            <Button
              type="dashed"
              icon={<FiPlus />}
              onClick={handleAddOption}
              size="small"
              className="h-[40px]"
            >
              Add Option
            </Button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {options.map((option, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    Option {index + 1}
                  </span>
                  {options.length > 1 && (
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<FiTrash2 />}
                      onClick={() => handleRemoveOption(index)}
                      className="h-[40px]"
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Option Text *
                    </label>
                    <Input
                      placeholder="Laminate"
                      value={option.optionText}
                      onChange={(e) =>
                        handleOptionChange(index, "optionText", e.target.value)
                      }
                      className="h-[45px]"
                    />
                  </div>

                  {questionType === "IMAGE_NAME" && (
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Option Image *
                      </label>
                      <Upload
                        listType="picture-card"
                        maxCount={1}
                        beforeUpload={() => false}
                        accept="image/*"
                        onChange={(info) =>
                          handleImageUpload(index, info.fileList[0] || null)
                        }
                        defaultFileList={
                          typeof option.optionImage === "string"
                            ? [
                                {
                                  uid: `${index}`,
                                  name: "image",
                                  status: "done",
                                  url: option.optionImage,
                                } as UploadFile,
                              ]
                            : []
                        }
                      >
                        {!option.optionImage && "+ Upload"}
                      </Upload>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Price Modifier *
                      </label>
                      <InputNumber
                        min={0}
                        value={option.priceModifierValue}
                        onChange={(value) =>
                          handleOptionChange(
                            index,
                            "priceModifierValue",
                            value || 0
                          )
                        }
                        className="w-full h-[45px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Modifier Type *
                      </label>
                      <Select
                        value={option.priceModifierType}
                        onChange={(value) =>
                          handleOptionChange(index, "priceModifierType", value)
                        }
                        className="w-full h-[45px]"
                        options={[
                          { label: "Fixed", value: "FIXED" },
                        //   { label: "Percentage", value: "PERCENTAGE" },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddExtraServiceModal;
