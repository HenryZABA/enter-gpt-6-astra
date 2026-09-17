## Context

当前 14 份 Prompt 原文均为中文纯文本，单份与批量下载仍以 `.txt` 输出。用户要求把全部 Prompt 统一为英文，并改成有清晰结构的 Markdown 下载文档。

本次会同时影响详情页中展示/复制的 Prompt 和下载内容：用户看到、复制及下载的都将是同一份英文版本。Wren’s Room 继续标记为 Original build prompt，其余 13 份继续标记为 Recreation prompt；只翻译内容，不改变来源声明。

## 推荐方案

- 将 `src/data/prompts/*.txt` 中 14 份 Prompt 逐份忠实翻译成英文，保留原有章节、列表、验收条件、数字、技术名词、限制条件和段落层级，不扩写新需求。
- 原始数据文件继续作为 raw source 使用，避免改动 `cases.ts` 的稳定映射；文件内容本身采用 Markdown 结构。
- `src/lib/prompt-bundle.ts` 改为标准 Markdown：H1 文档标题、摘要、每个案例 H2、Preview/Prompt type 元数据和 fenced `text` Prompt 区块。
- 新增单份 Markdown 构建 helper，`PromptPanel` 的下载改为 `*-prompt.md`；复制按钮仍只复制 Prompt 正文，避免把下载元数据混入粘贴内容。
- 批量文件名改为 `gpt6-astra-selected-prompts.md`，下载 Blob MIME 改为 `text/markdown;charset=utf-8`。
- 下载成功弹窗、批选模式和详情翻面交互保持不变。

## 关键文件

- `src/data/prompts/*.txt` — 14 份英文 Prompt 正文。
- `src/lib/prompt-bundle.ts` — Markdown 合集结构及单份文档 helper。
- `src/components/case-library/prompt-panel.tsx` — 单份 `.md` 下载。
- `src/pages/Index.tsx` — 批量下载文件名改为 `.md`。
- `src/lib/prompt-file.ts` — Markdown MIME。

## Implementation checklist

- [x] Wren’s Room Prompt 完整翻译为英文并保留原始来源类型。
- [x] 13 份 Recreation Prompt 完整翻译为英文，不改变项目映射或来源类型。
- [x] 所有章节、列表、数字、验收标准和免责声明在英文版中可追溯。
- [x] 单份下载生成带标题、Prompt type 和 fenced text block 的 Markdown。
- [x] 批量下载生成有效 Markdown，案例顺序与用户选择后的案例库顺序一致。
- [x] 单份和批量文件扩展名均为 `.md`，Blob 使用 Markdown MIME。
- [x] 页面展示与复制继续使用英文 Prompt 正文，不复制额外下载元数据。

## Verification checklist

- [x] 扫描 14 份 Prompt，确认不存在中文字符残留。
- [x] 检查 Markdown 标题层级、列表、链接和 fenced code block 均正确闭合。
- [x] 检查单份文件名、批量文件名和 MIME 均为 Markdown。
- [x] 检查 Wren 为 Original，其余 13 份为 Recreation，UI 与下载文档一致。
- [x] 运行 `pnpm check`、`pnpm build` 和 i18n check/scan。
