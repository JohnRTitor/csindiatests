<script lang="ts">
  import { Search, Menu, User, BookOpen, LineChart, Settings, Clock, Pencil, Timer, FileClock, Grid } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import ModeToggle from "$lib/components/layout/ModeToggle.svelte";
  import { page } from "$app/state";
  import type { Component } from "svelte";

  let isOpen = $state(false);

  type NavLink = {
    href: string;
    label: string;
    icon: Component;
  };

  const navLinks = [
    { href: "/", label: "Practice", icon: Pencil },
    { href: "/mock-tests", label: "Mock Tests", icon: Timer },
    { href: "/ugc-net-cs/pyq", label: "PYQs", icon: FileClock },
    { href: "/subjects", label: "Subjects", icon: Grid },
  ] satisfies NavLink[];

  type UserMenuLink = {
    href: string;
    label: string;
    icon: Component;
  };

  const userMenuLinks = [
    { href: "/progress", label: "Progress", icon: LineChart },
    { href: "/activity", label: "Recent Activity", icon: Clock },
    { href: "/settings", label: "Settings", icon: Settings },
  ] satisfies UserMenuLink[];
</script>

<header
  class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
>
  <div class="container mx-auto px-4 sm:px-8 flex h-16 items-center">

    <!-- Mobile Menu -->
    <div class="md:hidden mr-4">
      <Drawer.Root bind:open={isOpen} direction="left">
        <Drawer.Trigger>
          {#snippet child({ props }: { props: Record<string, unknown> })}
            <Button variant="ghost" size="icon" {...props}>
              <Menu class="h-5 w-5" />
              <span class="sr-only">Toggle menu</span>
            </Button>
          {/snippet}
        </Drawer.Trigger>
        <Drawer.Content class="w-[85vw] max-w-90 h-screen before:hidden bg-background rounded-none border-r border-border p-0 m-0">
          <Drawer.Header class="text-left border-b p-4">
            <Drawer.Title>
              <div class="flex items-center gap-2">
                <div class="bg-primary text-primary-foreground p-1.5 rounded-md">
                  <BookOpen class="h-5 w-5" />
                </div>
                <span class="font-bold tracking-tight text-lg">
                  CS India Tests
                </span>
              </div>
            </Drawer.Title>
          </Drawer.Header>
          <nav class="flex flex-col gap-2 p-4">
            {#each navLinks as link}
              {@const Icon = link.icon}
              <a
                href={link.href}
                class="flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                data-active={page.url.pathname === link.href || (link.href !== "/" && page.url.pathname.startsWith(link.href))}
                onclick={() => (isOpen = false)}
              >
                <Icon class="h-5 w-5" />
                {link.label}
              </a>
            {/each}
          </nav>
        </Drawer.Content>
      </Drawer.Root>
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
    <nav class="hidden md:flex items-center text-sm font-medium">
      <NavigationMenu.Root>
        <NavigationMenu.List class="flex items-center gap-6">
          {#each navLinks as link}
            <NavigationMenu.Item>
              <NavigationMenu.Link
                href={link.href}
                class="transition-colors hover:text-primary text-muted-foreground data-[active=true]:text-foreground text-sm font-medium"
                data-active={page.url.pathname === link.href || (link.href !== "/" && page.url.pathname.startsWith(link.href))}
              >
                {link.label}
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          {/each}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </nav>

    <div class="ml-auto flex items-center space-x-2 sm:space-x-4">
      <a href="/search">
        <Button
          variant="ghost"
          size="icon"
          class="text-muted-foreground hidden sm:inline-flex"
        >
          <Search class="h-5 w-5" />
          <span class="sr-only">Search</span>
        </Button>
      </a>

      <ModeToggle />

      {#snippet UserMenuItem(link: { href: string; label: string; icon: Component })}
        {@const Icon = link.icon}
        <DropdownMenu.Item class={page.url.pathname === link.href ? 'bg-accent text-accent-foreground' : ''}>
          {#snippet child({ props }: { props: Record<string, unknown> })}
            <a href={link.href} {...props}>
              <Icon class="mr-2 h-4 w-4" />
              <span>{link.label}</span>
            </a>
          {/snippet}
        </DropdownMenu.Item>
      {/snippet}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          {#snippet child({ props }: { props: Record<string, unknown> })}
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
        <DropdownMenu.Content align="end" class="w-48">
          {#each userMenuLinks as link}
            {@render UserMenuItem(link)}
          {/each}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </div>
</header>
