import { waitElement } from "@1natsu/wait-element";
import { createRoot } from "react-dom/client";
import { StyleProvider } from "@ant-design/cssinjs";
import ReportPanel from "@/components/ReportPanel";

export default defineContentScript({
  matches: ["*://card.tsinghua.edu.cn/userselftrade*"],

  async main() {
    console.log("[THU-CARD-SUMMARY] Content script loaded");

    // Wait for page to be ready
    await waitElement("body");

    // Create floating button
    createFloatingButton();
  },
});

function createFloatingButton() {
  // Remove existing container if present
  const existing = document.getElementById("THU-CARD-SUMMARY-extension-root");
  if (existing) {
    existing.remove();
    console.log("[THU-CARD-SUMMARY] Removed existing container");
  }

  // Create shadow root for isolation
  const container = document.createElement("div");
  container.id = "THU-CARD-SUMMARY-extension-root";
  container.style.cssText = "all: initial; position: fixed; z-index: 999999;";
  document.body.appendChild(container);

  const shadowRoot = container.attachShadow({ mode: "open" });

  // Create button
  const button = document.createElement("button");
  button.id = "THU-CARD-SUMMARY-button";
  button.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" fill="currentColor"/>
    </svg>
    <span>年度报告</span>
  `;
  button.style.cssText = `
    all: initial;
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 120px;
    height: 48px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 24px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    z-index: 999999;
  `;

  button.addEventListener("mouseenter", () => {
    button.style.transform = "scale(1.05)";
    button.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.5)";
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "scale(1)";
    button.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
  });

  button.addEventListener("click", () => {
    openPanel(shadowRoot, container);
  });

  shadowRoot.appendChild(button);

  console.log("[THU-CARD-SUMMARY] Floating button created");
}

function openPanel(shadowRoot: ShadowRoot, rootContainer: HTMLDivElement) {
  console.log("[THU-CARD-SUMMARY] Opening panel");

  // Remove the button
  const button = shadowRoot.getElementById("THU-CARD-SUMMARY-button");
  if (button) {
    button.remove();
    console.log("[THU-CARD-SUMMARY] Button removed");
  }

  const container = document.createElement("div");
  container.id = "THU-CARD-SUMMARY-panel-container";
  shadowRoot.appendChild(container);
  const root = createRoot(container);

  root.render(
    <StyleProvider container={shadowRoot}>
      <ReportPanel
        onClose={() => {
          console.log("[THU-CARD-SUMMARY] Closing panel");
          root.unmount();
          container.remove();

          // Recreate the button
          createFloatingButton();
        }}
      />
    </StyleProvider>
  );

  console.log("[THU-CARD-SUMMARY] React component rendered");
}
