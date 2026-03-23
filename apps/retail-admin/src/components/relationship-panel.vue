<script lang="ts" setup>
import type { BlackTonnyInventorySalesRelationship } from '#/types/black-tonny';

import { computed } from 'vue';

import { toSentenceList } from '#/utils/black-tonny';

import EmptyStateBlock from './empty-state-block.vue';

const props = defineProps<{
  relationship?: BlackTonnyInventorySalesRelationship;
  subtitle?: string;
  title?: string;
}>();

const metricCards = computed(
  () => props.relationship?.metric_cards?.slice(0, 6) ?? [],
);

const findings = computed(() =>
  (props.relationship?.findings ?? []).map((item) => ({
    evidence: item.evidence ? String(item.evidence) : '',
    tag: item.value_type ? String(item.value_type) : '',
    title: String(item.title ?? '结论'),
    value: String(item.conclusion ?? '暂无'),
  })),
);

const recommendations = computed(() =>
  (props.relationship?.recommendations ?? []).map((item) => ({
    items: toSentenceList(item.items),
    title: String(item.title ?? '建议动作'),
  })),
);
</script>

<template>
  <el-card shadow="never" class="rounded-[28px] border border-slate-200">
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <span class="text-base font-semibold text-slate-950">
          {{ title || '库销关系' }}
        </span>
        <span class="text-xs text-slate-400">
          {{ subtitle || '先判断补货、积压和结构失衡' }}
        </span>
      </div>
    </template>

    <div v-if="relationship" class="space-y-4">
      <div
        class="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-4"
      >
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-lg font-semibold text-slate-950">
            {{ relationship.headline || '关系总览' }}
          </h3>
          <el-tag effect="plain" round size="small" type="info">
            {{ relationship.tone || 'neutral' }}
          </el-tag>
        </div>
        <p class="mt-2 text-sm leading-7 text-slate-600">
          {{ relationship.summary || '暂无库销关系摘要。' }}
        </p>
      </div>

      <div
        v-if="metricCards.length"
        class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        <article
          v-for="card in metricCards"
          :key="`${card.title}-${card.value}`"
          class="rounded-[22px] border border-slate-200 bg-white px-4 py-4"
        >
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm font-medium text-slate-500">{{ card.title }}</p>
            <el-tag
              v-if="card.value_type"
              effect="plain"
              round
              size="small"
              type="info"
            >
              {{ card.value_type }}
            </el-tag>
          </div>
          <p class="mt-3 text-2xl font-semibold text-slate-950">
            {{ card.value }}
          </p>
          <p class="mt-2 text-sm leading-6 text-slate-500">
            {{ card.note }}
          </p>
        </article>
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <section
          class="rounded-[22px] border border-slate-200 bg-white px-4 py-4"
        >
          <h3 class="text-sm font-semibold text-slate-950">核心发现</h3>
          <div v-if="findings.length" class="mt-3 space-y-3">
            <article
              v-for="item in findings"
              :key="`${item.title}-${item.value}`"
              class="rounded-2xl bg-slate-50/80 px-4 py-4"
            >
              <div class="flex items-center justify-between gap-3">
                <p class="font-medium text-slate-900">{{ item.title }}</p>
                <el-tag
                  v-if="item.tag"
                  effect="plain"
                  round
                  size="small"
                  type="info"
                >
                  {{ item.tag }}
                </el-tag>
              </div>
              <p class="mt-2 text-sm leading-6 text-slate-700">
                {{ item.value }}
              </p>
              <p
                v-if="item.evidence"
                class="mt-2 text-xs leading-5 text-slate-400"
              >
                {{ item.evidence }}
              </p>
            </article>
          </div>
          <EmptyStateBlock
            v-else
            compact
            description="当前样本没有返回库销发现。"
            title="暂无库销发现"
          />
        </section>

        <section
          class="rounded-[22px] border border-slate-200 bg-white px-4 py-4"
        >
          <h3 class="text-sm font-semibold text-slate-950">建议动作</h3>
          <div v-if="recommendations.length" class="mt-3 space-y-3">
            <article
              v-for="item in recommendations"
              :key="item.title"
              class="rounded-2xl bg-slate-50/80 px-4 py-4"
            >
              <p class="font-medium text-slate-900">{{ item.title }}</p>
              <ul class="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                <li v-for="line in item.items" :key="line">{{ line }}</li>
              </ul>
            </article>
          </div>
          <EmptyStateBlock
            v-else
            compact
            description="当前样本没有返回建议动作。"
            title="暂无建议动作"
          />
        </section>
      </div>
    </div>

    <EmptyStateBlock
      v-else
      compact
      description="当前样本没有返回库销关系数据。"
      title="暂无库销关系"
    />
  </el-card>
</template>
