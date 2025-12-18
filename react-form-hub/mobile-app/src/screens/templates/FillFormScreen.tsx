// Form fill screen - Full implementation matching DeployedForm.tsx
import React, { useState, useCallback, useEffect } from 'react';
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
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LocalTemplate, Field, ConditionalLogic, ConditionalRule } from '../../shared/types';
import { sanitizeFormData } from '../../shared/utils/numberUtils';
import { referralService } from '../../shared/services';
import { COLORS } from '../../theme/colors';
import { Button, AppText as Text, AppTextInput as TextInput } from '../../components/ui';

export const FillFormScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { isOnline, createCase, getDraft, saveDraft, deleteDraft } = useData();
  const { template, referralId } = route.params as { 
    template: LocalTemplate;
    referralId?: number;
  };
  
  const draftKey = `draft_${template.template_data.id}`;
  
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState<string | null>(null);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  // Initialize form data from session draft or template
  useEffect(() => {
    const existingDraft = getDraft(draftKey);
    if (existingDraft) {
      // Load existing session draft
      setFormData(existingDraft);
      setHasDraft(true);
      Alert.alert(
        'مسودة موجودة',
        'تم العثور على مسودة محفوظة في الجلسة الحالية. هل تريد المتابعة معها؟',
        [
          { 
            text: 'حذف', 
            style: 'destructive',
            onPress: () => {
              deleteDraft(draftKey);
              setHasDraft(false);
              initializeEmptyForm();
            }
          },
          { text: 'استخدام المسودة', onPress: () => {} }
        ]
      );
    } else {
      // Initialize empty form based on template
      initializeEmptyForm();
    }
  }, [template]);

  const initializeEmptyForm = () => {
    const initialData: Record<string, any> = {};
    template.template_data.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.type === 'checkbox') {
          initialData[field.id] = [];
        } else if (field.type === 'unitNumber') {
          initialData[field.id] = { number: '', unit: field.defaultUnit || '' };
        } else {
          initialData[field.id] = '';
        }
      });
      
      // Initialize subsection fields
      section.subsections?.forEach((subsection) => {
        subsection.fields.forEach((field) => {
          if (field.type === 'checkbox') {
            initialData[field.id] = [];
          } else if (field.type === 'unitNumber') {
            initialData[field.id] = { number: '', unit: field.defaultUnit || '' };
          } else {
            initialData[field.id] = '';
          }
        });
      });
    });
    setFormData(initialData);
  };

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(formData).length > 0) {
        saveDraft(draftKey, formData);
        setHasDraft(true);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [formData, draftKey]);

  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
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

  const handleSaveDraft = () => {
    try {
      saveDraft(draftKey, formData);
      setHasDraft(true);
      Alert.alert(
        'تم الحفظ',
        'تم حفظ المسودة في الجلسة الحالية. ⚠️ تنبيه: ستفقد المسودة عند إغلاق التطبيق.',
        [{ text: 'موافق' }]
      );
    } catch (error) {
      console.error('Error saving draft:', error);
      Alert.alert('خطأ', 'فشل في حفظ المسودة');
    }
  };

  const handleSubmit = async () => {
    if (!isOnline) {
      Alert.alert('خطأ', 'يلزم الاتصال بالإنترنت لإرسال الحالة');
      return;
    }

    try {
      setIsSaving(true);
      
      // Extract all fields from template for sanitization
      const allFields = template.template_data.sections.flatMap(s => s.fields);
      
      // Sanitize form data - convert Arabic numerals to Western numerals
      const sanitizedFormData = sanitizeFormData(formData, allFields);
      
      // Derive case name and patient identifier from sanitized data
      const displayField = allFields.find(
        f => f.id.toLowerCase().includes('name') || f.type === 'text'
      );
      const caseName = displayField ? sanitizedFormData[displayField.id] : undefined;
      const patientId = 
        sanitizedFormData.patient_id || 
        sanitizedFormData.patientId || 
        sanitizedFormData.patient_name || 
        sanitizedFormData.patientName || 
        undefined;
      
      // Submit to server - use template_data.id (semantic ID) not template.id (db ID)
      const createdCase = await createCase({
        template_id: template.template_data.id, // This is the semantic ID like "malaria-form-v1"
        case_data: sanitizedFormData,
        case_name: caseName,
        patient_identifier: patientId,
        city_id: user?.city_id,
        city_name: user?.city_name,
      });

      // If this is from a referral, complete the referral
      if (referralId && createdCase?.id) {
        try {
          console.log('Completing referral:', referralId, 'with case:', createdCase.id);
          await referralService.completeReferral(
            referralId,
            createdCase.id,
            template.template_data.id
          );
          console.log('✅ Referral completed successfully');
        } catch (referralError) {
          console.error('Error completing referral:', referralError);
          // Don't fail the whole submission if referral completion fails
          // The case was created successfully
        }
      }

      // Delete draft after successful submission
      deleteDraft(draftKey);
      
      Alert.alert(
        'تم الإرسال',
        'تم إرسال الحالة بنجاح',
        [
          {
            text: 'موافق',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting case:', error);
      
      // Get more detailed error message
      let errorMessage = 'فشل إرسال الحالة';
      if (error instanceof Error) {
        errorMessage += `\n${error.message}`;
        console.error('Error details:', error.message);
      }
      
      Alert.alert('خطأ', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const renderField = (field: Field) => {
    const value = formData[field.id] || '';

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
              style={styles.input}
              value={value}
              onChangeText={(val) => handleFieldChange(field.id, val)}
              placeholder={field.placeholder}
              keyboardType={field.type === 'email' ? 'email-address' : field.type === 'phone' ? 'phone-pad' : 'default'}
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
              style={styles.input}
              value={value}
              onChangeText={(val) => handleFieldChange(field.id, val)}
              placeholder={field.placeholder}
              keyboardType="numeric"
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
              style={styles.dateButton}
              onPress={() => {
                setTempDate(dateValue || new Date());
                setShowDatePicker(field.id);
              }}
            >
              <Text style={[styles.dateButtonText, !value && styles.dateButtonPlaceholder]}>
                {value || field.placeholder || 'اختر التاريخ'}
              </Text>
            </TouchableOpacity>
            {showDatePicker === field.id && (
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
            {showDatePicker === field.id && Platform.OS === 'ios' && (
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
              style={[styles.input, styles.textArea]}
              value={value}
              onChangeText={(val) => handleFieldChange(field.id, val)}
              placeholder={field.placeholder}
              multiline
              numberOfLines={4}
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
            <View style={styles.radioGroup}>
              {field.options?.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.radioOption}
                  onPress={() => handleFieldChange(field.id, option.value)}
                >
                  <View style={styles.radioCircle}>
                    {value === option.value && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>{option.label}</Text>
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
                  onPress={() => handleCheckboxChange(field.id, option.value, !checkboxValues.includes(option.value))}
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
                  onPress={() => handleFieldChange(field.id, option.value)}
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
              style={styles.input}
              value={value}
              onChangeText={(val) => handleFieldChange(field.id, val)}
              placeholder={field.placeholder}
            />
            {/* TODO: Add autocomplete suggestions dropdown */}
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
                style={[styles.input, styles.unitNumberInput]}
                value={unitValue.number}
                onChangeText={(val) => handleFieldChange(field.id, { ...unitValue, number: val })}
                placeholder={field.placeholder || 'أدخل القيمة'}
                keyboardType="numeric"
              />
              <View style={styles.unitSelectContainer}>
                {field.unitOptions?.map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={[
                      styles.unitOption,
                      unitValue.unit === unit && styles.unitOptionSelected
                    ]}
                    onPress={() => handleFieldChange(field.id, { ...unitValue, unit })}
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
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => handleFieldChange(field.id, 'نعم')}
              >
                <View style={styles.radioCircle}>
                  {value === 'نعم' && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioLabel}>نعم</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => handleFieldChange(field.id, 'لا')}
              >
                <View style={styles.radioCircle}>
                  {value === 'لا' && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioLabel}>لا</Text>
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
        <Text style={styles.title}>{template.name}</Text>
        
        {hasDraft && (
          <View style={styles.draftBanner}>
            <Text style={styles.draftBannerText}>📝 مسودة محفوظة (الجلسة الحالية فقط)</Text>
          </View>
        )}

        {/* Render form sections */}
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
      </ScrollView>

      {/* Action buttons */}
      <View style={styles.footer}>
        <Button
          label={isSaving ? undefined : "حفظ كمسودة"}
          onPress={handleSaveDraft}
          disabled={isSaving}
          style={{ flex: 1, backgroundColor: COLORS.primaryMuted }}
        >
          {isSaving && <ActivityIndicator color="#fff" />}
        </Button>
        
        <Button
          label={isSaving ? undefined : "إرسال"}
          onPress={handleSubmit}
          disabled={isSaving}
          style={{ flex: 1 }}
        >
          {isSaving && <ActivityIndicator color="#fff" />}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  draftBanner: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderStartWidth: 4,
    borderStartColor: '#f59e0b',
  },
  draftBannerText: {
    fontSize: 16,
    color: '#92400e',
    fontWeight: '600',
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
    marginBottom: 8,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  radioGroup: {
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
  radioLabel: {
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
    flexDirection: 'row',
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
  datePickerDone: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  datePickerDoneText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '600',
  },
  footer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    padding: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  draftButton: {
    backgroundColor: COLORS.primaryMuted,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '600',
  },
});
