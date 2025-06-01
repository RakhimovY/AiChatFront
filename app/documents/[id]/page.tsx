import DocumentEditor from "@/components/web/DocumentEditor";
import { documentService } from "@/lib/services/documentService";

interface DocumentPageProps {
    params: {
        id: string;
    };
}

export default async function DocumentPage({ params }: DocumentPageProps) {
    const document = await documentService.getDocument(params.id);
    const template = await documentService.getTemplate(document.templateId);

    return (
        <div className="container py-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Edit Document</h1>
                <DocumentEditor
                    documentId={document.id}
                    templateId={template.id}
                    initialTemplate={template}
                    initialValues={document.values}
                />
            </div>
        </div>
    );
} 