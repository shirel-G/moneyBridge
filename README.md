# Money Bridge 🚗💰

> A secure escrow platform for vehicle transactions in Israel

Money Bridge is a modern, full-featured escrow service that simplifies and secures vehicle purchases by managing payments between buyers and sellers, verifying ownership transfers, and ensuring insurance compliance.

## ✨ Features

### Core Functionality
- 🔍 **Vehicle Verification** - Instant lookup by license plate
- 💰 **Secure Escrow** - Safe payment holding with transparent fee structure
- 📱 **SMS Verification** - Two-factor authentication for both parties
- 🏦 **Bank Integration** - Support for all major Israeli banks
- 🛡️ **Insurance Validation** - Automatic insurance offer comparison
- 🌍 **Multi-Language** - Full support for Hebrew, English, Russian, and Arabic

### User Experience
- **Realistic Flow** - Mirrors real-world escrow processes
- **Transparent Pricing** - Clear breakdown of sale price + 120 NIS service fee
- **Secure Authentication** - 4-digit OTP verification for identity confirmation
- **Bank Details Collection** - Complete banking information from both parties
- **Automated Verification** - Simulated payment detection and ownership transfer

### Supported Banks
- Bank Leumi (בנק לאומי)
- Bank Hapoalim (בנק הפועלים)
- Discount Bank (בנק דיסקונט)
- Mizrahi Tefahot (בנק מזרחי טפחות)
- Bank Yahav (בנק יהב)
- First International Bank - FIBI (בנק פאג״י)

### Insurance Companies
- Harel (הראל)
- Phoenix (פניקס)
- Menora Mivtachim (מנורה מבטחים)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/money-bridge.git

# Navigate to project directory
cd money-bridge

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🏗️ Technology Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: i18next
- **Icons**: Lucide React
- **State Management**: React Hooks

## 📱 Usage Flow

1. **Vehicle Lookup** - Enter license plate to identify vehicle
2. **Price Entry** - Seller enters sale price
3. **Seller Verification** - Collect seller details + SMS verification
4. **Bank Selection** - Both parties select their banks
5. **Buyer Verification** - Collect buyer details + SMS verification
6. **Payment** - Secure escrow deposit with payment breakdown
7. **Insurance** - Compare and select insurance offers
8. **Transfer** - Automated ownership verification
9. **Completion** - Funds released to seller

## 🔐 Security Features

- SMS-based two-factor authentication
- Secure bank detail collection
- Simulated payment verification
- Government verification integration (simulated)

## 🌐 Localization

The application is fully localized in:
- 🇮🇱 Hebrew (עברית) - Primary
- 🇺🇸 English
- 🇷🇺 Russian (Русский)
- 🇸🇦 Arabic (العربية)

## 📄 License

MIT License - feel free to use this project for learning and development purposes.

## 🙏 Acknowledgments

Built with modern web technologies to demonstrate a complete escrow flow for vehicle transactions in the Israeli market.

---

**Note**: This is a demonstration project. All bank integrations, payment verifications, and government checks are simulated for educational purposes.
