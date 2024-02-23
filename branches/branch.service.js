const bcrypt = require("bcryptjs");
const db = require("_helpers/db");

module.exports = {
  getAll,
  create,
  getBranch,
  delete: _delete,
  update,
};

async function getAll() {
  return await db.Branches.findAll();
}

async function create(params) {
  const branch = new db.Branches(params);
  await branch.save();
}

async function update(id, params) {
  const branch = await getBranch(id);

  // validate
  const branchChanged = branch.branch !== params.branch;
  if (
    branchChanged &&
    (await db.Branches.findOne({ where: { branch: params.branch } }))
  ) {
    throw 'Branch "' + params.branch + '" is already registered';
  }

  // copy params to user and save
  Object.assign(branch, params);
  await branch.save();
}

async function _delete(id) {
  const branch = await getBranch(id);
  await branch.destroy();
}

async function getBranch(id) {
  const branch = await db.Branches.findByPk(id);
  if (!branch) throw "branch not found";
  return branch;
}
