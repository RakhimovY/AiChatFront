import { documentService } from "@/lib/services/documentService";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function DocumentsPage() {
    const documents = await documentService.getDocuments();

    return (
        <div className="container py-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Documents</h1>
                    <Button asChild>
                        <Link href="/documents/new">
                            <Plus className="h-4 w-4 mr-2" />
                            New Document
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {documents.map((document) => (
                        <div
                            key={document.id}
                            className="border rounded-lg p-4 space-y-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-semibold">{document.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Template: {document.templateName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Created: {new Date(document.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        asChild
                                    >
                                        <Link href={`/documents/${document.id}`}>
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={async () => {
                                            if (confirm("Are you sure you want to delete this document?")) {
                                                try {
                                                    await documentService.deleteDocument(document.id);
                                                    window.location.reload();
                                                } catch (error) {
                                                    console.error("Error deleting document:", error);
                                                    alert("Failed to delete document");
                                                }
                                            }
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="text-sm text-muted-foreground">
                                    Version {document.version}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                >
                                    <Link href={`/documents/${document.id}`}>
                                        <FileText className="h-4 w-4 mr-2" />
                                        View Document
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {documents.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        No documents found
                    </div>
                )}
            </div>
        </div>
    );
} 