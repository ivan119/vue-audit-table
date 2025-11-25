<template>
  <div ref="container" class="audit-table" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

// CORRECT WAY in Vue 3.5+ with TypeScript
const props = withDefaults(
    defineProps<{
      oldValue?: Record<string, any>
      newValue?: Record<string, any>
    }>(),
    {
      oldValue: () => ({}),
      newValue: () => ({}),
    }
)

const container = ref<HTMLElement | null>(null)

const render = () => {
  if (!container.value) return
  const oldStr = JSON.stringify(props.oldValue, null, 2)
  const newStr = JSON.stringify(props.newValue, null, 2)
  container.value.innerHTML = diffHtml(oldStr, newStr)
}

onMounted(render)
watch(() => [props.oldValue, props.newValue], render, { deep: true })

// ——————————— FULL WORKING DIFF ENGINE (copy-paste) ———————————
function diffHtml(v1: string, v2: string): string {
  const type = (o: any) => Object.prototype.toString.call(o)
  const kind = (t: string) => t === '[object Array]' ? 'array' : t === '[object Object]' ? 'object' : 'simple'

  const oldItem = (n: string | null, s: string, t: string, v: any) => ({ name: n, status: s, oldType: kind(t), oldValue: v })
  const newItem = (n: string | null, s: string, t: string, v: any) => ({ name: n, status: s, newType: kind(t), newValue: v })
  const del = (k: string, t: string, v: any) => oldItem(k, 'deleted', t, v)
  const add = (k: string, t: string, v: any) => newItem(k, 'created', t, v)

  const deep = (obj: any, f: any): any[] => {
    const r: any[] = []
    for (const k in obj) if (Object.hasOwn(obj, k)) r.push(deepItem(k, obj[k], f))
    return r
  }
  const deepItem = (name: string, val: any, f: any) => {
    const t = type(val)
    return t === '[object Array]' || t === '[object Object]' ? f(name, t, deep(val, f)) : f(name, t, val)
  }

  const compare = (a: any, b: any, name: string | null = null): any => {
    const ta = type(a), tb = type(b)
    if (a === b) return oldItem(name, 'unchanged', ta, a)
    if (ta === tb && (ta === '[object Array]' || ta === '[object Object]')) {
      return oldItem(name, 'unchanged', ta, diffDeep(a, b))
    }
    if (ta === tb) {
      return { name, status: 'updated', oldType: kind(ta), newType: kind(tb), oldValue: a, newValue: b }
    }
    return {
      name,
      status: 'updated',
      oldType: kind(ta),
      newType: kind(tb),
      oldValue: kind(ta) === 'simple' ? a : deep(a, del),
      newValue: kind(tb) === 'simple' ? b : deep(b, add),
    }
  }

  const diffDeep = (a: any, b: any): any[] => {
    const items: any[] = []
    for (const k in a) Object.hasOwn(a, k) && (Object.hasOwn(b, k) ? items.push(compare(a[k], b[k], k)) : items.push(deepItem(k, a[k], del)))
    for (const k in b) Object.hasOwn(b, k) && !Object.hasOwn(a, k) && items.push(deepItem(k, b[k], add))
    return items
  }

  const esc = (v: any) => v == null ? '' : String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]!))

  const row = (cls: string, label: string | null, val: string) =>
      `<tr class="${cls}"><td class="label ${cls}">${label ?? ''}</td><td class="value ${cls}">${val}</td></tr>`

  const node = (n: any): string => {
    let h = ''
    const name = esc(n.name)
    if (n.oldType) {
      const old = n.oldType === 'simple' ? esc(n.oldValue) : table(n.oldValue)
      if (n.status === 'unchanged') return row('unchanged', name, old)
      h += row('old', name, old)
    }
    if (n.newType) h += row('new', name, n.newType === 'simple' ? esc(n.newValue) : table(n.newValue))
    return h
  }

  const table = (nodes: any[]) => `<table><tbody>${nodes.map(node).join('')}</tbody></table>`
  const report = (root: any) => table([root])

  return report(compare(JSON.parse(v1 || '{}'), JSON.parse(v2 || '{}')))
}
</script>