# Adding License Headers to Source Files

This guide explains how to add license headers to all source files in the Quartz Manager project.

## License Information

Quartz Manager is licensed under the **MIT License with Non-Commercial Restriction**.

- **Free to use** for personal, educational, and non-commercial purposes
- **NOT allowed** for commercial use without permission
- See the [LICENSE](../LICENSE) file for full terms

## Automated License Header Addition

### Option 1: Using license-maven-plugin (Java/Backend)

The backend already has the license-maven-plugin configured in `pom.xml`. To add headers:

```bash
cd quartz-manager-backend
mvn license:format
```

This will automatically add license headers to all Java files.

### Option 2: Using license-checker-webpack-plugin (Frontend)

For the frontend, you can use a webpack plugin or manually add headers.

### Option 3: Manual Addition

Use the provided header templates in `.license-templates/` directory:

- `header-java-ts.txt` - For Java and TypeScript/JavaScript files
- `header-script.txt` - For Python, Shell, YAML files
- `header-html-xml.txt` - For HTML and XML files

## Header Templates

### Java/TypeScript/JavaScript Files

```java
/*
 * Copyright (c) 2026 Quartz Manager Contributors
 *
 * This file is part of Quartz Manager.
 *
 * Quartz Manager is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License with Non-Commercial Restriction.
 *
 * This software may NOT be used for commercial purposes.
 * See the LICENSE file in the project root for full license information.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 */
```

### Shell/Python/YAML Files

```bash
#
# Copyright (c) 2026 Quartz Manager Contributors
#
# This file is part of Quartz Manager.
#
# Quartz Manager is free software: you can redistribute it and/or modify
# it under the terms of the MIT License with Non-Commercial Restriction.
#
# This software may NOT be used for commercial purposes.
# See the LICENSE file in the project root for full license information.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
#
```

### HTML/XML Files

```html
<!--
  Copyright (c) 2026 Quartz Manager Contributors
  
  This file is part of Quartz Manager.
  
  Quartz Manager is free software: you can redistribute it and/or modify
  it under the terms of the MIT License with Non-Commercial Restriction.
  
  This software may NOT be used for commercial purposes.
  See the LICENSE file in the project root for full license information.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
-->
```

## Using Scripts to Add Headers

### Bash Script (Linux/Mac)

Create a script `add-license-headers.sh`:

```bash
#!/bin/bash

# Add headers to Java files
find quartz-manager-backend/src -name "*.java" -type f -exec sh -c '
  if ! grep -q "Copyright (c) 2026 Quartz Manager Contributors" "$1"; then
    cat .license-templates/header-java-ts.txt "$1" > "$1.new"
    mv "$1.new" "$1"
  fi
' _ {} \;

# Add headers to TypeScript/JavaScript files
find quartz-manager-frontend/src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -type f -exec sh -c '
  if ! grep -q "Copyright (c) 2026 Quartz Manager Contributors" "$1"; then
    cat .license-templates/header-java-ts.txt "$1" > "$1.new"
    mv "$1.new" "$1"
  fi
' _ {} \;
```

### PowerShell Script (Windows)

Create a script `add-license-headers.ps1`:

```powershell
# Add headers to Java files
Get-ChildItem -Path "quartz-manager-backend\src" -Filter "*.java" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -notmatch "Copyright \(c\) 2026 Quartz Manager Contributors") {
        $header = Get-Content ".license-templates\header-java-ts.txt" -Raw
        Set-Content -Path $_.FullName -Value ($header + $content)
    }
}

# Add headers to TypeScript/JavaScript files
Get-ChildItem -Path "quartz-manager-frontend\src" -Include "*.ts","*.tsx","*.js" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -notmatch "Copyright \(c\) 2026 Quartz Manager Contributors") {
        $header = Get-Content ".license-templates\header-java-ts.txt" -Raw
        Set-Content -Path $_.FullName -Value ($header + $content)
    }
}
```

Run with:
```powershell
.\add-license-headers.ps1
```

## Maven Plugin Configuration (Already Added)

The `pom.xml` includes the license-maven-plugin:

```xml
<plugin>
    <groupId>com.mycila</groupId>
    <artifactId>license-maven-plugin</artifactId>
    <version>4.3</version>
    <configuration>
        <header>.license-templates/header-java-ts.txt</header>
        <includes>
            <include>src/**/*.java</include>
        </includes>
    </configuration>
</plugin>
```

## Verification

After adding headers, verify:

```bash
# Check Java files
grep -r "Copyright (c) 2026" quartz-manager-backend/src --include="*.java" | wc -l

# Check TypeScript files
grep -r "Copyright (c) 2026" quartz-manager-frontend/src --include="*.ts*" | wc -l
```

## Files to Exclude

Don't add license headers to:
- `package-lock.json`
- `node_modules/`
- `target/`
- `dist/`
- `.git/`
- Binary files
- Generated files

## Notes

- Update the year (2026) to the current year or range (e.g., 2026-2027)
- You can customize "Quartz Manager Contributors" to your name/organization
- The non-commercial restriction is clearly stated in both the LICENSE and headers
