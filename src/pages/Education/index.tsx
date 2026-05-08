import React from "react";
import PageWrapper from "../../components/shared/PageWrapper";
import { t } from "../../lib/i18n";

const EducationPage: React.FC = () => {
  return (
    <PageWrapper title={t("pages.education.title", "Educational Resources")}>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t("pages.education.title", "Educational Resources")}</h1>
        <p className="text-lg md:text-xl text-secondary max-w-2xl">
          {t(
            "pages.education.description",
            "Explore fun facts, videos, and activities to learn about hearing and the ocean world."
          )}
        </p>
      </div>
    </PageWrapper>
  );
};

export default EducationPage;
