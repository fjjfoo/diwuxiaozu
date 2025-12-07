import { useState } from 'react';
import { Button, Input, Form, Card, Space, message } from 'antd';
import { batchSaveCrypto } from '../api/crypto';
import { type CryptoCurrencyRequest } from '../types/crypto';
import 'antd/dist/reset.css';

const TestData = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();
      
      // 构造请求数据（不含 id，usdPrice 为字符串，updateTime 为 ISO 格式）
      const testData: CryptoCurrencyRequest[] = [
        {
          symbol: values.symbol || 'BTC',
          name: values.name || '比特币',
          usdPrice: values.price || '45000.12345678', // 必须是字符串，避免精度丢失
          updateTime: new Date().toISOString(), // 生成 ISO 格式时间（如：2025-12-01T12:00:00.000Z）
        },
        {
          symbol: 'ETH',
          name: '以太坊',
          usdPrice: '2300.87654321',
          updateTime: new Date().toISOString(),
        },
      ];

      const res = await batchSaveCrypto(testData);
      message.success(res.data.message);
      form.resetFields();
    } catch (error: unknown) {
      // 显示后端返回的详细错误信息
      const errorMsg = (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || (error as { message?: string }).message || '数据推送失败';
      message.error(errorMsg);
      console.error('推送失败：', (error as { response?: { data?: unknown } }).response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Card title="模拟Dify推送测试数据" variant="outlined">
        <Form form={form} layout="vertical">
          <Form.Item 
            label="货币符号" 
            name="symbol" 
            rules={[{ required: true, message: '请输入货币符号（如 BTC）' }]}
          >
            <Input placeholder="如：BTC/ETH/USDT" />
          </Form.Item>
          <Form.Item 
            label="货币名称" 
            name="name" 
            rules={[{ required: true, message: '请输入货币名称' }]}
          >
            <Input placeholder="如：比特币/以太坊" />
          </Form.Item>
          <Form.Item 
            label="美元价格（支持8位小数）" 
            name="price" 
            rules={[{ required: true, message: '请输入价格（如：45000.12345678）' }]}
          >
            <Input placeholder="如：45000.12345678" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={onSubmit} loading={loading}>
                推送测试数据
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TestData;