// Template list screen
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
import { SkeletonView, Card } from 'react-native-ui-lib';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LocalTemplate, Assignment } from '../../shared/types';
import { templateService, referralService } from '../../shared/services';
import { COLORS } from '../../theme/colors';
import { AssignmentsModal } from '../../components/forms/AssignmentsModal';
import { AssignmentDetailsModal } from '../../components/forms/AssignmentDetailsModal';
import { Button, AppText as Text, AppTextInput as TextInput } from '../../components/ui';

type NavigationProp = StackNavigationProp<any>;

export const TemplateListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, refreshUser } = useAuth();
  const { templates: dataTemplates, loadTemplates, isLoading: dataLoading, isOnline } = useData();
  const [filteredTemplates, setFilteredTemplates] = useState<LocalTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isRefreshingUser = React.useRef(false);

  // Assignments state
  const [showAssignmentsModal, setShowAssignmentsModal] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState<number | undefined>(undefined);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // Details Modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Load templates on mount
  useEffect(() => {
    if (dataTemplates.length === 0) {
      loadTemplates();
    }
  }, []);

  // Fetch assignments for T5/R5 users
  useEffect(() => {
    if (user?.user_tier === 'T5' || user?.user_tier === 'R5') {
      fetchAssignments();
    }
  }, [user]);

  // Reload when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Prevent multiple simultaneous refreshes
      if (isRefreshingUser.current) {
        console.log('User refresh already in progress, skipping...');
        return;
      }

      console.log('Screen focused, refreshing user and reloading templates...');

      // Refresh user data first to get latest assignments, then load templates
      const refreshAndLoad = async () => {
        isRefreshingUser.current = true;
        try {
          await refreshUser();
          console.log('User data refreshed on screen focus');

          // Refresh assignments for T5/R5 users
          if (user?.user_tier === 'T5' || user?.user_tier === 'R5') {
            await fetchAssignments();
          }
        } catch (error) {
          console.warn('Could not refresh user on focus:', error);
        }

        await loadTemplates();
        isRefreshingUser.current = false;
      };

      refreshAndLoad();
    }, [user?.user_tier])
  );

  const fetchAssignments = async () => {
    if (!user?.id) return;
    try {
      const response = await referralService.getInvestigatorAssignments(user.id);
      setAssignments(response.referrals || []);
    } catch (err) {
      console.error('Error fetching assignments:', err);
    }
  };

  // Filter templates based on search query
  const filterTemplates = React.useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredTemplates(dataTemplates);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = dataTemplates.filter(
        (template) =>
          template.name.toLowerCase().includes(query) ||
          template.description?.toLowerCase().includes(query) ||
          template.template_data.disease?.toLowerCase().includes(query)
      );
      setFilteredTemplates(filtered);
    }
  }, [searchQuery, dataTemplates]);

  useEffect(() => {
    filterTemplates();
  }, [filterTemplates]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // First, refresh user data to get latest disease assignments
      console.log('🔄 Pull-to-refresh: Refreshing user data...');
      await refreshUser();
      console.log('✅ User data refreshed');

      // Refresh assignments for T5/R5 users
      if (user?.user_tier === 'T5' || user?.user_tier === 'R5') {
        await fetchAssignments();
      }

      // Then, reload templates with fresh user data
      console.log('🔄 Reloading templates with updated user data...');
      await loadTemplates();
      console.log('✅ Templates reloaded');
    } catch (error) {
      console.error('Error refreshing:', error);
      Alert.alert('خطأ', 'فشل في تحديث النماذج');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTemplatePress = (template: LocalTemplate) => {
    const permission = user
      ? templateService.getUserPermissionForTemplate(template, user)
      : 'edit';

    navigation.navigate('FillForm', { template, permission });
  };

  const handleViewCases = (template: LocalTemplate) => {
    const permission = user
      ? templateService.getUserPermissionForTemplate(template, user)
      : 'edit';

    navigation.navigate('CaseList', { template, permission });
  };

  // Assignment Actions
  const handleAcceptAssignment = async (assignment: Assignment) => {
    if (!user?.id || !user?.user_tier) return;

    try {
      setProcessingId(assignment.id);
      await referralService.acceptReferral(assignment.id, user.id, user.user_tier);
      Alert.alert('نجح', 'تم قبول التكليف بنجاح');
      setShowDetailsModal(false);
      fetchAssignments();
    } catch (err) {
      console.error('Error accepting assignment:', err);
      Alert.alert('خطأ', 'فشل في قبول التكليف');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectAssignment = async (assignment: Assignment) => {
    if (!user?.id || !user?.user_tier) return;

    Alert.prompt(
      'رفض التكليف',
      'يرجى إدخال سبب الرفض:',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'إرسال',
          onPress: async (reason?: string) => {
            if (!reason?.trim()) {
              Alert.alert('تنبيه', 'يجب إدخال سبب الرفض');
              return;
            }

            try {
              setProcessingId(assignment.id);
              await referralService.rejectReferral(
                assignment.id,
                user.id,
                user.user_tier!,
                reason
              );
              Alert.alert('نجح', 'تم رفض التكليف');
              setShowDetailsModal(false);
              fetchAssignments();
            } catch (err) {
              console.error('Error rejecting assignment:', err);
              Alert.alert('خطأ', 'فشل في رفض التكليف');
            } finally {
              setProcessingId(null);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleStartInvestigation = async (assignment: Assignment) => {
    try {
      // Find the template from the loaded templates
      const template = dataTemplates.find(t => t.id === assignment.target_template_id);
      
      if (!template) {
        Alert.alert('خطأ', 'لم يتم العثور على النموذج');
        return;
      }

      // Navigate to fill form screen with assignment context
      navigation.navigate('FillForm', {
        template: template,
        referralId: assignment.id,
        permission: 'edit',
      });

      // Start the investigation in the background
      await referralService.startInvestigation(assignment.id);

      setShowDetailsModal(false);
    } catch (err) {
      console.error('Error starting investigation:', err);
      Alert.alert('خطأ', 'فشل في بدء التحقيق');
    }
  };

  const renderSkeletonTemplate = () => (
    <View style={styles.templateCard}>
      <SkeletonView
        showContent={false}
        renderContent={() => null}
      >
        <View style={{ marginBottom: 12 }}>
          <View style={{ width: '70%', height: 20, backgroundColor: '#e5e7eb', borderRadius: 4, marginBottom: 8 }} />
          <View style={{ width: '90%', height: 16, backgroundColor: '#e5e7eb', borderRadius: 4, marginBottom: 4 }} />
          <View style={{ width: '60%', height: 16, backgroundColor: '#e5e7eb', borderRadius: 4 }} />
        </View>
        <View style={{ width: '40%', height: 14, backgroundColor: '#e5e7eb', borderRadius: 4, marginBottom: 12 }} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1, height: 40, backgroundColor: '#e5e7eb', borderRadius: 8 }} />
          <View style={{ flex: 1, height: 40, backgroundColor: '#e5e7eb', borderRadius: 8 }} />
        </View>
      </SkeletonView>
    </View>
  );

  const renderTemplate = ({ item }: { item: LocalTemplate }) => {
    const cleanName = item.name.replace(/\s*\(Deployed:.*?\)$/, '').trim();
    const isInvestigator = user?.user_tier === 'T5' || user?.user_tier === 'R5';

    // Count assignments for this template
    // Note: assignment.target_template_id is number, item.id is number
    const templateAssignmentsCount = assignments.filter(
      a => a.target_template_id == item.id
    ).length;

    return (
      <View style={styles.templateCard}>
        <View style={styles.templateHeader}>
          <Text style={styles.templateName}>{cleanName}</Text>
        </View>

        {item.description && (
          <Text style={styles.templateDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        {item.template_data.disease && (
          <Text style={styles.templateDisease}>
            المرض: {item.template_data.disease}
          </Text>
        )}

        <View style={styles.buttonContainer}>
          <Button
            label="ملء النموذج"
            onPress={() => handleTemplatePress(item)}
            variant="primary"
            style={{ flex: 1 }}
          />

          <Button
            label="إدارة الحالات"
            onPress={() => handleViewCases(item)}
            variant="primary"
            style={{ flex: 1 }}
          />
        </View>

        {/* Assignments Button inside card */}
        {isInvestigator && (
          <Button
            onPress={() => {
              setActiveTemplateId(item.id);
              setShowAssignmentsModal(true);
            }}
            style={{ marginTop: 8, width: '100%' }}
            variant="primary"
            label="التكليفات"
          >
            {templateAssignmentsCount > 0 && (
              <View style={styles.assignmentsBadge}>
                <Text style={styles.assignmentsBadgeText}>{templateAssignmentsCount}</Text>
              </View>
            )}
          </Button>
        )}
      </View>
    );
  };

  if (dataLoading && dataTemplates.length === 0) {
    return (
      <View style={styles.container}>
        {/* Skeleton Modern Header */}
        <View style={styles.modernHeader}>
          <View style={styles.headerGradient}>
            <Card style={styles.userCard} enableShadow elevation={4}>
              <SkeletonView showContent={false}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#e5e7eb', marginEnd: 12 }} />
                  <View style={{ flex: 1 }}>
                    <View style={{ width: '60%', height: 18, backgroundColor: '#e5e7eb', borderRadius: 4, marginBottom: 8 }} />
                    <View style={{ width: '40%', height: 14, backgroundColor: '#e5e7eb', borderRadius: 4 }} />
                  </View>
                </View>
              </SkeletonView>
            </Card>
            <View style={styles.searchWrapper}>
              <View style={[styles.modernSearchInput, { backgroundColor: '#f3f4f6' }]} />
            </View>
          </View>
        </View>
        <View style={styles.listContent}>
          {[1, 2, 3, 4, 5].map((_, index) => (
            <View key={index}>{renderSkeletonTemplate()}</View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Modern Header */}
      <View style={styles.modernHeader}>
        <View style={styles.headerGradient}>
          {/* User Info Card */}
          <Card
            style={styles.userCard}
            enableShadow
            elevation={4}
          >
            <View style={styles.userCardContent}>
              {/* Left side: Avatar & Info */}
              <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </Text>
                  </View>
                  <View style={[styles.onlineIndicator, { backgroundColor: isOnline ? '#10B981' : COLORS.error }]} />
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user?.username || 'مستخدم'}</Text>
                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>
                      {isOnline ? 'متصل' : 'غير متصل'}
                    </Text>
                    {user?.user_tier && (
                      <View style={styles.tierBadge}>
                        <Text style={styles.tierText}>{user.user_tier}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Right side: Assignment badge if applicable */}
              {(user?.user_tier === 'T5' || user?.user_tier === 'R5') && assignments.length > 0 && (
                <TouchableOpacity
                  style={styles.assignmentsBadgeContainer}
                  onPress={() => {
                    setActiveTemplateId(undefined);
                    setShowAssignmentsModal(true);
                  }}
                >
                  <View style={styles.assignmentsCountBadge}>
                    <Text style={styles.assignmentsCountText}>{assignments.length}</Text>
                  </View>
                  <Text style={styles.assignmentsBadgeLabel}>تكليفات</Text>
                </TouchableOpacity>
              )}
            </View>
          </Card>

          {/* Search bar inside header */}
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.modernSearchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="البحث في النماذج..."
              placeholderTextColor={COLORS.placeholder}
            />
          </View>
        </View>
      </View>

      {/* Template list */}
      <FlatList
        data={filteredTemplates}
        renderItem={renderTemplate}
        keyExtractor={(item) => item.template_data.id}
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
            <Text style={styles.emptyText}>
              {searchQuery ? 'لم يتم العثور على نماذج' : 'لا توجد نماذج متاحة'}
            </Text>
          </View>
        }
      />

      {/* Assignments Modal (List) */}
      <AssignmentsModal
        visible={showAssignmentsModal}
        onClose={() => {
          setShowAssignmentsModal(false);
          setActiveTemplateId(undefined);
          fetchAssignments(); // Refresh assignments when modal closes
        }}
        onSelectAssignment={(assignment) => {
          setSelectedAssignment(assignment);
          setShowAssignmentsModal(false); // Close list
          setTimeout(() => setShowDetailsModal(true), 300); // Open details after delay
        }}
        templateId={activeTemplateId}
      />

      {/* Assignment Details Modal */}
      <AssignmentDetailsModal
        visible={showDetailsModal}
        assignment={selectedAssignment}
        onClose={() => setShowDetailsModal(false)}
        onAccept={handleAcceptAssignment}
        onReject={handleRejectAssignment}
        onStart={handleStartInvestigation}
        processingId={processingId}
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
    fontSize: 17,
    color: COLORS.textSecondary,
  },
  // New Modern Header Styles
  modernHeader: {
    backgroundColor: COLORS.primary,
    paddingBottom: 16,
  },
  headerGradient: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  userCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  userCardContent: {
    flexDirection: I18nManager.isRTL ? 'row' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: I18nManager.isRTL ? 'row' : 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginEnd: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: I18nManager.isRTL ? undefined : 2,
    left: I18nManager.isRTL ? 2 : undefined,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 19,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  statusRow: {
    flexDirection: I18nManager.isRTL ? 'row' : 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  tierBadge: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tierText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  assignmentsBadgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  assignmentsCountBadge: {
    backgroundColor: COLORS.error,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  assignmentsCountText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  assignmentsBadgeLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  searchWrapper: {
    paddingHorizontal: 0,
  },
  modernSearchInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    fontSize: 17,
    color: COLORS.textPrimary,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Old styles (keeping for backward compatibility)
  header: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statusContainer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  statusUsername: {
    marginTop: 6,
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginStart: 8,
  },
  statusText: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: COLORS.surface,
  },
  searchInput: {
    backgroundColor: COLORS.primarySoftAlt,
    borderRadius: 8,
    padding: 12,
    fontSize: 19,
    color: COLORS.textPrimary,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  listContent: {
    padding: 16,
  },
  templateCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateHeader: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  templateName: {
    flex: 1,
    fontSize: 21,
    fontWeight: '600',
    color: COLORS.textPrimary,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  templateDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 8,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  templateDisease: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 12,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  buttonContainer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: COLORS.primaryMuted,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  assignmentsButtonCard: {
    backgroundColor: COLORS.primary,
    marginTop: 8,
    width: '100%',
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  assignmentsButtonCardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  assignmentsBadge: {
    position: 'absolute',
    top: -8,
    left: I18nManager.isRTL ? undefined : -8,
    right: I18nManager.isRTL ? -8 : undefined,
    backgroundColor: COLORS.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    zIndex: 10,
  },
  assignmentsBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 19,
    color: COLORS.placeholder,
    textAlign: 'center',
  },
  globalSummary: {
    backgroundColor: COLORS.warning,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  globalSummaryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
