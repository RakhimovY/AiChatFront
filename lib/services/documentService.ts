import { Template, Document, DocumentValues } from '@/types/document';
import api from '@/lib/api';
import { templates } from '@/lib/data/templates';

export class DocumentService {
    private static instance: DocumentService;
    private constructor() { }

    public static getInstance(): DocumentService {
        if (!DocumentService.instance) {
            DocumentService.instance = new DocumentService();
        }
        return DocumentService.instance;
    }

    // Template operations
    async getTemplates(): Promise<Template[]> {
        return templates;
    }

    async getTemplate(id: string): Promise<Template> {
        const template = templates.find(t => t.id === id);
        if (!template) {
            throw new Error('Template not found');
        }
        return template;
    }

    // Document operations
    async getDocuments(): Promise<Document[]> {
        try {
            const response = await api.get('/web/documents');
            return response.data;
        } catch (error) {
            console.error('Error fetching documents:', error);
            throw new Error('Failed to fetch documents');
        }
    }

    async getDocument(id: string): Promise<Document> {
        try {
            const response = await api.get(`/web/documents/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching document:', error);
            throw new Error('Failed to fetch document');
        }
    }

    async createDocument(templateId: string, values: DocumentValues, title?: string): Promise<Document> {
        try {
            const response = await api.post('/web/documents', {
                templateId,
                values,
                title
            });
            return response.data;
        } catch (error) {
            console.error('Error creating document:', error);
            throw new Error('Failed to create document');
        }
    }

    async updateDocument(id: string, data: { templateId: string; values: DocumentValues; title?: string }): Promise<Document> {
        try {
            const response = await api.put(`/web/documents/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating document:', error);
            throw new Error('Failed to update document');
        }
    }

    async deleteDocument(id: string): Promise<void> {
        try {
            await api.delete(`/web/documents/${id}`);
        } catch (error) {
            console.error('Error deleting document:', error);
            throw new Error('Failed to delete document');
        }
    }

    async getDocumentVersions(id: string): Promise<Document[]> {
        try {
            const response = await api.get(`/web/documents/${id}/versions`);
            return response.data;
        } catch (error) {
            console.error('Error fetching document versions:', error);
            throw new Error('Failed to fetch document versions');
        }
    }

    // Export operations
    async exportDocument(templateId: string, values: DocumentValues, format: 'pdf' | 'docx'): Promise<Blob> {
        try {
            const response = await api.post('/web/documents/export', {
                templateId,
                values,
                format
            }, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            console.error('Error exporting document:', error);
            throw new Error('Failed to export document');
        }
    }

    async restoreDocumentVersion(documentId: string, versionId: string): Promise<Document> {
        try {
            const response = await api.post(`/web/documents/${documentId}/versions/${versionId}/restore`);
            return response.data;
        } catch (error) {
            console.error('Error restoring document version:', error);
            throw new Error('Failed to restore document version');
        }
    }
}

export const documentService = DocumentService.getInstance(); 