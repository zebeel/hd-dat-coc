<!-- components/FieldGroup.vue -->
<template>
  <div 
    class="field-group"
    :class="group.colorClass"
  >
    <button 
      @click="$emit('toggle', group.key)"
      class="group-header"
      :class="{ expanded: expandedSections[group.key] }"
      :aria-expanded="expandedSections[group.key]"
      :aria-controls="`group-${group.key}`"
    >
      <div class="group-title">
        <i :class="group.icon" aria-hidden="true"></i>
        <span>{{ group.title }}</span>
        <span class="field-count">({{ group.fields.length }})</span>
      </div>
      <i class="fas fa-chevron-down toggle-icon" aria-hidden="true"></i>
    </button>
    
    <div 
      v-show="expandedSections[group.key]" 
      :id="`group-${group.key}`"
      class="group-content"
      role="region"
      :aria-labelledby="`header-${group.key}`"
    >
      <div v-if="group.description" class="group-description">
        <p>{{ group.description }}</p>
      </div>
      
      <div class="fields-grid">
        <FormField
          v-for="field in getVisibleFields(group.fields)" 
          :key="field.name"
          :field="field"
          :value="formData[field.name]"
          :error="errors[field.name]"
          @input="$emit('input', field.name, $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import { FieldGroup as FieldGroupType, FormData, Field } from '../config/formConfig'
import FormField from './FormField.vue'

interface Props {
  group: FieldGroupType
  formData: FormData
  expandedSections: Record<string, boolean>
  errors: Record<string, string>
}

interface Emits {
  (e: 'toggle', section: string): void
  (e: 'input', fieldName: keyof FormData, value: string): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

// Filter fields based on conditional logic
const getVisibleFields = (fields: Field[]) => {
  return fields.filter(field => {
    if (!field.conditionalField) return true
    
    const { dependsOn, showWhen } = field.conditionalField
    const dependentValue = props.formData[dependsOn]
    
    if (Array.isArray(showWhen)) {
      return showWhen.includes(dependentValue)
    }
    
    return dependentValue === showWhen
  })
}
</script>

<style scoped>
.group-description {
  padding: 0.5rem 0 1rem 0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1rem;
}

.group-description p {
  color: #718096;
  font-size: 0.875rem;
  margin: 0;
  font-style: italic;
}
</style>