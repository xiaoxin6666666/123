import { Accessor, createSignal, JSXElement, Setter, Show } from "solid-js"
import type { Setting } from "./Generator"
import { toJpeg } from "html-to-image"
import { copyToClipboard, dateFormat } from "~/utils"
import type { ChatMessage } from "~/types"

export default function SettingAction(props: {
  setting: Accessor<Setting>
  setSetting: Setter<Setting>
  clear: any
  reAnswer: any
  messaages: ChatMessage[]
}) {
  const [shown, setShown] = createSignal(false)
  const [copied, setCopied] = createSignal(false)
  return (
    <div class="text-sm text-slate-7 dark:text-slate mb-2">
      <Show when={shown()}>
        <SettingItem icon="i-carbon:api" label="API Key">
          <input
            type="password"
            value={props.setting().openaiAPIKey}
            class="max-w-150px ml-1em px-1 text-slate-7 dark:text-slate rounded-sm bg-slate bg-op-15 focus:bg-op-20 focus:ring-0 focus:outline-none"
            onInput={e => {
              props.setSetting({
                ...props.setting(),
                openaiAPIKey: (e.target as HTMLInputElement).value
              })
            }}
          />
        </SettingItem>
        <SettingItem icon="i-carbon:user-online" label="系统角色指令">
          <input="我想让你充当一个有知识而且表达能力很强的中国人,只要回答好我的问题就行，不要给我建议，并且要严格遵守我以下条件：第一：对于我的任何问题和我新提出的问题，首先第一句话你都必须要说 你好[鲜花] ，第二：请给出直接准确肯定的答案,50字到150字之间，第三：你一定要先说出准确直接肯定的答案，第四：有法律规定的问题或者答案，你要把法律规定的内容完整详细的说出来，第五你的回答要跟正常人的说话水平一样，第六步你的回答全程禁止带有机器人口语文字，机械化的文字，第七你具有人类的表达能力，但是你必须按照我的要求回答我的问题 ，第八禁止重复啰嗦，第九：不要建议我"
            type="text"
            value={props.setting().systemRule}
            class="text-ellipsis max-w-150px ml-1em px-1 text-slate-7 dark:text-slate rounded-sm bg-slate bg-op-15 focus:bg-op-20 focus:ring-0 focus:outline-none"
            onInput={e => {
              props.setSetting({
                ...props.setting(),
                systemRule: (e.target as HTMLInputElement).value
              })
            }}
          />
        </SettingItem>
        <SettingItem icon="i-carbon:data-enrichment" label="思维发散程度">
          <input
            type="range"
            min={0}
            max={100}
            value={String(props.setting().openaiAPITemperature)}
            class="max-w-150px w-full h-2 bg-slate bg-op-15 rounded-lg appearance-none cursor-pointer accent-slate"
            onInput={e => {
              props.setSetting({
                ...props.setting(),
                openaiAPITemperature: Number(
                  (e.target as HTMLInputElement).value
                )
              })
            }}
          />
        </SettingItem>
        <SettingItem
          icon="i-carbon:save-image"
          label="记录对话内容，刷新不会消失"
        >
          <label class="relative inline-flex items-center cursor-pointer ml-1">
            <input
              type="checkbox"
              checked={props.setting().archiveSession}
              class="sr-only peer"
              onChange={e => {
                props.setSetting({
                  ...props.setting(),
                  archiveSession: (e.target as HTMLInputElement).checked
                })
              }}
            />
            <div class="w-9 h-5 bg-slate bg-op-15 peer-focus:outline-none peer-focus:ring-0  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate"></div>
          </label>
        </SettingItem>
        <SettingItem
          icon="i-carbon:3d-curve-auto-colon"
          label="开启连续对话，将加倍消耗 Token"
        >
          <label class="relative inline-flex items-center cursor-pointer ml-1">
            <input
              type="checkbox"
              checked={props.setting().continuousDialogue}
              class="sr-only peer"
              onChange={e => {
                props.setSetting({
                  ...props.setting(),
                  continuousDialogue: (e.target as HTMLInputElement).checked
                })
              }}
            />
            <div class="w-9 h-5 bg-slate bg-op-15 peer-focus:outline-none peer-focus:ring-0  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate"></div>
          </label>
        </SettingItem>
        <hr class="mt-2 bg-slate-5 bg-op-15 border-none h-1px"></hr>
      </Show>
      <div class="mt-2 flex items-center justify-between">
        <ActionItem
          onClick={() => {
            setShown(!shown())
          }}
          icon="i-carbon:settings"
          label="设置"
        />
        <div class="flex">
          <ActionItem
            onClick={exportJpg}
            icon="i-carbon:image"
            label="导出图片"
          />
          <ActionItem
            label="导出 Markdown"
            onClick={async () => {
              await exportMD(props.messaages)
              setCopied(true)
              setTimeout(() => setCopied(false), 1000)
            }}
            icon={
              copied() ? "i-ri:check-fill text-yellow" : "i-ri:markdown-line"
            }
          />
          <ActionItem
            onClick={props.reAnswer}
            icon="i-carbon:reset"
            label="重新回答"
          />
          <ActionItem
            onClick={props.clear}
            icon="i-carbon:trash-can"
            label="清空对话"
          />
        </div>
      </div>
    </div>
  )
}

function SettingItem(props: {
  children: JSXElement
  icon: string
  label: string
}) {
  return (
    <div class="flex items-center p-1 justify-between hover:bg-slate hover:bg-op-10 rounded">
      <div class="flex items-center">
        <button class={props.icon} />
        <span ml-1>{props.label}</span>
      </div>
      {props.children}
    </div>
  )
}

function ActionItem(props: { onClick: any; icon: string; label?: string }) {
  return (
    <div
      class="flex items-center cursor-pointer mx-1 p-2 hover:bg-slate hover:bg-op-10 rounded text-1.2em"
      onClick={props.onClick}
    >
      <button class={props.icon} title={props.label} />
    </div>
  )
}

function exportJpg() {
  toJpeg(document.querySelector("#message-container") as HTMLElement, {}).then(
    url => {
      const a = document.createElement("a")
      a.href = url
      a.download = `ChatGPT-${dateFormat(new Date(), "HH-MM-SS")}.jpg`
      a.click()
    }
  )
}

async function exportMD(messages: ChatMessage[]) {
  const role = {
    system: "系统",
    user: "我",
    assistant: "ChatGPT"
  }
  await copyToClipboard(
    messages
      .map(k => {
        return `### ${role[k.role]}\n\n${k.content.trim()}`
      })
      .join("\n\n\n\n")
  )
}
