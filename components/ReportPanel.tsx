import { useState } from "react";
import {
  Modal,
  Button,
  Input,
  Form,
  Spin,
  ConfigProvider,
  Space,
  Typography,
  Alert,
  message,
} from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import type { ReportData } from "@/lib/types";
import ReportView from "./ReportView";

const { Title, Paragraph } = Typography;

interface ReportPanelProps {
  open: boolean;
  onClose: () => void;
  getContainer?: HTMLElement | (() => HTMLElement) | false;
}

export default function ReportPanel({ open, onClose, getContainer }: ReportPanelProps) {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const handleGenerate = async (values: { userId: string }) => {
    setLoading(true);
    try {
      console.log("[PANEL] Sending FETCH_DATA message...");
      const response = await browser.runtime.sendMessage({
        type: "FETCH_DATA",
        payload: {
          userId: values.userId,
          startDate: "2025-01-01",
          endDate: "2025-12-31",
        },
      });

      console.log("[PANEL] Received response:", response);
      console.log("[PANEL] Response type:", typeof response);
      console.log("[PANEL] Response.success:", response?.success);
      console.log("[PANEL] Response.data:", response?.data);

      if (response && response.success) {
        console.log("[PANEL] Setting report data...");
        setReportData(response.data);
        console.log("[PANEL] Report data set successfully");
      } else {
        throw new Error(response?.error || "生成报告失败");
      }
    } catch (error) {
      console.error("[PANEL] Error:", error);
      const errorMsg = error instanceof Error ? error.message : "生成报告时发生错误";

      // Check if it's a cookie error
      if (
        errorMsg.includes("cookie") ||
        errorMsg.includes("Cookie") ||
        errorMsg.includes("logged in")
      ) {
        messageApi.error("请先登录校园卡系统 (card.tsinghua.edu.cn)");
      } else {
        messageApi.error(errorMsg);
        messageApi.error("若尚未登录，请先登录系统；若已登录，请尝试排查网络问题");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      getPopupContainer={
        getContainer
          ? typeof getContainer === "function"
            ? getContainer
            : () => getContainer
          : undefined
      }
    >
      {contextHolder}
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        width={reportData ? 800 : 500}
        centered
        getContainer={getContainer}
        title={
          <Space>
            <FileTextOutlined />
            <span>清华大学校园卡年度报告</span>
          </Space>
        }
        styles={{
          header: {
            color: "white",
          },
          body: {
            padding: reportData ? "24px" : "32px",
          },
        }}
      >
        {!reportData ? (
          <Spin spinning={loading} tip="正在生成年度报告...">
            <Space vertical size="large" style={{ width: "100%", display: "flex" }}>
              <div style={{ textAlign: "center" }}>
                <Title level={3}>生成 2025 年度报告</Title>
                <Paragraph type="secondary">请输入您的学号以生成年度消费报告</Paragraph>
              </div>

              <Form form={form} onFinish={handleGenerate} layout="vertical">
                <Form.Item
                  label="学号"
                  name="userId"
                  rules={[
                    { required: true, message: "请输入学号" },
                    {
                      pattern: /^\d{10}$/,
                      message: "请输入有效的10位学号",
                    },
                  ]}
                >
                  <Input
                    placeholder="请输入10位学号"
                    size="large"
                    disabled={loading}
                    maxLength={10}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    size="large"
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                    }}
                  >
                    生成报告
                  </Button>
                </Form.Item>
              </Form>

              <Alert
                title="使用说明"
                description={
                  <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px" }}>
                    <li>报告数据来源于 2025-01-01 至 2025-12-31</li>
                    <li>目前仅统计食堂消费记录，不含其他交易</li>
                  </ul>
                }
                type="info"
                showIcon
              />
            </Space>
          </Spin>
        ) : (
          <ReportView data={reportData} onBack={() => setReportData(null)} />
        )}
      </Modal>
    </ConfigProvider>
  );
}
