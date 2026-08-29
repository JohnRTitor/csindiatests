<script lang="ts">
  import { Search, Menu, User, BookOpen, LineChart, Settings } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import ModeToggle from "$lib/components/layout/ModeToggle.svelte";
  import { page } from "$app/state";

  let isOpen = $state(false);

  const navLinks = [
    { href: "/", label: "Practice" },
    { href: "/mock-tests", label: "Mock Tests" },
    { href: "/subjects", label: "Subjects" },
  ];
</script>

<header
  class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
>
  <div class="container mx-auto px-4 sm:px-8 flex h-16 items-center">
    {#snippet NavItem(link: { href: string; label: string }, isMobile: boolean)}
      <a
        href={link.href}
        class={isMobile 
          ? "text-lg font-medium transition-colors hover:text-primary data-[active=true]:text-primary" 
          : "transition-colors hover:text-primary text-muted-foreground data-[active=true]:text-foreground"}
        data-active={page.url.pathname === link.href || (link.href !== "/" && page.url.pathname.startsWith(link.href))}
        onclick={isMobile ? () => (isOpen = false) : undefined}
      >
        {link.label}
      </a>
    {/snippet}

    <!-- Mobile Menu -->
    <div class="md:hidden mr-4">
      <Sheet.Root bind:open={isOpen}>
        <Sheet.Trigger>
          {#snippet child({ props })}
            <Button variant="ghost" size="icon" {...props}>
              <Menu class="h-5 w-5" />
              <span class="sr-only">Toggle menu</span>
            </Button>
          {/snippet}
        </Sheet.Trigger>
        <Sheet.Content side="left" class="w-62.5 sm:w-75">
          <nav class="flex flex-col gap-4 mt-8">
            {#each navLinks as link}
              {@render NavItem(link, true)}
            {/each}
          </nav>
        </Sheet.Content>
      </Sheet.Root>
    </div>

    <!-- Logo -->
    <a href="/" class="flex items-center gap-2 mr-6 shrink-0">
      <div class="bg-primary text-primary-foreground p-1.5 rounded-md">
        <BookOpen class="h-5 w-5" />
      </div>
      <span class="font-bold tracking-tight text-lg hidden sm:inline-block">
        CS India Tests
      </span>
    </a>

    <!-- Desktop Navigation -->
    <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
      {#each navLinks as link}
        {@render NavItem(link, false)}
      {/each}
    </nav>

    <!-- Right Side Actions -->
    <div class="ml-auto flex items-center space-x-2 sm:space-x-4">
      <Button
        variant="ghost"
        size="icon"
        class="text-muted-foreground hidden sm:inline-flex"
      >
        <Search class="h-5 w-5" />
        <span class="sr-only">Search</span>
      </Button>

      <ModeToggle />

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          {#snippet child({ props })}
            <Button variant="ghost" size="icon" class="rounded-full" {...props}>
              <div
                class="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border"
              >
                <User class="h-5 w-5 text-muted-foreground" />
              </div>
              <span class="sr-only">User menu</span>
            </Button>
          {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" class="w-40">
          <DropdownMenu.Item class={page.url.pathname === '/progress' ? 'bg-accent text-accent-foreground' : ''}>
            {#snippet child({ props })}
              <a href="/progress" {...props}>
                <LineChart class="mr-2 h-4 w-4" />
                <span>Progress</span>
              </a>
            {/snippet}
          </DropdownMenu.Item>
          <DropdownMenu.Item class={page.url.pathname === '/settings' ? 'bg-accent text-accent-foreground' : ''}>
            {#snippet child({ props })}
              <a href="/settings" {...props}>
                <Settings class="mr-2 h-4 w-4" />
                <span>Settings</span>
              </a>
            {/snippet}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </div>
</header>
