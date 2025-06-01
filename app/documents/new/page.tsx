import { NewDocumentClient } from "./NewDocumentClient";

export default function NewDocumentPage() {
    return (
        <div className="container py-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Create New Document</h1>
                <NewDocumentClient />
            </div>
        </div>
    );
} 