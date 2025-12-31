import { useState, useRef } from "react";
import { StyleProvider } from "@ant-design/cssinjs";
import { FloatButton } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import ReportPanel from "@/components/ReportPanel";

function App({ shadowRoot }: { shadowRoot: ShadowRoot }) {
  const [showPanel, setShowPanel] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <StyleProvider container={shadowRoot}>
      <div ref={containerRef}>
        <FloatButton
          icon={<FileTextOutlined />}
          content="年度报告"
          shape="square"
          onClick={() => setShowPanel(true)}
          styles={{
            root: {
              right: "24px",
              bottom: "24px",
              width: "120px",
              height: "48px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "24px",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            },
            icon: {
              color: "white",
              fontSize: "16px",
            },
            content: {
              color: "white",
              fontSize: "16px",
            },
          }}
        />
        <ReportPanel
          open={showPanel}
          onClose={() => setShowPanel(false)}
          getContainer={() => containerRef.current || document.body}
        />
      </div>
    </StyleProvider>
  );
}

export default App;
