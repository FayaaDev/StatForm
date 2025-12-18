import React from 'react';
import {
    View,
    Modal,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    I18nManager,
    ActivityIndicator,
} from 'react-native';
import { Assignment } from '../../shared/types';
import { COLORS } from '../../theme/colors';
import { Button, AppText as Text } from '../ui';

interface AssignmentDetailsModalProps {
    visible: boolean;
    assignment: Assignment | null;
    onClose: () => void;
    onAccept: (assignment: Assignment) => void;
    onReject: (assignment: Assignment) => void;
    onStart: (assignment: Assignment) => void;
    processingId: number | null;
}

export const AssignmentDetailsModal: React.FC<AssignmentDetailsModalProps> = ({
    visible,
    assignment,
    onClose,
    onAccept,
    onReject,
    onStart,
    processingId,
}) => {
    if (!assignment) return null;

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

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.detailsContainer}>
                <View style={styles.detailsContent}>
                    <ScrollView>
                        <View style={styles.detailsHeader}>
                            <Text style={styles.detailsTitle}>تفاصيل التكليف</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.detailSection}>
                            <Text style={styles.detailLabel}>رقم البلاغ:</Text>
                            <Text style={styles.detailValue}>{assignment.notification_id}</Text>
                        </View>

                        <View style={styles.detailSection}>
                            <Text style={styles.detailLabel}>اسم الحالة:</Text>
                            <Text style={styles.detailValue}>{assignment.notification_case_name}</Text>
                        </View>

                        <View style={styles.detailSection}>
                            <Text style={styles.detailLabel}>المريض:</Text>
                            <Text style={styles.detailValue}>{assignment.patient_identifier || 'غير محدد'}</Text>
                        </View>

                        <View style={styles.detailSection}>
                            <Text style={styles.detailLabel}>المدينة:</Text>
                            <Text style={styles.detailValue}>{assignment.city_name}</Text>
                        </View>

                        <View style={styles.detailSection}>
                            <Text style={styles.detailLabel}>المرض:</Text>
                            <Text style={styles.detailValue}>{assignment.disease}</Text>
                        </View>

                        <View style={styles.detailSection}>
                            <Text style={styles.detailLabel}>الأولوية:</Text>
                            <Text style={[styles.detailValue, { color: getPriorityColor(assignment.priority) }]}>
                                {getPriorityLabel(assignment.priority)}
                            </Text>
                        </View>

                        {assignment.supervisor_name && (
                            <View style={styles.detailSection}>
                                <Text style={styles.detailLabel}>المشرف:</Text>
                                <Text style={styles.detailValue}>{assignment.supervisor_name}</Text>
                            </View>
                        )}

                        {assignment.assignment_notes && (
                            <View style={styles.detailSection}>
                                <Text style={styles.detailLabel}>ملاحظات التكليف:</Text>
                                <Text style={styles.detailValue}>{assignment.assignment_notes}</Text>
                            </View>
                        )}

                        {assignment.supervisor_notes && (
                            <View style={styles.detailSection}>
                                <Text style={styles.detailLabel}>ملاحظات المشرف:</Text>
                                <Text style={styles.detailValue}>{assignment.supervisor_notes}</Text>
                            </View>
                        )}

                        {assignment.due_date && (
                            <View style={styles.detailSection}>
                                <Text style={styles.detailLabel}>تاريخ الاستحقاق:</Text>
                                <Text style={styles.detailValue}>
                                    {new Date(assignment.due_date).toLocaleDateString('en-GB')}
                                </Text>
                            </View>
                        )}

                        <View style={styles.actionButtons}>
                            {assignment.referral_status === 'assigned_investigator' && (
                                <>
                                    <Button
                                        label={processingId === assignment.id ? undefined : "قبول التكليف"}
                                        onPress={() => onAccept(assignment)}
                                        disabled={processingId === assignment.id}
                                        variant="primary"
                                        style={{ width: '100%' }}
                                    >
                                        {processingId === assignment.id && <ActivityIndicator color="#fff" />}
                                    </Button>

                                    <Button
                                        label="رفض التكليف"
                                        onPress={() => onReject(assignment)}
                                        disabled={processingId === assignment.id}
                                        variant="danger"
                                        style={{ width: '100%' }}
                                    />
                                </>
                            )}

                            {(assignment.referral_status === 'accepted_investigator' ||
                                assignment.referral_status === 'in_progress') && (
                                    <Button
                                        label="بدء التحقيق"
                                        onPress={() => onStart(assignment)}
                                        backgroundColor={COLORS.primaryMuted}
                                        style={{ width: '100%' }}
                                    />
                                )}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    detailsContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    detailsContent: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '85%',
        padding: 20,
    },
    detailsHeader: {
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    detailsTitle: {
        fontSize: 23,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    closeButton: {
        fontSize: 27,
        color: COLORS.textSecondary,
        fontWeight: 'bold',
    },
    detailSection: {
        marginBottom: 16,
    },
    detailLabel: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 4,
        fontWeight: '600',
        writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    detailValue: {
        fontSize: 19,
        color: COLORS.textPrimary,
        writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    actionButtons: {
        marginTop: 24,
        gap: 12,
    },
    actionButton: {
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    acceptButton: {
        backgroundColor: COLORS.primary,
    },
    rejectButton: {
        backgroundColor: COLORS.error,
    },
    startButton: {
        backgroundColor: COLORS.primaryMuted,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 19,
        fontWeight: '600',
    },
});
