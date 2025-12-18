// Data context for session-based in-memory caching
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { memoryStorage } from '../services/memoryStorage';
import { caseService, templateService } from '../shared/services';
import { networkService } from '../services/networkService';
import { LocalTemplate, CaseData, CreateCaseRequest } from '../shared/types';
import { useAuth } from './AuthContext';

interface DataContextType {
  // Templates
  templates: LocalTemplate[];
  loadTemplates: () => Promise<void>;
  getTemplate: (templateId: string) => LocalTemplate | undefined;
  
  // Cases
  getCases: (templateId: string) => CaseData[];
  loadCases: (templateId: string) => Promise<void>;
  createCase: (caseData: CreateCaseRequest) => Promise<CaseData>;
  updateCase: (caseId: number, templateId: string, caseData: Partial<CaseData>) => Promise<CaseData>;
  deleteCase: (caseId: number, templateId: string) => Promise<void>;
  
  // Drafts (session-only)
  getDraft: (draftKey: string) => any | undefined;
  saveDraft: (draftKey: string, draftData: any) => void;
  deleteDraft: (draftKey: string) => void;
  
  // Refresh
  refreshData: () => Promise<void>;
  
  // Loading states
  isLoading: boolean;
  isOnline: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [templates, setTemplates] = useState<LocalTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Monitor network status
  useEffect(() => {
    const unsubscribe = networkService.addListener((connected) => {
      setIsOnline(connected);
      if (!connected) {
        Alert.alert(
          'لا يوجد اتصال بالإنترنت',
          'يلزم الاتصال بالإنترنت لتحميل البيانات'
        );
      }
    });

    // Initial check
    networkService.checkConnection().then(setIsOnline);

    return unsubscribe;
  }, []);

  // Load templates when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadTemplates().catch((error) => {
        console.error('Failed to load templates:', error);
      });
    }
  }, [isAuthenticated, user]);

  // Load templates from server and cache in memory
  const loadTemplates = async () => {
    if (!isOnline) {
      Alert.alert('خطأ', 'يلزم الاتصال بالإنترنت لتحميل النماذج');
      return;
    }

    try {
      setIsLoading(true);
      const serverTemplates = await templateService.getAllTemplates();
      
      console.log('📥 Fetched templates from server:', {
        total: serverTemplates.length,
        templates: serverTemplates.map(t => ({
          name: t.name,
          isActive: t.is_active,
          isDeployed: t.template_data?.isDeployed,
          deploymentId: t.template_data?.deploymentId,
          disease: t.template_data?.disease,
          createdBySector: t.template_data?.createdBySector
        }))
      });
      
      // Filter templates for user if user exists
      const filteredTemplates = user
        ? templateService.filterTemplatesForUser(serverTemplates, user)
        : serverTemplates;

      console.log('👤 User filter info:', {
        hasUser: !!user,
        username: user?.username,
        assignedDiseases: user?.assigned_diseases,
        diseasePermissions: user?.disease_permissions,
        globalPermission: user?.global_permission
      });

      console.log('✅ After filtering:', {
        filtered: filteredTemplates.length,
        original: serverTemplates.length,
        templates: filteredTemplates.map(t => t.name)
      });

      // Cache in memory
      memoryStorage.setTemplates(filteredTemplates);
      setTemplates(filteredTemplates);
      
      console.log(`✅ Loaded ${filteredTemplates.length} templates into memory`);
    } catch (error) {
      console.error('Error loading templates:', error);
      Alert.alert('خطأ', 'فشل في تحميل النماذج');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get template from memory cache
  const getTemplate = (templateId: string): LocalTemplate | undefined => {
    return memoryStorage.getTemplate(templateId);
  };

  // Load cases for a template from server and cache in memory
  const loadCases = async (templateId: string) => {
    if (!isOnline) {
      Alert.alert('خطأ', 'يلزم الاتصال بالإنترنت لتحميل الحالات');
      return;
    }

    try {
      setIsLoading(true);
      const cityFilter = user
        ? {
            cityId: user.city_id,
            cityName: user.city_name,
          }
        : undefined;

      const serverCases = await caseService.getCasesForTemplate(
        templateId,
        cityFilter
      );

      // Cache in memory
      memoryStorage.setCases(templateId, serverCases);
      
      console.log(`✅ Loaded ${serverCases.length} cases for template ${templateId}`);
    } catch (error) {
      console.error('Error loading cases:', error);
      Alert.alert('خطأ', 'فشل في تحميل الحالات');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get cases from memory cache
  const getCases = (templateId: string): CaseData[] => {
    return memoryStorage.getCases(templateId);
  };

  // Create a new case on server and add to memory cache
  const createCase = async (caseData: CreateCaseRequest): Promise<CaseData> => {
    if (!isOnline) {
      throw new Error('يلزم الاتصال بالإنترنت لإنشاء حالة');
    }

    try {
      setIsLoading(true);
      const createdCase = await caseService.createCase(caseData);
      
      // Add to memory cache
      memoryStorage.setCase(caseData.template_id, createdCase);
      
      console.log(`✅ Created case ${createdCase.id}`);
      return createdCase;
    } catch (error) {
      console.error('Error creating case:', error);
      Alert.alert('خطأ', 'فشل في إنشاء الحالة');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update case (creates version) on server and update memory cache
  const updateCase = async (
    caseId: number,
    templateId: string,
    caseData: Partial<CaseData>
  ): Promise<CaseData> => {
    if (!isOnline) {
      throw new Error('يلزم الاتصال بالإنترنت لتحديث الحالة');
    }

    try {
      setIsLoading(true);
      
      // Create version label
      const now = new Date();
      const username = user?.username || 'مستخدم';
      const versionLabel = `تعديل ${now.toLocaleDateString('en-GB')} - ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} - ${username}`;
      
      // Create new version on server
      const newVersion = await caseService.createCaseVersion(caseId, caseData, versionLabel);
      
      // Update memory cache with new version
      memoryStorage.setCase(templateId, newVersion);
      
      console.log(`✅ Updated case ${caseId}, created version ${newVersion.id}`);
      return newVersion;
    } catch (error) {
      console.error('Error updating case:', error);
      Alert.alert('خطأ', 'فشل في تحديث الحالة');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete case from server and memory cache
  const deleteCase = async (caseId: number, templateId: string): Promise<void> => {
    if (!isOnline) {
      throw new Error('يلزم الاتصال بالإنترنت لحذف الحالة');
    }

    try {
      setIsLoading(true);
      await caseService.deleteCase(caseId, templateId);
      
      // Remove from memory cache
      memoryStorage.deleteCase(templateId, caseId);
      
      console.log(`✅ Deleted case ${caseId}`);
    } catch (error) {
      console.error('Error deleting case:', error);
      Alert.alert('خطأ', 'فشل في حذف الحالة');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get draft from session storage
  const getDraft = (draftKey: string): any | undefined => {
    return memoryStorage.getDraft(draftKey);
  };

  // Save draft to session storage (lost on app close)
  const saveDraft = (draftKey: string, draftData: any): void => {
    memoryStorage.setDraft(draftKey, draftData);
    console.log(`💾 Draft saved: ${draftKey} (session-only)`);
  };

  // Delete draft from session storage
  const deleteDraft = (draftKey: string): void => {
    memoryStorage.deleteDraft(draftKey);
    console.log(`🗑️ Draft deleted: ${draftKey}`);
  };

  // Refresh all data from server
  const refreshData = async () => {
    if (!isOnline) {
      Alert.alert('خطأ', 'يلزم الاتصال بالإنترنت لتحديث البيانات');
      return;
    }

    try {
      setIsLoading(true);
      
      // Reload templates
      await loadTemplates();
      
      // Reload cases for cached templates
      const cachedTemplates = memoryStorage.getAllTemplates();
      for (const template of cachedTemplates) {
        if (template.template_data?.id) {
          try {
            await loadCases(template.template_data.id);
          } catch (error) {
            console.warn(`Failed to reload cases for template ${template.template_data.id}:`, error);
          }
        }
      }
      
      console.log('✅ Data refreshed');
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert('خطأ', 'فشل في تحديث البيانات');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: DataContextType = {
    templates,
    loadTemplates,
    getTemplate,
    getCases,
    loadCases,
    createCase,
    updateCase,
    deleteCase,
    getDraft,
    saveDraft,
    deleteDraft,
    refreshData,
    isLoading,
    isOnline,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

