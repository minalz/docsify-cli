NodeJs-PDF导出

### 1.tsconfig.json新增配置

```json
"types": ["node"],      // 显式引入
"lib": ["ES2022"],      // 或 ESNext
```

### 2.核心代码

#### 2.1 pdf.module.ts

```typescript
import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';

@Module({
    controllers: [PdfController],
    providers: [PdfService],
})
export class PdfModule {}
```

#### 2.2 pdf.service.ts

```typescript
import { Injectable, Logger } from '@nestjs/common';
import puppeteer, {Browser} from 'puppeteer';
import { createPool } from 'generic-pool';
import type { PdfRequest } from './dto/pdf-request.dto';
import * as PDF_OPTIONS from './pdf.options.json'

@Injectable()
export class PdfService {
    private readonly logger = new Logger(PdfService.name);
    private readonly pool = createPool<Browser>({
        create: async () =>
            puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            }),
        destroy: async (b) => b.close(),
    }, { min: 1, max: 4 });

    async generate({ html, options }: PdfRequest): Promise<Buffer> {
        const browser = await this.pool.acquire();
        const page = await browser.newPage();
        try {
            await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
            let headerTemplate = '';
            let footerTemplate = '';
            if (options && options.displayHeaderFooter) {
                headerTemplate = (PDF_OPTIONS.headerTemplate || '')
                    .replace('{{title}}', '2025 年度销售报表')
                    .replace('{{createTime}}', new Date().toLocaleString('zh-CN'));

                footerTemplate = (PDF_OPTIONS.footerTemplate || '')
                    .replace('{{title}}', '2025 年度销售报表')
                    .replace('{{createTime}}', new Date().toLocaleString('zh-CN'));
            }

            const buf = await page.pdf({
                format: options?.format ?? 'A4',
                printBackground: options?.printBackground ?? true,
                margin: options?.margin ?? { top: '20mm', bottom: '20mm', left: '10mm', right: '10mm' },
                ...options,
                displayHeaderFooter: options?.displayHeaderFooter ?? true,
                headerTemplate: options?headerTemplate : '',
                footerTemplate: options?footerTemplate : '',
            });
            return Buffer.from(buf);
        } finally {
            await page.close();
            await this.pool.release(browser);
        }
    }
}
```

#### 2.3 pdf.controller.ts

```typescript
import { Controller, Post, Body, Res, StreamableFile } from '@nestjs/common';
import { PdfService } from './pdf.service';
import type { PdfRequest } from './dto/pdf-request.dto';
import type { Response } from 'express';

@Controller('api/pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post()
  async download(
      @Body() body: PdfRequest,
      @Res({ passthrough: true }) res: Response,
  ) {
    const pdfBuffer = await this.pdfService.generate(body);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="report_${Date.now()}.pdf"`,
    });
    return new StreamableFile(pdfBuffer);
  }
}
```

#### 2.4 pdf-request.dto.ts

放在/dto包下

```typescript
import type { PDFOptions } from 'puppeteer';

export interface PdfRequest {
  html: string;
  options?: PDFOptions & { format?: string };
}
```

#### 2.5 pdf.options.json

```json
{
  "format": "A4",
  "margin": {
    "top": "20mm",
    "bottom": "20mm"
  },
  "displayHeaderFooter": true,
  "headerTemplate": "<span style='display:inline-block;width:100%;height:15mm;line-height:15mm;background:transparent;font-size:10px;text-align:center;color:#000;padding:0;margin:0;'>{{title}} - 第<span class=\"pageNumber\"></span>页 / 共<span class=\"totalPages\"></span>页</span>",
  "footerTemplate": "<span style='display:inline-block;width:100%;height:15mm;line-height:15mm;background:transparent;font-size:9px;text-align:right;color:#666;padding:0;margin:0;'>生成时间：{{createTime}}</span>"
}
```

### 3.前端代码

放在项目page-pdf.html下

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8"/>
  <title>截图级分页导出</title>
  <style>
    body{margin:0;background:#fff;font-family:system-ui;}
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
      const res = await fetch('http://localhost:3000/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html,
          options: { format: 'A4',
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

### 3.需要新增静态目录的配置和module的配置PdfModule

```typescript
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),   // 静态目录
      serveRoot: '/',                              // URL 前缀
    }), PdfModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 4.请求page-pdf.html页面，点击导出即可



### 5.如果涉及跨域，需要配置CORS

main.ts里新增CORS的配置

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ① 全局 CORS 配置
  app.enableCors({
    origin: true,        // 或 ['http://localhost:3000']
    credentials: true,   // 允许带 cookie
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```