import { useTranslation } from "react-i18next";
import ERVisit from "./FormComponents/ERVisit";
import SatisfactionSignals from "./FormComponents/SatisfactionSignals";
import CommunicationSignals from "./FormComponents/CommunicationSignals";
import FailureIndicators from "./FormComponents/FailureIndicators";
import ContextForm from "./FormComponents/ContextData";

export default function DataForm() {
  const { t } = useTranslation();

  const baseClasses = " bg-background border-border "

  return (
    <div className="flex-1 h-96 overflow-auto scroll-container px-2">
      <div className="my-5 h-1 sm:grid lg:grid-cols-2 sm:gap-2 md:gap-4">

        {/* ================================================= */}
        {/* 1. ER VISIT CORE DATA */}
        {/* ================================================= */}
        <ERVisit baseClasses={baseClasses} />

        {/* ================================================= */}
        {/* 2. PATIENT SATISFACTION SIGNALS */}
        {/* ================================================= */}
        <SatisfactionSignals baseClasses={baseClasses} />

        {/* ================================================= */}
        {/* 3. COMMUNICATION SIGNALS */}
        {/* ================================================= */}
        <CommunicationSignals baseClasses={baseClasses} />

        {/* ================================================= */}
        {/* 4. EXPERIENCE FAILURE INDICATORS */}
        {/* ================================================= */}
        <FailureIndicators baseClasses={baseClasses} />

        {/* ================================================= */}
        {/* 5. CONTEXT DATA */}
        {/* ================================================= */}
        <div className="w-full col-span-2">
          <ContextForm baseClasses={baseClasses} />
        </div>

      </div>
    </div>
  );
}

  