import { useState, useEffect } from 'react'
import './App.css'

interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  volume: number
  averageVolume20D: number
  marketCap: string
}

function App() {
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching NVDA stock data
    const fetchStockData = () => {
      setLoading(true)
      // Mock NVDA data (in real app, you'd fetch from an API like Alpha Vantage, Yahoo Finance, etc.)
      setTimeout(() => {
        const mockData: StockData = {
          symbol: 'NVDA',
          price: 875.42,
          change: 12.85,
          changePercent: 1.49,
          high: 879.50,
          low: 861.20,
          volume: 45230000,
          averageVolume20D: 38500000,
          marketCap: '2.15T'
        }
        setStockData(mockData)
        setLoading(false)
      }, 1000)
    }

    fetchStockData()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchStockData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="app">
        <h1>Stock Dashboard</h1>
        <div className="loading">Loading NVDA stock data...</div>
      </div>
    )
  }

  if (!stockData) {
    return (
      <div className="app">
        <h1>Stock Dashboard</h1>
        <div className="error">Failed to load stock data</div>
      </div>
    )
  }

  const isPositive = stockData.change >= 0

  return (
    <div className="app">
      <h1>Stock Dashboard</h1>
      
      <div className="stock-card">
        <div className="stock-header">
          <h2>{stockData.symbol}</h2>
          <div className="stock-price">${stockData.price.toFixed(2)}</div>
        </div>
        
        <div className={`stock-change ${isPositive ? 'positive' : 'negative'}`}>
          <span className="change-amount">
            {isPositive ? '+' : ''}${stockData.change.toFixed(2)}
          </span>
          <span className="change-percent">
            ({isPositive ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
          </span>
        </div>

        <div className="stock-details">
          <div className="detail-item">
            <span className="label">High:</span>
            <span className="value">${stockData.high.toFixed(2)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Low:</span>
            <span className="value">${stockData.low.toFixed(2)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Volume:</span>
            <span className="value">{stockData.volume.toLocaleString()}</span>
          </div>
          <div className="detail-item">
            <span className="label">Market Cap:</span>
            <span className="value">${stockData.marketCap}</span>
          </div>
        </div>
      </div>

      <div className="volume-chart">
        <h3>Volume Analysis</h3>
        <div className="chart-container">
          <div className="chart-bar-wrapper">
            <div className="chart-labels">
              <span className="chart-label today">Today: {stockData.volume.toLocaleString()}</span>
              <span className="chart-label average">20D Avg: {stockData.averageVolume20D.toLocaleString()}</span>
            </div>
            <div className="chart-bars">
              <div className="chart-bar-group">
                <div 
                  className="chart-bar today-bar" 
                  style={{ 
                    height: `${(stockData.volume / Math.max(stockData.volume, stockData.averageVolume20D)) * 100}%` 
                  }}
                >
                  <span className="bar-value">{(stockData.volume / 1000000).toFixed(1)}M</span>
                </div>
                <div 
                  className="chart-bar average-bar" 
                  style={{ 
                    height: `${(stockData.averageVolume20D / Math.max(stockData.volume, stockData.averageVolume20D)) * 100}%` 
                  }}
                >
                  <span className="bar-value">{(stockData.averageVolume20D / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="volume-insight">
          {stockData.volume > stockData.averageVolume20D ? (
            <p className="insight positive">
              📈 Trading volume is <strong>{((stockData.volume / stockData.averageVolume20D - 1) * 100).toFixed(1)}%</strong> above average
            </p>
          ) : (
            <p className="insight negative">
              📉 Trading volume is <strong>{((1 - stockData.volume / stockData.averageVolume20D) * 100).toFixed(1)}%</strong> below average
            </p>
          )}
        </div>
      </div>

      <div className="last-updated">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}

export default App
