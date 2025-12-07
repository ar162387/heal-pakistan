import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeHtml(html: string): string {
  if (!html) return "";

  const allowedIframeHosts = new Set([
    "youtube.com",
    "www.youtube.com",
    "youtu.be",
    "www.youtu.be",
    "youtube-nocookie.com",
    "www.youtube-nocookie.com",
    "player.vimeo.com",
  ]);

  const isAllowedIframe = (src: string | null) => {
    if (!src) return false;
    try {
      const url = new URL(src, "https://dummy.local");
      const host = url.hostname.toLowerCase();
      return allowedIframeHosts.has(host.replace(/^www\./, "")) || allowedIframeHosts.has(host);
    } catch (e) {
      return false;
    }
  };

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      .replace(/<(object|embed|link|meta)[^>]*?>/gi, "")
      .replace(
        /<iframe[^>]*src=["']?([^"'>\s]+)["']?[^>]*>(.*?)<\/iframe>/gi,
        (match, src) => (isAllowedIframe(src) ? match : "")
      );
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.querySelectorAll("script, style, object, embed, link, meta").forEach((el) => el.remove());

  doc.querySelectorAll("iframe").forEach((el) => {
    const src = el.getAttribute("src");
    if (!isAllowedIframe(src)) {
      el.remove();
    } else {
      el.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      );
      el.setAttribute("allowfullscreen", "true");
      el.setAttribute("loading", "lazy");
      el.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    }
  });

  return (doc.body.innerHTML || "").trim();
}

export function stripHtmlToText(html: string): string {
  if (!html) return "";

  if (typeof window === "undefined") {
    return html.replace(/<[^>]+>/g, " ");
  }

  const temp = document.createElement("div");
  temp.innerHTML = html;
  const text = temp.textContent || temp.innerText || "";

  return text.replace(/\s+/g, " ").trim();
}

export function buildExcerpt(html: string, limit = 200, fallback = "No description available yet."): string {
  const text = stripHtmlToText(html);
  if (!text) return fallback;
  return text.length > limit ? `${text.slice(0, limit - 3)}...` : text;
}
