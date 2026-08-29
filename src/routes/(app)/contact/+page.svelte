<script lang="ts">
    import { Input } from "$lib/components/ui/input/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { LoaderCircle, CircleCheck } from "@lucide/svelte";

  let isSubmitting = $state(false);
  let isSuccess = $state(false);
  let name = $state("");
  let email = $state("");
  let subject = $state("");
  let message = $state("");

  let nameError = $state("");
  let emailError = $state("");
  let messageError = $state("");

  function validate() {
    let isValid = true;
    
    if (!name.trim()) {
      nameError = "Name is required.";
      isValid = false;
    } else {
      nameError = "";
    }
    
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      emailError = "Valid email is required.";
      isValid = false;
    } else {
      emailError = "";
    }

    if (!message.trim()) {
      messageError = "Message is required.";
      isValid = false;
    } else {
      messageError = "";
    }
    
    return isValid;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!validate()) return;

    isSubmitting = true;
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    isSubmitting = false;
    isSuccess = true;
  }

  function resetForm() {
    isSuccess = false;
    name = "";
    email = "";
    subject = "";
    message = "";
  }
</script>
<svelte:head>
  <title>Contact CS India Tests</title>
</svelte:head>

<div class="container mx-auto max-w-3xl py-12 md:py-20 px-4 sm:px-6">



  <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
    
    <!-- Contact Info -->
    <div class="space-y-8">
      <div>
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Get in touch</h1>
        <p class="text-lg text-muted-foreground">
          Have a question, found an issue, or have an idea for CS India Tests? We'd like to hear from you.
        </p>
      </div>

      <div class="space-y-6">
        <div>
          <h3 class="font-bold text-lg mb-1">General enquiries</h3>
          <p class="text-muted-foreground">hello@csindiatests.example</p>
        </div>
        <div>
          <h3 class="font-bold text-lg mb-1">Feedback</h3>
          <p class="text-muted-foreground">feedback@csindiatests.example</p>
        </div>
      </div>
    </div>

    <!-- Contact Form -->
    <div class="bg-card border rounded-2xl p-6 sm:p-8 shadow-sm">
      {#if isSuccess}
        <div class="h-full min-h-100 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-300">
          <div class="h-16 w-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center">
            <CircleCheck class="h-8 w-8" />
          </div>
          <div>
            <h2 class="text-2xl font-bold mb-2">Thanks for reaching out.</h2>
            <p class="text-muted-foreground max-w-sm mx-auto">
              Your message has been recorded in this demo interface. A real delivery backend can be connected later.
            </p>
          </div>
          <Button variant="outline" onclick={resetForm} class="mt-4">
            Send another message
          </Button>
        </div>
      {:else}
        <form onsubmit={handleSubmit} class="space-y-6 animate-in fade-in duration-300">
          
          <div class="space-y-2">
            <Label for="name">Name</Label>
            <Input 
              id="name" 
              bind:value={name} 
              disabled={isSubmitting} 
              placeholder="Your name" 
              class={nameError ? "border-destructive" : ""} 
            />
            {#if nameError}
              <p class="text-sm text-destructive font-medium">{nameError}</p>
            {/if}
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              bind:value={email} 
              disabled={isSubmitting} 
              placeholder="you@example.com" 
              class={emailError ? "border-destructive" : ""} 
            />
            {#if emailError}
              <p class="text-sm text-destructive font-medium">{emailError}</p>
            {/if}
          </div>

          <div class="space-y-2">
            <Label for="subject">Subject</Label>
            <Select.Root type="single" bind:value={subject} disabled={isSubmitting}>
              <Select.Trigger class="w-full">
                {subject || "Select a subject"}
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="General question">General question</Select.Item>
                <Select.Item value="Bug report">Bug report</Select.Item>
                <Select.Item value="Feedback">Feedback</Select.Item>
                <Select.Item value="Feature request">Feature request</Select.Item>
                <Select.Item value="Other">Other</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>

          <div class="space-y-2">
            <Label for="message">Message</Label>
            <Textarea 
              id="message" 
              bind:value={message} 
              disabled={isSubmitting} 
              placeholder="How can we help?" 
              class="min-h-30 resize-y {messageError ? 'border-destructive' : ''}" 
            />
            {#if messageError}
              <p class="text-sm text-destructive font-medium">{messageError}</p>
            {/if}
          </div>

          <Button type="submit" class="w-full" disabled={isSubmitting}>
            {#if isSubmitting}
              <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
              Sending...
            {:else}
              Send message
            {/if}
          </Button>

        </form>
      {/if}
    </div>
    
  </div>

</div>
