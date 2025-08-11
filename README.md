# World Ranks - Country Data Application

A modern React application that displays and filters country data with comprehensive testing coverage.

## 🌍 Features

- **Country Data Display**: View countries with flags, names, population, area, and region
- **Advanced Filtering**: Filter by region, UN membership, independence status
- **Search Functionality**: Search by name, region, or subregion
- **Sorting Options**: Sort by population, name, or area
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Pagination**: Navigate through large datasets efficiently

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd fe-test

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

This project includes a comprehensive testing suite built with **Jest** and **React Testing Library**.

### Test Coverage
- **Overall Coverage**: 94.5%
- **Branch Coverage**: 95.57%
- **Function Coverage**: 96.92%
- **Line Coverage**: 94.08%
- **Total Tests**: 262 tests (all passing)

### Running Tests

#### **Run All Tests (Recommended)**
```bash
npm test -- --watchAll=false
```

#### **Run All Tests with Coverage Report**
```bash
npm test -- --watchAll=false --coverage
```

#### **Run Tests for Specific Component**
```bash
# Test SearchBar component
npm test -- --watchAll=false --testNamePattern="SearchBar"

# Test CountryTable component
npm test -- --watchAll=false --testNamePattern="CountryTable"

# Test useCountries hook
npm test -- --watchAll=false --testNamePattern="useCountries"
```

#### **Run Tests in Watch Mode (Interactive)**
```bash
npm test
```

### Test Structure

The testing suite follows best practices with co-located test files:

```
src/
├── components/
│   ├── common/
│   │   ├── LoadingSpinner.js
│   │   ├── LoadingSpinner.test.js ✅
│   │   ├── ErrorDisplay.js
│   │   └── ErrorDisplay.test.js ✅
│   └── country/
│       ├── SearchBar.js
│       ├── SearchBar.test.js ✅
│       ├── CountryTable.js
│       ├── CountryTable.test.js ✅
│       └── ...
├── hooks/
│   ├── useCountries.js
│   ├── useCountries.test.js ✅
│   ├── useCountryFilters.js
│   ├── useCountryFilters.test.js ✅
│   └── ...
└── utils/
    ├── constants.js
    └── constants.test.js ✅
```

### Testing Technologies

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing with user-centric approach
- **@testing-library/jest-dom**: Custom Jest matchers for DOM elements
- **@testing-library/user-event**: Realistic user interaction simulation

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components (LoadingSpinner, ErrorDisplay)
│   └── country/        # Country-specific components
├── hooks/              # Custom React hooks for business logic
├── utils/              # Utility functions and constants
├── pages/              # Main application pages
└── App.js              # Main application component
```

## 🎨 Styling

- **CSS Modules**: Component-scoped styling
- **CSS Variables**: Consistent design tokens
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Modern, accessible color scheme

## 📱 Available Scripts

### Development
```bash
npm start          # Start development server
npm run build      # Build for production
npm run eject      # Eject from Create React App (one-way operation)
```

### Testing
```bash
npm test           # Run tests in watch mode
npm test -- --watchAll=false --coverage  # Run all tests with coverage
```

## 🔧 Technical Details

- **Framework**: React 18
- **Build Tool**: Create React App
- **Testing**: Jest + React Testing Library
- **Styling**: CSS Modules
- **State Management**: React Hooks
- **API Integration**: REST Countries API

## 📊 Performance Features

- **React.memo**: Component memoization for performance
- **useCallback**: Optimized event handlers
- **useMemo**: Computed value caching
- **Lazy Loading**: Efficient data fetching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### Common Issues

**Tests not running**: Ensure you're in the project directory and have run `npm install`

**Coverage not showing**: Use the `--coverage` flag: `npm test -- --watchAll=false --coverage`

**Specific test failing**: Run individual test suites with `--testNamePattern`

### Getting Help

- Check the test output for specific error messages
- Review the test files for examples of proper testing patterns
- Ensure all dependencies are properly installed

---

**Built with ❤️ using React and modern testing practices**
