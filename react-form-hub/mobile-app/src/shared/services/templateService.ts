// Template service for mobile app
import { apiClient } from './apiClient';
import { Template } from '../types';

export const templateService = {
  // Get all templates
  async getAllTemplates(): Promise<Template[]> {
    try {
      return await apiClient.get<Template[]>('/templates');
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  },

  // Get template by ID
  async getTemplateById(id: number): Promise<Template> {
    try {
      return await apiClient.get<Template>(`/templates/${id}`);
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  },

  // Helper function to extract disease name from template
  extractDiseaseName(template: Template): string {
    let templateDisease = template.template_data?.disease || '';
    
    // If the disease field is generic, extract from template name
    if (templateDisease === 'مرض عام' || !templateDisease) {
      const name = template.name;
      if (name.includes('حمى الضنك')) {
        templateDisease = 'حمى الضنك';
      } else if (name.includes('السل')) {
        templateDisease = 'السل';
      } else if (name.includes('الملاريا')) {
        templateDisease = 'الملاريا';
      } else if (name.includes('كوفيد')) {
        templateDisease = 'كوفيد-19';
      } else if (name.includes('الأنفلونزا')) {
        templateDisease = 'الأنفلونزا';
      } else if (name.includes('الكوليرا')) {
        templateDisease = 'الكوليرا';
      } else {
        // Extract the part before " - " or " ("
        const parts = name.split(/\s*[-()]\s*/);
        templateDisease = parts[0].trim();
      }
    }
    
    return templateDisease;
  },

  // Helper function to check if template is deployed
  isTemplateDeployed(template: Template): boolean {
    return template.template_data?.isDeployed === true || 
           !!template.template_data?.deploymentId;
  },

  // Filter templates for regional user
  filterTemplatesForUser(
    templates: Template[],
    user: {
      assigned_diseases: string[];
      disease_permissions: Record<string, 'view' | 'edit'>;
      global_permission: 'view' | 'edit';
    }
  ): Template[] {
    console.log('🔍 Starting template filtering...');
    console.log('📋 User assigned diseases:', user?.assigned_diseases);
    
    return templates.filter(template => {
      const templateName = template.name;
      
      // Must be active
      if (!template.is_active) {
        console.log(`❌ ${templateName}: Not active`);
        return false;
      }
      
      // Check if deployed
      if (!this.isTemplateDeployed(template)) {
        console.log(`❌ ${templateName}: Not deployed (isDeployed: ${template.template_data?.isDeployed}, deploymentId: ${template.template_data?.deploymentId})`);
        return false;
      }
      
      // If user has no assigned diseases, don't show any templates
      if (!user?.assigned_diseases || user.assigned_diseases.length === 0) {
        console.log(`❌ ${templateName}: User has no assigned diseases`);
        return false;
      }
      
      // Check if this is an HQ template that needs assignment checking
      const isHQTemplate = template.template_data?.createdBySector === 'hq';
      
      if (isHQTemplate) {
        console.log(`🏢 ${templateName}: HQ template - checking assignments...`);
        
        // For HQ templates, check if user has permission for this disease/template
        // First, check if user is assigned to the full template name
        if (user.assigned_diseases.includes(template.name)) {
          console.log(`✅ ${templateName}: Matched by full template name`);
          return true;
        }
        
        // Also check if assigned to template name without deployment suffix
        const cleanTemplateName = template.name.replace(/\s*\(Deployed:.*?\)$/, '').trim();
        if (user.assigned_diseases.includes(cleanTemplateName)) {
          console.log(`✅ ${templateName}: Matched by clean template name (${cleanTemplateName})`);
          return true;
        }
        
        // Extract and check disease name
        const templateDisease = this.extractDiseaseName(template);
        console.log(`   Extracted disease: "${templateDisease}"`);
        if (templateDisease && user.assigned_diseases.includes(templateDisease)) {
          console.log(`✅ ${templateName}: Matched by disease (${templateDisease})`);
          return true;
        }
        
        // Also check metadata disease field
        if (template.template_data?.metadata?.disease) {
          const metadataDisease = template.template_data.metadata.disease;
          if (user.assigned_diseases.includes(metadataDisease)) {
            console.log(`✅ ${templateName}: Matched by metadata disease (${metadataDisease})`);
            return true;
          }
        }
        
        console.log(`❌ ${templateName}: HQ template - no disease match. Template disease: "${templateDisease}", User diseases: ${JSON.stringify(user.assigned_diseases)}`);
        return false; // HQ templates require explicit assignment
      }
      
      // For non-HQ templates, check disease permissions
      if (template.template_data?.disease) {
        const matches = user.assigned_diseases.includes(template.template_data.disease);
        if (matches) {
          console.log(`✅ ${templateName}: Matched by disease (${template.template_data.disease})`);
        } else {
          console.log(`❌ ${templateName}: Disease mismatch. Template: "${template.template_data.disease}", User: ${JSON.stringify(user.assigned_diseases)}`);
        }
        return matches;
      }
      
      console.log(`❌ ${templateName}: No disease field found`);
      return false;
    });
  },

  // Get user permission for a specific template
  getUserPermissionForTemplate(
    template: Template,
    user: {
      assigned_diseases: string[];
      disease_permissions: Record<string, 'view' | 'edit'>;
      global_permission: 'view' | 'edit';
    }
  ): 'edit' | 'view' {
    if (!user?.assigned_diseases) {
      return 'edit'; // Default to edit if no disease info
    }
    
    // First, check if user is assigned to the full template name
    if (user.assigned_diseases.includes(template.name)) {
      return user.disease_permissions?.[template.name] || user.global_permission || 'edit';
    }
    
    // Also check if assigned to template name without deployment suffix
    const cleanTemplateName = template.name.replace(/\s*\(Deployed:.*?\)$/, '').trim();
    if (user.assigned_diseases.includes(cleanTemplateName)) {
      return user.disease_permissions?.[cleanTemplateName] || user.global_permission || 'edit';
    }
    
    // Extract and check disease name using helper function
    const templateDisease = this.extractDiseaseName(template);
    if (templateDisease && user.assigned_diseases.includes(templateDisease)) {
      return user.disease_permissions?.[templateDisease] || user.global_permission || 'edit';
    }
    
    // Also check metadata disease field
    if (template.template_data?.metadata?.disease) {
      const metadataDisease = template.template_data.metadata.disease;
      if (user.assigned_diseases.includes(metadataDisease)) {
        return user.disease_permissions?.[metadataDisease] || user.global_permission || 'edit';
      }
    }
    
    return 'edit'; // Default fallback
  }
};

