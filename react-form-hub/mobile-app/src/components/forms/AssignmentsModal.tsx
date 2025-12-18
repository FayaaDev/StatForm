// Assignments Modal for T5/R5 users
import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  I18nManager,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { referralService } from '../../shared/services';
import { Assignment } from '../../shared/types';
import { COLORS } from '../../theme/colors';
import { Button, AppText as Text } from '../ui';

interface AssignmentsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectAssignment: (assignment: Assignment) => void;
  templateId?: number;
}

export const AssignmentsModal: React.FC<AssignmentsModalProps> = ({
  visible,
  onClose,
  onSelectAssignment,
  templateId
}) => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && user?.id && (user?.user_tier === 'T5' || user?.user_tier === 'R5')) {
      fetchAssignments();
    }
  }, [visible, user]);

  const fetchAssignments = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await referralService.getInvestigatorAssignments(user.id);
      let fetchedAssignments = response.referrals || [];

      // Filter by templateId if provided
      if (templateId) {
        fetchedAssignments = fetchedAssignments.filter(
          a => a.target_template_id == templateId
        );
      }

      setAssignments(fetchedAssignments);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError('فشل في تحميل التكليفات');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      low: COLORS.textSecondary,
      normal: COLORS.primary,
      high: COLORS.warning,
      urgent: COLORS.error,
    };
    return colors[priority] || COLORS.textSecondary;
  };

  const getPriorityLabel = (priority: string): string => {
    const labels: Record<string, string> = {
      low: 'منخفضة',
      normal: 'عادية',
      high: 'عالية',
      urgent: 'عاجلة',
    };
    return labels[priority] || priority;
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      assigned_investigator: 'معلق - بانتظار القبول',
      accepted_investigator: 'مقبول',
      in_progress: 'قيد العمل',
    };
    return labels[status] || status;
  };

  const renderAssignmentItem = ({ item }: { item: Assignment }) => (
    <TouchableOpacity
      style={styles.assignmentCard}
      onPress={() => onSelectAssignment(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.caseName}>{item.notification_case_name}</Text>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>{getPriorityLabel(item.priority)}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>المريض:</Text>
        <Text style={styles.infoValue}>{item.patient_identifier || 'غير محدد'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>المدينة:</Text>
        <Text style={styles.infoValue}>{item.city_name}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>المرض:</Text>
        <Text style={styles.infoValue}>{item.disease}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>الحالة:</Text>
        <Text style={styles.infoValue}>{getStatusLabel(item.referral_status)}</Text>
      </View>

      {item.supervisor_name && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>المشرف:</Text>
          <Text style={styles.infoValue}>{item.supervisor_name}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>التكليفات</Text>
          <TouchableOpacity onPress={onClose} style={styles.headerCloseButton}>
            <Text style={styles.headerCloseText}>✕</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>جاري تحميل التكليفات...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Button
              label="إعادة المحاولة"
              onPress={fetchAssignments}
              variant="primary"
            />
          </View>
        ) : assignments.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>لا توجد تكليفات حالياً</Text>
          </View>
        ) : (
          <FlatList
            data={assignments}
            renderItem={renderAssignmentItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 20,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#fff',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  headerCloseButton: {
    padding: 12, // Increased touch area
    margin: -8, // Offset the padding to keep alignment
  },
  headerCloseText: {
    fontSize: 33, // Slightly larger
    color: '#fff',
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 19,
    color: COLORS.textSecondary,
  },
  errorText: {
    fontSize: 19,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 19,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  assignmentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  caseName: {
    flex: 1,
    fontSize: 19,
    fontWeight: '600',
    color: COLORS.textPrimary,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
    marginBottom: 6,
    gap: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
});
