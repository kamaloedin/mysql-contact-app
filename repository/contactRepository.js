const pool = require('../utils/db');

const getContacts = async () => {
  const [rows] = await pool.query('SELECT * FROM contacts');
  console.log(rows);
  return rows;
};

const findContactByName = async (name) => {
  const [rows] = await pool.query('SELECT id FROM contacts WHERE name = ?', [name]);
  return rows[0];
};

const findContactById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM contacts WHERE id = ?', [id]);
  return rows[0];
};

const addContact = async ({ name, phone, email }) => {
  const [rows] = await pool.query(
    `
    INSERT INTO contacts(name, phone, email)
    VALUES(?, ?, ?)`,
    [name, phone, email],
  );

  return rows.insertId;
};

const editContactById = async ({ id, name, phone, email }) => {
  const [rows] = await pool.query(
    `
    UPDATE contacts
    SET name = ?, phone = ?, email = ?
    WHERE id = ?
    `,
    [name, phone, email, id],
  );

  return rows[0];
};

const deleteContact = async (id) => {
  const [rows] = await pool.query('DELETE FROM contacts WHERE id = ?', [id]);
  return rows[0];
};

module.exports = {
  getContacts,
  findContactByName,
  findContactById,
  addContact,
  deleteContact,
  editContactById,
};
