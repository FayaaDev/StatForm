// Case service for mobile app
import { apiClient } from './apiClient';
import { CaseData, CreateCaseRequest, UpdateCaseRequest } from '../types';

export const caseService = {
  // Get all cases for a template
  async getCasesForTemplate(
    templateId: string,
    cityFilter?: { cityId?: string; cityName?: string }
  ): Promise<CaseData[]> {
    try {
      const params: Record<string, string> = {};
      if (cityFilter?.cityId) {
        params.cityId = cityFilter.cityId;
      }
      
      return await apiClient.get<CaseData[]>(
        `/cases/template/${templateId}`,
        Object.keys(params).length > 0 ? params : undefined
      );
    } catch (error) {
      console.error('Error fetching cases:', error);
      throw error;
    }
  },

  // Get a specific case by ID
  async getCase(caseId: number, templateId: string): Promise<CaseData> {
    try {
      return await apiClient.get<CaseData>(
        `/cases/${caseId}`,
        { templateId }
      );
    } catch (error) {
      console.error('Error fetching case:', error);
      throw error;
    }
  },

  // Create a new case
  async createCase(caseData: CreateCaseRequest): Promise<CaseData> {
    try {
      console.log('Creating case with data:', {
        template_id: caseData.template_id,
        case_name: caseData.case_name,
        patient_identifier: caseData.patient_identifier,
        city_id: caseData.city_id,
        city_name: caseData.city_name,
        case_data_keys: Object.keys(caseData.case_data || {})
      });
      
      return await apiClient.post<CaseData>('/cases', caseData);
    } catch (error) {
      console.error('Error creating case:', error);
      
      // Re-throw with more details if available
      if (error instanceof Error) {
        throw new Error(`Failed to create case: ${error.message}`);
      }
      throw error;
    }
  },

  // Update an existing case
  async updateCase(caseId: number, caseData: UpdateCaseRequest): Promise<CaseData> {
    try {
      return await apiClient.put<CaseData>(`/cases/${caseId}`, caseData);
    } catch (error) {
      console.error('Error updating case:', error);
      throw error;
    }
  },

  // Delete a case
  async deleteCase(caseId: number, templateId: string): Promise<void> {
    try {
      await apiClient.delete(`/cases/${caseId}`, { templateId });
    } catch (error) {
      console.error('Error deleting case:', error);
      throw error;
    }
  },

  // Update investigation status
  async updateInvestigationStatus(
    caseId: number,
    templateId: string,
    status: 'open' | 'closed',
    currentCase: CaseData
  ): Promise<CaseData> {
    try {
      return await this.updateCase(caseId, {
        investigation_status: status,
        template_id: templateId,
        case_data: currentCase.case_data,
        case_name: currentCase.case_name,
        patient_identifier: currentCase.patient_identifier
      });
    } catch (error) {
      console.error('Error updating investigation status:', error);
      throw error;
    }
  },

  // Update case classification
  async updateCaseClassification(
    caseId: number,
    templateId: string,
    classification: 'confirmed' | 'probable' | 'not_a_case',
    currentCase: CaseData
  ): Promise<CaseData> {
    try {
      return await this.updateCase(caseId, {
        case_classification: classification,
        template_id: templateId,
        case_data: currentCase.case_data,
        case_name: currentCase.case_name,
        patient_identifier: currentCase.patient_identifier
      });
    } catch (error) {
      console.error('Error updating case classification:', error);
      throw error;
    }
  },

  // Create a new version of an existing case
  async createCaseVersion(
    originalCaseId: number,
    caseData: Partial<CaseData>,
    versionLabel?: string
  ): Promise<CaseData> {
    try {
      console.log('Creating case version for original case:', originalCaseId);
      console.log('Version label:', versionLabel);
      console.log('Case data for version:', caseData);
      
      // Use the versioning endpoint with templateId
      const templateId = caseData.template_id;
      if (!templateId) {
        throw new Error('template_id is required to create a version');
      }
      
      const url = `/cases/${originalCaseId}/versions?templateId=${templateId}`;
      console.log('Calling versioning endpoint:', url);
      
      const response = await apiClient.post<CaseData>(url, {
        ...caseData,
        version_label: versionLabel
      });
      
      console.log('Version created successfully:', response);
      return response;
    } catch (error) {
      console.error('Error creating case version:', error);
      throw error;
    }
  },

  // Get all versions of a case
  async getCaseVersions(caseId: number, templateId: string): Promise<CaseData[]> {
    try {
      return await apiClient.get<CaseData[]>(
        `/cases/${caseId}/versions`,
        { templateId }
      );
    } catch (error) {
      console.error('Error fetching case versions:', error);
      throw error;
    }
  }
};

