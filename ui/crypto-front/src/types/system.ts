// 系统概览数据类型
export interface SystemOverview {
  // 未读消息数量
  unreadMessageCount: number;
  // 待审核报告数量
  pendingReportCount: number;
  // 总资产估值（单位：USD）
  totalAssetValue: number;
}
