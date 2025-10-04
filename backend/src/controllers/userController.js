const getAll = (req, res) => {
  res.status(200).send("Đây là trang user");
};

const getById = (req, res) => {
    res.status(200).send("Nhân viên 1");
};

export default { getAll, getById };