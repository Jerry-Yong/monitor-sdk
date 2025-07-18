
# smart-monitor-sdk
监控SDK

### 注意事项
- version >= 1.0.0为稳定版本
- 仅自定义对外暴露

### 安装
```bash
pnpm i smart-monitor-sdk
```


### 使用
- import 方式
```javascript 
import { initMonitor } from "smart-monitor-sdk";

const sdk = initMonitor({
    logType: string; // 业务ID
    isOnline: boolean; // 是否为线上环境，非线上环境不进行上报日志
    userId: string; // 用户ID，默认：Guest
});
// 自定义事件上报
sdk.track("publish", { type: "click", code: "666" });
```

### 支持能力
|   序号  |      名称      |      说明     |
| :----: |    :----:     |    :----:     |
|   1    |      白屏    |  /  |
|   2    |   js错误  |  /  |
|   3    |   资源加载错误  |  / |
|   4    |   网络异常  | /   |
|   5    |    性能      |   /      |
|   6    |  路由change |   /   |
|   7    |  自定义上报   |   /   |


