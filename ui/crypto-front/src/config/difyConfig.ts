/**
 * Dify 配置文件
 * 存储 Dify 相关的工作流地址和配置信息
 */
export const difyConfig = {
  // Dify 工作流地址
  workflowUrl: 'https://api.dify.ai/v1/workflows/run',
  
  // 加密货币数据爬取工作流
  cryptoWorkflowId: 'your-crypto-workflow-id',
  
  // API Key (建议从环境变量获取)
  apiKey: 'your-dify-api-key',
  
  // 数据推送间隔（毫秒）
  pushInterval: 300000, // 5分钟
};

/**
 * 获取完整的 Dify 工作流运行地址
 */
export const getDifyWorkflowUrl = (workflowId?: string): string => {
  return `${difyConfig.workflowUrl}/${workflowId || difyConfig.cryptoWorkflowId}`;
};