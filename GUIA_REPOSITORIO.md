# 🐙 GUÍA DE REPOSITORIO GITHUB - HabitWolf Pro

## 📋 Tabla de Contenidos
1. [Configuración Inicial](#configuración-inicial)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Branching Strategy](#branching-strategy)
4. [Workflow de Desarrollo](#workflow-de-desarrollo)
5. [CI/CD con GitHub Actions](#cicd-con-github-actions)
6. [Gestión de Issues y PRs](#gestión-de-issues-y-prs)
7. [Colaboración y Community](#colaboración-y-community)
8. [Security y Best Practices](#security-y-best-practices)

---

## 🚀 Configuración Inicial

### Paso 1: Crear el Repositorio
```bash
# Opción A: Desde GitHub Web Interface
1. https://github.com/new
2. Repository name: habitwolf-pro
3. Description: 🐺 Advanced Gamified Habit Tracker with Wolf Evolution System
4. ✅ Public
5. ✅ Add README file
6. License: MIT (recomendado)

# Opción B: Desde CLI con GitHub CLI
gh repo create habitwolf-pro --public --description "🐺 Advanced Gamified Habit Tracker with Wolf Evolution System"
```

### Paso 2: Configuración Local
```bash
# Clona el repositorio
git clone https://github.com/TU_USUARIO/habitwolf-pro.git
cd habitwolf-pro

# Configuración básica
git config user.name "Tu Nombre"
git config user.email "tu.email@gmail.com"

# Configuración de ramas protegidas
git branch -M main
```

### Paso 3: Preparar .gitignore
```gitignore
# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# Node modules (si añades build tools)
node_modules/
npm-debug.log*

# Logs
logs
*.log

# Temporary files
*.tmp
*.temp

# Backup files
*.bak
*.backup

# Environment files
.env
.env.local
.env.production
```

---

## 📁 Estructura del Proyecto

### Estructura Recomendada
```
habitwolf-pro/
├── 📄 index.html                    # Aplicación principal (renombrado)
├── 📚 docs/                         # Documentación
│   ├── README.md                    # Documentación principal
│   ├── DEPLOYMENT_GUIDE.md          # Guía de despliegue
│   ├── GUIA_REPOSITORIO.md         # Esta guía
│   ├── HabitWolf_Pro_Manual.md     # Manual de usuario
│   └── HabitWolf_Pro_PDF_Content.md # Contenido PDF
├── 🎨 assets/                       # Recursos estáticos
│   ├── images/
│   ├── icons/
│   └── screenshots/
├── 🧪 tests/                        # Tests (futuro)
│   ├── unit/
│   └── integration/
├── ⚙️ .github/                      # GitHub configuration
│   ├── workflows/
│   │   ├── deploy.yml
│   │   └── test.yml
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── question.md
│   └── PULL_REQUEST_TEMPLATE.md
├── 📋 CHANGELOG.md                  # Historial de cambios
├── 🛡️ SECURITY.md                   # Políticas de seguridad
├── 🤝 CONTRIBUTING.md               # Guía de contribución
├── ⚖️ LICENSE                       # Licencia MIT
└── 🚫 .gitignore                    # Archivos ignorados
```

### Implementación Paso a Paso
```bash
# 1. Reorganizar archivos existentes
mkdir -p docs assets/.keep tests/.keep .github/workflows .github/ISSUE_TEMPLATE

# 2. Mover archivos de documentación
mv README.md docs/
mv DEPLOYMENT_GUIDE.md docs/
mv GUIA_REPOSITORIO.md docs/
mv HabitWolf_Pro_Manual.md docs/
mv HabitWolf_Pro_PDF_Content.md docs/

# 3. Renombrar aplicación principal
mv habitwolf_pro.html index.html

# 4. Crear README principal
touch README.md
```

---

## 🌿 Branching Strategy

### Modelo GitFlow Simplificado
```
main                    # 🚀 Producción estable
├── develop            # 🔧 Desarrollo activo
├── feature/*          # ✨ Nuevas características
├── hotfix/*           # 🐛 Fixes críticos
└── release/*          # 📦 Preparación releases
```

### Comandos de Branch Management
```bash
# Crear rama de feature
git checkout -b feature/advanced-analytics
git checkout -b feature/social-sharing
git checkout -b feature/custom-themes

# Crear rama de hotfix
git checkout -b hotfix/chart-rendering-bug
git checkout -b hotfix/mobile-responsive-fix

# Crear rama de release
git checkout -b release/v1.1.0

# Merge y cleanup
git checkout main
git merge --no-ff feature/advanced-analytics
git branch -d feature/advanced-analytics
git push origin --delete feature/advanced-analytics
```

### Branch Protection Rules
Configurar en GitHub → Settings → Branches:
```yaml
Branch protection rule: main
✅ Require a pull request before merging
✅ Require approvals: 1
✅ Dismiss stale PR approvals when new commits are pushed
✅ Require status checks to pass before merging
✅ Require branches to be up to date before merging
✅ Include administrators
```

---

## 🔄 Workflow de Desarrollo

### 1. Feature Development
```bash
# Paso 1: Sincronizar con main
git checkout main
git pull origin main

# Paso 2: Crear feature branch
git checkout -b feature/new-gamification-system

# Paso 3: Desarrollar y commit
git add .
git commit -m "✨ Add achievement badges system

- Implement bronze, silver, gold, platinum badges
- Add badge display in profile section
- Update XP calculation for badge unlocks
- Add badge unlock notifications

Closes #15"

# Paso 4: Push y crear PR
git push origin feature/new-gamification-system
gh pr create --title "✨ Add achievement badges system" --body "Implements comprehensive badge system with 4 tiers and notification system"
```

### 2. Commit Message Convention
```bash
# Tipos de commit
✨ feat:     Nueva característica
🐛 fix:      Bug fix
📚 docs:     Documentación
🎨 style:    Formato/estilo
♻️ refactor: Refactoring
🧪 test:     Tests
⚙️ chore:    Mantenimiento

# Ejemplos
git commit -m "✨ feat: Add weekly progress analytics dashboard"
git commit -m "🐛 fix: Resolve mobile chart rendering issue"
git commit -m "📚 docs: Update installation guide with new dependencies"
git commit -m "🎨 style: Improve button hover animations"
git commit -m "♻️ refactor: Optimize habit calculation algorithms"
git commit -m "🧪 test: Add unit tests for wolf evolution system"
git commit -m "⚙️ chore: Update dependencies to latest versions"
```

### 3. Semantic Versioning
```bash
# Versioning scheme: MAJOR.MINOR.PATCH
1.0.0 → Initial release
1.0.1 → Bug fixes
1.1.0 → New features (backward compatible)
2.0.0 → Breaking changes

# Tagging releases
git tag -a v1.1.0 -m "🚀 Release v1.1.0: Advanced Analytics Dashboard"
git push origin v1.1.0
```

---

## ⚡ CI/CD con GitHub Actions

### Workflow de Deploy Automático
**Archivo:** `.github/workflows/deploy.yml`
```yaml
name: 🚀 Deploy HabitWolf Pro

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  # Job 1: Linting y Tests
  test:
    runs-on: ubuntu-latest
    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4
      
    - name: 🧪 Run HTML validation
      run: |
        sudo apt-get update
        sudo apt-get install -y tidy
        tidy -errors -quiet index.html || true
        
    - name: 📊 Check file sizes
      run: |
        echo "📁 File sizes:"
        ls -lah *.html *.md
        
    - name: 🔍 Check for TODO comments
      run: |
        echo "🔍 Checking for TODOs:"
        grep -r "TODO\|FIXME" *.html *.md || echo "✅ No TODOs found"

  # Job 2: Deploy to GitHub Pages
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    permissions:
      contents: read
      pages: write
      id-token: write
      
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
      
    steps:
    - name: 📥 Checkout
      uses: actions/checkout@v4
      
    - name: ⚙️ Setup Pages
      uses: actions/configure-pages@v4
      
    - name: 📦 Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: '.'
        
    - name: 🚀 Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4

  # Job 3: Performance Testing
  lighthouse:
    needs: deploy
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: 🔍 Lighthouse CI
      uses: treosh/lighthouse-ci-action@v9
      with:
        urls: |
          https://${{ github.repository_owner }}.github.io/habitwolf-pro/
        uploadArtifacts: true
        temporaryPublicStorage: true
```

### Workflow de Testing
**Archivo:** `.github/workflows/test.yml`
```yaml
name: 🧪 Tests

on:
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: 🔧 Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: 📊 Install dependencies
      run: npm install -g html-validate
      
    - name: ✅ Validate HTML
      run: html-validate index.html
      
    - name: 🎨 Check CSS formatting
      run: |
        echo "Checking for CSS best practices..."
        grep -E "(position: fixed|z-index: [0-9]{4,})" index.html && exit 1 || echo "✅ CSS looks good"
        
    - name: 📱 Mobile responsiveness check
      run: |
        echo "Checking for mobile viewport..."
        grep -q "viewport" index.html && echo "✅ Viewport meta tag found" || exit 1
```

---

## 🎫 Gestión de Issues y PRs

### Templates de Issues

**Archivo:** `.github/ISSUE_TEMPLATE/bug_report.md`
```markdown
---
name: 🐛 Bug Report
about: Report a bug to help us improve HabitWolf Pro
title: '[BUG] '
labels: bug, needs-triage
assignees: ''
---

## 🐛 Bug Description
A clear and concise description of what the bug is.

## 🔄 Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## ✅ Expected Behavior
A clear and concise description of what you expected to happen.

## 📱 Device Information
- **Device**: [e.g. iPhone 12, Desktop]
- **OS**: [e.g. iOS 15, Windows 11]
- **Browser**: [e.g. Chrome 96, Safari 15]
- **Screen Size**: [e.g. 390x844, 1920x1080]

## 📸 Screenshots
If applicable, add screenshots to help explain your problem.

## 🎮 Game Data
- **Wolf Level**: [e.g. Level 3 - Guerrero Experimentado]
- **Total XP**: [e.g. 1,250 XP]
- **Habits Tracked**: [e.g. 8 active habits]
- **Days Active**: [e.g. 15 days]

## 📋 Additional Context
Add any other context about the problem here.
```

**Archivo:** `.github/ISSUE_TEMPLATE/feature_request.md`
```markdown
---
name: ✨ Feature Request
about: Suggest an idea for HabitWolf Pro
title: '[FEATURE] '
labels: enhancement, needs-triage
assignees: ''
---

## 🎯 Feature Description
A clear and concise description of what you want to happen.

## 💡 Use Case
Describe the use case and why this feature would be valuable.

## 🎨 Proposed Solution
Describe how you'd like this feature to work.

## 🎮 Gamification Impact
How would this feature integrate with the wolf evolution system?

## 📱 Platform Considerations
- [ ] Works on mobile
- [ ] Works on desktop
- [ ] Responsive design
- [ ] Offline capability

## 🔄 Alternative Solutions
Describe alternatives you've considered.

## 📋 Additional Context
Add any other context, mockups, or examples.
```

### Pull Request Template

**Archivo:** `.github/PULL_REQUEST_TEMPLATE.md`
```markdown
## 📋 Description
Brief description of changes made.

## 🎯 Type of Change
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🎨 Style/UI improvements
- [ ] ♻️ Code refactoring

## 🧪 Testing
- [ ] ✅ Tested on Chrome desktop
- [ ] ✅ Tested on Safari mobile
- [ ] ✅ Tested habit tracking flow
- [ ] ✅ Tested wolf evolution system
- [ ] ✅ Tested data export/import
- [ ] ✅ Verified responsive design

## 📸 Screenshots
If UI changes, please add before/after screenshots.

## 🔗 Related Issues
Closes #(issue number)

## 📋 Checklist
- [ ] ✅ Code follows style guidelines
- [ ] ✅ Self-review completed
- [ ] ✅ No console errors
- [ ] ✅ Responsive design verified
- [ ] ✅ Performance impact considered
- [ ] ✅ Documentation updated if needed

## 🎮 Gamification Impact
How does this change affect the user's wolf journey?

## 📱 Mobile Testing
Confirm the changes work well on mobile devices.
```

---

## 🤝 Colaboración y Community

### Contributing Guidelines

**Archivo:** `CONTRIBUTING.md`
```markdown
# 🤝 Contributing to HabitWolf Pro

## 🎉 Welcome!
Thank you for considering contributing to HabitWolf Pro! This project thrives on community contributions.

## 🚀 Getting Started
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/habitwolf-pro.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes
5. Commit: `git commit -m "✨ Add amazing feature"`
6. Push: `git push origin feature/amazing-feature`
7. Create a Pull Request

## 💡 What Can You Contribute?
- 🐛 **Bug Fixes**: Help us squash bugs
- ✨ **Features**: Add new gamification elements
- 🎨 **UI/UX**: Improve the wolf evolution visuals
- 📚 **Documentation**: Improve guides and tutorials
- 🧪 **Testing**: Add test coverage
- 🌍 **Translations**: Make HabitWolf Pro multilingual

## 🎮 Priority Areas
- 📊 Advanced analytics dashboards
- 🏆 Achievement system expansion
- 👥 Social features (leaderboards, sharing)
- 🎨 Custom wolf skins and themes
- ☁️ Cloud sync capabilities
- 📱 Mobile app companion

## 📋 Code Style
- Use semantic HTML5 elements
- Follow mobile-first responsive design
- Maintain 60fps animations
- Keep functions under 50 lines
- Comment complex gamification logic
- Use meaningful commit messages

## 🧪 Testing Your Changes
Before submitting a PR:
1. Test on Chrome desktop and mobile
2. Verify wolf evolution animations
3. Check habit tracking flow
4. Test data persistence
5. Verify responsive design

## 🎯 Pull Request Process
1. Update documentation if needed
2. Add yourself to contributors list
3. Ensure CI passes
4. Request review from maintainers

## ⭐ Recognition
Contributors get:
- 🏆 Special badge in README
- 🐺 Custom wolf skin (top contributors)
- 📱 Early access to new features
- 🎮 Lifetime premium features access
```

### Community Management

**Labels para Issues:**
```yaml
Priority:
- 🔥 priority/critical
- 🔴 priority/high  
- 🟡 priority/medium
- 🟢 priority/low

Type:
- 🐛 bug
- ✨ enhancement
- 📚 documentation
- 🎨 design
- 🧪 testing

Status:
- 🆕 status/new
- 🔄 status/in-progress
- ⏸️ status/blocked
- ✅ status/ready-for-review
- 🎉 status/completed

Experience:
- 🥇 good-first-issue
- 🆘 help-wanted
- 🧠 advanced
```

---

## 🛡️ Security y Best Practices

### Security Policy

**Archivo:** `SECURITY.md`
```markdown
# 🛡️ Security Policy

## 🔒 Supported Versions
| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | ✅ Yes             |
| 1.0.x   | ✅ Yes             |
| < 1.0   | ❌ No              |

## 🚨 Reporting a Vulnerability

### How to Report
- **Email**: security@habitwolf-pro.com
- **GitHub**: Private vulnerability reporting (Security tab)
- **Response Time**: Within 48 hours

### What to Include
1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if known)

### What Happens Next
1. We acknowledge receipt within 48 hours
2. We investigate and assess impact
3. We develop and test a fix
4. We release a patch
5. We publicly disclose (with your credit)

## 🔐 Security Best Practices

### For Users
- Keep browser updated
- Use strong passwords for data export
- Don't share exported data publicly
- Report suspicious behavior

### For Developers
- No API keys in frontend code
- Sanitize all user inputs
- Use HTTPS for all external resources
- Implement CSP headers
- Regular dependency updates
```

### Dependabot Configuration

**Archivo:** `.github/dependabot.yml`
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    commit-message:
      prefix: "⬆️"
      include: "scope"
    reviewers:
      - "maintainer-username"
    labels:
      - "dependencies"
      - "automated"
```

### Code Security Scanning

**Archivo:** `.github/workflows/security.yml`
```yaml
name: 🛡️ Security Scan

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * 1'  # Weekly on Mondays

jobs:
  security:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: 🔍 Run CodeQL Analysis
      uses: github/codeql-action/init@v2
      with:
        languages: javascript
        
    - name: 🔒 Check for secrets
      uses: trufflesecurity/trufflehog@main
      with:
        path: ./
        base: main
        head: HEAD
```

---

## 📈 Métricas y Analytics

### Repository Insights Setup
1. **Settings → Insights**: Habilitar todas las métricas
2. **Community Standards**: Completar checklist
3. **Traffic**: Monitorear clones y vistas
4. **Releases**: Crear releases regulares

### Performance Monitoring
```yaml
# .github/workflows/performance.yml
name: 📊 Performance Monitoring

on:
  schedule:
    - cron: '0 0 * * *'  # Daily
    
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
    - name: 🏃‍♂️ Run Lighthouse
      uses: treosh/lighthouse-ci-action@v9
      with:
        urls: |
          https://tu-usuario.github.io/habitwolf-pro/
        configPath: '.lighthouserc.json'
```

### Release Automation
```bash
# Script para automatizar releases
#!/bin/bash

VERSION=$1
CHANGELOG=$(git log --oneline $(git describe --tags --abbrev=0)..HEAD --pretty=format:"- %s")

echo "🚀 Creating release v$VERSION"

# Create tag
git tag -a "v$VERSION" -m "🚀 Release v$VERSION"

# Push tag
git push origin "v$VERSION"

# Create GitHub release
gh release create "v$VERSION" --title "🚀 HabitWolf Pro v$VERSION" --notes "$CHANGELOG"

echo "✅ Release v$VERSION created successfully!"
```

---

## 🎯 Roadmap del Repositorio

### Milestone 1: Repository Setup (Semana 1)
- [x] ✅ Estructura básica
- [x] ✅ Branching strategy
- [x] ✅ CI/CD pipeline
- [x] ✅ Issue templates
- [x] ✅ Documentation

### Milestone 2: Community Building (Semana 2-3)
- [ ] 🤝 Contributing guidelines
- [ ] 🏷️ Label management
- [ ] 👥 Maintainer guidelines
- [ ] 📊 Analytics setup
- [ ] 🎉 First community PR

### Milestone 3: Advanced Features (Semana 4+)
- [ ] 🔒 Security scanning
- [ ] 📈 Performance monitoring
- [ ] 🌍 Internationalization
- [ ] 📱 Mobile PWA setup
- [ ] ☁️ Cloud sync preparation

---

## 🆘 Comandos de Referencia Rápida

```bash
# Setup inicial
git clone https://github.com/TU_USUARIO/habitwolf-pro.git
cd habitwolf-pro
git checkout -b develop

# Desarrollo diario
git checkout develop
git pull origin develop
git checkout -b feature/nueva-funcionalidad
# ... hacer cambios ...
git add .
git commit -m "✨ feat: add nueva funcionalidad"
git push origin feature/nueva-funcionalidad

# Crear PR
gh pr create --title "✨ Nueva funcionalidad" --base develop

# Merge a main
git checkout main
git pull origin main
git merge --no-ff develop
git tag -a v1.1.0 -m "🚀 Release v1.1.0"
git push origin main --tags

# Cleanup
git branch -d feature/nueva-funcionalidad
git push origin --delete feature/nueva-funcionalidad
```

---

## 🎊 ¡Tu Repositorio Está Listo!

**🚀 Con esta configuración tendrás:**
- ✅ **Repositorio profesional** con estructura clara
- ✅ **CI/CD automático** para deployment
- ✅ **Community-ready** con templates y guidelines
- ✅ **Security scanning** automático
- ✅ **Performance monitoring** integrado
- ✅ **Release automation** simplificada

**🎯 Próximos pasos:**
1. Implementar la estructura de carpetas
2. Configurar branch protection rules
3. Crear tu primer release
4. ¡Invitar a la comunidad a contribuir!

---

*Creado con 💙 para maximizar el potencial de HabitWolf Pro*
*Versión: 1.0.0 | Fecha: Diciembre 2024*