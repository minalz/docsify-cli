$files = Get-ChildItem -Path "D:\AAAWorkSpace\docsify-cli\docs" -Recurse -Filter "*.md" | Where-Object { $_.FullName -notmatch "\\ai\\" -and $_.FullName -notmatch "\\soft\\" }

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    if (-not $content) { continue }
    $lines = $content -split "`r?`n"
    if ($lines.Count -eq 0) { continue }
    
    $modified = $false
    $firstLine = $lines[0]
    
    if ($firstLine -match "^#\s+(.+)$") {
        $title = $matches[1].Trim()
        $firstChar = if ($title.Length -gt 0) { $title[0] } else { "" }
        if ($firstChar -cmatch "[A-Za-z0-9\u4e00-\u9fff]") {
            $path = $file.FullName.ToLower()
            $fname = $file.Name.ToLower()
            $emoji = "📄"
            if ($path -match "algorithm") { $emoji = "📊" }
            elseif ($path -match "docker") { $emoji = "🐳" }
            elseif ($path -match "k8s") { $emoji = "☸️" }
            elseif ($path -match "elk") { $emoji = "📈" }
            elseif ($path -match "draw") { $emoji = "🎨" }
            elseif ($path -match "codes") { $emoji = "💻" }
            elseif ($path -match "notes") { $emoji = "📝" }
            elseif ($path -match "links") { $emoji = "🔗" }
            elseif ($path -match "main") { $emoji = "🏠" }
            elseif ($fname -match "blog") { $emoji = "🚀" }
            elseif ($fname -match "github|gitee|ssh") { $emoji = "🔑" }
            elseif ($fname -match "readme") { $emoji = "📖" }
            
            $lines[0] = "# $emoji $title"
            
            $hasDesc = $false
            for ($j = 1; $j -lt [Math]::Min(5, $lines.Count); $j++) {
                if ($lines[$j] -match "^>\s*💡") { $hasDesc = $true; break }
            }
            
            if (-not $hasDesc) {
                $newLines = [System.Collections.ArrayList]@()
                [void]$newLines.Add($lines[0])
                [void]$newLines.Add("")
                [void]$newLines.Add("> 💡 $title")
                [void]$newLines.Add("")
                [void]$newLines.Add("---")
                [void]$newLines.Add("")
                for ($i = 1; $i -lt $lines.Count; $i++) {
                    [void]$newLines.Add($lines[$i])
                }
                $lines = $newLines.ToArray()
            }
            $modified = $true
        }
    }
    
    $sectionEmojis = @("📖","🔧","💡","📝","🚀","✅","❓","📌","🌀","🔄","📥","🌐","🏗️","📁","✍️","👀","🔗","⚠️","📦","🗑️","🍎","🪟","🐧","📊","🔍","☁️","🌱","🦌","🐰","🎨","💻","📋","🔓","📡","🌊","🖥️","🔴","🟢","🟡","🔵")
    $sectionIdx = 0
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match "^##\s+(.+)$") {
            $title = $matches[1].Trim()
            $firstChar = if ($title.Length -gt 0) { $title[0] } else { "" }
            if ($firstChar -cmatch "[A-Za-z0-9\u4e00-\u9fff]") {
                $emoji = $sectionEmojis[$sectionIdx % $sectionEmojis.Count]
                $lines[$i] = "## $emoji $title"
                $sectionIdx++
                $modified = $true
            }
        }
    }
    
    if ($modified) {
        $newContent = $lines -join "`n"
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        Write-Output "Updated: $($file.FullName)"
    }
}

Write-Output "Done"
