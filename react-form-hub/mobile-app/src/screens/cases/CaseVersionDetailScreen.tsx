// Case version detail screen (read-only view of specific version)
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  I18nManager,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CaseData, LocalTemplate, Field, ConditionalLogic, ConditionalRule } from '../../shared/types';
import { caseService } from '../../shared/services';
import { COLORS } from '../../theme/colors';
import { Button, AppText as Text } from '../../components/ui';

export const CaseVersionDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { version, template } = route.params as {
    version: CaseData;
    template: LocalTemplate;
  };
  const [versionDetail, setVersionDetail] = useState<CaseData>(version);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadVersionDetails = async () => {
      if (!version.id || !template?.template_data?.id) return;
      try {
        setIsLoading(true);
        const fullVersion = await caseService.getCase(version.id, template.template_data.id);
        setVersionDetail(fullVersion);
      } catch (error) {
        console.error('Error loading version detail:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVersionDetails();
  }, [version.id, template?.template_data?.id]);

  const formData = versionDetail?.case_data || {};

  const investigationStatusRaw = useMemo(() => {
    return (
      versionDetail?.investigation_status ||
      (formData && (
        formData['investigation_status'] ||
        formData['investigationStatus'] ||
        formData['case_investigation_status'] ||
        formData['caseInvestigationStatus']
      ))
    );
  }, [versionDetail?.investigation_status, formData]);

  const caseClassificationRaw = useMemo(() => {
    return (
      versionDetail?.case_classification ||
      (formData && (
        formData['case_classification'] ||
        formData['caseClassification'] ||
        formData['classification']
      ))
    );
  }, [versionDetail?.case_classification, formData]);

  const getInvestigationStatusLabel = (status?: string | null) => {
    switch (status) {
      case 'open':
        return 'مفتوح';
      case 'closed':
        return 'مغلق';
      case 'confirmed':
        return 'مؤكد';
      case 'probable':
        return 'محتمل';
      case 'not_a_case':
        return 'ليست حالة';
      default:
        return status || '-';
    }
  };

  const getClassificationLabel = (classification?: string | null) => {
    switch (classification) {
      case 'confirmed':
        return 'مؤكد';
      case 'probable':
        return 'محتمل';
      case 'not_a_case':
        return 'ليست حالة';
      default:
        return classification || '-';
    }
  };

  // Evaluate conditional logic for field visibility
  const evaluateConditionalLogic = useCallback((logic: ConditionalLogic): boolean => {
    if (!logic) return true;

    if (logic.all && Array.isArray(logic.all)) {
      return logic.all.every((rule: ConditionalRule) => evaluateRule(rule));
    }

    if (logic.any && Array.isArray(logic.any)) {
      return logic.any.some((rule: ConditionalRule) => evaluateRule(rule));
    }

    return true;
  }, [formData]);

  const evaluateRule = useCallback((rule: ConditionalRule): boolean => {
    if (!rule || !rule.field || !rule.op) return false;

    const fieldValue = formData[rule.field];
    const ruleValue = rule.value;

    switch (rule.op) {
      case 'equals':
        return fieldValue === ruleValue;
      case 'notEquals':
        return fieldValue !== ruleValue;
      case 'in':
        if (Array.isArray(ruleValue)) {
          return ruleValue.includes(fieldValue);
        }
        return false;
      case 'notIn':
        if (Array.isArray(ruleValue)) {
          return !ruleValue.includes(fieldValue);
        }
        return true;
      case 'gt':
        return Number(fieldValue) > Number(ruleValue);
      case 'gte':
        return Number(fieldValue) >= Number(ruleValue);
      case 'lt':
        return Number(fieldValue) < Number(ruleValue);
      case 'lte':
        return Number(fieldValue) <= Number(ruleValue);
      default:
        return false;
    }
  }, [formData]);

  const renderFieldValue = (field: Field): React.ReactNode => {
    const value = formData[field.id];

    // Check conditional display logic
    if (field.showIf && !evaluateConditionalLogic(field.showIf)) {
      return null;
    }

    if (field.conditionalDisplay) {
      const dependentValue = formData[field.conditionalDisplay.dependsOn];
      if (!field.conditionalDisplay.values.includes(dependentValue)) {
        return null;
      }
    }

    // Skip separator fields
    if (field.type === 'separator') {
      return (
        <View key={field.id} style={styles.separator}>
          <View style={styles.separatorLine} />
          {field.label && field.label !== 'خط فاصل' && (
            <Text style={styles.separatorText}>{field.label}</Text>
          )}
        </View>
      );
    }

    // Display field value in read-only format
    let displayValue = '-';

    if (value !== undefined && value !== null && value !== '') {
      switch (field.type) {
        case 'checkbox':
          displayValue = Array.isArray(value) ? value.join(', ') : value;
          break;
        case 'radio':
        case 'select':
          const option = field.options?.find(opt => opt.value === value);
          displayValue = option ? option.label : value;
          break;
        case 'unitNumber':
          if (value && typeof value === 'object') {
            displayValue = `${value.number} ${value.unit}`;
          } else {
            displayValue = value;
          }
          break;
        case 'conditional':
          displayValue = value;
          // Render conditional follow-up field if applicable
          if (value === field.conditionalField?.triggerValue && field.conditionalField) {
            return (
              <View key={field.id} style={styles.field}>
                <Text style={styles.label}>{field.label}</Text>
                <Text style={styles.value}>{displayValue}</Text>
                <View style={styles.conditionalContent}>
                  {field.conditionalField.type === 'field' && field.conditionalField.field
                    ? renderFieldValue(field.conditionalField.field)
                    : field.conditionalField.type === 'subsection' && field.conditionalField.subsection
                    ? (
                      <View>
                        <Text style={styles.subsectionTitle}>{field.conditionalField.subsection.title}</Text>
                        {field.conditionalField.subsection.fields.map(subField => (
                          <View key={subField.id}>
                            {renderFieldValue(subField)}
                          </View>
                        ))}
                      </View>
                    )
                    : field.conditionalField.field && renderFieldValue(field.conditionalField.field)
                  }
                </View>
              </View>
            );
          }
          break;
        default:
          displayValue = value.toString();
      }
    }

    return (
      <View key={field.id} style={styles.field}>
        <Text style={styles.label}>{field.label}</Text>
        <Text style={styles.value}>{displayValue}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Version Info Badge */}
        <View style={styles.versionBadge}>
          <Text style={styles.versionBadgeText}>
            {versionDetail?.version_number ? `النسخة ${versionDetail.version_number}` : 'النسخة الأصلية'}
          </Text>
          {versionDetail?.version_label && (
            <Text style={styles.versionLabel}>{versionDetail.version_label}</Text>
          )}
        </View>

        {/* Case Metadata */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معلومات الحالة</Text>
          
          {versionDetail?.case_name && (
            <View style={styles.field}>
              <Text style={styles.label}>اسم الحالة</Text>
              <Text style={styles.value}>{versionDetail.case_name}</Text>
            </View>
          )}

          {versionDetail?.patient_identifier && (
            <View style={styles.field}>
              <Text style={styles.label}>معرف المريض</Text>
              <Text style={styles.value}>{versionDetail.patient_identifier}</Text>
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>حالة التقصي</Text>
            <Text style={styles.value}>{getInvestigationStatusLabel(investigationStatusRaw)}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>تصنيف الحالة</Text>
            <Text style={styles.value}>{getClassificationLabel(caseClassificationRaw)}</Text>
          </View>
        </View>

        {/* Form Fields */}
        {template.template_data.sections?.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.description && (
              <Text style={styles.sectionDescription}>{section.description}</Text>
            )}
            
            {section.fields?.map((field) => renderFieldValue(field))}
            
            {/* Render subsections */}
            {section.subsections?.map((subsection) => (
              <View key={subsection.id} style={styles.subsection}>
                <Text style={styles.subsectionTitle}>{subsection.title}</Text>
                {subsection.description && (
                  <Text style={styles.sectionDescription}>{subsection.description}</Text>
                )}
                {subsection.fields?.map((field) => renderFieldValue(field))}
              </View>
            ))}
          </View>
        ))}

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text style={styles.metadataText}>
            تاريخ الإنشاء: {versionDetail?.created_at ? new Date(versionDetail.created_at).toLocaleString('en-GB') : '-'}
          </Text>
          {versionDetail?.updated_at && (
            <Text style={styles.metadataText}>
              آخر تحديث: {new Date(versionDetail.updated_at).toLocaleString('en-GB')}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Return Button */}
      <View style={styles.footer}>
        <Button
          label="العودة إلى السجل"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    zIndex: 10,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  versionBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  versionBadgeText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '600',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  versionLabel: {
    color: '#fff',
    fontSize: 16,
    marginTop: 4,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 16,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  sectionDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 4,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  value: {
    fontSize: 19,
    color: COLORS.textPrimary,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  subsection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  subsectionTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  conditionalContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  separator: {
    marginVertical: 16,
    alignItems: 'center',
  },
  separatorLine: {
    height: 1,
    backgroundColor: COLORS.border,
    width: '100%',
  },
  separatorText: {
    position: 'absolute',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  metadata: {
    backgroundColor: COLORS.primarySoftAlt,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  metadataText: {
    fontSize: 15,
    color: COLORS.textMuted,
    marginBottom: 4,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  returnButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  returnButtonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '600',
  },
});

