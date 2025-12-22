import { requestWithRetry } from '../utils/axiosInstance';
import { difyConfig, getDifyWorkflowUrl } from '../config/difyConfig';

// 市场概览数据类型
export interface MarketOverview {
  totalMarketCap: number;
  tradingVolume24h: number;
  btcDominance: number;
  cryptoPerformance: Array<{
    symbol: string;
    price: number;
    change24h: number;
  }>;
}

// 价格历史数据类型
export interface PriceHistory {
  symbol: string;
  timestamps: number[];
  prices: number[];
}

// 技术指标类型
export interface TechnicalIndicator {
  name: string;
  value: number;
  status: 'bullish' | 'bearish' | 'neutral';
  description: string;
}

// 市场情绪数据类型
export interface MarketSentiment {
  overallSentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  analysis: string;
  newsCount: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

// 新闻摘要类型
export interface NewsSummary {
  id: number;
  title: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
}

/**
 * 获取市场趋势数据
 * @param params 查询参数
 * @returns 市场趋势数据
 */
export const getMarketTrendsData = async (params?: {
  symbol?: string;
  timeRange?: string;
  workflowId?: string;
}): Promise<{
  marketOverview: MarketOverview;
  priceHistory: PriceHistory;
  technicalIndicators: TechnicalIndicator[];
  marketSentiment: MarketSentiment;
  newsSummaries: NewsSummary[];
}> => {
  try {
    // 调用 Dify API 获取市场趋势数据
    const response = await requestWithRetry<any>({
      method: 'POST',
      url: getDifyWorkflowUrl(params?.workflowId),
      headers: {
        'Authorization': `Bearer ${difyConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      data: {
        inputs: {
          symbol: params?.symbol || 'BTC',
          time_range: params?.timeRange || '7d',
        },
      },
    });

    // 处理 Dify API 可能的不同返回格式
    let apiData = response.data;
    
    // Dify API 通常返回 data 字段包含实际数据
    if (apiData.data) {
      apiData = apiData.data;
    }
    
    // 确保返回的数据结构符合预期
    return {
      marketOverview: apiData.marketOverview || {
        totalMarketCap: 0,
        tradingVolume24h: 0,
        btcDominance: 0,
        cryptoPerformance: [],
      },
      priceHistory: apiData.priceHistory || {
        symbol: params?.symbol || 'BTC',
        timestamps: [],
        prices: [],
      },
      technicalIndicators: apiData.technicalIndicators || [],
      marketSentiment: apiData.marketSentiment || {
        overallSentiment: 'neutral',
        score: 0,
        analysis: '',
        newsCount: {
          positive: 0,
          negative: 0,
          neutral: 0,
        },
      },
      newsSummaries: apiData.newsSummaries || [],
    };
  } catch (error) {
    console.error('获取市场趋势数据失败:', error);
    // 返回空数据结构，确保前端能正常渲染
    return {
      marketOverview: {
        totalMarketCap: 0,
        tradingVolume24h: 0,
        btcDominance: 0,
        cryptoPerformance: [],
      },
      priceHistory: {
        symbol: params?.symbol || 'BTC',
        timestamps: [],
        prices: [],
      },
      technicalIndicators: [],
      marketSentiment: {
        overallSentiment: 'neutral',
        score: 0,
        analysis: '',
        newsCount: {
          positive: 0,
          negative: 0,
          neutral: 0,
        },
      },
      newsSummaries: [],
    };
  }
};
