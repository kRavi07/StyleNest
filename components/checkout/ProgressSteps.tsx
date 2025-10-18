import { CheckCircle } from 'lucide-react';

interface ProgressStepsProps {
    currentStep: number;
    steps: string[];
}

export function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
                {steps.map((_, index) => {
                    const stepNumber = index + 1;
                    return (
                        <div key={stepNumber} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= stepNumber
                                ? 'bg-orange-400 text-white'
                                : 'bg-gray-200 text-gray-600'
                                }`}>
                                {currentStep > stepNumber ? (
                                    <CheckCircle className="h-5 w-5" />
                                ) : (
                                    stepNumber
                                )}
                            </div>
                            {stepNumber < steps.length && (
                                <div className={`w-16 h-1 mx-2 ${currentStep > stepNumber ? 'bg-orange-300' : 'bg-gray-200'
                                    }`} />
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-center mt-4 space-x-20">
                {steps.map((stepName, index) => (
                    <span
                        key={stepName}
                        className={`text-sm font-medium ${currentStep >= index + 1 ? 'text-orange-300' : 'text-gray-500'
                            }`}
                    >
                        {stepName}
                    </span>
                ))}
            </div>
        </div>
    );
}
