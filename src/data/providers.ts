/**
 * LLM provider presets for the AI settings modal.
 *
 * Every entry here is **OpenAI Chat Completions compatible** — that's
 * the protocol Ghost Editor speaks. If a provider uses a different
 * native API (e.g. Anthropic Messages), it must expose an
 * OpenAI-compatible endpoint or proxy to be included.
 *
 * Pick a provider → endpoint + default model auto-fill. Both stay
 * editable so the user can override or add custom values.
 */

export type ProviderRegion = 'global' | 'cn' | 'local';

export interface ProviderPreset {
  id: string;
  name: string;
  /** Short label shown in the dropdown next to the name. */
  region: ProviderRegion;
  /** OpenAI-compatible base URL (no trailing slash). */
  endpoint: string;
  /** Default model id pre-filled when the user picks this provider. */
  defaultModel: string;
  /** Common models shown in the model datalist for this provider. */
  models: string[];
  /** URL where the user can get an API key. */
  keyUrl?: string;
  /** One-line note shown under the endpoint input. */
  note?: string;
}

export const REGION_LABELS: Record<ProviderRegion, string> = {
  global: '海外',
  cn: '国内',
  local: '本地',
};

export const providers: ProviderPreset[] = [
  /* -------------------- Global -------------------- */
  {
    id: 'openai',
    name: 'OpenAI',
    region: 'global',
    endpoint: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo', 'o1-preview', 'o1-mini', 'o3-mini'],
    keyUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'google-gemini',
    name: 'Google Gemini',
    region: 'global',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai',
    defaultModel: 'gemini-2.0-flash-exp',
    models: ['gemini-2.0-flash-exp', 'gemini-2.0-flash-thinking-exp', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'],
    keyUrl: 'https://aistudio.google.com/apikey',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    region: 'global',
    endpoint: 'https://openrouter.ai/api/v1',
    defaultModel: 'openai/gpt-4o-mini',
    models: [
      'openai/gpt-4o',
      'openai/gpt-4o-mini',
      'anthropic/claude-3.5-sonnet',
      'google/gemini-2.0-flash-exp:free',
      'meta-llama/llama-3.1-405b-instruct',
      'meta-llama/llama-3.1-70b-instruct',
      'deepseek/deepseek-chat',
      'qwen/qwen-2.5-72b-instruct',
    ],
    keyUrl: 'https://openrouter.ai/keys',
    note: 'One key, every model. Free tier available.',
  },
  {
    id: 'groq',
    name: 'Groq',
    region: 'global',
    endpoint: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.1-70b-versatile',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
    keyUrl: 'https://console.groq.com/keys',
    note: 'Ultra-fast inference. Generous free tier.',
  },
  {
    id: 'xai',
    name: 'xAI (Grok)',
    region: 'global',
    endpoint: 'https://api.x.ai/v1',
    defaultModel: 'grok-2-latest',
    models: ['grok-2-latest', 'grok-2-vision-latest', 'grok-beta'],
    keyUrl: 'https://console.x.ai/',
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    region: 'global',
    endpoint: 'https://api.mistral.ai/v1',
    defaultModel: 'mistral-large-latest',
    models: ['mistral-large-latest', 'mistral-small-latest', 'mistral-medium-latest', 'open-mistral-7b', 'open-mixtral-8x7b'],
    keyUrl: 'https://console.mistral.ai/',
  },
  {
    id: 'together',
    name: 'Together AI',
    region: 'global',
    endpoint: 'https://api.together.xyz/v1',
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    models: ['meta-llama/Llama-3.3-70B-Instruct-Turbo', 'meta-llama/Llama-3.1-405B-Instruct-Turbo', 'Qwen/Qwen2.5-72B-Instruct-Turbo', 'deepseek-ai/DeepSeek-V3'],
    keyUrl: 'https://api.together.xyz/settings/api-keys',
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    region: 'global',
    endpoint: 'https://api.perplexity.ai',
    defaultModel: 'llama-3.1-sonar-large-128k-online',
    models: ['llama-3.1-sonar-large-128k-online', 'llama-3.1-sonar-small-128k-online', 'llama-3.1-sonar-large-128k-chat'],
    keyUrl: 'https://www.perplexity.ai/settings/api',
    note: 'Online models with built-in web search.',
  },
  {
    id: 'cohere',
    name: 'Cohere',
    region: 'global',
    endpoint: 'https://api.cohere.ai/compatibility/v1',
    defaultModel: 'command-r-plus',
    models: ['command-r-plus', 'command-r', 'command-light', 'command'],
    keyUrl: 'https://dashboard.cohere.com/api-keys',
  },

  /* -------------------- China -------------------- */
  {
    id: 'deepseek',
    name: 'DeepSeek 深度求索',
    region: 'cn',
    endpoint: 'https://api.deepseek.com',
    defaultModel: 'deepseek-chat',
    models: ['deepseek-chat', 'deepseek-reasoner', 'deepseek-coder'],
    keyUrl: 'https://platform.deepseek.com/api_keys',
    note: '性价比最高，支持 64K 上下文。',
  },
  {
    id: 'moonshot',
    name: 'Moonshot 月之暗面 (Kimi)',
    region: 'cn',
    endpoint: 'https://api.moonshot.cn/v1',
    defaultModel: 'moonshot-v1-8k',
    models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k', 'moonshot-v1-auto'],
    keyUrl: 'https://platform.moonshot.cn/console/api-keys',
  },
  {
    id: 'zhipu',
    name: '智谱 GLM (BigModel)',
    region: 'cn',
    endpoint: 'https://open.bigmodel.cn/api/paas/v4',
    defaultModel: 'glm-4-flash',
    models: ['glm-4-plus', 'glm-4-air', 'glm-4-air-250414', 'glm-4-flash', 'glm-4-flash-250414', 'glm-4-long'],
    keyUrl: 'https://bigmodel.cn/usercenter/apikeys',
    note: 'GLM-4-Flash 免费。',
  },
  {
    id: 'baidu-qianfan',
    name: '百度千帆 (Qianfan)',
    region: 'cn',
    endpoint: 'https://qianfan.baidubce.com/v2',
    defaultModel: 'ernie-3.5-8k',
    models: ['ernie-4.0-8k', 'ernie-3.5-8k', 'ernie-3.5-128k', 'ernie-speed-8k', 'ernie-lite-8k', 'ernie-tiny-8k', 'deepseek-v3', 'deepseek-r1'],
    keyUrl: 'https://console.bce.baidu.com/qianfan/ais/console/apiKey',
    note: '兼容模式，访问凭证从控制台获取。',
  },
  {
    id: 'alibaba-qwen',
    name: '阿里百炼 (DashScope / Qwen)',
    region: 'cn',
    endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: 'qwen-plus',
    models: ['qwen-max', 'qwen-plus', 'qwen-turbo', 'qwen-long', 'qwen2.5-72b-instruct', 'qwen2.5-32b-instruct', 'qwen2.5-14b-instruct', 'qwen2.5-7b-instruct', 'qwen-vl-max', 'qwen-vl-plus'],
    keyUrl: 'https://bailian.console.aliyun.com/?apiKey=1',
    note: '兼容模式需用「上海(华东2)」地域 Key。',
  },
  {
    id: 'tencent-hunyuan',
    name: '腾讯混元 (Hunyuan)',
    region: 'cn',
    endpoint: 'https://api.hunyuan.cloud.tencent.com/v1',
    defaultModel: 'hunyuan-turbo',
    models: ['hunyuan-turbo', 'hunyuan-pro', 'hunyuan-standard', 'hunyuan-large', 'hunyuan-embedding'],
    keyUrl: 'https://console.cloud.tencent.com/hunyuan/api-key',
  },
  {
    id: 'doubao',
    name: '字节豆包 (Volcengine Ark)',
    region: 'cn',
    endpoint: 'https://ark.cn-beijing.volces.com/api/v3',
    defaultModel: 'doubao-pro-32k',
    models: ['doubao-pro-32k', 'doubao-pro-128k', 'doubao-lite-32k', 'doubao-lite-128k', 'doubao-1-5-pro-32k'],
    keyUrl: 'https://www.volcengine.com/product/ark',
    note: 'Endpoint 中需将模型 ID 替换为你在控制台创建的推理接入点 ID。',
  },
  {
    id: 'stepfun',
    name: 'Stepfun 阶跃星辰',
    region: 'cn',
    endpoint: 'https://api.stepfun.com/v1',
    defaultModel: 'step-1-8k',
    models: ['step-1-8k', 'step-1-32k', 'step-1-128k', 'step-1v-32k', 'step-2-16k', 'step-2-mini'],
    keyUrl: 'https://platform.stepfun.com/',
  },
  {
    id: 'yi-01ai',
    name: '零一万物 (Yi / 01.AI)',
    region: 'cn',
    endpoint: 'https://api.lingyiwanwu.com/v1',
    defaultModel: 'yi-large',
    models: ['yi-large', 'yi-medium', 'yi-spark', 'yi-vision', 'yi-large-rag', 'yi-large-fc'],
    keyUrl: 'https://platform.lingyiwanwu.com/',
  },
  {
    id: 'siliconflow',
    name: 'SiliconFlow 硅基流动',
    region: 'cn',
    endpoint: 'https://api.siliconflow.cn/v1',
    defaultModel: 'Qwen/Qwen2.5-72B-Instruct',
    models: [
      'Qwen/Qwen2.5-72B-Instruct',
      'Qwen/Qwen2.5-32B-Instruct',
      'Qwen/Qwen2.5-14B-Instruct',
      'Qwen/Qwen2.5-7B-Instruct',
      'Qwen/QwQ-32B-Preview',
      'deepseek-ai/DeepSeek-V3',
      'deepseek-ai/DeepSeek-R1',
      'meta-llama/Meta-Llama-3.1-70B-Instruct',
      'meta-llama/Meta-Llama-3.1-8B-Instruct',
      'THUDM/glm-4-9b-chat',
    ],
    keyUrl: 'https://cloud.siliconflow.cn/account/ak',
    note: '国内速度快的多模型托管，注册送 2000 万 tokens。',
  },
  {
    id: 'iflytek-spark',
    name: '讯飞星火 (iFlytek Spark)',
    region: 'cn',
    endpoint: 'https://spark-api-open.xf-yun.com/v1',
    defaultModel: 'general',
    models: ['general', 'generalv3.5', '4.0Ultra', 'max-32k', 'pro-128k', 'lite'],
    keyUrl: 'https://console.xfyun.cn/services/bm3',
  },
  {
    id: 'modelscope',
    name: 'ModelScope 魔搭',
    region: 'cn',
    endpoint: 'https://api-inference.modelscope.cn/v1',
    defaultModel: 'Qwen/Qwen2.5-72B-Instruct',
    models: ['Qwen/Qwen2.5-72B-Instruct', 'Qwen/Qwen2.5-32B-Instruct', 'Qwen/Qwen2.5-14B-Instruct', 'Qwen/Qwen2.5-7B-Instruct', 'deepseek-ai/DeepSeek-V2.5'],
    keyUrl: 'https://www.modelscope.cn/my/myaccesstoken',
    note: '魔搭平台的 API 推理服务，注册即送额度。',
  },

  /* -------------------- Local -------------------- */
  {
    id: 'ollama',
    name: 'Ollama (本地)',
    region: 'local',
    endpoint: 'http://localhost:11434/v1',
    defaultModel: 'llama3.1',
    models: ['llama3.1', 'llama3.2', 'qwen2.5', 'gemma2', 'mistral', 'codellama', 'deepseek-r1'],
    note: 'Run `OLLAMA_ORIGINS=* ollama serve` to allow browser CORS.',
  },
  {
    id: 'lm-studio',
    name: 'LM Studio (本地)',
    region: 'local',
    endpoint: 'http://localhost:1234/v1',
    defaultModel: 'local-model',
    models: ['local-model', 'qwen2.5-7b-instruct', 'llama-3.1-8b-instruct'],
    note: 'Enable the local server in LM Studio. CORS is on by default.',
  },
  {
    id: 'vllm',
    name: 'vLLM (本地/自部署)',
    region: 'local',
    endpoint: 'http://localhost:8000/v1',
    defaultModel: 'meta-llama/Llama-3.1-8B-Instruct',
    models: ['meta-llama/Llama-3.1-8B-Instruct', 'meta-llama/Llama-3.1-70B-Instruct', 'Qwen/Qwen2.5-7B-Instruct'],
    note: '`vllm serve ... --host 0.0.0.0` then start the server.',
  },
];

export const customProvider: ProviderPreset = {
  id: 'custom',
  name: '自定义',
  region: 'global',
  endpoint: 'https://',
  defaultModel: '',
  models: [],
};

export function findProvider(id: string | null | undefined): ProviderPreset | null {
  if (!id) return null;
  return providers.find((p) => p.id === id) ?? null;
}
