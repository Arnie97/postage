# Postage Calculator for Greater China 两岸四地邮费计算器

## Architecture Highlights

- **Svelte + TypeScript**: Modern reactive framework with type safety
- **Service Worker**: Caches app resources for full offline functionality after first load
- **Responsive Design**: Optimized for both mobile and desktop
- **Web App Manifest**: Installable on mobile devices
- **Multilingual**: Complete translation system with regional preferences

## Development Commands

Prerequisites: Node.js 18+

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run Svelte type checking
npm run check

# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## Project Structure

```
src/
├── lib/
│   ├── components/         # Svelte components
│   ├── data/               # Static resources
│   │   ├── regions.ts      # Postal zone definitions
│   │   ├── rates.ts        # Postage rates and prices
│   │   └── translations.ts # Multilingual text translations
│   └── utils/              # Calculation logic
├── App.svelte              # Main app component
├── main.ts                 # Entry point
└── app.css                 # Global styles
```

## Todo

* EMS
* Insured mails
* Postal services in other regions

## Contributing

Contributions are welcome! Please ensure that:

- Rate calculations are based on official postal service documentation
- New features maintain offline functionality
- Code follows the existing style and structure (use `npm run format`)
- Use proper UPU terms for postal services: see the [Universal Postal Convention](https://www.lawinfochina.com/display.aspx?id=8061&lib=tax)
- Use neutral terms for different political entites: see https://zhwp.org/mos:CS4D

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).
By contributing, you agree that all your contributions will also be licensed under AGPL-3.0.

## Disclaimer

This calculator try to provide meaningful results on a best effort basis.
Actual rates may vary due to updates, and the code has not been covered by automated tests yet.
Please report an issue if the result is different from the official sites.

## Credits

This project would not be possible without heavy use of vibe coding.
Most of the codebase was accomplished by [Claude Sonnet 4.5](https://www.anthropic.com/claude/sonnet),
and some parts were coauthored by [DeepSeek V3.2](https://api-docs.deepseek.com/news/news250929).

One human who had neither read the Svelte docs nor learnt any TypeScript was responsible for
the architecture design, code reviews, information gathering, and integration testing.
