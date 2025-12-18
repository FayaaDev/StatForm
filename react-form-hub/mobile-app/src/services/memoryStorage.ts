// In-Memory Storage Service for Session-Based Caching
import { LocalTemplate, LocalCase, CaseData } from '../shared/types';

export class MemoryStorageService {
  private templates: Map<string, LocalTemplate> = new Map();
  private cases: Map<string, Map<number, CaseData>> = new Map();
  private draftCases: Map<string, any> = new Map();

  // Template Methods
  getTemplate(templateId: string): LocalTemplate | undefined {
    return this.templates.get(templateId);
  }

  getAllTemplates(): LocalTemplate[] {
    return Array.from(this.templates.values());
  }

  setTemplate(template: LocalTemplate): void {
    if (template.template_data?.id) {
      this.templates.set(template.template_data.id, template);
    }
  }

  setTemplates(templates: LocalTemplate[]): void {
    this.templates.clear();
    templates.forEach(template => {
      if (template.template_data?.id) {
        this.templates.set(template.template_data.id, template);
      }
    });
  }

  // Case Methods
  getCase(templateId: string, caseId: number): CaseData | undefined {
    const templateCases = this.cases.get(templateId);
    return templateCases?.get(caseId);
  }

  getCases(templateId: string): CaseData[] {
    const templateCases = this.cases.get(templateId);
    return templateCases ? Array.from(templateCases.values()) : [];
  }

  setCase(templateId: string, caseData: CaseData): void {
    if (!caseData.id) return;

    let templateCases = this.cases.get(templateId);
    if (!templateCases) {
      templateCases = new Map();
      this.cases.set(templateId, templateCases);
    }
    templateCases.set(caseData.id, caseData);
  }

  setCases(templateId: string, cases: CaseData[]): void {
    const templateCases = new Map<number, CaseData>();
    cases.forEach(caseData => {
      if (caseData.id) {
        templateCases.set(caseData.id, caseData);
      }
    });
    this.cases.set(templateId, templateCases);
  }

  deleteCase(templateId: string, caseId: number): void {
    const templateCases = this.cases.get(templateId);
    if (templateCases) {
      templateCases.delete(caseId);
    }
  }

  // Draft Methods (Session-only, lost on app close)
  getDraft(draftKey: string): any | undefined {
    return this.draftCases.get(draftKey);
  }

  setDraft(draftKey: string, draftData: any): void {
    this.draftCases.set(draftKey, draftData);
  }

  deleteDraft(draftKey: string): void {
    this.draftCases.delete(draftKey);
  }

  getAllDrafts(): Map<string, any> {
    return new Map(this.draftCases);
  }

  // Clear Methods
  clearTemplates(): void {
    this.templates.clear();
  }

  clearCases(templateId?: string): void {
    if (templateId) {
      this.cases.delete(templateId);
    } else {
      this.cases.clear();
    }
  }

  clearDrafts(): void {
    this.draftCases.clear();
  }

  clearAll(): void {
    this.templates.clear();
    this.cases.clear();
    this.draftCases.clear();
    console.log('✅ Memory storage cleared');
  }

  // Debug/Info Methods
  getStats(): {
    templateCount: number;
    totalCaseCount: number;
    draftCount: number;
  } {
    let totalCaseCount = 0;
    this.cases.forEach(templateCases => {
      totalCaseCount += templateCases.size;
    });

    return {
      templateCount: this.templates.size,
      totalCaseCount,
      draftCount: this.draftCases.size,
    };
  }
}

// Singleton instance
export const memoryStorage = new MemoryStorageService();

