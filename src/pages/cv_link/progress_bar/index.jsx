export const ProgressBar = ({ steps, currentStep, getCurrentStep }) => {
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