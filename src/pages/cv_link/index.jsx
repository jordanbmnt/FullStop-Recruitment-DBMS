import React, { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, CheckCircle } from "lucide-react";
import { UserForm } from "./user_form";
import { FormSummary } from "./form_summary";
import { CvUploadOption } from "./cv_upload_option";
import { ProgressBar } from "./progress_bar";
import { STYLES } from "../../constants/styles";

const DEFAULT_FORM_DATA = {
  cvType: "",
  previousJobReasons: "",
  cvFile: null,
  cvFileName: "",
  cvFileSize: 0,
  email: "",
  status: "",
  field: "",
  jobTitle: "",
  yearsOfXp: "",
  coverLetter: "",
  skills: [],
  summary: "",
  name: "",
};

const CvLink = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateUserExists, setUpdateUserExists] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [submitMessage, setSubmitMessage] = useState("");
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  // Step configuration
  const steps = [
    {
      id: 1,
      title: "CV Type Selection",
      description:
        "Choose whether to upload a new CV or update your existing one",
    },
    {
      id: 2,
      title: "Job Profile Details",
      description: "Complete your professional profile information",
    },
    {
      id: 3,
      title: "Review & Submit",
      description: "Review your information before submitting",
    },
  ];

  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Clear any previous submit status when going back
      setSubmitStatus(null);
      setSubmitMessage("");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["application/pdf"];

      if (allowedTypes.includes(file.type)) {
        setFormData((prev) => ({
          ...prev,
          cvFile: file,
          cvFileName: file.name,
          cvFileSize: Math.round(file.size / 1024),
        }));
      } else {
        alert("Please upload a PDF");
        event.target.value = "";
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        cvFile: null,
        cvFileName: null,
        cvFileSize: null,
      }));
    }
  };

  const handleUpdateExistingUser = (
    email,
    setIsLoading,
    isLoading,
    setUserExists
  ) => {
    let searchResult = {
      body: [],
      error: null,
    };

    if (!email || email.trim() === "") {
      if (!isLoading) {
        searchResult = {
          body: [],
          error: "Please provide a valid email address to search.",
        };
        setIsLoading(false);
        setUserExists(searchResult);
        return searchResult;
      }
    }

    try {
      const ROOT_PARAM = "/.netlify/functions/user";
      let url = `${ROOT_PARAM}?email=${email.toLowerCase()}&limit=1`;
      if (!isLoading) {
        setIsLoading(true);
        fetch(url)
          .then((res) => res.json())
          .then((value) => {
            if (value && value.body.length > 0) {
              setUpdateUserExists(true);
              setUserExists({
                body: value.body,
                error: null,
              });
              setFormData((prev) => ({
                ...prev,
                ...value.body[0],
                cvType: "update",
              }));
              setTimeout(() => {
                setIsLoading(false);
              }, 1500); // Simulate loading delay
              return;
            } else {
              setUserExists({
                body: [],
                error: "Does not exist",
              });
              setIsLoading(false);
            }
          });
        return;
      }
    } catch (e) {
      console.warn("Error:", e);
      setUserExists({
        body: [],
        error: "Error fetching user data." + e.message,
      });
      setTimeout(() => {
        setIsLoading(false);
      }, 1500); // Simulate loading delay
      return;
    }
  };

  const handleSubmit = async (isUpdating) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage("");

    try {
      const formDataToSend = new FormData();

      // Original CV data
      formDataToSend.append("cvType", formData.cvType);
      formDataToSend.append("previousJobReasons", formData.previousJobReasons);

      if (formData["fileInfo"]) {
        formDataToSend.append("fileInfo", JSON.stringify(formData["fileInfo"]));
      } else {
        formDataToSend.append("fileInfo", ["no-file-info"]);
      }

      // Additional profile data
      formDataToSend.append("email", formData.email);
      formDataToSend.append("coverLetter", formData.coverLetter);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("field", formData.field);
      formDataToSend.append("jobTitle", formData.jobTitle);
      formDataToSend.append("yearsOfXp", formData.yearsOfXp);
      formDataToSend.append("skills", JSON.stringify(formData.skills));
      formDataToSend.append("summary", formData.summary);
      formDataToSend.append("name", formData.name);

      if (formData.cvFile) {
        formDataToSend.append("cvFile", formData.cvFile);
      }

      const response = await fetch("/.netlify/functions/user", {
        method: isUpdating ? "PUT" : "POST",
        body: formDataToSend,
      });

      const result = await response.json();
      if (result.success) {
        setSubmitStatus("success");
        setSubmitMessage(
          "CV and profile submitted successfully! Your application has been received."
        );

        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            cvType: "",
            previousJobReasons: "",
            cvFile: null,
            cvFileName: "",
            cvFileSize: 0,
            email: "",
            status: "available",
            field: "",
            jobTitle: "",
            yearsOfXp: "",
            skills: [],
            summary: "",
            name: "",
          });
          setCurrentStep(1);
          setSubmitStatus(null);
          setSubmitMessage("");
        }, 3000);
      } else {
        throw new Error(result.error || "Submission failed");
      }
    } catch (error) {
      console.error("Error submitting CV:", error);
      setSubmitStatus("error");
      setSubmitMessage(
        error.message || "Error submitting CV. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return (
          (formData.cvType !== "" && formData.cvFile !== null) ||
          updateUserExists
        );
      case 2:
        return (
          formData.name.trim() !== "" &&
          formData.email.trim() !== "" &&
          formData.summary.trim() !== "" &&
          formData.jobTitle.trim() !== "" &&
          formData.field.trim() !== "" &&
          formData.skills.length > 0 &&
          formData.previousJobReasons.trim() !== ""
        );
      case 3:
        return true;
      default:
        return true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, updateUserExists]);

  const resetFormData = () => {
    setFormData(DEFAULT_FORM_DATA);
    setUpdateUserExists(false);
    return;
  };

  const getCurrentStep = () => {
    return steps.find((step) => step.id === currentStep) || steps[0];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CvUploadOption
            formData={formData}
            handleInputChange={handleInputChange}
            handleFileUpload={handleFileUpload}
            handleUpdateExistingUser={handleUpdateExistingUser}
            reset={resetFormData}
          />
        );

      case 2:
        return (
          <UserForm
            formData={formData}
            onFormDataChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />
        );

      case 3:
        return (
          <FormSummary
            formData={formData}
            submitStatus={submitStatus}
            submitMessage={submitMessage}
          />
        );

      default:
        return <div>Step content not found</div>;
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='text-center mb-8'>
        <h1 className={`text-3xl font-bold ${STYLES.dark.text.primary} mb-2`}>
          Full Stop Recruitment CV Form
        </h1>
        <p className={STYLES.dark.text.secondary}>
          Complete the steps below to submit your CV
        </p>
      </div>

      {
        <ProgressBar
          steps={steps}
          currentStep={currentStep}
          getCurrentStep={getCurrentStep}
        />
      }

      <div className='max-w-4xl mx-auto'>
        <div
          className={`${STYLES.dark.background.secondary} border ${STYLES.dark.border.strong} rounded-lg shadow-lg p-8 mb-8`}
        >
          {renderStepContent()}
        </div>

        <div className='flex justify-between items-center'>
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentStep === 1
                ? `${STYLES.dark.background.darkest} ${STYLES.dark.text.paragraph} cursor-not-allowed`
                : `${STYLES.dark.background.secondary} border ${STYLES.dark.border.light} ${STYLES.dark.text.primary} hover:${STYLES.dark.background.darkest}`
            }`}
          >
            <ChevronLeft className='w-5 h-5 mr-2' />
            Previous
          </button>

          <div className={`text-sm ${STYLES.dark.text.tertiary}`}>
            {currentStep} of {totalSteps}
          </div>

          {currentStep === totalSteps ? (
            <button
              onClick={() => {
                handleSubmit(formData.cvType === "update");
              }}
              disabled={
                !canProceed() || isSubmitting || submitStatus === "success"
              }
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                !canProceed() || isSubmitting || submitStatus === "success"
                  ? `${STYLES.dark.background.darkest} ${STYLES.dark.text.paragraph} cursor-not-allowed`
                  : `bg-[${STYLES.dark.accent.color}] ${STYLES.dark.text.primary} hover:bg-red-900 border ${STYLES.dark.border.light}`
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                  Submitting...
                </>
              ) : submitStatus === "success" ? (
                <>
                  <CheckCircle className='w-5 h-5 mr-2' />
                  Submitted
                </>
              ) : (
                <>
                  Submit
                  <ChevronRight className='w-5 h-5 ml-2' />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                canProceed()
                  ? `bg-[${STYLES.dark.accent.color}] ${STYLES.dark.text.primary} hover:bg-red-900 border ${STYLES.dark.border.light}`
                  : `${STYLES.dark.background.darkest} ${STYLES.dark.text.paragraph} cursor-not-allowed`
              }`}
            >
              Next
              <ChevronRight className='w-5 h-5 ml-2' />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CvLink;
