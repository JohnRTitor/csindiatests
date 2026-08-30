<script lang="ts">
  import { page } from "$app/state";

  let {
    title = "",
    description = "Practice Computer Science questions, strengthen fundamentals, and prepare for UGC NET and GATE CS.",
    canonical = "",
    type = "website",
    noindex = false,
    image = "",
    structuredData = ""
  }: {
    title?: string;
    description?: string;
    canonical?: string;
    type?: string;
    noindex?: boolean;
    image?: string;
    structuredData?: string;
  } = $props();

  const siteName = "CS India Tests";
  const defaultTitle = "CS India Tests — Computer Science Preparation for UGC NET & GATE";
  
  // Format the title correctly based on whether one is provided
  let formattedTitle = $derived(title ? (title.includes(siteName) ? title : `${title} | ${siteName}`) : defaultTitle);
  
  // Use page.url if canonical isn't explicitly provided.
  let canonicalUrl = $derived(canonical || page.url.href.split('?')[0].split('#')[0]);
  
  // Use a default image if none provided. (If we add one later, we can place it in static/og-image.jpg)
  let ogImage = $derived(image || new URL('/favicon.svg', page.url.origin).href);
</script>

<svelte:head>
  <title>{formattedTitle}</title>
  <meta name="description" content={description} />
  
  <!-- Canonical URL -->
  {#if canonicalUrl}
    <link rel="canonical" href={canonicalUrl} />
  {/if}

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={type} />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:title" content={formattedTitle} />
  <meta property="og:description" content={description} />
  {#if canonicalUrl}
    <meta property="og:url" content={canonicalUrl} />
  {/if}
  {#if ogImage}
    <meta property="og:image" content={ogImage} />
  {/if}

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={formattedTitle} />
  <meta name="twitter:description" content={description} />
  {#if ogImage}
    <meta name="twitter:image" content={ogImage} />
  {/if}

  <!-- Robots -->
  {#if noindex}
    <meta name="robots" content="noindex, nofollow" />
  {:else}
    <meta name="robots" content="index, follow" />
  {/if}

  <!-- Structured Data -->
  {#if structuredData}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html `<script type="application/ld+json">${structuredData}</script>`}
  {/if}
</svelte:head>
