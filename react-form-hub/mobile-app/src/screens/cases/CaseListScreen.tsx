// Case list screen
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  I18nManager,
} from 'react-native';
import { Drawer, SkeletonView } from 'react-native-ui-lib';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LocalTemplate, CaseData } from '../../shared/types';
import { caseService } from '../../shared/services';
import { COLORS } from '../../theme/colors';
import { AppText as Text } from '../../components/ui';

export const CaseListScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { user } = useAuth();
  const { loadCases, getCases, refreshData } = useData();
  const { template, permission } = route.params as { template: LocalTemplate; permission: 'view' | 'edit' };
  
  const [cases, setCases] = useState<CaseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadCasesData();
  }, []);

  // Reload cases when screen comes into focus (after editing a case)
  useFocusEffect(
    React.useCallback(() => {
      loadCasesData();
    }, [])
  );

  const loadCasesData = async () => {
    try {
      setIsLoading(true);
      // Get existing cases count before loading
      const existingCases = getCases(template.template_data.id);
      if (existingCases.length > 0) {
        setCases(existingCases);
      }
      await loadCases(template.template_data.id);
      const loadedCases = getCases(template.template_data.id);
      setCases(loadedCases);
    } catch (error) {
      console.error('Error loading cases:', error);
      Alert.alert('خطأ', 'فشل في تحميل الحالات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadCases(template.template_data.id);
      const loadedCases = getCases(template.template_data.id);
      setCases(loadedCases);
    } catch (error) {
      console.error('Error refreshing:', error);
      Alert.alert('خطأ', 'فشل في تحديث البيانات');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getClassificationBorderColor = (classification?: string) => {
    switch (classification) {
      case 'confirmed':
        return COLORS.primary; // Primary
      case 'probable':
        return '#eab308'; // Yellow
      case 'not_a_case':
        return '#6b7280'; // Grey
      default:
        return '#d1d5db';
    }
  };

  const handleCasePress = (item: CaseData) => {
    // Open detail screen
    navigation.navigate('CaseDetail', { 
      caseItem: item, 
      template, 
      permission 
    });
  };

  const handleHistoryPress = async (item: CaseData) => {
    try {
      // Fetch all versions of the case
      const versions = await caseService.getCaseVersions(item.id!, template.template_data.id);
      
      if (versions.length === 0) {
        Alert.alert('تنبيه', 'لا توجد نسخ لهذه الحالة');
        return;
      }
      
      // Sort versions by version number descending to get the latest
      const sortedVersions = versions.sort((a, b) => {
        if (a.version_number && b.version_number) {
          return b.version_number - a.version_number;
        }
        // Fallback to created_at
        if (a.created_at && b.created_at) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return 0;
      });
      
      // Get the latest version (first after sorting)
      const latestVersion = sortedVersions[0];
      
      // Navigate directly to the latest version detail screen
      navigation.navigate('CaseVersionDetail', {
        version: latestVersion,
        template,
      });
    } catch (error) {
      console.error('Error loading latest version:', error);
      Alert.alert('خطأ', 'فشل في تحميل آخر نسخة من الحالة');
    }
  };

  const renderCase = ({ item }: { item: CaseData }) => {
    const borderColor = getClassificationBorderColor(item.case_classification);
    const isClosed = item.investigation_status === 'closed';
    
    return (
      <Drawer
        rightItems={[
          {
            text: 'السجل',
            background: COLORS.primary,
            onPress: () => handleHistoryPress(item),
          },
        ]}
        style={styles.drawerContainer}
      >
        <TouchableOpacity
          style={[
            styles.caseCard,
            { borderColor, borderWidth: 2 },
            isClosed && styles.caseCardClosed
          ]}
          onPress={() => handleCasePress(item)}
        >
          <View style={styles.caseHeader}>
            <Text style={styles.caseName}>
              {item.case_name || item.patient_identifier || `حالة #${item.id}`}
            </Text>
          </View>
          
          {item.patient_identifier && (
            <Text style={styles.caseDetail}>رقم المريض: {item.patient_identifier}</Text>
          )}
          
          <Text style={styles.caseDate}>
            {item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB') : '-'}
          </Text>
        </TouchableOpacity>
      </Drawer>
    );
  };

  const renderSkeletonCase = () => (
    <View style={styles.drawerContainer}>
      <View style={[styles.caseCard, { borderWidth: 2, borderColor: '#d1d5db', width: '100%' }]}>
        <SkeletonView
          showContent={false}
          renderContent={() => null}
        >
          <View style={styles.caseHeader}>
            <View style={{ width: '60%', height: 20, backgroundColor: '#e5e7eb', borderRadius: 4 }} />
          </View>
          <View style={{ width: '50%', height: 16, backgroundColor: '#e5e7eb', borderRadius: 4, marginBottom: 4 }} />
          <View style={{ width: '30%', height: 14, backgroundColor: '#e5e7eb', borderRadius: 4 }} />
        </SkeletonView>
      </View>
    </View>
  );

  if (isLoading) {
    const skeletonCount = cases.length > 0 ? cases.length : 5;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{template.name}</Text>
          <Text style={styles.headerSubtitle}>جاري التحميل...</Text>
        </View>
        <View style={styles.listContent}>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <View key={index}>{renderSkeletonCase()}</View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{template.name}</Text>
        <Text style={styles.headerSubtitle}>
          {cases.length} {cases.length === 1 ? 'حالة' : 'حالات'}
        </Text>
      </View>

      <FlatList
        data={cases}
        renderItem={renderCase}
        keyExtractor={(item) => item.id!.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>لا توجد حالات محفوظة</Text>
            <Text style={styles.emptySubtext}>ابدأ بملء نموذج جديد</Text>
          </View>
        }
      />
      
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
  listContent: {
    padding: 16,
  },
  drawerContainer: {
    marginBottom: 12,
  },
  skeletonContainer: {
    marginBottom: 12,
  },
  caseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  caseHeader: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  caseCardClosed: {
    backgroundColor: COLORS.primarySoftAlt,
    opacity: 0.7,
  },
  caseName: {
    flex: 1,
    fontSize: 19,
    fontWeight: '600',
    color: COLORS.textPrimary,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  caseDetail: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  caseDate: {
    fontSize: 14,
    color: COLORS.placeholder,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 21,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: COLORS.placeholder,
    textAlign: 'center',
  },
  bottomFader: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 260,
  },
});

