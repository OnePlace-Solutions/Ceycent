import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Table, Form } from "react-bootstrap";
import Sidebar from "../components/dashboard";

const MonthlyReport = () => {
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [profit, setProfit] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(moment().format("YYYY-MM"));
  const [loading, setLoading] = useState(false);

// Inside fetchData
const fetchData = async (month, year) => {
  setLoading(true);
  try {
    const params = { month, year };
    const salesResponse = await axios.get("https://ceycent-server.vercel.app/report/sales", { params });
    setSales(salesResponse.data);

    const expensesResponse = await axios.get("https://ceycent-server.vercel.app/report/expenses", { params });
    setExpenses(expensesResponse.data);

    const profitResponse = await axios.get("https://ceycent-server.vercel.app/report/profit", { params });
    setProfit(profitResponse.data.totalProfit);

  } catch (err) {
    console.error("Error fetching report data:", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    const [year, month] = selectedMonth.split("-");
    fetchData(month, year);
  }, [selectedMonth]); // Refetch data whenever selectedMonth changes

  return (
    <Sidebar>
      <div className="container mt-4">
        <h2>Monthly Sales & Expenses Report</h2>

        {/* Month Picker */}
        <Form.Group controlId="monthPicker" className="mb-4">
          <Form.Label>Select Month</Form.Label>
          <Form.Control
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </Form.Group>

        {/* Loading Indicator */}
        {loading && <p>Loading data...</p>}

        {/* Sales Table */}
        <h3>Sales Report</h3>
        <Table striped bordered hover className="mb-4">
          <thead>
            <tr>
              <th>Date</th>
              <th>Items Sold</th>
              <th>Sales (Rs)</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => (
              <tr key={index}>
                <td>{moment(sale.createdAt).format("YYYY-MM-DD")}</td>
                <td>
                  {sale.itemNames.map((item, idx) => (
                    <span key={idx}>{item}<br /></span>
                  ))}
                </td>
                <td>{sale.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Expenses Table */}
        <h3>Expenses Report</h3>
        <Table striped bordered hover className="mb-4">
          <thead>
            <tr>
              <th>Date</th>
              <th>Expense Name</th>
              <th>Expenses (Rs)</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index}>
                <td>{moment(expense.date).format("YYYY-MM-DD")}</td>
                <td>{expense.name}</td>
                <td>{expense.price}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Total Profit */}
        <div className="mt-4" style={{ backgroundColor: 'gray', padding: '10px', borderRadius: '5px' }}>
          <h4>Total Profit for {moment(selectedMonth).format("MMMM YYYY")}: Rs {profit}</h4>
        </div>
      </div>
    </Sidebar>
  );
};

export default MonthlyReport;
