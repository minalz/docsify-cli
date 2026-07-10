# 📊 百万级 Excel 导出优化

> 💡 大数据量导出方案 | 分片查询 | 流式写入 | GZIP 压缩 | 浏览器导出

---

## 🚀 一、分片 + 流式 + 浏览器导出的方式

### 1️⃣ 核心代码

```java
String fileName = assessmentReport.getReportName() + "-" + timeSuffix + ".xlsx";

// 用于同步 & 异常传递
CountDownLatch latch = new CountDownLatch(1);
AtomicReference<Exception> exRef = new AtomicReference<>();

try (PipedOutputStream pos = new PipedOutputStream();
     PipedInputStream  pis = new PipedInputStream(pos, 2 * 1024)) {

    // 2. 启动写线程
    Thread writeThread = new Thread(new AssessmentExcelWriteTask(pos, strategy, isBatch, reqVO, latch, exRef), "excel-writer");
    writeThread.start();

    fileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8).replaceAll("\\+", "%20");
    response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    response.setCharacterEncoding("utf-8");
    response.setHeader("Content-Encoding", "gzip");
    response.setHeader("Content-disposition", "attachment;filename*=utf-8''" + fileName);
    pis.transferTo(response.getOutputStream());
}

latch.await();

Exception writeEx = null;
if (exRef.get() != null) {
    throw new BusinessException("AssessmentReportExportVO 生成文件上传OSS失败！", exRef.get());
}
```

### 2️⃣ 写线程核心代码

```java
@Override
public void run() {
    try (GZIPOutputStream gzip = new GZIPOutputStream(pos);
         ExcelWriter writer = EasyExcel.write(gzip, strategy.getExportClass())
                 .registerWriteHandler(new LongestMatchColumnWidthStyleStrategy())
                 .autoCloseStream(false)
                 .build()) {
        WriteSheet sheet = EasyExcel.writerSheet("sheet1").build();
        Object LAST_MAX_ID = 0L;
        int PAGE_SIZE = 1000;
        AssessmentReportExportDTO exportDTO = new AssessmentReportExportDTO();
        exportDTO.setQueryDate(reqVO.getQueryDate());
        while (true) {
            exportDTO.setLastMaxId(LAST_MAX_ID);
            exportDTO.setPageSize(PAGE_SIZE);
            List<?> data = strategy.getData(exportDTO);
            writer.write(data, sheet);
            if (CollectionUtils.isEmpty(data)) {
                log.warn("LAST_MAX_ID: {}, PAGE_SIZE: {}, reportCode: {}, 无数据", LAST_MAX_ID, PAGE_SIZE, reqVO.getReportCode());
                break;
            }
            if (!isBatch) {
                break;
            }
            LAST_MAX_ID = getLastMaxId(data);
        }
        writer.finish();
        gzip.finish();
    } catch (Exception e) {
        log.error("AssessmentExcelWriteTask 写线程异常 - Pos流异常！");
        exRef.set(e);
    } finally {
        latch.countDown();
    }
}

private Object getLastMaxId(List<?> data) {
    if (data == null || data.isEmpty()) {
        return null;
    }
    Object last = data.getLast();
    try {
        Field idField = last.getClass().getDeclaredField("id");
        idField.setAccessible(true);
        return idField.get(last);
    } catch (NoSuchFieldException | IllegalAccessException e) {
        throw new BusinessException("无法获取id字段");
    }
}
```

### 3️⃣ 注意点

> 💡 **提示**：`pos.close` 可关可不关，因为都放在 try-with-catch 中。

---

## ☁️ 二、上传到 OSS 的方案

此种方式是浏览器导出，如果想要上传到 OSS 上，以阿里云为例：

### 1️⃣ 小于 5GB：简单上传

使用 `PutObject`，但这是一次性上传，流不能分片，如果分片了，会报错。

> ⚠️ **特别注意**：不要使用管道流，`大坑`！

所以针对这种模式，需要将流统一处理好再上传，但是这又带来一个新的问题，就是仍然会占用比较大的内存，所以又引入了一个 gzip 的压缩，可以压缩 **70%~80%** 的内存。

### 2️⃣ 大于 5GB：分片上传

使用分片上传的方法，但要注意：
- 除了最后一块可以小于 100KB，其余分片最少要大于 100KB（最小分片）
- Part 数量 1~10000，否则会报最小分片过小的异常

| 项目               | 限制值                       | 说明                                                  |
| ------------------ | ---------------------------- | ----------------------------------------------------- |
| **单个 Part 大小** | **≥ 100 KB**（102 400 字节） | 除最后一个 Part 外，其余每个 Part **必须 ≥ 100 KB**。 |
| **最后一个 Part**  | **允许 < 100 KB**            | 文件末尾不足 100 KB 时，最后一片可以小于 100 KB。     |
| **Part 数量**      | **1 ~ 10 000**               | 一次分片上传最多 10 000 个 Part。                     |
| **单个文件总大小** | **≤ 48.8 TB**                | 所有 Part 合并后整个对象不能超过 48.8 TB。            |

### 3️⃣ 阿里云上传核心代码

```java
ByteArrayInputStream inputStream = new ByteArrayInputStream(gzipBaos.toByteArray());
ObjectMetaData metaData = new ObjectMetaData();
metaData.setContentLength(gzipBaos.size());
metaData.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
metaData.setContentEncoding("gzip");
ossClient.putObject(fileName, inputStream, metaData);
```

---

## 📦 三、GZIP 压缩一次性上传示例

简单实现文件 GZIP 压缩，然后一次性上传到阿里云的代码：

```java
ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
try {
    EasyExcel.write(outputStream, strategy.getExportClass())
            .registerWriteHandler(new LongestMatchColumnWidthStyleStrategy())
            .autoCloseStream(Boolean.FALSE)
            .sheet("sheet1")
            .doWrite(data);

    // GZIP 压缩
    ByteArrayOutputStream gzipBaos = new ByteArrayOutputStream();
    try (GZIPOutputStream gzip = new GZIPOutputStream(gzipBaos)) {
        outputStream.writeTo(gzip);   // 把未压缩的 Excel 一次性压进去
    }

    // 上传到 OSS
    ByteArrayInputStream inputStream = new ByteArrayInputStream(gzipBaos.toByteArray());
    ObjectMetaData metaData = new ObjectMetaData();
    metaData.setContentLength(gzipBaos.size());
    metaData.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    metaData.setContentEncoding("gzip");
    ossClient.putObject(fileName, inputStream, metaData);
} catch (Exception e) {
    log.error("生成文件上传OSS失败！", e);
}
```

