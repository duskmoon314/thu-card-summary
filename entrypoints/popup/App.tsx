import { Button, Card, Space, Divider, Typography } from "antd";
import { FileTextOutlined, GithubOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import "./App.css";

const { Title, Text, Link } = Typography;

function App() {
  const handleOpenGitHub = () => {
    window.open("https://github.com/duskmoon314/thu-card-summary", "_blank");
  };

  const handleOpenCardSite = () => {
    window.open("https://card.tsinghua.edu.cn/userselftrade", "_blank");
  };

  return (
    <div style={{ width: "350px", padding: "16px" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <FileTextOutlined style={{ fontSize: "32px", color: "#667eea" }} />
        <Title level={4} style={{ margin: "8px 0" }}>
          清华大学校园卡年度报告
        </Title>
        <Text type="secondary" style={{ fontSize: "12px" }}>
          Tsinghua Card Annual Report
        </Text>
      </div>

      <Divider />

      <Card size="small" style={{ marginBottom: "12px" }}>
        <Space direction="vertical" style={{ width: "100%" }} size="small">
          <div>
            <QuestionCircleOutlined style={{ marginRight: "8px", color: "#667eea" }} />
            <Text strong>使用说明</Text>
          </div>
          <Text style={{ fontSize: "13px", color: "#666" }}>1. 访问清华大学卡务网站</Text>
          <Text style={{ fontSize: "13px", color: "#666" }}>2. 点击右下角"年度报告"按钮</Text>
          <Text style={{ fontSize: "13px", color: "#666" }}>3. 输入学号并生成报告</Text>
        </Space>
      </Card>

      <Space direction="vertical" style={{ width: "100%" }} size="small">
        <Button block type="primary" icon={<FileTextOutlined />} onClick={handleOpenCardSite}>
          打开卡务网站
        </Button>

        <Button block icon={<GithubOutlined />} onClick={handleOpenGitHub}>
          查看项目源码
        </Button>
      </Space>

      <Divider />

      <div
        style={{
          padding: "8px",
          background: "#f7f9fc",
          borderRadius: "4px",
          fontSize: "11px",
          color: "#666",
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: "4px" }}>Version {browser.runtime.getManifest().version}</div>
        <div>
          <Link
            href="https://github.com/duskmoon314/thu-card-summary"
            target="_blank"
            style={{ fontSize: "11px" }}
          >
            github.com/duskmoon314/thu-card-summary
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
