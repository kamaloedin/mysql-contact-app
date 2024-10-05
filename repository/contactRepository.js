const pool = require('../utils/db');

const getContacts = async () => {
  const [rows] = await pool.query('SELECT * FROM contacts');
  console.log(rows);
  return rows;
};

const findContactByName = async (name) => {
  const [rows] = await pool.query('SELECT * FROM contacts WHERE name = ?', [name]);
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

const editContactByName = async ({ oldName, name, phone, email }) => {
  const [rows] = await pool.query(
    `
    UPDATE contacts
    SET name = ?, phone = ?, email = ?
    WHERE name = ?`,
    [name, phone, email, oldName],
  );

  return rows[0];
};

const deleteContact = async (name) => {
  const [rows] = await pool.query('DELETE FROM contacts WHERE name = ?', [name]);
  return rows[0];
};

module.exports = { getContacts, findContactByName, addContact, deleteContact, editContactByName };
