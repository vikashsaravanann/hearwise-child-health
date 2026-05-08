import React from 'react';
import PageWrapper from '../../components/shared/PageWrapper';
import { t } from '../../lib/i18n';

const EarCarePage: React.FC = () => (
  <PageWrapper title={t('ear_care.title')}> // 'Ear Care Tips'
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-white">{t('ear_care.title')}</h2>
      <p className="text-lg text-gray-200">{t('ear_care.intro')}</p>
      {/* Example tips list */}
      <ul className="list-disc list-inside space-y-2 text-gray-200">
        <li>{t('ear_care.tip1')}</li>
        <li>{t('ear_care.tip2')}</li>
        <li>{t('ear_care.tip3')}</li>
        <li>{t('ear_care.tip4')}</li>
      </ul>
    </div>
  </PageWrapper>
);

export default EarCarePage;
