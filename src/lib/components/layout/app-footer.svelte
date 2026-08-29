<script lang="ts">
  import { BookOpen } from "@lucide/svelte";
</script>

<footer class="border-t py-8 md:py-12 bg-muted/30">
  <div class="container mx-auto px-4 sm:px-8">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
      
      <div class="flex items-center gap-2">
        <div class="bg-primary/10 text-primary p-1 rounded-md">
          <BookOpen class="h-4 w-4" />
        </div>
        <span class="font-semibold tracking-tight text-sm">
          CS India Tests
        </span>
        <span class="text-sm text-muted-foreground ml-2">
          &copy; {new Date().getFullYear()} All rights reserved.
        </span>
      </div>

      <nav class="flex items-center gap-4 text-sm text-muted-foreground">
        <a href="/about" class="hover:text-foreground transition-colors">About</a>
        <a href="/contact" class="hover:text-foreground transition-colors">Contact</a>
        <a href="/privacy" class="hover:text-foreground transition-colors">Privacy</a>
        <a href="/terms" class="hover:text-foreground transition-colors">Terms</a>
      </nav>
      
    </div>
  </div>
</footer>
