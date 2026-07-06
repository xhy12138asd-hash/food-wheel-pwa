import type { Food } from "../types";

const API_KEY_STORAGE = "eat-wheel-zhipu-api-key-v1";
const BIGMODEL_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const MODEL = "glm-4.6v";

export function loadZhipuApiKey(): string {
  return localStorage.getItem(API_KEY_STORAGE) || "";
}

export function saveZhipuApiKey(apiKey: string): void {
  const trimmed = apiKey.trim();
  if (trimmed) {
    localStorage.setItem(API_KEY_STORAGE, trimmed);
  } else {
    localStorage.removeItem(API_KEY_STORAGE);
  }
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function recognizeFoodFromImage(apiKey: string, imageDataUrl: string): Promise<Omit<Food, "id">> {
  const response = await fetch(BIGMODEL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageDataUrl,
              },
            },
            {
              type: "text",
              text:
                "请识别图片中的食物，估算一份可食部分的营养数据。只返回 JSON，不要 Markdown。格式必须是：" +
                '{"name":"食物名称","category":"分类","calories":数字,"protein":数字,"carbs":数字,"fat":数字,"fiber":数字,"note":"估算说明"}。' +
                "单位：热量 kcal，蛋白质/碳水/脂肪/膳食纤维为 g。如果无法确定，请根据图片给出合理估算并在 note 里说明。",
            },
          ],
        },
      ],
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `识别失败：${response.status}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("识别结果格式不正确");
  }

  return normalizeRecognitionResult(parseJsonContent(content));
}

function parseJsonContent(content: string): unknown {
  const trimmed = content.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "");
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("没有解析到营养 JSON");
    return JSON.parse(match[0]);
  }
}

function normalizeRecognitionResult(value: unknown): Omit<Food, "id"> {
  const result = value as Partial<Food>;
  return {
    name: String(result.name || "图片识别食物"),
    category: String(result.category || "图片识别"),
    calories: Number(result.calories) || 0,
    protein: Number(result.protein) || 0,
    carbs: Number(result.carbs) || 0,
    fat: Number(result.fat) || 0,
    fiber: Number(result.fiber) || 0,
    note: String(result.note || "由图片识别估算，实际数值可能有偏差"),
  };
}
