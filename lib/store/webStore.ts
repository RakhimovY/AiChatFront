import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api';
import {templates} from "@/lib/data/templates";

// Types
interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  fields: any[];
  content: string;
  previewImage?: string;
}

interface Document {
  id: string;
  title: string;
  templateId: string;
  templateName: string;
  values: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  isDirty: boolean;
  history: Array<Record<string, any>>;
  historyIndex: number;
}

interface WebState {
  // Templates
  templates: Template[];
  selectedTemplateId: string | null;
  isLoadingTemplates: boolean;
  templatesError: string | null;

  // Documents
  documents: Document[];
  selectedDocumentId: string | null;
  isLoadingDocuments: boolean;
  documentsError: string | null;

  // Sidebar state
  isMobileMenuOpen: boolean;

  // Form state
  form: FormState;

  // Actions
  setTemplates: (templates: Template[]) => void;
  setSelectedTemplateId: (id: string | null) => void;
  setIsLoadingTemplates: (isLoading: boolean) => void;
  setTemplatesError: (error: string | null) => void;

  setDocuments: (documents: Document[]) => void;
  setSelectedDocumentId: (id: string | null) => void;
  setIsLoadingDocuments: (isLoading: boolean) => void;
  setDocumentsError: (error: string | null) => void;

  // Sidebar actions
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  toggleMobileMenu: () => void;

  // Form actions
  setFormValues: (values: Record<string, any>) => void;
  updateFormValue: (key: string, value: any) => void;
  setFormErrors: (errors: Record<string, string>) => void;
  clearFormErrors: () => void;
  resetForm: () => void;

  // History actions
  addToHistory: () => void;
  undo: () => void;
  redo: () => void;

  // Fetch actions
  fetchTemplates: () => Promise<void>;
  fetchTemplate: (id: string) => Promise<Template | null>;
  fetchDocuments: () => Promise<void>;
  fetchDocument: (id: string) => Promise<Document | null>;

  // Save actions
  saveDocument: (document: Partial<Document>) => Promise<Document | null>;
  deleteDocument: (id: string) => Promise<boolean>;
}

// Initial form state
const initialFormState: FormState = {
  values: {},
  errors: {},
  isDirty: false,
  history: [],
  historyIndex: -1,
};

// Create store
export const useWebStore = create<WebState>()(
  persist(
    (set, get) => ({
      // Templates
      templates: [],
      selectedTemplateId: null,
      isLoadingTemplates: false,
      templatesError: null,

      // Documents
      documents: [],
      selectedDocumentId: null,
      isLoadingDocuments: false,
      documentsError: null,

      // Sidebar state
      isMobileMenuOpen: false,

      // Form state
      form: initialFormState,

      // Template actions
      setTemplates: (templates) => set({ templates }),
      setSelectedTemplateId: (id) => set({ selectedTemplateId: id }),
      setIsLoadingTemplates: (isLoading) => set({ isLoadingTemplates: isLoading }),
      setTemplatesError: (error) => set({ templatesError: error }),

      // Document actions
      setDocuments: (documents) => set({ documents }),
      setSelectedDocumentId: (id) => set({ selectedDocumentId: id }),
      setIsLoadingDocuments: (isLoading) => set({ isLoadingDocuments: isLoading }),
      setDocumentsError: (error) => set({ documentsError: error }),

      // Sidebar actions
      setIsMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

      // Form actions
      setFormValues: (values) => set(state => ({
        form: {
          ...state.form,
          values,
          isDirty: true
        }
      })),

      updateFormValue: (key, value) => set(state => {
        const newValues = { ...state.form.values, [key]: value };

        // Clear error for this field if it exists
        const newErrors = { ...state.form.errors };
        if (newErrors[key]) {
          delete newErrors[key];
        }

        return {
          form: {
            ...state.form,
            values: newValues,
            errors: newErrors,
            isDirty: true
          }
        };
      }),

      setFormErrors: (errors) => set(state => ({
        form: {
          ...state.form,
          errors
        }
      })),

      clearFormErrors: () => set(state => ({
        form: {
          ...state.form,
          errors: {}
        }
      })),

      resetForm: () => set({
        form: initialFormState
      }),

      // History actions
      addToHistory: () => set(state => {
        const { values, history, historyIndex } = state.form;

        // Create a new history array that includes only the entries up to the current index
        // (discarding any future states if we're in the middle of the history)
        const newHistory = history.slice(0, historyIndex + 1);

        // Add the current values to the history
        newHistory.push({ ...values });

        return {
          form: {
            ...state.form,
            history: newHistory,
            historyIndex: newHistory.length - 1
          }
        };
      }),

      undo: () => set(state => {
        const { history, historyIndex } = state.form;

        if (historyIndex <= 0) return state;

        const newIndex = historyIndex - 1;
        const previousValues = history[newIndex];

        return {
          form: {
            ...state.form,
            values: { ...previousValues },
            historyIndex: newIndex,
            isDirty: true
          }
        };
      }),

      redo: () => set(state => {
        const { history, historyIndex } = state.form;

        if (historyIndex >= history.length - 1) return state;

        const newIndex = historyIndex + 1;
        const nextValues = history[newIndex];

        return {
          form: {
            ...state.form,
            values: { ...nextValues },
            historyIndex: newIndex,
            isDirty: true
          }
        };
      }),

      // Fetch actions
      fetchTemplates: async () => {
        const { setIsLoadingTemplates, setTemplates, setTemplatesError } = get();

        setIsLoadingTemplates(true);
        setTemplatesError(null);

        try {
          setTemplates(templates);
        } catch (error) {
          setTemplatesError(error instanceof Error ? error.message : 'Failed to fetch templates');
        } finally {
          setIsLoadingTemplates(false);
        }
      },

      fetchTemplate: async (id: string) => {
        const { templates } = get();
        return templates.find(t => t.id === id) || null;
      },

      fetchDocuments: async () => {
        const { setIsLoadingDocuments, setDocuments, setDocumentsError } = get();

        setIsLoadingDocuments(true);
        setDocumentsError(null);

        try {
          const response = await api.get('/web/documents');
          setDocuments(response.data);
        } catch (error) {
          setDocumentsError(error instanceof Error ? error.message : 'Failed to fetch documents');
        } finally {
          setIsLoadingDocuments(false);
        }
      },

      fetchDocument: async (id: string) => {
        const { documents } = get();
        return documents.find(d => d.id === id) || null;
      },

      saveDocument: async (document: Partial<Document>) => {
        const { documents, setDocuments } = get();

        try {
          const response = await api.post('/web/documents', document);
          const newDocument = response.data;

          setDocuments([...documents, newDocument]);
          return newDocument;
        } catch (error) {
          console.error('Failed to save document:', error);
          return null;
        }
      },

      deleteDocument: async (id: string) => {
        const { documents, setDocuments } = get();

        try {
          await api.delete(`/web/documents/${id}`);
          setDocuments(documents.filter(d => d.id !== id));
          return true;
        } catch (error) {
          console.error('Failed to delete document:', error);
          return false;
        }
      },
    }),
    {
      name: 'web-store',
      partialize: (state) => ({
        selectedTemplateId: state.selectedTemplateId,
        selectedDocumentId: state.selectedDocumentId,
        form: state.form
      })
    }
  )
);
