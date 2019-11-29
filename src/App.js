import React from 'react';
import './App.css';

// Raw test data
const customerTransactions = [
  {
      name: "Alice",
      date: "2020-01",
      amount: 10.00
  },
  {
      name: "Alice",
      date: "2020-01",
      amount: 120.00
  },
  {
      name: "Alice",
      date: "2020-01",
      amount: 75.00
  },
  {
    name: "Alice",
    date: "2020-01",
    amount: 55.00
  },
  {
      name: "Bob",
      date: "2020-01",
      amount: 10.00
  },
  {
      name: "Bob",
      date: "2020-02",
      amount: 120.00
  },
  {
      name: "Bob",
      date: "2020-03",
      amount: 70.00
  },
];

// Test data date range
const monthRange = ["2020-01", "2020-02", "2020-03"];

// Tunable parameters for point awards
const FIRST_CUTOFF = 50;
const FIRST_CUTOFF_MULTIPLIER = 1;
const SECOND_CUTOFF = 100;
const SECOND_CUTOFF_MULTIPLIER = 2;
const MAX_SINGLE_POINTS = (SECOND_CUTOFF - FIRST_CUTOFF) * FIRST_CUTOFF_MULTIPLIER;

// Core business logic for point awards
function calculatePoints(amount) {
  if (typeof amount !== 'number') {
      return 0; //throw "invalid argument"
  }
  if (amount <= FIRST_CUTOFF) {
      return 0;
  }
  if (amount <= SECOND_CUTOFF) {
      return FIRST_CUTOFF_MULTIPLIER * (amount - FIRST_CUTOFF);
  }
  return MAX_SINGLE_POINTS + (SECOND_CUTOFF_MULTIPLIER * (amount - SECOND_CUTOFF))
}

// Map-reduce the data to calculate total points per user
function pointsPerUser(name) {
  return customerTransactions
      .filter(transaction => transaction.name === name)
      .map(transaction => calculatePoints(transaction.amount))
      .reduce((a, b) => a + b, 0)
}

// Map-reduce the data to calculate monthly points per user
function pointsPerMonth(name, date) {
  return customerTransactions
      .filter(transaction => transaction.name === name && transaction.date === date)
      .map(transaction => calculatePoints(transaction.amount))
      .reduce((a, b) => a + b, 0)
}

// React component to render monthly points for a user
class CustomerMonthlyPoints extends React.Component {
  render() {
      return (
          <li>{this.props.date}: {pointsPerMonth(this.props.name, this.props.date)}</li>
      );
  }
}

//React componenent to render a user's total and monthly points
class CustomerPointDisplay extends React.Component {
  months =  monthRange.map((date) =>
    <li><CustomerMonthlyPoints name={this.props.name} date={date}/></li>
  );
  render() {
      return (
          <div className="customer-point-display">
              <h1>Reward Points for {this.props.name}</h1>
              <strong>TOTAL: {pointsPerUser(this.props.name)}</strong>
              <ul>
                {monthRange.map((date) =>
                  <CustomerMonthlyPoints name={this.props.name} key={date} date={date}/>
                )}
              </ul>
          </div>
      );
  }
}

// Render single page app
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <CustomerPointDisplay name="Alice"/>
          <CustomerPointDisplay name="Bob"/>
          <CustomerPointDisplay name="Cassie"/>
        </div>
      </header>
    </div>
  );
}

export default App;
