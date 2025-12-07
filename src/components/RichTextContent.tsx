import { cn, sanitizeHtml } from "@/lib/utils";

interface RichTextContentProps {
  html?: string | null;
  className?: string;
  placeholder?: string;
}

const RichTextContent = ({ html, className, placeholder }: RichTextContentProps) => {
  const sanitized = sanitizeHtml(html ?? "");

  if (!sanitized) {
    return (
      <p className="text-sm text-muted-foreground">
        {placeholder ?? "No content provided yet."}
      </p>
    );
  }

  return (
    <div
      className={cn(
        "prose prose-slate max-w-none [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:min-h-[280px] [&_iframe]:rounded-lg",
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};

export default RichTextContent;
