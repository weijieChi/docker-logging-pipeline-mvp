# Logging Pipeline MVP (Loki + Promtail + Grafana)
因為本專案為 MVP 是泛，所以在 Logs 儲存並未採取較專業的儲存技術處理
## 📌 專案介紹

本專案實作一個基於 Loki 的 **observability pipeline（可觀測性管線）**，  
將 Node.js 的 structured logs（結構化日誌）轉換為可查詢、可視覺化的監控資訊。

---

## 🧱 系統架構

```

Node.js (structured logging)
↓
Docker stdout (json-file)
↓
Promtail (log collection + parsing)
↓
Loki (storage: labels + string)
↓
Grafana (query + visualization)
```

---

## 🔧 技術棧（Tech Stack）

- Node.js（TypeScript）
- Express
- Winston + Morgan（structured logging）
- Docker / Docker Compose
- Promtail
- Loki
- Grafana

---

## ✨ 功能特色

### ✅ Structured Logging

- JSON 格式 logs（machine-readable）
- requestId tracing（請求追蹤）
- HTTP request logging
- error stack logging

---

### ✅ Log Pipeline

- 使用 Docker stdout 收集 logs
- Promtail 解析（docker → json → labels）
- Loki 儲存（label-based indexing）

---

### ✅ 查詢與分析（LogQL）

- 依 `level` / `statusCode` / `method` 過濾
- 使用 `requestId` 追蹤請求
- 支援 query-time JSON parsing

---

### ✅ 監控與視覺化（Grafana）

可建立以下 dashboard：

- Request rate
- Error rate
- Latency
- Status code 分佈
- API usage

---

## docker-compose 啟動

```sh
docker-compose up --build
```

---

## 🌐 服務列表

| Service | URL                   |
| ------- | --------------------- |
| Node.js | http://localhost:5000 |
| Grafana | http://localhost:3000 |
| Loki    | http://localhost:3100 |

---

## 🔍 範例查詢（LogQL）

### 查詢 error logs

```logql
{job="nodejs"} | json | level="error"
```

---

### 計算 request 數量

```logql
count_over_time({job="nodejs"}[1m])
```

---

### 計算平均 latency

```logql
avg_over_time({job="nodejs"} | json | unwrap latency [1m])
```

---

## 核心技術觀念

### 🔹 Loki vs ELK

| 系統 | 儲存方式        |
| ---- | --------------- |
| ELK  | JSON document   |
| Loki | string + labels |

 Loki 採用：

* schema-less（無 schema）
* 輕量
* 高寫入效能

### 🔹 Loki Storage Model

Loki 採用：

- 儲存：log line（string）
- 索引：labels（metadata）

👉 不進行全文 indexing，而是透過 labels 提升查詢效能

---

### 🔹 Query-time JSON Parsing

```logql
{job="nodejs"} | json
```

* logs 以 string 形式儲存
* JSON parsing 在查詢時進行

---

### 🔹 Log-based Metrics

```
count_over_time(...)
avg_over_time(...)
```

👉 將 logs 轉換為 metrics（監控指標）

---

## ⚠️ 已知限制（MVP）

* 尚未設定 Loki persistent storage（無 volume）
  * Loki 將 logs 儲存為 string（非 JSON object）
  * JSON parsing 需在查詢時透過 LogQL `| json` 處理
* Grafana 未加驗證機制
* 單節點架構
* Loki 儲存 logs 為 string ， Grafana 查詢時需使用 LogQL (如 `| json`)進行解析

---

## 🎯 專案價值

本專案展示：

* observability pipeline 設計能力
* log ingestion vs query-time parsing 理解
* log-based metrics 實作
* 實際 debug logging system 經驗