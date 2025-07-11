import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  RefreshCw,
  FileText,
  User,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const CvLink = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [submitMessage, setSubmitMessage] = useState("");
  const [formData, setFormData] = useState({
    cvType: "",
    previousJobReasons: "",
    cvFile: null,
    cvFileName: "",
    cvFileSize: 0,
  });

  // Step configuration
  const steps = [
    {
      id: 1,
      title: "CV Type Selection",
      description: "Choose whether to upload a new CV or update your existing one",
    },
    {
      id: 2,
      title: "Previous Job Summary",
      description: "Provide a summary of reasons for leaving previous positions",
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
      const allowedTypes = [
        "application/pdf",
      ];

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
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('cvType', formData.cvType);
      formDataToSend.append('previousJobReasons', formData.previousJobReasons);

      if (formData.cvFile) {
        formDataToSend.append('cvFile', formData.cvFile);
      }

      console.warn(formDataToSend.get('cvType'), formDataToSend.get('cvFile'), formDataToSend.get('previousJobReasons'))

      const response = await fetch('/.netlify/functions/cv_upload', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();
      console.warn(result)
      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage('CV submitted successfully! Your application has been received.');

        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            cvType: "",
            previousJobReasons: "",
            cvFile: null,
            cvFileName: "",
            cvFileSize: 0,
          });
          setCurrentStep(1);
          setSubmitStatus(null);
          setSubmitMessage("");
        }, 3000);
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Error submitting CV:', error);
      setSubmitStatus('error');
      setSubmitMessage(error.message || 'Error submitting CV. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.cvType !== "" && formData.cvFile !== null;
      case 2:
        return formData.previousJobReasons.trim() !== "";
      case 3:
        return true;
      default:
        return true;
    }
  };

  const getCurrentStep = () => {
    return steps.find((step) => step.id === currentStep) || steps[0];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <FileText className="w-16 h-16 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                CV Management
              </h2>
              <p className="text-gray-600">
                Choose how you'd like to proceed with your CV
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer ${formData.cvType === "new"
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
                onClick={() => handleInputChange("cvType", "new")}
              >
                <Upload className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Upload New CV
                </h3>
                <p className="text-gray-600 text-sm">
                  Start fresh with a completely new CV document
                </p>

                {formData.cvType === "new" && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose your CV file:
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formData.cvFile && (
                      <div className="mt-2 p-2 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">
                          ✓ {formData.cvFileName} ({formData.cvFileSize} KB)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div
                className={`p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer ${formData.cvType === "update"
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
                onClick={() => handleInputChange("cvType", "update")}
              >
                <RefreshCw className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Update Existing CV
                </h3>
                <p className="text-gray-600 text-sm">
                  Upload an updated version of your CV document
                </p>

                {formData.cvType === "update" && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose your updated CV file:
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    {formData.cvFile && (
                      <div className="mt-2 p-2 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">
                          ✓ {formData.cvFileName} ({formData.cvFileSize} KB)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <User className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Previous Job Summary
              </h2>
              <p className="text-gray-600">
                Help us understand your career journey
              </p>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Briefly summarize your reasons for leaving previous positions:
              </label>
              <textarea
                value={formData.previousJobReasons}
                onChange={(e) =>
                  handleInputChange("previousJobReasons", e.target.value)
                }
                placeholder="e.g., Seeking new challenges, career advancement, better work-life balance, company restructuring, etc."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={6}
              />
              <p className="text-sm text-gray-500">
                This information helps us better understand your career
                motivations and goals.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 mx-auto text-purple-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Review & Submit
              </h2>
              <p className="text-gray-600">
                Please review your information before submitting
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">CV Type:</h3>
                  <p className="text-gray-600 capitalize">{formData.cvType}</p>
                </div>

                {formData.cvFile && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">File:</h3>
                    <p className="text-gray-600">
                      {formData.cvFileName} ({formData.cvFileSize} KB)
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Previous Job Reasons:
                </h3>
                <p className="text-gray-600 bg-white p-3 rounded border">
                  {formData.previousJobReasons}
                </p>
              </div>
            </div>

            {submitStatus && (
              <div className={`p-4 rounded-lg flex items-center space-x-2 ${submitStatus === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
                }`}>
                {submitStatus === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <p>{submitMessage}</p>
              </div>
            )}
          </div>
        );

      default:
        return <div>Step content not found</div>;
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center mb-4 justify-between">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className={`flex items-center ${index === steps.length - 1 ? "w-fit" : "w-full"}`}>
                <div
                  className={`min-w-10 min-h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors shadow-md ${isCompleted
                    ? "bg-green-600 text-white"
                    : isCurrent
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {isCompleted ? "✓" : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-full mx-4 transition-colors shadow-sm ${isCompleted ? "bg-green-600" : "bg-gray-200"
                      }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Step {currentStep}: {getCurrentStep().title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {getCurrentStep().description}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Full Stop Recruitment CV Form
        </h1>
        <p className="text-gray-600">
          Complete the steps below to submit your CV
        </p>
      </div>

      {renderProgressBar()}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {renderStepContent()}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${currentStep === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          <div className="text-sm text-gray-500">
            {currentStep} of {totalSteps}
          </div>

          {currentStep === totalSteps ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting || submitStatus === 'success'}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${!canProceed() || isSubmitting || submitStatus === 'success'
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
                }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : submitStatus === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Submitted
                </>
              ) : (
                <>
                  Submit
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${canProceed()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CvLink;
