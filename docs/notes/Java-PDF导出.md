# Java-PDF导出

### 1.pom.xml引入palywright依赖包

```xml
<dependency>
    <groupId>com.microsoft.playwright</groupId>
    <artifactId>playwright</artifactId>
    <version>1.44.0</version>
</dependency>
```

### 2.核心代码

#### 2.1 PdfOptions.java

```java
@Data
public class PdfOptions {
    private String format = "A4";
    private boolean displayHeaderFooter = false;
    private String headerTemplate;
    private String footerTemplate;
}
```

#### 2.2 PdfRequest.java

```java
@Data
public class PdfRequest {
    @NotBlank
    private String html;
    private PdfOptions options = new PdfOptions();
}
```

#### 2.3 PdfService.java

```java
@Service
public class PdfService {

    public byte[] generate(String html, PdfOptions opts) {
        // 1. 启动 Playwright（自动下载无头 Chrome）
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(
                    new BrowserType.LaunchOptions()
                            .setHeadless(true)
                            .setArgs(Arrays.asList("--no-sandbox", "--disable-setuid-sandbox"))
            );
            Page page = browser.newPage();

            // 2. 塞 HTML
            page.setContent(html, new Page.SetContentOptions().setWaitUntil(WaitUntilState.NETWORKIDLE));

            // 3. 构造 PDF 参数
            Page.PdfOptions pdfOpts = new Page.PdfOptions()
                    .setFormat(opts.getFormat())
                    .setPrintBackground(true)
                    .setMargin(new Margin()
                            .setTop("20mm")
                            .setBottom("20mm")
                            .setLeft("10mm")
                            .setRight("10mm"));

            if (opts.isDisplayHeaderFooter()) {
                pdfOpts.setDisplayHeaderFooter(true)
                       .setHeaderTemplate(opts.getHeaderTemplate() != null ? opts.getHeaderTemplate().replace("{{title}}", "2025 销售报表")
                               .replace("{{createTime}}", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))) : "")
                       .setFooterTemplate(opts.getFooterTemplate() != null ? opts.getFooterTemplate().replace("{{createTime}}", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))) : "");
            }

            // 4. 生成 PDF
            byte[] pdf = page.pdf(pdfOpts);
            browser.close();
            return pdf;
        }
    }
}
```

#### 2.4 PdfController

```java
@RestController
@RequestMapping("/api/pdf")
@RequiredArgsConstructor
public class PdfController {

    private final PdfService pdfService;

    @PostMapping
    public ResponseEntity<Resource> download(@Valid @RequestBody PdfRequest dto) throws Exception {
        byte[] pdf = pdfService.generate(dto.getHtml(), dto.getOptions());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.pdf")
                .body(new ByteArrayResource(pdf));
    }
}
```

#### 2.5 前端示例代码

放在/resource/static目录下即可

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8"/>
  <title>截图级分页导出</title>
  <style>
    /*body{margin:0;background:#fff;font-family:system-ui;}*/
    /*body{margin:0;background:#fff;font-family:"SimSun", serif;}*/
    body{margin:0;background:#fff;font-family:"Consolas", "Courier New", monospace;}
    .toolbar{position:sticky;top:0;z-index:9;background:#fff;padding:12px 24px;box-shadow:0 2px 4px rgba(0,0,0,.08);}
    .btn{background:#1890ff;color:#fff;border:0;border-radius:4px;padding:6px 16px;cursor:pointer;}
    #content{width:210mm;margin:24px auto;background:#fff;padding:32px;box-shadow:0 4px 12px rgba(0,0,0,.1);}
    h1{border-bottom:2px solid #1890ff;padding-bottom:8px;}
    table{width:100%;border-collapse:collapse;margin-top:16px;}
    th,td{border:1px solid #e8e8e8;padding:8px;}
    th{background:#fafafa;}
    /* 关键：避免行被砍半 */
    tr{page-break-inside:avoid;}
  </style>

  <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>
</head>
<body>
  <div class="toolbar">
    <button class="btn" onclick="exportPDF()">导出 PDF（截图级分页）</button>
    <button class="btn" onclick="exportPDF2()">导出 PDF2（截图级分页）</button>
  </div>

  <div id="content">
    <h1>2025 年度销售报表</h1>
    <p>生成时间：<span id="time"></span></p>

    <!-- 故意造很多行，验证分页 -->
    <table>
      <thead><tr><th>区域</th><th>Q1</th><th>Q2</th><th>Q3</th><th>Q4</th></tr></thead>
      <tbody id="tbody"></tbody>
    </table>

    <p style="margin-top:24px;font-size:12px;color:#999;">说明：本报表由前端自动生成，可直接打印或存档。</p>
  </div>

  <script>
    /* 造 200 行数据，方便看分页 */
    const html = [];
    for (let i = 0; i < 200; i++) {
      html.push(`<tr><td>区域${i+1}</td><td>${1000+i*5}</td><td>${1100+i*5}</td><td>${1200+i*5}</td><td>${1300+i*5}</td></tr>`);
    }
    document.getElementById('tbody').innerHTML = html.join('');
    document.getElementById('time').textContent = new Date().toLocaleString('zh-CN');

    /* ------------- 导出逻辑 ------------- */
    async function exportPDF() {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;                          // 四边留白
      const safeHeight = pdfHeight - margin * 2;  // 每页安全高(mm)

      const element = document.getElementById('content');
      const totalWidth = element.scrollWidth;
      const totalHeight = element.scrollHeight;

      /* mm → px 比例：jsPDF 里 1 mm = 96/25.4 px */
      const pxPerMm = 96 / 25.4;
      const safePx = safeHeight * pxPerMm;        // 每页安全高(px)

      let yOffset = 0;                            // 已截掉的像素
      let page = 0;

      while (yOffset < totalHeight) {
        if (page) pdf.addPage();                  // 非首页加页
        page++;

        /* 1. 只渲染当前页区域 */
        const canvas = await html2canvas(element, {
          scale: 2,               // 打印够用
          useCORS: true,
          height: safePx,         // 关键：只截一页高
          y: yOffset,             // 关键：纵向偏移
          width: totalWidth,
          scrollX: 0,
          scrollY: 0
        });

        /* 2. 加到 PDF */
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth - margin * 2, safeHeight);

        yOffset += safePx;
      }

      /* 3. 可选：页眉页脚页码 */
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.text(`第 ${i} 页 / 共 ${totalPages} 页`, pdfWidth / 2, pdfHeight - 6, { align: 'center' });
      }

      pdf.save(`report_${Date.now()}.pdf`);
    }

    function cloneWithStyles(targetId = 'content') {
      const clone = document.getElementById(targetId).cloneNode(true);

      // 1. 收集所有 <style> 和 <link>（忽略外部 CDN 可提速）
      const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
              .map(node => node.outerHTML)
              .join('\n');

      // 2. 在克隆体最前面插入样式副本
      const styleWrap = document.createElement('div');
      styleWrap
              .innerHTML = styles;
      clone
              .insertBefore(styleWrap, clone.firstChild);

      return clone.outerHTML;
    }

    async function exportPDF2() {
      const html = cloneWithStyles(); // 已含完整样式
      const res = await fetch('http://localhost:8081/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html,
          options: {
            format: 'A4',
            printBackground: true,
            displayHeaderFooter: true,
            headerTemplate: "<span style='display:inline-block;width:100%;height:15mm;line-height:15mm;background:transparent;font-size:10px;text-align:center;color:#000;padding:0;margin:0;'>{{title}} - 第<span class=\"pageNumber\"></span>页 / 共<span class=\"totalPages\"></span>页</span>",
            footerTemplate: "<span style='display:inline-block;width:100%;height:15mm;line-height:15mm;background:transparent;font-size:9px;text-align:right;color:#666;padding:0;margin:0;'>生成时间：{{createTime}}</span>"
          },
        }),
      });
      // 触发下载
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      Object.assign(document.createElement('a'), { href: url, download: `report_${Date.now()}.pdf` }).click();
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>
```

### 3.请求page-pdf.html页面，点击导出即可

### 4.如果涉及跨域，需要配置CORS

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")          // 所有接口
//                        .allowedOriginPatterns("*") // 或 .allowedOrigins("http://localhost:3000") // springboot 2.4+才有
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);   // 带 cookie 时必须
            }
        };
    }
}
```