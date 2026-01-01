import ReactDOM from "react-dom/client";
import App from "./App";
import "antd/dist/antd.css";

export default defineContentScript({
  matches: ["*://card.tsinghua.edu.cn/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    console.log("[THU-CARD-SUMMARY] Content script loaded");

    const ui = await createShadowRootUi(ctx, {
      name: "thu-card-summary-ui",
      position: "inline",
      anchor: "body",
      onMount: (container, shadowRoot) => {
        const app = document.createElement("div");
        container.append(app);

        const root = ReactDOM.createRoot(app);
        root.render(<App shadowRoot={shadowRoot} />);
        return root;
      },
      onRemove: (root: any) => {
        root?.unmount();
      },
    });

    ui.mount();
  },
});
