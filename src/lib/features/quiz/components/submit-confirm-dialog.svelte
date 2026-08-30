<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";

  let { 
    open = $bindable(false),
    hasUnansweredQuestions,
    onSubmit,
  }: {
    open: boolean;
    hasUnansweredQuestions: boolean;
    onSubmit: () => void;
  } = $props();

</script>

<AlertDialog.Root bind:open>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Submit Test?</AlertDialog.Title>
      <AlertDialog.Description>
        You are about to finish and submit the test.
        {#if hasUnansweredQuestions}
          <br/><br/>
          <span class="text-destructive font-medium">You have unanswered questions.</span>
        {/if}
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Review Answers</AlertDialog.Cancel>
      <AlertDialog.Action onclick={onSubmit}>Submit Test</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
