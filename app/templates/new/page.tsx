import { TemplateManager } from "@/components/web/TemplateManager";

export default function NewTemplatePage() {
    return (
        <div className="container py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Create New Template</h1>
                <TemplateManager />
            </div>
        </div>
    );
} 