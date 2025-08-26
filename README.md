# Postage Calculator for Greater China | 大中华地区邮费计算器

A progressive web app (PWA) for calculating postage rates across Greater China region. The app automatically selects the correct postal service based on the origin region and supports detailed provincial-level calculations for mainland China according to official postal regulations.

## Features

- **🌏 Multi-language Support**: English, Traditional Chinese (繁體中文), Simplified Chinese (简体中文)
- **📱 PWA Functionality**: Installable web app that works offline after first load
- **🎯 Smart Service Detection**: Automatically selects postal service based on origin region
- **🗺️ Comprehensive Coverage**: All mainland Chinese provinces, Hong Kong, Taiwan, Macau, and international destinations
- **📋 Official Rate Calculations**: Based on latest postal regulations including 发改价格规〔2017〕629号
- **🏷️ Postal Zone System**: Accurate domestic parcel pricing with 3-zone system for mainland China
- **📦 Multiple Mail Types**: Letters, parcels, EMS, and ePacket (where available)
- **💱 Multi-currency**: Supports CNY, TWD, and HKD

## How It Works

### 🚀 Smart Service Selection

The app automatically determines which postal service to use based on your selected origin:

- **From Mainland China** → China Post (中国邮政)
- **From Taiwan** → Chunghwa Post (中華郵政)
- **From Hong Kong** → Hong Kong Post (香港郵政)
- **From Macau** → China Post (中国邮政)

### 📍 Comprehensive Regional Support

- **Mainland China**: All 31 provinces, municipalities, and autonomous regions
- **Special Administrative Regions**: Hong Kong, Macau
- **Taiwan**: Complete coverage
- **International**: Major countries and regions worldwide

### 💰 Accurate Pricing Calculations

#### China Post (中国邮政)

- **Domestic parcels**: 3-zone pricing system per 发改价格规〔2017〕629号
  - **本埠** (Local): Same province delivery (首重500g: ¥3)
  - **第一区** (Zone 1): Adjacent/same region delivery (首重500g: ¥6)
  - **第二区** (Zone 2): Cross-region delivery (首重500g: ¥8)
  - **第三区** (Zone 3): Remote areas (Tibet, Xinjiang, Qinghai) (首重500g: ¥10)
- **Letters**: Domestic, Hong Kong/Macau/Taiwan, international rates
- **EMS & ePacket**: Weight-based pricing tiers

> ⚠️ **Note**: The postal zone calculation is implemented based on general geographic and administrative principles. The complete official zone mapping table from 发改价格规〔2017〕629号附件 should be consulted for precise commercial use.

#### Chunghwa Post (中華郵政)

- **Domestic**: Taiwan island-wide delivery
- **Cross-strait**: Special rates to mainland China
- **Regional**: Hong Kong and Macau
- **International**: Worldwide delivery with zone-based pricing

#### Hong Kong Post (香港郵政)

- **Local**: Hong Kong domestic rates
- **Regional**: Mainland China, Taiwan, Macau
- **International**: Global delivery options

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check

# Linting
npm run lint

# Format code
npm run format
```

### Project Structure

```
src/
├── lib/
│   ├── components/          # Svelte components
│   ├── data/               # Translation data
│   ├── stores/             # Svelte stores
│   └── utils/              # Utility functions
├── App.svelte              # Main app component
├── main.ts                 # Entry point
└── app.css                 # Global styles
```

## Technical Implementation

### Rate Calculation Engine

- **Weight-based pricing**: Accurate calculations per gram with proper tier handling
- **Postal zone mapping**: Implements official 3-zone system for China Post parcels
- **Service compatibility**: Automatic filtering of available mail types per route
- **Regulation compliance**: Based on official postal service rate tables

### Architecture Highlights

- **Svelte + TypeScript**: Modern reactive framework with type safety
- **Offline-first PWA**: Service worker caching for full offline functionality
- **Responsive design**: Mobile-optimized interface with touch controls
- **Multilingual**: Complete translation system with regional preferences

## PWA Features

- **Service Worker**: Caches app resources for offline use
- **Web App Manifest**: Installable on mobile devices
- **Responsive Design**: Optimized for mobile and desktop
- **Fast Loading**: Optimized bundle size and lazy loading

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

## Contributing

Contributions are welcome! Please ensure that:

- Rate calculations are based on official postal service documentation
- New features maintain offline functionality
- Code follows the existing style and structure
- All postal services remain accurately represented

## Rate References

All calculations are based on official postal service rate tables:

### China Post 中国邮政

- [发改价格规〔2017〕629号](https://www.ndrc.gov.cn/xxgk/zcfb/ghxwj/201704/t20170412_960915.html) - Parcel rate structure
- [台湾、香港、澳门地区函件资费表](https://www.chinapost.com.cn/xhtml1/report/19101/1784-1.htm)
- [国际函件资费表](https://www.chinapost.com.cn/xhtml1/report/19101/1959-1.htm)

### Chunghwa Post 中華郵政

- [國內郵件資費表](https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=20501)
- [兩岸郵政速遞資費表](https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=1396492589492)
- [國際包裹資費表](https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=2050401)

### Hong Kong Post 香港郵政

- [Postage Rates 2022](https://www.hongkongpost.hk/en/other/2022/postage/index.html)

## Disclaimer

This calculator provides estimates based on official postal rate tables as of 2020-2022. Actual rates may vary due to updates, special services, or regional variations. Always verify with the official postal service for final pricing and current rates.
