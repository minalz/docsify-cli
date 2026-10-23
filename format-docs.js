const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'docs');
const leadingEmoji = /^(?:[0-9#*]\uFE0F?\u20E3|\p{Regional_Indicator}{2}|\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?)*)\s*/u;

// Match the heading's meaning first; never assign icons by section position.
const titleEmojis = [
    [/目录|导航|contents|navigation/i, '📑'],
    [/问题|错误|异常|报错|排查|故障|error|troubleshoot/i, '🔍'],
    [/解决|修复|solution|fix\b/i, '🔧'],
    [/卸载|删除|清理|uninstall|delete|remove/i, '🗑️'],
    [/下载|安装|拉取|download|install/i, '📥'],
    [/前置|准备|依赖|要求|prerequisite|requirement|dependenc/i, '📋'],
    [/快速开始|启动|部署|入门|quick\s*start|getting\s*started|deploy/i, '🚀'],
    [/参考|链接|官网|reference|links?/i, '🔗'],
    [/解题|思路|原理|idea|principle/i, '💡'],
    [/代码|示例|code|example/i, '💻'],
    [/配置|设置|命令|操作|config|setting|command/i, '🔧'],
    [/网络|连接|代理|network|connect|proxy/i, '🌐'],
    [/权限|认证|密码|密钥|ssh|auth|password|security/i, '🔑'],
    [/存储|持久化|备份|数据库|storage|backup|database|mysql/i, '💾'],
    [/测试|校验|验证|test|validat/i, '✅'],
    [/对比|比较|统计|性能|compare|comparison|performance/i, '📊'],
    [/说明|总结|笔记|note|summary/i, '📝'],
    [/概述|简介|介绍|概念|描述|学习|overview|introduction|description/i, '📖'],
    [/docker|容器/i, '🐳'],
    [/k8s|kubernetes/i, '☸️'],
    [/算法|algorithm/i, '📊'],
    [/windows/i, '🪟'],
    [/linux|ubuntu|centos/i, '🐧'],
    [/macos|\bmac\b/i, '🍎']
];

function getEmoji(filePath, title) {
    for (const [pattern, emoji] of titleEmojis) {
        if (pattern.test(title)) return emoji;
    }
    const lowerPath = filePath.toLowerCase();
    const lowerName = path.basename(filePath).toLowerCase();
    if (lowerPath.includes('algorithm')) return '📊';
    if (lowerPath.includes('docker')) return '🐳';
    if (lowerPath.includes('k8s')) return '☸️';
    if (lowerPath.includes('elk')) return '📈';
    if (lowerPath.includes('draw')) return '🎨';
    if (lowerPath.includes('codes')) return '💻';
    if (lowerPath.includes('notes')) return '📝';
    if (lowerPath.includes('links')) return '🔗';
    if (lowerPath.includes('main')) return '🏠';
    if (lowerName.includes('blog')) return '🚀';
    if (/github|gitee|ssh/.test(lowerName)) return '🔑';
    if (lowerName.includes('readme')) return '📖';
    return '📄';
}

function formatContent(content, filePath = '') {
    const bom = content.startsWith('\uFEFF') ? '\uFEFF' : '';
    const newline = content.includes('\r\n') ? '\r\n' : '\n';
    const lines = content.slice(bom.length).split(/\r?\n/);
    let modified = false;

    const titleMatch = lines[0].match(/^#\s+(.+)$/);
    if (titleMatch) {
        const title = titleMatch[1].trim();
        const plainTitle = title.replace(leadingEmoji, '');
        if (!leadingEmoji.test(title)) {
            lines[0] = `# ${getEmoji(filePath, title)} ${title}`;
            modified = true;
        }

        // Only inspect the introduction, so examples later in the file cannot
        // be mistaken for the document's own description or separator.
        let hasDescription = false;
        let hasSeparator = false;
        let lastQuote = 0;
        for (let i = 1; i < lines.length; i++) {
            if (/^>/.test(lines[i])) {
                hasDescription ||= /^>\s*💡/.test(lines[i]);
                lastQuote = i;
            } else if (/^---\s*$/.test(lines[i])) {
                hasSeparator = true;
            } else if (lines[i].trim() !== '') {
                break;
            }
        }

        if (!hasDescription) {
            let firstContent = 1;
            while (firstContent < lines.length && lines[firstContent].trim() === '') firstContent++;
            const intro = ['', `> 💡 ${plainTitle}`, ''];
            if (!hasSeparator) intro.push('---', '');
            lines.splice(1, firstContent - 1, ...intro);
            modified = true;
        } else if (!hasSeparator) {
            let nextContent = lastQuote + 1;
            while (nextContent < lines.length && lines[nextContent].trim() === '') nextContent++;
            lines.splice(lastQuote + 1, nextContent - lastQuote - 1, '', '---', '');
            modified = true;
        }
    }

    let fence = null;
    for (let i = 0; i < lines.length; i++) {
        const fenceMatch = lines[i].match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
        if (fence) {
            if (fenceMatch && fenceMatch[1][0] === fence.character &&
                fenceMatch[1].length >= fence.length && fenceMatch[2].trim() === '') {
                fence = null;
            }
            continue;
        }
        if (fenceMatch && (fenceMatch[1][0] === '~' || !fenceMatch[2].includes('`'))) {
            fence = { character: fenceMatch[1][0], length: fenceMatch[1].length };
            continue;
        }

        const sectionMatch = lines[i].match(/^##\s+(.+)$/);
        if (sectionMatch) {
            const title = sectionMatch[1].trim();
            if (!leadingEmoji.test(title)) {
                lines[i] = `## ${getEmoji('', title)} ${title}`;
                modified = true;
            }
        }
    }

    return modified ? bom + lines.join(newline) : content;
}

function formatPath(targetPath, onUpdate = () => {}) {
    const resolvedPath = path.resolve(targetPath);
    // Keep excluded categories untouched, even when a file is selected directly.
    if (resolvedPath.split(path.sep).some(part => /^(ai|soft)$/i.test(part))) return 0;
    const stat = fs.lstatSync(resolvedPath);
    if (stat.isDirectory()) {
        let updated = 0;
        for (const entry of fs.readdirSync(resolvedPath, { withFileTypes: true })) {
            // Do not follow symbolic links outside the selected directory.
            if (entry.isDirectory() || (entry.isFile() && /\.md$/i.test(entry.name))) {
                updated += formatPath(path.join(resolvedPath, entry.name), onUpdate);
            }
        }
        return updated;
    }
    if (!stat.isFile() || !/\.md$/i.test(resolvedPath)) {
        throw new Error('Select a Markdown file or a directory.');
    }
    const content = fs.readFileSync(resolvedPath, 'utf8');
    const formatted = formatContent(content, resolvedPath);
    if (formatted === content) return 0;
    fs.writeFileSync(resolvedPath, formatted, 'utf8');
    onUpdate(resolvedPath);
    return 1;
}

if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
        console.log('Usage: node format-docs.js [markdown-file-or-directory]');
        console.log('Default: docs/ next to this script; ai/ and soft/ are excluded.');
    } else {
        try {
            if (args.length > 1 || (args[0] && args[0].startsWith('-'))) {
                throw new Error('Usage: node format-docs.js [markdown-file-or-directory]');
            }
            formatPath(args[0] || docsDir, file => console.log('Updated:', file));
            console.log('Done');
        } catch (error) {
            console.error(error.message);
            process.exitCode = 1;
        }
    }
}

module.exports = { formatContent, formatPath };
