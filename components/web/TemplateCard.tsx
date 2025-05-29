import React from "react";
import Link from "next/link";
import { Template } from "@/lib/data/templates";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

interface TemplateCardProps {
  template: Template;
}

/**
 * TemplateCard component displays a card for a template with preview image, title, description,
 * and a button to create a document.
 */
export default function TemplateCard({ template }: TemplateCardProps) {
  const { t } = useLanguage();
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      {/* Template preview image */}
      {template.previewImage && (
        <div className="h-40 bg-muted">
          <img
            src={template.previewImage}
            alt={template.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardHeader className="pb-2">
        {/* Category badge */}
        {/*<div className="inline-block px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground mb-2">*/}
        {/*  {template.category}*/}
        {/*</div>*/}

        {/* Template title */}
        <h3 className="text-lg font-semibold">{template.title}</h3>
      </CardHeader>

      <CardContent className="pb-4 flex-grow">
        {/* Template description */}
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </CardContent>

      <CardFooter className="pt-0">
        {/* Create document button */}
        <Link href={`/web/templates/${template.id}`} className="w-full">
          <Button className="w-full">{t.createDocument}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
