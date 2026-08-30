<script lang="ts">
  import {
    Search,
    MapPin,
    CheckCircle,
    ChevronRight,
    Hash,
  } from "@lucide/svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import type { SearchResult } from "../types";

  let { result }: { result: SearchResult } = $props();

  // Create a preview snippet from the matched fields
  let snippet = $derived.by(() => {
    // If the question matched, return that
    if (result.match) {
      // Find the first field that matched and isn't a metadata field if possible
      const fields = Object.keys(result.match);
      const textMatchFields = fields.filter((f) =>
        ["question", "options", "explanation"].includes(f),
      );

      if (textMatchFields.length > 0) {
        const field = textMatchFields[0];
        // naive truncation for preview
        const content = result[field as keyof SearchResult] as string;
        if (content) {
          return {
            field: field.charAt(0).toUpperCase() + field.slice(1),
            text:
              content.length > 150
                ? content.substring(0, 150) + "..."
                : content,
          };
        }
      }
    }

    // Fallback to question text
    return {
      field: "Question",
      text:
        result.question.length > 150
          ? result.question.substring(0, 150) + "..."
          : result.question,
    };
  });
</script>

<a
  href="/ugc-net-cs/pyq/{result.year}/{encodeURIComponent(
    result.shift,
  )}#q-{result.questionNumber}"
  class="block group"
>
  <Card.Root class="transition-colors hover:bg-muted/50">
    <Card.Header class="pb-2">
      <div class="flex items-start justify-between gap-4">
        <div class="space-y-1">
          <Card.Title
            class="text-base font-medium leading-none flex items-center gap-2"
          >
            <span>Question {result.questionNumber}</span>
            <Badge variant="secondary" class="text-xs">
              UGC NET · {result.year} · {result.session}
            </Badge>
          </Card.Title>
          {#if result.subject || result.topic}
            <div
              class="flex items-center text-xs text-muted-foreground gap-2 pt-1"
            >
              {#if result.subject}
                <span class="flex items-center"
                  ><Hash class="w-3 h-3 mr-1" /> {result.subject}</span
                >
              {/if}
              {#if result.subject && result.topic}
                <span class="text-border">•</span>
              {/if}
              {#if result.topic}
                <span class="text-primary/80 font-medium">{result.topic}</span>
              {/if}
            </div>
          {/if}
        </div>
        <ChevronRight
          class="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>
    </Card.Header>
    <Card.Content>
      <p class="text-sm text-foreground/80 line-clamp-2">
        <span class="font-semibold text-xs text-muted-foreground uppercase mr-1"
          >{snippet.field}:</span
        >
        {snippet.text}
      </p>
    </Card.Content>
  </Card.Root>
</a>
