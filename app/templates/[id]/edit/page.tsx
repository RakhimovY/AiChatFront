import { TemplateManager } from "@/components/web/TemplateManager";
import { documentService } from "@/lib/services/documentService";

interface EditTemplatePageProps {
    params: {
        id: string;
    };
}

export default async function EditTemplatePage({ params }: EditTemplatePageProps) {
    const template = await documentService.getTemplate(params.id);

    return (
        <div className="container py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Edit Template</h1>
                <TemplateManager template={template} />
            </div>
        </div>
    );
} 