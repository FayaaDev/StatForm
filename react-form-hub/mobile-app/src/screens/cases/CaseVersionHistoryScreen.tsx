// Case version history screen with timeline UI
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  I18nManager,
} from 'react-native';
import { SkeletonView } from 'react-native-ui-lib';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { caseService } from '../../shared/services';
import { CaseData, LocalTemplate } from '../../shared/types';
import { COLORS } from '../../theme/colors';
import { Button, AppText as Text } from '../../components/ui';

export const CaseVersionHistoryScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { caseId, templateId, template } = route.params as {
    caseId: number;
    templateId: string;
    template: LocalTemplate;
  };

  const [versions, setVersions] = useState<CaseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    try {
      setIsLoading(true);
      const fetchedVersions = await caseService.getCaseVersions(caseId, templateId);
      // Sort by version number descending (most recent first)
      const sortedVersions = fetchedVersions.sort((a, b) => {
        if (a.version_number && b.version_number) {
          return b.version_number - a.version_number;
        }
        // Fallback to created_at
        if (a.created_at && b.created_at) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return 0;
      });
      setVersions(sortedVersions);
    } catch (error) {
      console.error('Error loading versions:', error);
      Alert.alert('خطأ', 'فشل في تحميل سجل النسخ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewVersion = (version: CaseData) => {
    navigation.navigate('CaseVersionDetail', {
      version,
      template,
    });
  };

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

  const renderVersion = (version: CaseData, index: number) => {
    const isLatest = index === 0;
    const isOriginal = !version.version_number || version.version_number === 1;
    const investigationStatus =
      version.investigation_status ||
      (version.case_data && (
        version.case_data['investigation_status'] ||
        version.case_data['investigationStatus']
      ));
    const caseClassification =
      version.case_classification ||
      (version.case_data && (
        version.case_data['case_classification'] ||
        version.case_data['caseClassification']
      ));

    return (
      <View key={version.id} style={styles.timelineItem}>
        {/* Timeline Line */}
        {index < versions.length - 1 && <View style={styles.timelineLine} />}
        
        {/* Timeline Dot */}
        <View style={[
          styles.timelineDot,
          isLatest && styles.timelineDotLatest,
          isOriginal && styles.timelineDotOriginal
        ]} />

        {/* Version Card */}
        <View style={styles.versionCard}>
          <View style={styles.versionHeader}>
            <View style={styles.versionInfo}>
              <Text style={styles.versionNumber}>
                {isOriginal ? 'النسخة الأصلية' : `النسخة ${version.version_number || '-'}`}
              </Text>
              {isLatest && (
                <View style={styles.latestBadge}>
                  <Text style={styles.latestBadgeText}>الأحدث</Text>
                </View>
              )}
            </View>
            {version.version_label && (
              <Text style={styles.versionLabel}>{version.version_label}</Text>
            )}
          </View>

          <View style={styles.versionMeta}>
            <Text style={styles.metaText}>
              التاريخ: {version.created_at ? new Date(version.created_at).toLocaleString('en-GB') : '-'}
            </Text>
            {version.case_name && (
              <Text style={styles.metaText}>الاسم: {version.case_name}</Text>
            )}
            <Text style={styles.metaText}>
              حالة التقصي: {getInvestigationStatusLabel(investigationStatus)}
            </Text>
            <Text style={styles.metaText}>
              تصنيف الحالة: {getClassificationLabel(caseClassification)}
            </Text>
          </View>

          <Button
            label="عرض التفاصيل"
            onPress={() => handleViewVersion(version)}
            variant="secondary"
            size="small"
            style={{ marginTop: 12, borderWidth: 1, borderColor: COLORS.primary }}
          />
        </View>
      </View>
    );
  };

  const renderSkeletonVersion = (index: number) => (
    <View key={`skeleton-${index}`} style={styles.timelineItem}>
      {index < 4 && <View style={styles.timelineLine} />}
      <View style={styles.timelineDot} />
      <View style={styles.versionCard}>
        <SkeletonView showContent={false} renderContent={() => null}>
          <View style={{ marginBottom: 12 }}>
            <View style={{ width: '50%', height: 18, backgroundColor: '#e5e7eb', borderRadius: 4, marginBottom: 8 }} />
            <View style={{ width: '40%', height: 14, backgroundColor: '#e5e7eb', borderRadius: 4 }} />
          </View>
          <View style={{ marginBottom: 12 }}>
            <View style={{ width: '70%', height: 14, backgroundColor: '#e5e7eb', borderRadius: 4, marginBottom: 6 }} />
            <View style={{ width: '60%', height: 14, backgroundColor: '#e5e7eb', borderRadius: 4, marginBottom: 6 }} />
            <View style={{ width: '65%', height: 14, backgroundColor: '#e5e7eb', borderRadius: 4 }} />
          </View>
          <View style={{ width: '100%', height: 36, backgroundColor: '#e5e7eb', borderRadius: 8 }} />
        </SkeletonView>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>سجل النسخ</Text>
          <Text style={styles.headerSubtitle}>جاري التحميل...</Text>
        </View>
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.timeline}>
            {[0, 1, 2, 3, 4].map((index) => renderSkeletonVersion(index))}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>سجل النسخ</Text>
        <Text style={styles.headerSubtitle}>
          {versions.length} {versions.length === 1 ? 'نسخة' : 'نسخ'}
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {versions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>لا يوجد سجل نسخ</Text>
          </View>
        ) : (
          <View style={styles.timeline}>
            {versions.map((version, index) => renderVersion(version, index))}
          </View>
        )}
      </ScrollView>
      
      {/* Bottom fade effect */}
      <LinearGradient
        colors={['rgba(244, 247, 247, 0)', 'rgba(244, 247, 247, 0.8)', COLORS.background]}
        locations={[0, 0.5, 1]}
        style={styles.bottomFader}
        pointerEvents="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 19,
    color: COLORS.textSecondary,
  },
  header: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: '600',
    color: COLORS.textPrimary,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  timeline: {
    paddingEnd: 8,
  },
  timelineItem: {
    position: 'relative',
    paddingEnd: 32,
    marginBottom: 24,
  },
  timelineLine: {
    position: 'absolute',
    right: 11,
    top: 24,
    bottom: -24,
    width: 2,
    backgroundColor: COLORS.border,
  },
  timelineDot: {
    position: 'absolute',
    right: 4,
    top: 12,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  timelineDotLatest: {
    backgroundColor: COLORS.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    right: 2,
    top: 10,
  },
  timelineDotOriginal: {
    backgroundColor: '#6b7280',
  },
  versionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  versionHeader: {
    marginBottom: 12,
  },
  versionInfo: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  versionNumber: {
    fontSize: 21,
    fontWeight: '600',
    color: COLORS.textPrimary,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  latestBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  latestBadgeText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  versionLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    marginTop: 4,
  },
  versionMeta: {
    marginBottom: 12,
  },
  metaText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  viewButton: {
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  viewButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 21,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  bottomFader: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
});

