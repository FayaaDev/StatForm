// Case detail and edit screen
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  I18nManager,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FloatingButton } from 'react-native-ui-lib';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { CaseData, LocalTemplate, Field, ConditionalLogic, ConditionalRule } from '../../shared/types';
import { COLORS } from '../../theme/colors';
import { Button, AppText as Text, AppTextInput as TextInput } from '../../components/ui';

export const CaseDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { user } = useAuth();
  const { updateCase, isOnline } = useData();
  const { caseItem, template, permission } = route.params as { 
    caseItem: CaseData; 
    template: LocalTemplate;
    permission: 'view' | 'edit';
  };

  const [formData, setFormData] = useState<Record<string, any>>(caseItem.case_data);
  const [investigationStatus, setInvestigationStatus] = useState<'open' | 'closed'>(
    (caseItem.investigation_status as 'open' | 'closed') || 'open'
  );
  const [caseClassification, setCaseClassification] = useState<'confirmed' | 'probable' | 'not_a_case'>(
    (caseItem.case_classification as 'confirmed' | 'probable' | 'not_a_case') || 'confirmed'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState<string | null>(null);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [isEditMode, setIsEditMode] = useState(false);

  // Update state when case item changes
  useEffect(() => {
    setFormData(caseItem.case_data);
    setInvestigationStatus((caseItem.investigation_status as 'open' | 'closed') || 'open');
    setCaseClassification((caseItem.case_classification as 'confirmed' | 'probable' | 'not_a_case') || 'confirmed');
  }, [caseItem]);

  // Derive case name and patient identifier from form data
  const getCaseName = () => {
    const displayField = template.template_data.sections
      .flatMap(s => s.fields)
      .find(f => f.id.toLowerCase().includes('name') || f.type === 'text');
    return displayField ? formData[displayField.id] : undefined;
  };

  const getPatientId = () => {
    return formData.patient_id || formData.patientId || formData.patient_name || formData.patientName || undefined;
  };

  const isViewOnly = permission === 'view';
  const canEdit = !isViewOnly && isEditMode;

  // Set up edit button in header
  React.useLayoutEffect(() => {
    if (isViewOnly) {
      navigation.setOptions({
        headerRight: undefined,
      });
    } else {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => setIsEditMode(!isEditMode)}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>
              {isEditMode ? 'إنهاء' : 'تعديل'}
            </Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, isEditMode, isViewOnly]);

  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  const handleCheckboxChange = useCallback((fieldId: string, optionValue: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = Array.isArray(prev[fieldId]) ? prev[fieldId] : [];
      const newValues = checked
        ? [...currentValues, optionValue]
        : currentValues.filter((v: string) => v !== optionValue);
      
      return {
        ...prev,
        [fieldId]: newValues
      };
    });
  }, []);

  // Evaluate conditional logic for field visibility
  const evaluateConditionalLogic = useCallback((logic: ConditionalLogic): boolean => {
    if (!logic) return true;

    // Handle 'all' conditions (AND logic)
    if (logic.all && Array.isArray(logic.all)) {
      return logic.all.every((rule: ConditionalRule) => evaluateRule(rule));
    }

    // Handle 'any' conditions (OR logic) 
    if (logic.any && Array.isArray(logic.any)) {
      return logic.any.some((rule: ConditionalRule) => evaluateRule(rule));
    }

    return true;
  }, [formData]);

  // Evaluate a single conditional rule
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

  const handleSave = async () => {
    if (isViewOnly) return;

    if (!isOnline) {
      Alert.alert('خطأ', 'يلزم الاتصال بالإنترنت لحفظ التغييرات');
      return;
    }

    try {
      setIsSaving(true);

      // Derive case name and patient identifier from form data
      const caseName = getCaseName();
      const patientId = getPatientId();

      if (caseItem.id) {
        // Update case (creates version on server)
        await updateCase(caseItem.id, template.template_data.id, {
          case_data: formData,
          case_name: caseName,
          patient_identifier: patientId,
          template_id: template.template_data.id,
          template_name: template.name,
          region: template.template_data.region,
          disease: template.template_data.disease,
          city_id: user?.city_id,
          city_name: user?.city_name,
          investigation_status: investigationStatus,
          case_classification: caseClassification,
        });

        Alert.alert('نجح', 'تم إنشاء نسخة جديدة من الحالة بنجاح', [
          { text: 'موافق', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Error saving case:', error);
      Alert.alert('خطأ', 'فشل في حفظ التغييرات');
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewVersionHistory = () => {
    if (!caseItem.id) return;
    navigation.navigate('CaseVersionHistory', {
      caseId: caseItem.id,
      templateId: template.template_data.id,
      template: template
    });
  };

  const renderField = (field: Field): React.ReactNode => {
    const value = formData[field.id];

    // Check new conditional display logic first
    if (field.showIf && !evaluateConditionalLogic(field.showIf)) {
      return null;
    }

    // Check legacy conditional display for backward compatibility
    if (field.conditionalDisplay) {
      const dependentValue = formData[field.conditionalDisplay.dependsOn];
      if (!field.conditionalDisplay.values.includes(dependentValue)) {
        return null;
      }
    }

    const fieldDisabled = isViewOnly || !canEdit;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <View key={field.id} style={styles.field}>
            <Text style={styles.label}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={[styles.input, fieldDisabled && styles.inputDisabled]}
              value={value !== undefined && value !== null ? String(value) : ''}
              onChangeText={(val) => handleFieldChange(field.id, val)}
              placeholder={field.placeholder}
              keyboardType={field.type === 'email' ? 'email-address' : field.type === 'phone' ? 'phone-pad' : 'default'}
              editable={!fieldDisabled}
            />
          </View>
        );

      case 'number':
        return (
          <View key={field.id} style={styles.field}>
            <Text style={styles.label}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={[styles.input, fieldDisabled && styles.inputDisabled]}
              value={value !== undefined && value !== null ? String(value) : ''}
              onChangeText={(val) => handleFieldChange(field.id, val)}
              placeholder={field.placeholder}
              keyboardType="numeric"
              editable={!fieldDisabled}
            />
          </View>
        );

      case 'date':
        const dateValue = value ? new Date(value) : null;
        return (
          <View key={field.id} style={styles.field}>
            <Text style={styles.label}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <TouchableOpacity
              style={[styles.dateButton, fieldDisabled && styles.inputDisabled]}
              onPress={() => {
                if (!fieldDisabled) {
                  setTempDate(dateValue || new Date());
                  setShowDatePicker(field.id);
                }
              }}
              disabled={fieldDisabled}
            >
              <Text style={[styles.dateButtonText, !value && styles.dateButtonPlaceholder]}>
                {value || field.placeholder || 'اختر التاريخ'}
              </Text>
            </TouchableOpacity>
            {showDatePicker === field.id && !fieldDisabled && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === 'android') {
                    setShowDatePicker(null);
                  }
                  if (selectedDate) {
                    const formattedDate = selectedDate.toISOString().split('T')[0];
                    handleFieldChange(field.id, formattedDate);
                    if (Platform.OS === 'ios') {
                      setTempDate(selectedDate);
                    }
                  }
                }}
                maximumDate={new Date()}
              />
            )}
            {showDatePicker === field.id && Platform.OS === 'ios' && !fieldDisabled && (
              <Button
                label="تم"
                onPress={() => setShowDatePicker(null)}
                variant="primary"
                style={{ marginTop: 8 }}
              />
            )}
          </View>
        );

      case 'textarea':
        return (
          <View key={field.id} style={styles.field}>
            <Text style={styles.label}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={[styles.input, styles.textArea, fieldDisabled && styles.inputDisabled]}
              value={value !== undefined && value !== null ? String(value) : ''}
              onChangeText={(val) => handleFieldChange(field.id, val)}
              placeholder={field.placeholder}
              multiline
              numberOfLines={4}
              editable={!fieldDisabled}
            />
          </View>
        );

      case 'radio':
        return (
          <View key={field.id} style={styles.field}>
            <Text style={styles.label}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.radioGroupField}>
              {field.options?.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.radioOption}
                  onPress={() => !fieldDisabled && handleFieldChange(field.id, option.value)}
                  disabled={fieldDisabled}
                >
                  <View style={styles.radioCircle}>
                    {value === option.value && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabelText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'checkbox':
        const checkboxValues = Array.isArray(value) ? value : [];
        return (
          <View key={field.id} style={styles.field}>
            <Text style={styles.label}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.checkboxGroup}>
              {field.options?.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.checkboxOption}
                  onPress={() => !fieldDisabled && handleCheckboxChange(field.id, option.value, !checkboxValues.includes(option.value))}
                  disabled={fieldDisabled}
                >
                  <View style={styles.checkbox}>
                    {checkboxValues.includes(option.value) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'select':
        return (
          <View key={field.id} style={styles.field}>
            <Text style={styles.label}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.selectContainer}>
              {field.options?.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.selectOption,
                    value === option.value && styles.selectOptionSelected
                  ]}
                  onPress={() => !fieldDisabled && handleFieldChange(field.id, option.value)}
                  disabled={fieldDisabled}
                >
                  <Text style={[
                    styles.selectOptionText,
                    value === option.value && styles.selectOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'autocomplete':
        return (
          <View key={field.id} style={styles.field}>
            <Text style={styles.label}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={[styles.input, fieldDisabled && styles.inputDisabled]}
              value={value !== undefined && value !== null ? String(value) : ''}
              onChangeText={(val) => handleFieldChange(field.id, val)}
              placeholder={field.placeholder}
              editable={!fieldDisabled}
            />
          </View>
        );

      case 'unitNumber':
        const unitValue = value || { number: '', unit: field.defaultUnit || '' };
        return (
          <View key={field.id} style={styles.field}>
            <Text style={styles.label}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.unitNumberContainer}>
              <TextInput
                style={[styles.input, styles.unitNumberInput, fieldDisabled && styles.inputDisabled]}
                value={unitValue.number !== undefined && unitValue.number !== null ? String(unitValue.number) : ''}
                onChangeText={(val) => !fieldDisabled && handleFieldChange(field.id, { ...unitValue, number: val })}
                placeholder={field.placeholder || 'أدخل القيمة'}
                keyboardType="numeric"
                editable={!fieldDisabled}
              />
              <View style={styles.unitSelectContainer}>
                {field.unitOptions?.map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={[
                      styles.unitOption,
                      unitValue.unit === unit && styles.unitOptionSelected
                    ]}
                    onPress={() => !fieldDisabled && handleFieldChange(field.id, { ...unitValue, unit })}
                    disabled={fieldDisabled}
                  >
                    <Text style={[
                      styles.unitOptionText,
                      unitValue.unit === unit && styles.unitOptionTextSelected
                    ]}>
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 'separator':
        return (
          <View key={field.id} style={styles.separator}>
            <View style={styles.separatorLine} />
            {field.label && field.label !== 'خط فاصل' && (
              <Text style={styles.separatorText}>{field.label}</Text>
            )}
          </View>
        );

      case 'conditional':
        if (!field.conditionalField) return null;
        
        return (
          <View key={field.id} style={styles.field}>
            <Text style={styles.label}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.radioGroupField}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => !fieldDisabled && handleFieldChange(field.id, 'نعم')}
                disabled={fieldDisabled}
              >
                <View style={styles.radioCircle}>
                  {value === 'نعم' && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioLabelText}>نعم</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => !fieldDisabled && handleFieldChange(field.id, 'لا')}
                disabled={fieldDisabled}
              >
                <View style={styles.radioCircle}>
                  {value === 'لا' && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioLabelText}>لا</Text>
              </TouchableOpacity>
            </View>
            
            {/* Conditional follow-up field */}
            {value === field.conditionalField.triggerValue && field.conditionalField && (
              <View style={styles.conditionalContent}>
                {field.conditionalField.type === 'field' && field.conditionalField.field ? (
                  renderField(field.conditionalField.field)
                ) : field.conditionalField.type === 'subsection' && field.conditionalField.subsection ? (
                  <View>
                    <Text style={styles.subsectionTitle}>{field.conditionalField.subsection.title}</Text>
                    {field.conditionalField.subsection.fields.map(subField => (
                      <View key={subField.id}>
                        {renderField(subField)}
                      </View>
                    ))}
                  </View>
                ) : (
                  // Legacy support for old conditional fields without type property
                  field.conditionalField.field && renderField(field.conditionalField.field)
                )}
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Version History Button */}
        <Button
          label="📜 عرض سجل النسخ"
          onPress={handleViewVersionHistory}
          variant="secondary"
          style={{ marginBottom: 16 }}
        />

        {/* Case Metadata - Investigation Status and Classification */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>حالة التقصي والتصنيف</Text>

          {/* Investigation Status */}
          <View style={styles.field}>
            <Text style={styles.label}>حالة التقصي</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  investigationStatus === 'open' && styles.radioButtonSelected
                ]}
                onPress={() => !isViewOnly && setInvestigationStatus('open')}
                disabled={isViewOnly}
              >
                <Text style={[
                  styles.radioText,
                  investigationStatus === 'open' && styles.radioTextSelected
                ]}>
                  مفتوح
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  investigationStatus === 'closed' && styles.radioButtonSelected
                ]}
                onPress={() => !isViewOnly && setInvestigationStatus('closed')}
                disabled={isViewOnly}
              >
                <Text style={[
                  styles.radioText,
                  investigationStatus === 'closed' && styles.radioTextSelected
                ]}>
                  مغلق
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Case Classification */}
          <View style={styles.field}>
            <Text style={styles.label}>تصنيف الحالة</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  caseClassification === 'confirmed' && styles.radioButtonConfirmed
                ]}
                onPress={() => !isViewOnly && setCaseClassification('confirmed')}
                disabled={isViewOnly}
              >
                <Text style={[
                  styles.radioText,
                  caseClassification === 'confirmed' && styles.radioTextConfirmed
                ]}>
                  مؤكدة
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  caseClassification === 'probable' && styles.radioButtonProbable
                ]}
                onPress={() => !isViewOnly && setCaseClassification('probable')}
                disabled={isViewOnly}
              >
                <Text style={[
                  styles.radioText,
                  caseClassification === 'probable' && styles.radioTextProbable
                ]}>
                  محتملة
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  caseClassification === 'not_a_case' && styles.radioButtonNotCase
                ]}
                onPress={() => !isViewOnly && setCaseClassification('not_a_case')}
                disabled={isViewOnly}
              >
                <Text style={[
                  styles.radioText,
                  caseClassification === 'not_a_case' && styles.radioTextNotCase
                ]}>
                  ليست حالة
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Form Fields */}
        {template.template_data.sections?.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.description && (
              <Text style={styles.sectionDescription}>{section.description}</Text>
            )}
            
            {section.fields?.map((field) => renderField(field))}
            
            {/* Render subsections */}
            {section.subsections?.map((subsection) => (
              <View key={subsection.id} style={styles.subsection}>
                <Text style={styles.subsectionTitle}>{subsection.title}</Text>
                {subsection.description && (
                  <Text style={styles.sectionDescription}>{subsection.description}</Text>
                )}
                {subsection.fields?.map((field) => renderField(field))}
              </View>
            ))}
          </View>
        ))}

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text style={styles.metadataText}>
            تاريخ الإنشاء: {caseItem.created_at ? new Date(caseItem.created_at).toLocaleString('en-GB') : '-'}
          </Text>
          {caseItem.updated_at && (
            <Text style={styles.metadataText}>
              آخر تحديث: {new Date(caseItem.updated_at).toLocaleString('en-GB')}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button - Only show in edit mode */}
      <FloatingButton
        visible={!isViewOnly && isEditMode}
        button={{
          label: isSaving ? undefined : 'حفظ',
          onPress: handleSave,
          disabled: isSaving || !canEdit,
          backgroundColor: COLORS.primary,
          labelStyle: {
            color: COLORS.white,
            fontSize: 17,
            fontWeight: '600',
          },
        }}
        bottomMargin={20}
        hideBackgroundOverlay={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  versionHistoryButton: {
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  versionHistoryText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
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
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 19,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 8,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    backgroundColor: COLORS.primarySoftAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 19,
    color: COLORS.textPrimary,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  inputDisabled: {
    backgroundColor: COLORS.primarySoft,
    color: COLORS.textMuted,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  sectionDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
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
  radioGroupField: {
    gap: 12,
  },
  radioOption: {
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginStart: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  radioLabelText: {
    fontSize: 19,
    color: COLORS.textPrimary,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    flex: 1,
  },
  checkboxGroup: {
    gap: 12,
  },
  checkboxOption: {
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginStart: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 19,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 19,
    color: COLORS.textPrimary,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    flex: 1,
  },
  selectContainer: {
    gap: 8,
  },
  selectOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.primarySoftAlt,
  },
  selectOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
  },
  selectOptionText: {
    fontSize: 19,
    color: COLORS.textPrimary,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  selectOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  unitNumberContainer: {
    gap: 8,
  },
  unitNumberInput: {
    flex: 1,
  },
  unitSelectContainer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  unitOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.primarySoftAlt,
  },
  unitOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
  },
  unitOptionText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  unitOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
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
  conditionalContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  dateButton: {
    backgroundColor: COLORS.primarySoftAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
  },
  dateButtonText: {
    fontSize: 19,
    color: COLORS.textPrimary,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  dateButtonPlaceholder: {
    color: COLORS.textMuted,
  },
  radioGroup: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  radioButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
    borderWidth: 2,
  },
  radioButtonConfirmed: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
    borderWidth: 2,
  },
  radioButtonProbable: {
    borderColor: '#eab308',
    backgroundColor: '#fef9c3',
    borderWidth: 2,
  },
  radioButtonNotCase: {
    borderColor: '#6b7280',
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
  },
  radioText: {
    fontSize: 16,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  radioTextSelected: {
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  radioTextConfirmed: {
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  radioTextProbable: {
    color: '#a16207',
    fontWeight: '600',
  },
  radioTextNotCase: {
    color: '#4b5563',
    fontWeight: '600',
  },
  metadata: {
    backgroundColor: COLORS.primarySoftAlt,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  metadataText: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 4,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    marginEnd: 16,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

