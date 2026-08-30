<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import type { TestSession } from "$lib/infrastructure/storage/db.types";
  
  let { 
    session, 
    onResume, 
    onDiscard, 
    onCancel 
  }: { 
    session: TestSession, 
    onResume: () => void, 
    onDiscard: () => void, 
    onCancel: () => void 
  } = $props();

  let open = $state(true);

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      onCancel();
    }
  }

  const sessionDate = $derived(session.startedAt ? new Date(session.startedAt).toLocaleString() : 'Unknown time');
</script>

<AlertDialog.Root {open} onOpenChange={handleOpenChange}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Test in progress</AlertDialog.Title>
      <AlertDialog.Description>
        You already have a <strong class="text-foreground">{session.title || 'test'}</strong> in progress from {sessionDate}.
        <br/><br/>
        Would you like to resume your existing test or discard it and start a new one?
        <br/><br/>
        <span class="text-destructive font-medium">Starting a new test will discard your current progress.</span>
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel onclick={onCancel}>Cancel</AlertDialog.Cancel>
      <div class="flex gap-2">
        <AlertDialog.Action onclick={onDiscard} class="bg-destructive text-destructive-foreground hover:bg-destructive/90">
          Start New Test
        </AlertDialog.Action>
        <AlertDialog.Action onclick={onResume}>
          Resume Test
        </AlertDialog.Action>
      </div>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
