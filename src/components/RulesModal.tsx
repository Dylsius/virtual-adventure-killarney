import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface RulesModalProps {
  isOpen: boolean;
  onAgree: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onAgree }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const rules = [
    t('rule1'), t('rule2'), t('rule3'), t('rule4'), t('rule5'), t('rule6'),
    t('rule7'), t('rule8'), t('rule9'), t('rule10'), t('rule11'), t('rule12'),
    t('rule13'), t('rule14'), t('rule15'), t('rule16'), t('rule17'),
    t('ruleNoAlcoholOrDrugs'), t('ruleNoAggression'), t('ruleNoRefundVoluntaryExit')
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t('rulesOfConduct')}</h2>
                <p className="text-blue-100">{t('vrAttractionArea')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <p className="text-blue-900 font-semibold mb-6">{t('rulesIntro')}</p>
          
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-blue-800 text-sm leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-blue-800 font-medium text-sm">{t('importantNotice')}</p>
                <p className="text-blue-700 text-sm mt-1">{t('rulesAgreement')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-blue-50 p-6 border-t border-blue-100">
          <div className="flex justify-center">
            <button
              onClick={onAgree}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>{t('iAgreeToRules')}</span>
            </button>
          </div>
          <p className="text-center text-blue-600 text-sm mt-3">{t('mustAgreeToRules')}</p>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;