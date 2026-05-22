# WYSIWYG Visual Component Builder

Enterprise-grade Visual Component Builder Platform - A modular, scalable, and extensible solution for building visual editors.

## 🚀 Features

- **Modular Architecture**: Monorepo structure with isolated packages
- **Component System**: Reusable component registry with typed schemas
- **Visual Editing**: Drag & drop, resize, multi-select, and more
- **Responsive Design**: Multiple viewport modes with device-specific styling
- **Plugin System**: Extensible plugin architecture
- **AI-Ready**: Built-in support for AI-powered features
- **Multi-Platform Export**: Export to HTML, React, WordPress, Odoo, and more
- **Secure Sandbox**: Isolated iframe runtime for user-generated content
- **Type-Safe**: Full TypeScript support with strict typing

## 📦 Architecture

```
apps/
└── builder/          # Main builder application
packages/
├── core/            # Core functionality and types
├── editor/          # Visual editing engine
├── renderer/        # Component rendering system
├── components/      # Component library
├── exporters/       # Export adapters
├── storage/         # Storage adapters
├── plugins/         # Plugin system
├── sandbox/         # Isolated runtime
├── history/         # Undo/Redo system
├── ai/             # AI integrations
└── shared/         # Shared utilities
```

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, TailwindCSS
- **State Management**: Zustand
- **Visual Editing**: GrapesJS
- **Code Editor**: Monaco Editor
- **Drag & Drop**: dnd-kit
- **Storage**: IndexedDB
- **Export**: JSZip
- **Preview**: iframe sandbox runtime

## 🏗️ Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

## 📖 Documentation

### Core Concepts

#### JSON Component Tree

The platform uses a JSON tree architecture as the source of truth:

```json
{
  "id": "hero_1",
  "type": "hero",
  "props": {
    "title": "Welcome"
  },
  "styles": {},
  "children": []
}
```

#### Rendering Pipeline

```
JSON Tree → Renderer → HTML/CSS/JS Output
```

#### Component Definition

```typescript
type ComponentDefinition = {
  type: string;
  label: string;
  icon: string;
  defaultProps: Record<string, any>;
  render: (props) => HTMLElement;
  inspector: InspectorField[];
};
```

## 🔌 Plugin System

Plugins can extend the builder with:
- Custom blocks
- Custom renderers
- Custom traits
- AI integrations
- Animations
- Ecommerce blocks
- Forms
- Charts

## 🌐 Export Options

- Static HTML websites
- React/Next.js components
- WordPress blocks
- Odoo snippets
- ZIP export with assets

## 🔒 Security

- XSS protection
- Sandboxed runtime
- Sanitized HTML export
- Secure asset handling
- Isolated execution context

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.
