# 🏗️ 系統架構設計（Architecture Design）

---

## 📌 系統概述

本系統為一個基於 logs 的 observability pipeline：

```
Producer → Transport → Collector → Storage → Visualization
```

---

## 🧱 元件設計

### 🟢 Node.js（Log Producer）

- 使用 Winston + Morgan
- 輸出 structured JSON logs

```json
{
  "level": "info",
  "message": "HTTP request",
  "method": "GET",
  "path": "/",
  "statusCode": 200,
  "latency": 12.5,
  "requestId": "abc-123"
}
```

---

### 🟡 Docker（Transport Layer）

* 使用 stdout（json-file driver）

封裝後格式：

```json
{
  "log": "...",
  "stream": "stdout",
  "time": "..."
}
```

👉 logs 在此階段轉為 string

---

### 🟠 Promtail（Collector + Parser）

#### 功能：

* 透過 `docker_sd_configs` 發現 container
* 加入 labels（metadata）
* parsing log

#### pipeline：

```yaml
- docker: {}
- json: {}
- labels: {}
```

👉 注意：

* JSON 會被解析
* 但 log 本體仍為 string（不會變 object）

---

### 🔴 Loki（Storage）

儲存模型：

```
labels + log line (string)
```

特性：

* 無 schema
* 不儲存 JSON object
* 僅對 labels 建立 index

👉 設計目標：高寫入吞吐量（high write throughput）

---

### 🔵 Grafana（Query & Visualization）

* 使用 LogQL 查詢
* query-time parsing JSON

```logql
{job="nodejs"} | json | statusCode=500
```

---

## 🔄 Data Flow

```
1. Node.js 輸出 JSON logs
2. Docker 封裝 logs
3. Promtail 收集並解析
4. Loki 儲存（string + labels）
5. Grafana 查詢與視覺化
```

---

## 🧠 設計決策（Design Decisions）

---

### 1️⃣ Loki vs ELK

| 指標       | Loki   | ELK       |
| ---------- | ------ | --------- |
| 儲存格式   | string | JSON      |
| index      | labels | full-text |
| 資源消耗   | 低     | 高        |
| 架構複雜度 | 低     | 高        |

👉 選擇 Loki 原因：

* 輕量
* 部署簡單
* 適合 container logs
* MVP 示範專案

---

### 2️⃣ Query-time Parsing

```text
parse at query time（查詢時解析）
```

優點：

* 彈性高
* 無 schema 限制

缺點：

* 查詢成本較高

---

### 3️⃣ Label 設計

目前 labels：

```yaml
job
container
level
method
statusCode
```

👉 設計目的：

* 提高查詢效率
* 降低掃描範圍

---

## 📊 Observability Strategy

本系統支援：

* Logging（原始事件）
* Metrics（聚合指標）
* Tracing（透過 requestId）

---

## ⚠️ 限制

* 無分散式架構
* 無 log retention policy
* 無持久化 storage
* 尚未實作 alerting

---

## 🚀 未來擴展

* Loki persistence（volume）
* Grafana alerting
* Prometheus integration
* OpenTelemetry（tracing）
* Kubernetes 部署

---

## 📈 Scaling（1TB/day）

擴展方式：

* 使用 distributed Loki
* 分離 read / write node
* 使用 object storage（S3 / GCS）
* 控制 label cardinality

---

## 核心觀念

```
Logs 不只是 debug 工具，
而是 observability 的資料來源。
```