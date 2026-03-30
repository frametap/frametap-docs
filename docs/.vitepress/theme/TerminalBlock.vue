<template>
  <div class="terminal-block">
    <div class="terminal-header">
      <span class="terminal-dot red"></span>
      <span class="terminal-dot yellow"></span>
      <span class="terminal-dot green"></span>
      <span class="terminal-title">{{ title }}</span>
    </div>
    <div class="terminal-body">
      <pre><code><slot /></code></pre>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'bash'
  }
})
</script>

<style scoped>
.terminal-block {
  border-radius: 8px;
  overflow: hidden;
  margin: 16px 0;
  background: #1e1e1e;
  border: 1px solid #333;
}

.terminal-header {
  background: #2d2d2d;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #333;
}

.terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.terminal-dot.red {
  background: #ff5f56;
}

.terminal-dot.yellow {
  background: #ffbd2e;
}

.terminal-dot.green {
  background: #27c93f;
}

.terminal-title {
  margin-left: 8px;
  font-size: 12px;
  color: #888;
  font-family: monospace;
}

.terminal-body {
  padding: 12px;
  overflow-x: auto;
}

.terminal-body pre {
  margin: 0;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #f8f8f2;
}

.terminal-body code {
  background: transparent;
  padding: 0;
  color: inherit;
}
</style>
