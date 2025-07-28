const FinancialAid = require("../models/financialaidModel");

const AddFinancialAid = async (req, res) => {
  try {
    const financialaid = new FinancialAid({
      institutename: req.body.institutename,
      name: req.body.name,
      image: req.body.image,
      aid: req.body.aid,
      claimed: req.body.claimed,
      description: req.body.description,
      dueDate: req.body.dueDate
    });
    const financialaid_data = await financialaid.save();
    res.status(200).send({ success: true, data: financialaid_data });
  } catch (error) {
    res.status(400).send({ success: false, msg: "Error in Add FinancialAid" });
  }
};

const getFinancialAid = async (req, res) => {
  try {
    const financialaid_data = await FinancialAid.find({});
    res.status(200).send({ success: true, data: financialaid_data });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const getFinancialAidByInstitute = async (req, res) => {
  try {
    const financialaid_data = await FinancialAid.find({ institutename: req.params.institutename });
    res.status(200).send({ success: true, data: financialaid_data });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const deleteFinancialAid = async (req, res) => {
  try {
    const id = req.params.id;
    const financialaid_data = await FinancialAid.deleteOne({ _id: id });
    res
      .status(200)
      .send({ success: true, data: "FinancialAid Deleted Successfully" });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const editFinancialAid = async (req, res) => {
  try {
    const financialaid_data = await FinancialAid.findByIdAndUpdate({ _id: req.body._id }, { $set: req.body }, { new: true });
    res.status(200).send({ success: true, msg: 'FinancialAid Updated', data: financialaid_data });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
}

module.exports = {
  AddFinancialAid,
  getFinancialAid,
  deleteFinancialAid,
  editFinancialAid,
  getFinancialAidByInstitute
};
