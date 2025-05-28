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
          // TODO: templates
          // const response = await api.get('/web/templates');
          // response.data
          setTemplates(templates);
          return templates;
        } catch (err) {
          const errorMessage = "Не удалось загрузить шаблоны. Пожалуйста, попробуйте позже.";
          setTemplatesError(errorMessage);
          console.error("Error fetching templates:", err);
          return [];
        } finally {
          setIsLoadingTemplates(false);
        }
      },

      fetchTemplate: async (id) => {
        const { setIsLoadingTemplates, setTemplatesError } = get();

        setIsLoadingTemplates(true);
        setTemplatesError(null);

        try {
          const response = await api.get(`/web/templates/${id}`);
          return response.data;
        } catch (err) {
          const errorMessage = "Не удалось загрузить шаблон. Пожалуйста, попробуйте позже.";
          setTemplatesError(errorMessage);
          console.error("Error fetching template:", err);
          return null;
        } finally {
          setIsLoadingTemplates(false);
        }
      },

      fetchDocuments: async () => {
        const { setIsLoadingDocuments, setDocuments, setDocumentsError } = get();

        setIsLoadingDocuments(true);
        setDocumentsError(null);

        try {
          const response = await api.get('/web/documents');

          setDocuments(response.data);
          return response.data;
        } catch (err) {
          const errorMessage = "Не удалось загрузить документы. Пожалуйста, попробуйте позже.";
          setDocumentsError(errorMessage);
          console.error("Error fetching documents:", err);
          return [];
        } finally {
          setIsLoadingDocuments(false);
        }
      },

      fetchDocument: async (id) => {
        const { setIsLoadingDocuments, setDocumentsError } = get();

        setIsLoadingDocuments(true);
        setDocumentsError(null);

        try {
          const response = await api.get(`/web/documents/${id}`);
          return response.data;
        } catch (err) {
          const errorMessage = "Не удалось загрузить документ. Пожалуйста, попробуйте позже.";
          setDocumentsError(errorMessage);
          console.error("Error fetching document:", err);
          return null;
        } finally {
          setIsLoadingDocuments(false);
        }
      },

      saveDocument: async (document) => {
        const { selectedDocumentId, setDocuments, documents } = get();

        try {
          const isUpdate = !!selectedDocumentId;
          const url = isUpdate 
            ? `/web/documents/${selectedDocumentId}` 
            : '/web/documents';

          let response;
          if (isUpdate) {
            response = await api.put(url, document);
          } else {
            response = await api.post(url, document);
          }

          const savedDocument = response.data;

          // Update documents list
          if (isUpdate) {
            setDocuments(
              documents.map(doc => 
                doc.id === savedDocument.id ? savedDocument : doc
              )
            );
          } else {
            setDocuments([...documents, savedDocument]);
          }

          return savedDocument;
        } catch (err) {
          console.error("Error saving document:", err);
          return null;
        }
      },

      deleteDocument: async (id) => {
        const { setDocuments, documents } = get();

        try {
          await api.delete(`/web/documents/${id}`);

          // Remove document from state
          setDocuments(documents.filter(doc => doc.id !== id));
          return true;
        } catch (err) {
          console.error("Error deleting document:", err);
          return false;
        }
      },
    }),
    {
      name: 'web-storage',
      partialize: (state) => ({
        selectedTemplateId: state.selectedTemplateId,
        selectedDocumentId: state.selectedDocumentId,
        form: {
          values: state.form.values,
          history: state.form.history,
          historyIndex: state.form.historyIndex,
        },
      }),
    }
  )
);
