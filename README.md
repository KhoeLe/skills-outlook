# Outlook Packages

Monorepo for parsing and displaying Microsoft Outlook email files.

## Packages

| Package | Description | npm |
|---------|-------------|-----|
| [outlook-email-parser](./outlook-email-parser) | Parse MSG, EML, OFT files | `npm i outlook-email-parser` |
| [outlook-reader-ui](./outlook-reader-ui) | React UI components | `npm i outlook-reader-ui` |

## Development

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run in dev mode
npm run dev

# Run tests
npm run test

# Clean build artifacts
npm run clean
```

## Publishing

This monorepo uses [Changesets](https://github.com/changesets/changesets) + GitHub Actions for automated publishing.

### Setup (one-time)

1. Create an npm access token at [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens)
   - Select "Granular Access Token"
   - Set Packages and scopes to "Read and Write"

2. Add the token to GitHub repository secrets:
   - Go to Settings → Secrets → Actions
   - Add `NPM_TOKEN` with your npm token

### Workflow

```bash
# 1. Make your changes

# 2. Create a changeset describing the change
npm run changeset
# Select packages, bump type (patch/minor/major), and add description

# 3. Commit and push
git add .
git commit -m "feat: your feature"
git push

# 4. GitHub Actions will:
#    - Run CI (build + test)
#    - Create a "Version Packages" PR with updated versions
#    - When PR is merged, automatically publish to npm
```

### Manual Publishing

```bash
# Build and publish locally
npm run build
npm run release
```

## License

MIT
