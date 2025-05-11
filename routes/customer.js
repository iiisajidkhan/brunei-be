const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const Customer = require("../model/customerModel");
const ExcelJS = require("exceljs");

// CREATE - POST /api/customers
router.post("/create", async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Customer created successfully...!",
      customer,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/get-all", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    let searchQuery = {};

    if (search) {
      if (!isNaN(search)) {
        searchQuery = {
          $or: [
            { registerNumber: parseInt(search) },
            { phoneNumber: { $regex: search, $options: "i" } },
          ],
        };
      } else {
        searchQuery = {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { phoneNumber: { $regex: search, $options: "i" } },
            { address: { $regex: search, $options: "i" } },
          ],
        };
      }
    }

    const customers = await Customer.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCustomers = await Customer.countDocuments(searchQuery);

    res.status(201).json({
      status: "success",
      total: totalCustomers,
      page: page,
      pages: Math.ceil(totalCustomers / limit),
      data: customers,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/get-by-id/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.status(201).json({
      status: "success",
      message: "Data fatch by id successfully...!",
      data: customer,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - PUT /api/customers/:id
router.put("/update/:id", async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Customer not found" });
    res.status(201).json({
      status: "success",
      message: "Data upated successfully...!",
      updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - DELETE /api/customers/:id
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Customer not found" });
    res.status(201).json({
      status: "success",
      message: "Customer deleted successfully...!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/export", async (req, res) => {
  try {
    const customers = await Customer.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Customers");

    worksheet.columns = [
      { header: "Register Number", key: "registerNumber", width: 15 },
      { header: "Name", key: "name", width: 30 },
      { header: "Phone", key: "phone", width: 20 },
      { header: "Address", key: "address", width: 30 },
    ];

    customers.forEach((customer) => {
      worksheet.addRow({
        registerNumber: customer.registerNumber,
        name: customer.name,
        phone: customer.phoneNumber,
        address: customer.address,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=customers.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
