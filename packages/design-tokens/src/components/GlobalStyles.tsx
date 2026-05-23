import React from 'react';
import { useTheme } from './ThemeProvider';

export function GlobalStyles() {
  const { theme } = useTheme();

  return (
    <style jsx global>{`
      :root {
        /* Reset and base styles */
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          font-size: 16px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        body {
          font-family: var(--dt-typography-font-family-sans);
          font-size: var(--dt-typography-font-size-base);
          font-weight: var(--dt-typography-font-weight-regular);
          line-height: var(--dt-typography-line-height-normal);
          color: var(--dt-text-primary);
          background-color: var(--dt-background-default);
          overflow-x: hidden;
        }

        /* Typography */
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--dt-typography-font-family-display);
          font-weight: var(--dt-typography-font-weight-bold);
          line-height: var(--dt-typography-line-height-tight);
          margin-bottom: var(--dt-spacing-4);
        }

        h1 {
          font-size: var(--dt-typography-font-size-5xl);
        }

        h2 {
          font-size: var(--dt-typography-font-size-4xl);
        }

        h3 {
          font-size: var(--dt-typography-font-size-3xl);
        }

        h4 {
          font-size: var(--dt-typography-font-size-2xl);
        }

        h5 {
          font-size: var(--dt-typography-font-size-xl);
        }

        h6 {
          font-size: var(--dt-typography-font-size-lg);
        }

        p {
          margin-bottom: var(--dt-spacing-4);
        }

        a {
          color: var(--dt-primary);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        a:hover {
          color: var(--dt-primary-hover);
        }

        /* Lists */
        ul, ol {
          margin-bottom: var(--dt-spacing-4);
          padding-left: var(--dt-spacing-6);
        }

        li {
          margin-bottom: var(--dt-spacing-2);
        }

        /* Code */
        code {
          font-family: var(--dt-typography-font-family-mono);
          font-size: 0.875em;
          padding: 0.2em 0.4em;
          margin: 0;
          font-size: 85%;
          background-color: var(--dt-neutral-100);
          border-radius: var(--dt-radius-sm);
        }

        pre {
          font-family: var(--dt-typography-font-family-mono);
          font-size: 0.875em;
          padding: var(--dt-spacing-4);
          margin: 0 0 var(--dt-spacing-4);
          overflow: auto;
          background-color: var(--dt-neutral-100);
          border-radius: var(--dt-radius-md);
        }

        pre code {
          padding: 0;
          font-size: inherit;
          color: inherit;
          background: none;
        }

        /* Blockquote */
        blockquote {
          margin: 0 0 var(--dt-spacing-4);
          padding: var(--dt-spacing-4) var(--dt-spacing-6);
          border-left: 4px solid var(--dt-primary);
          background-color: var(--dt-background-paper);
          color: var(--dt-text-secondary);
        }

        /* Tables */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: var(--dt-spacing-4);
        }

        th, td {
          padding: var(--dt-spacing-3);
          text-align: left;
          border-bottom: 1px solid var(--dt-border-default);
        }

        th {
          font-weight: var(--dt-typography-font-weight-semibold);
          color: var(--dt-text-primary);
        }

        /* Form elements */
        button,
        input,
        optgroup,
        select,
        textarea {
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
        }

        button {
          cursor: pointer;
          border: none;
          background: none;
        }

        /* Focus styles */
        :focus-visible {
          outline: 2px solid var(--dt-primary);
          outline-offset: 2px;
        }

        /* Selection */
        ::selection {
          background-color: var(--dt-primary-light);
          color: var(--dt-text-primary);
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        ::-webkit-scrollbar-track {
          background: var(--dt-background-default);
        }

        ::-webkit-scrollbar-thumb {
          background: var(--dt-neutral-400);
          border-radius: var(--dt-radius-md);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: var(--dt-neutral-500);
        }

        /* Utility classes */
        .text-primary {
          color: var(--dt-text-primary);
        }

        .text-secondary {
          color: var(--dt-text-secondary);
        }

        .text-disabled {
          color: var(--dt-text-disabled);
        }

        .text-inverse {
          color: var(--dt-text-inverse);
        }

        .bg-default {
          background-color: var(--dt-background-default);
        }

        .bg-paper {
          background-color: var(--dt-background-paper);
        }

        .bg-elevated {
          background-color: var(--dt-background-elevated);
        }

        .border-default {
          border-color: var(--dt-border-default);
        }

        .border-light {
          border-color: var(--dt-border-light);
        }

        .border-dark {
          border-color: var(--dt-border-dark);
        }

        /* Dark mode specific adjustments */
        .dark {
          color-scheme: dark;
        }

        .dark pre {
          background-color: var(--dt-neutral-800);
        }

        .dark code {
          background-color: var(--dt-neutral-800);
        }

        .dark blockquote {
          background-color: var(--dt-neutral-800);
        }
      `}</style>
  );
}
