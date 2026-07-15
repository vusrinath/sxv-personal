#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Shared Utilities
// ---------------------------------------------------------------------------

/** Directories to skip during repository walks */
const SKIP_DIRS = new Set([".git", "node_modules", ".kiro"]);

/**
 * Recursively walk a directory and return all file paths.
 * Skips directories listed in SKIP_DIRS.
 * @param {string} dir - Absolute directory path to walk
 * @returns {string[]} Array of absolute file paths
 */
function walkDir(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Extract all Markdown relative links from a file.
 * Returns an array of { text, target, line } objects.
 * Only captures inline links in the form [text](target).
 * @param {string} filePath - Absolute path to the Markdown file
 * @returns {{ text: string, target: string, line: number }[]}
 */
function extractLinks(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const links = [];
  // Matches inline Markdown links: [text](target)
  const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;

  for (let i = 0; i < lines.length; i++) {
    let match;
    while ((match = linkRegex.exec(lines[i])) !== null) {
      links.push({ text: match[1], target: match[2], line: i + 1 });
    }
  }
  return links;
}

/**
 * Determine whether a link target is external (http, https, mailto, or anchor-only).
 * @param {string} target - The link target string
 * @returns {boolean}
 */
function isExternalLink(target) {
  const trimmed = target.trim();
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("#")
  );
}

/**
 * Resolve a relative link target against the filesystem.
 * Strips anchors (#...) before resolution. Returns whether the target exists.
 * @param {string} sourceFile - Absolute path to the file containing the link
 * @param {string} target - The relative link target
 * @param {string} repoRoot - Absolute path to the repository root
 * @returns {{ exists: boolean, resolvedPath: string }}
 */
function resolveLink(sourceFile, target, repoRoot) {
  // Strip anchor fragment
  const hashIndex = target.indexOf("#");
  const pathPart = hashIndex >= 0 ? target.substring(0, hashIndex) : target;

  // If the target is anchor-only (e.g. "#section"), it's internal — treat as existing
  if (pathPart === "") {
    return { exists: true, resolvedPath: sourceFile };
  }

  // Decode percent-encoded characters
  const decoded = decodeURIComponent(pathPart);

  // Resolve relative to the source file's directory
  const sourceDir = path.dirname(sourceFile);
  const resolved = path.resolve(sourceDir, decoded);

  // Security: ensure the resolved path is within the repo root
  const normalizedResolved = path.normalize(resolved);
  const normalizedRoot = path.normalize(repoRoot);
  if (!normalizedResolved.startsWith(normalizedRoot)) {
    return { exists: false, resolvedPath: normalizedResolved };
  }

  const exists = fs.existsSync(resolved);
  return { exists, resolvedPath: resolved };
}

// ---------------------------------------------------------------------------
// Findings Collector
// ---------------------------------------------------------------------------

/**
 * @typedef {{ property: string, sourceFile: string, detail: string }} Finding
 */

/** @type {Finding[]} */
const findings = [];

/**
 * Add a finding to the collector.
 * @param {string} property - The property name (e.g., "link-integrity")
 * @param {string} sourceFile - The file where the issue was found (relative to repo root)
 * @param {string} detail - Description of the finding
 */
function addFinding(property, sourceFile, detail) {
  findings.push({ property, sourceFile, detail });
}

// ---------------------------------------------------------------------------
// Property 1: Link integrity (no dangling cross-links)
// ---------------------------------------------------------------------------

/**
 * Check Property 1: For all Markdown files in the repo, extract relative links
 * and verify each resolves to an existing file or folder.
 * @param {string} repoRoot - Absolute path to the repository root
 */
function checkLinkIntegrity(repoRoot) {
  const allFiles = walkDir(repoRoot);
  const mdFiles = allFiles.filter(
    (f) => f.endsWith(".md") || f.endsWith(".markdown")
  );

  for (const mdFile of mdFiles) {
    const links = extractLinks(mdFile);
    for (const link of links) {
      // Skip external links
      if (isExternalLink(link.target)) continue;

      const { exists } = resolveLink(mdFile, link.target, repoRoot);
      if (!exists) {
        const relativeSrc = path.relative(repoRoot, mdFile);
        addFinding(
          "link-integrity",
          relativeSrc,
          `Dangling link to: ${link.target}`
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Top-level Runner
// ---------------------------------------------------------------------------

/**
 * Run all property checks and return findings.
 * @param {string} repoRoot - Absolute path to the repository root
 * @returns {Finding[]}
 */
function runAllChecks(repoRoot) {
  // Clear findings from any prior run
  findings.length = 0;

  // Property 1: Link integrity
  checkLinkIntegrity(repoRoot);

  // Properties 2-17 will be added in subsequent tasks (7.2–7.7)

  return findings;
}

// ---------------------------------------------------------------------------
// CLI Entry Point
// ---------------------------------------------------------------------------

if (require.main === module) {
  const repoRoot = process.argv[2] || process.cwd();
  const resolvedRoot = path.resolve(repoRoot);

  if (!fs.existsSync(resolvedRoot)) {
    console.error(`Error: repository root does not exist: ${resolvedRoot}`);
    process.exit(2);
  }

  console.log(`Checking repository structure at: ${resolvedRoot}\n`);

  const results = runAllChecks(resolvedRoot);

  if (results.length === 0) {
    console.log("All checks passed. No findings.");
    process.exit(0);
  } else {
    console.log(`Found ${results.length} finding(s):\n`);
    for (const f of results) {
      console.log(`  [${f.property}] ${f.sourceFile}`);
      console.log(`    ${f.detail}\n`);
    }
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Exports (for use by later tasks / tests)
// ---------------------------------------------------------------------------

module.exports = {
  walkDir,
  extractLinks,
  isExternalLink,
  resolveLink,
  addFinding,
  findings,
  checkLinkIntegrity,
  runAllChecks,
  SKIP_DIRS,
};
