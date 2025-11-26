# Vue Audit Table

A lightweight Vue 3 component for displaying audit trail differences between old and new values with a clean, color-coded table interface.

## Features

- 🎨 Clean, color-coded diff visualization
- 🔍 Deep object comparison with nested structure support
- 📦 Lightweight with zero dependencies (except Vue 3)
- 🎯 TypeScript support
- ⚡ Works with Vue 3, Nuxt 3, Nuxt 4, and Vite projects
- 🔄 Fully reactive: updates automatically on prop changes
- 🖌️ Customizable colors, border, and text

## Installation
```bash
npm install vue-audit-table
```

## Usage
```vue
<script setup>
  import AuditTable from 'vue-audit-table'
  import 'vue-audit-table/style.css'

  const oldValue = {
    name: 'John Doe',
    age: 30,
    address: {
      city: 'New York',
      zip: '10001'
    }
  }

  const newValue = {
    name: 'John Doe',
    age: 31,
    address: {
      city: 'Los Angeles',
      zip: '90001'
    },
    email: 'john@example.com'
  }
</script>

<template>
  <AuditTable
      :old-value="oldValue"
      :new-value="newValue"
      old-value-color="#ffd6d6"
      new-value-color="#d4edda"
      unchanged-value-color="#ffffff"
      border-color="#ccc"
      text-color="#000"
  />
</template>
```

## Props
| Prop                  | Type                                 | Default   | Description                                 |
| --------------------- | ------------------------------------ | --------- | ------------------------------------------- |
| `oldValue`            | `Record<string, any>` | `Array<any>` | `{}`      | The original object or array before changes |
| `newValue`            | `Record<string, any>` | `Array<any>` | `{}`      | The updated object or array after changes   |
| `oldValueColor`       | `string`                             | `#ffd6d6` | Background color for old/deleted values     |
| `newValueColor`       | `string`                             | `#d4edda` | Background color for new/added values       |
| `unchangedValueColor` | `string`                             | `#ffffff` | Background color for unchanged values       |
| `borderColor`         | `string`                             | `#ccc`    | Border color for all table cells            |
| `textColor`           | `string`                             | `#000`    | Text color for all table cells              |

## Color Legend

- **White background**: Unchanged values
- **Red background**: Deleted or old values
- **Green background**: Added or new values

## Example Output

The component automatically detects and displays:
- ✅ Added fields
- ❌ Removed fields
- 🔄 Modified values
- 📊 Nested object changes
- 📋 Array differences

## License

MIT

## Author

[Ivan Kelava](https://github.com/ivan119)

## Repository

[GitHub](https://github.com/ivan119/vue-audit-table)