// Shared types for mobile and web app

// ============= Template Types =============

export interface Template {
  id: number;
  name: string;
  description?: string;
  template_data: TemplateData;
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_active: boolean;
  category?: string;
  tags?: string[];
  manual_form_pdf?: string | null;
}

export interface TemplateData {
  id: string; // Semantic ID for forms
  name: string;
  description?: string;
  disease: string;
  region?: string;
  sections: Section[];
  isDeployed?: boolean;
  deploymentId?: string;
  deploymentUrl?: string;
  deployed_db_id?: number;
  createdBySector?: string;
  allowedRegions?: string[];
  publishRegion?: string;
  specificRegion?: string | null;
  assignedCities?: string[];
  cityPermissions?: Array<{ city: string; permission: 'view' | 'edit' }>;
  metadata?: Record<string, any>;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  fields: Field[];
  subsections?: Subsection[];
  defaultOpen?: boolean;
}

export interface Subsection {
  id: string;
  title: string;
  description?: string;
  fields: Field[];
}

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  label_en?: string;
  placeholder?: string;
  required?: boolean;
  validation?: FieldValidation;
  options?: FieldOption[];
  autocompleteOptions?: string[];
  unitOptions?: string[];
  defaultUnit?: string;
  defaultValue?: any;
  showIf?: ConditionalLogic;
  gridColumns?: number;
  snomedCode?: string;
  metadata?: Record<string, any>;
  
  // Legacy conditional display (for backward compatibility)
  conditionalDisplay?: {
    dependsOn: string;
    values: string[];
  };
  
  // Conditional field type (for yes/no questions with follow-ups)
  conditionalField?: {
    triggerValue: string;
    type?: 'field' | 'subsection';
    field?: Field;
    subsection?: Subsection;
  };
}

export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'textarea'
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'autocomplete'
  | 'conditional'
  | 'separator'
  | 'unitNumber';

export interface FieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  custom?: string;
}

export interface FieldOption {
  value: string;
  label: string;
  label_en?: string;
}

export interface ConditionalLogic {
  all?: ConditionalRule[];
  any?: ConditionalRule[];
}

export interface ConditionalRule {
  field: string;
  op: 'equals' | 'notEquals' | 'in' | 'notIn' | 'gt' | 'gte' | 'lt' | 'lte';
  value: string | number | string[];
}

// ============= Case Types =============

export interface CaseData {
  id?: number;
  template_id: string;
  case_data: Record<string, any>;
  case_name?: string;
  patient_identifier?: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  template_name?: string;
  region?: string;
  disease?: string;
  investigation_status?: 'open' | 'closed';
  case_classification?: 'confirmed' | 'probable' | 'not_a_case';
  city_id?: string;
  city_name?: string;
  original_case_id?: number;
  version_number?: number;
  version_label?: string;
  versions?: CaseData[];
  version_count?: number;
}

export interface CreateCaseRequest {
  template_id: string;
  case_data: Record<string, any>;
  case_name?: string;
  patient_identifier?: string;
  city_id?: string;
  city_name?: string;
}

export interface UpdateCaseRequest {
  case_data?: Record<string, any>;
  case_name?: string;
  patient_identifier?: string;
  investigation_status?: 'open' | 'closed';
  case_classification?: 'confirmed' | 'probable' | 'not_a_case';
  template_id: string;
}

// ============= Auth Types =============

export interface AuthenticatedUser {
  id: number;
  username: string;
  full_name: string;
  email?: string;
  phone?: string;
  city_id: string;
  city_name: string;
  city_code: string;
  assigned_diseases: string[];
  global_permission: 'view' | 'edit';
  disease_permissions: Record<string, 'view' | 'edit'>;
  user_tier?: 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'R1' | 'R2' | 'R3' | 'R4' | 'R5';
  sector_info: {
    id: string;
    name: string;
    nameAr: string;
  };
  last_login?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  city_id?: string;
}

export interface LoginResponse {
  user: AuthenticatedUser;
  token: string;
  expires_at: string;
}

// ============= Mobile-Specific Types =============

export interface LocalTemplate extends Template {
  synced_at?: string;
  local_id?: number;
}

export interface LocalCase extends CaseData {
  local_id?: number;
  server_id?: number;
  status: 'draft' | 'pending' | 'synced' | 'error';
  sync_error?: string;
  synced_at?: string;
}

export interface SyncQueueItem {
  id?: number;
  operation: 'create' | 'update' | 'delete';
  entity_type: 'case';
  entity_id: number;
  payload: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retry_count: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface SyncStatus {
  isSyncing: boolean;
  lastSyncAt?: string;
  pendingCount: number;
  errorCount: number;
  isOnline: boolean;
}

// ============= Referral/Assignment Types =============

export interface Assignment {
  id: number;
  notification_id: number;
  notification_case_name: string;
  patient_identifier: string;
  city_name: string;
  disease: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  referral_status: string;
  target_template_id: number;
  target_template_name?: string;
  created_at: string;
  investigator_assigned_at?: string;
  due_date?: string;
  assignment_notes?: string;
  supervisor_notes?: string;
  supervisor_name?: string;
  field_mapping?: Record<string, any>;
  mapping_confidence?: number;
}

export interface ReferralResponse {
  referrals: Assignment[];
  total: number;
}

// ============= API Response Types =============

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

