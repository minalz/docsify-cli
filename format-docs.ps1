param(
    [Alias('Path')]
    [string]$TargetPath = (Join-Path $PSScriptRoot 'docs')
)

$ErrorActionPreference = 'Stop'

# Share the formatter with Node.js. Keep this wrapper ASCII-only so that
# Windows PowerShell 5.1 also reads it correctly without a UTF-8 BOM.
& node (Join-Path $PSScriptRoot 'format-docs.js') $TargetPath
exit $LASTEXITCODE
