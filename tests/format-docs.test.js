const assert = require('node:assert/strict');
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { formatContent, formatPath } = require('../format-docs');

test('selects icons by heading meaning and preserves existing icons', () => {
    const input = '# 文档\n\n## 安装\n## 配置\n## 常见问题\n## 🐳 Docker\n## 1️⃣ 原有编号\n';
    const result = formatContent(input);
    assert.match(result, /^# 📄 文档\n\n> 💡 文档\n\n---\n/m);
    assert.match(result, /^## 📥 安装$/m);
    assert.match(result, /^## 🔧 配置$/m);
    assert.match(result, /^## 🔍 常见问题$/m);
    assert.match(result, /^## 🐳 Docker$/m);
    assert.match(result, /^## 1️⃣ 原有编号$/m);
    assert.equal(formatContent(result), result);
});

test('repairs a missing introduction even if the main title already has an emoji', () => {
    const result = formatContent('# 🐳 Docker\n\n## 安装\n');
    assert.match(result, /^# 🐳 Docker\n\n> 💡 Docker\n\n---\n/);
    assert.equal((result.match(/^> 💡/gm) || []).length, 1);
    assert.equal(formatContent(result), result);
});

test('does not duplicate existing descriptions or separators', () => {
    const input = '# 📝 笔记\n\n\n\n\n\n> 💡 原有描述\n\n---\n\n正文\n';
    assert.equal(formatContent(input), input);
    const withSeparator = formatContent('# 标题\n\n---\n\n正文\n');
    assert.equal((withSeparator.match(/^---$/gm) || []).length, 1);
    const withoutSeparator = formatContent('# 📝 笔记\n\n> 💡 原有描述\n\n正文\n');
    assert.match(withoutSeparator, /> 💡 原有描述\n\n---\n\n正文/);
    assert.equal(formatContent(withoutSeparator), withoutSeparator);
});

test('leaves Markdown headings inside backtick and tilde code fences untouched', () => {
    const codeBlocks = [
        '```markdown\n# 示例标题\n## 示例章节\n> 💡 示例描述\n```',
        '~~~~markdown\n## 示例章节\n~~~\n## 仍在代码块内\n~~~~',
        '  ````markdown\n## 缩进围栏\n```\n## 短围栏不能关闭\n````'
    ];
    const result = formatContent('# 文档\n\n' + codeBlocks.join('\n\n') + '\n\n## 安装\n');
    for (const block of codeBlocks) assert.ok(result.includes(block));
    assert.match(result, /^> 💡 文档$/m);
    assert.match(result, /^## 📥 安装$/m);
    assert.equal(formatContent(result), result);
});

test('preserves UTF-8 BOM, CRLF, and unchanged content byte for byte', () => {
    const result = formatContent('\uFEFF# 📝 笔记\r\n\r\n## 安装\r\n');
    assert.ok(result.startsWith('\uFEFF# 📝 笔记\r\n'));
    assert.ok(!/(?<!\r)\n/.test(result));
    assert.equal(formatContent(result), result);
    assert.equal(formatContent(''), '');
});

test('formats only the selected Markdown file or directory and excludes ai/soft', t => {
    const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-format-'));
    t.after(() => fs.rmSync(fixtureDir, { recursive: true, force: true }));
    for (const category of ['notes', 'ai', 'soft']) {
        fs.mkdirSync(path.join(fixtureDir, category));
        fs.writeFileSync(path.join(fixtureDir, category, 'README.md'), '# 测试\n');
    }
    const selected = path.join(fixtureDir, 'notes', 'README.md');
    assert.equal(formatPath(selected), 1);
    assert.equal(formatPath(fixtureDir), 0);
    assert.equal(formatPath(path.join(fixtureDir, 'ai', 'README.md')), 0);
    for (const category of ['ai', 'soft']) {
        assert.equal(fs.readFileSync(path.join(fixtureDir, category, 'README.md'), 'utf8'), '# 测试\n');
    }
    assert.throws(() => formatPath(__filename), /Markdown/);
    assert.throws(() => formatPath(path.join(fixtureDir, 'missing.md')), /ENOENT/);
});

test('PowerShell wrapper uses its own location and returns formatter failures', { skip: process.platform !== 'win32' }, t => {
    const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-format-ps-'));
    t.after(() => fs.rmSync(fixtureDir, { recursive: true, force: true }));
    const selected = path.join(fixtureDir, 'README.md');
    fs.writeFileSync(selected, '# Docker 安装\n');
    const wrapperPath = path.resolve(__dirname, '..', 'format-docs.ps1');
    const runWrapper = target => ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', wrapperPath, '-TargetPath', target];
    execFileSync('powershell.exe', runWrapper(selected), { cwd: fixtureDir });
    assert.match(fs.readFileSync(selected, 'utf8'), /^# 📥 Docker 安装/);
    const failed = spawnSync('powershell.exe', runWrapper(path.join(fixtureDir, 'missing.md')), { cwd: fixtureDir });
    assert.equal(failed.status, 1);
});
