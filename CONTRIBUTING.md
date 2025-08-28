# Contributing to Live JS

Thank you for your interest in contributing to Live JS! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Getting Started
1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Create** a new branch for your feature or fix
4. **Make** your changes
5. **Test** your changes thoroughly
6. **Submit** a pull request

### Development Setup

#### Prerequisites
- **Bun** 1.0+ (recommended) or **Node.js** 18+
- **Git** for version control
- **Code editor** (VS Code recommended)

#### Installation
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/live-js.git
cd live-js

# Install dependencies
bun install

# Start development server
bun run dev
```

## 📋 Contribution Guidelines

### Code Style
- Follow existing code conventions and patterns
- Use **TypeScript** for type safety
- Follow **Vue 3 Composition API** patterns
- Use **Tailwind CSS** for styling
- Maintain consistent indentation (2 spaces)

### Commit Messages
Use clear and descriptive commit messages:
```
type(scope): description

feat(editor): add syntax highlighting for new language
fix(api): resolve execution timeout issue
docs(readme): update installation instructions
style(ui): improve button hover states
```

#### Commit Types
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Branch Naming
Use descriptive branch names:
```
feature/add-dark-theme
fix/execution-timeout
docs/update-contributing
refactor/api-structure
```

## 🐛 Reporting Issues

### Bug Reports
When reporting bugs, please include:
- **Description**: Clear description of the issue
- **Steps to reproduce**: Detailed steps to recreate the bug
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: Browser, OS, version information
- **Screenshots**: If applicable

### Feature Requests
For new features, please include:
- **Description**: Clear description of the proposed feature
- **Use case**: Why this feature would be useful
- **Implementation ideas**: Suggestions for implementation
- **Alternatives**: Other solutions you've considered

## 🔧 Development Guidelines

### Code Quality
- Write **clean, readable code**
- Add **comments** for complex logic
- Follow **DRY principles** (Don't Repeat Yourself)
- Use **meaningful variable names**
- Keep functions **small and focused**

### Testing
- Test your changes thoroughly
- Ensure existing functionality still works
- Test in multiple browsers if applicable
- Verify responsive design on different screen sizes

### Performance
- Consider **performance implications** of your changes
- Optimize for **fast loading times**
- Minimize **bundle size** when possible
- Use **lazy loading** for heavy components

## 📚 Project Structure

```
live-js/
├── components/          # Vue components
├── composables/         # Vue composables
├── pages/              # Nuxt pages
├── server/             # Server-side code
│   └── api/           # API endpoints
├── assets/             # Static assets
├── public/             # Public files
└── plugins/            # Nuxt plugins
```

### Key Components
- **CodeEditor.vue**: Monaco editor wrapper
- **OutputPanel.vue**: Code execution results
- **Toolbar.vue**: Action buttons and controls
- **SettingsModal.vue**: User preferences

### Key Composables
- **useCodeExecution.ts**: Code execution logic
- **useTheme.ts**: Theme management
- **useWebSocket.ts**: WebSocket communication

## 🚀 Pull Request Process

### Before Submitting
1. **Update** your branch with the latest changes from main
2. **Test** your changes thoroughly
3. **Run** linting and formatting tools
4. **Update** documentation if needed
5. **Add** tests for new features

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Tested locally
- [ ] Tested in multiple browsers
- [ ] Added/updated tests

## Screenshots
(If applicable)

## Additional Notes
Any additional information
```

### Review Process
1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** in staging environment
4. **Approval** and merge

## 🎯 Areas for Contribution

### High Priority
- **Performance optimizations**
- **Accessibility improvements**
- **Mobile responsiveness**
- **Error handling enhancements**
- **Documentation improvements**

### Feature Ideas
- **Additional themes**
- **Code sharing improvements**
- **Keyboard shortcuts**
- **Code templates**
- **Export functionality**

### Technical Improvements
- **Test coverage**
- **Code splitting**
- **Bundle optimization**
- **SEO enhancements**
- **Progressive Web App features**

## 📖 Resources

### Documentation
- [Vue 3 Documentation](https://vuejs.org/)
- [Nuxt 3 Documentation](https://nuxt.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Monaco Editor Documentation](https://microsoft.github.io/monaco-editor/)

### Tools
- [Bun Documentation](https://bun.sh/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

## 🏆 Recognition

Contributors are recognized in:
- **GitHub contributors list**
- **Release notes** for significant contributions
- **Project documentation**
- **Special thanks** in major releases

## 📞 Getting Help

### Community
- **GitHub Discussions**: Ask questions and share ideas
- **Issues**: Report bugs and request features
- **Discord**: Real-time chat with the community

### Maintainers
- **@zkjon**: Project maintainer
- **Core team**: Active contributors with write access

## 📄 License

By contributing to Live JS, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Live JS! 🚀**